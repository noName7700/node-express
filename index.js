const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const csurf = require("csurf");
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const homeRoutes = require("./routes/home");
const cardRoutes = require("./routes/cart");
const coursesRoutes = require("./routes/courses");
const addRoutes = require("./routes/add");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const errorHandler = require("./middleware/error");
const fileMiddleware = require("./middleware/file");

const keys = require("./keys/index");

const client = require("./models/db");

const app = express();

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
    helpers: require("./utils/hbs-helpers")
});

const store = new pgSession({
    pool : client,
    tableName : 'user_session'
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csurf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use("/cart", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})