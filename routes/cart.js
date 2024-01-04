const { Router } = require("express");
const Cart = require("../models/cart");
const Course = require("../models/course");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = Router();

async function mapCartItems(cart) {
    const promises = cart.map(async (c) => {
        c = Cart.fromJSON(c);
        const val = (await c.getCourse())[0];
        return { ...val, count: c.count};
    });
    const courses = await Promise.all(promises).then(values => {
        return values; 
    });
    return courses;
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0);
}

router.post("/add", auth, async (req, res) => {
    const course = await Course.findById(req.body.id);
    const user = User.fromJSON(req.user);
    await user.addToCart(course);
    res.redirect("/cart");
});

router.delete("/remove/:id", auth, async (req, res) => {
    const user = User.fromJSON(req.user);
    await user.removeFromCart(req.params.id);
    const cart = await Cart.getItems(req.user.id);
    const courses = await mapCartItems(cart);
    res.status(200).json({ courses: courses, price: computePrice(courses) });
})

router.get("/", auth, async (req, res) => {
    const cart = await Cart.getItems(req.user.id);
    const courses = await mapCartItems(cart);
    res.render("cart", {
        title: "Корзина",
        isCart: true,
        courses: courses,
        price: computePrice(courses)
    });
});

module.exports = router;