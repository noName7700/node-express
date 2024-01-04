const { Router } = require("express");
const Order = require("../models/order");
const Order_Course = require("../models/order_course");
const User = require("../models/user");
const Cart = require("../models/cart");
const Course = require("../models/course");
const router = Router();
const auth = require("../middleware/auth");

async function mapCartItems(cart) {
    const promises = cart.map(async (c) => {
        c = Cart.fromJSON(c);
        const val = (await c.getCourse())[0];
        return { ...val, count: c.count };
    });
    const courses = await Promise.all(promises).then(values => {
        return values; 
    });
    return courses;
}

async function mapOrderItems(orderItems) {
    const promisesResult = orderItems.map(async (o) => {
        o.date = o.date.toLocaleDateString();
        const promises = o.courses.map(async c => {
            const course = await Course.findById(c.courseid);
            c.course = { ...course };
            return c;
        });
        const courses = await Promise.all(promises).then(values => {
            return values;
        });
        o.courses = courses;
        let price = 0;
        courses.forEach(c => {
            price += c.count * c.course.price;
        });
        o.price = price;
        return o;
    });
    const result = await Promise.all(promisesResult).then(values => {
        return values;
    });
    return result;
}

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user.id);
    const orders = await Order.findByUserId(req.user.id);
    const promises = orders.map(async o => {
        const courses = await Order_Course.findCoursesByOrderId(o.id);
        o.courses = courses;
        return o;
    });
    const orderItems = await Promise.all(promises).then(values => {
        return values; 
    });
    const orderCourses = await mapOrderItems(orderItems);
    res.render("orders", {
        isOrder: true, 
        title: "Заказы",
        orders: orderCourses,
        user: user
    });
});

router.post("/", auth, async (req, res) => {
    const user = User.fromJSON(req.user);
    const cart = await Cart.getItems(req.user.id);
    const courses = await mapCartItems(cart);
    const order = new Order(req.user.id, Date.now());
    await order.save();
    const orderId = await Order.getOrderId(req.user.id);
    courses.forEach(c => {
        const orderCourse = new Order_Course(orderId, c.id, c.count);
        orderCourse.save();
    });
    await user.clearCart();
    res.redirect("/orders");
})

module.exports = router;