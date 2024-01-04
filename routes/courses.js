const { Router } = require("express");
const Course = require("../models/course");
const router = Router();
const auth = require("../middleware/auth");
const { courseValidators } = require("../utils/validators");
const { validationResult } = require("express-validator");

function isOwner(course, req) {
    return course.userid === req.user.id;
}

router.get("/", async (req, res) => {
    const courses = await Course.findAll();
    res.render("courses", {
        title: "Курсы",
        isCourses: true,
        userId: req.user ? req.user.id : null,
        courses
    });
});

router.get("/:id/edit", auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect("/");
    }
    const course = await Course.findById(req.params.id);
    if (!isOwner(course, req)) {
        return res.redirect("/courses");
    }
    res.render("course-edit", {
        title: `Редактировать ${course.title}`,
        course
    })
});

router.post("/edit", auth, courseValidators, async (req, res) => {
    const errors = validationResult(req);
    const {id} = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
    }
    delete req.body.id;
    const course = await Course.findById(id);
    if (!isOwner(course, req)) {
        return res.redirect("/courses");
    }
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect("/courses");
});

router.post("/remove", auth, async (req, res) => {
    const course = await Course.findById(req.body.id);
    if (!isOwner(course, req)) {
        return res.redirect("/courses");
    }
    await Course.deleteOne(req.body.id);
    res.redirect("/courses");
});

router.get("/:id", async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render("course", {
        layout: "empty",
        title: `Курс ${course.title}`,
        course
    });
})

module.exports = router;