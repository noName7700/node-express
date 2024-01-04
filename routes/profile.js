const { Router } = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = Router();

router.get("/", auth, async (req, res) => {
    res.render("profile", {
        title: "Профиль",
        isProfile: true,
        user: req.user
    });
});

router.post("/", auth, async(req, res) => {
    const user = User.fromJSON(await User.findById(req.user.id));
    const name = req.body.name;
    let avatar = req.user.avatar ? req.user.avatar : "";
    if (req.file) {
        avatar = req.file.path;
    }
    await user.update(user.id, name, avatar);
    res.redirect("/profile");
});

module.exports = router;