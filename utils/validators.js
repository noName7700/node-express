const { body } = require("express-validator");
const User = require("../models/user");

exports.registerValidators = [
    body('email')
    .isEmail()
    .withMessage("Введите корректный email")
    .custom(async (value, { req }) => {
        const candidate = await User.findOne(value);
        if (candidate) {
            return Promise.reject("Пользователь с таким email уже существует");
        }
    })
    .normalizeEmail(),
    body('password', "Пароль должен быть минимум 6 символов")
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Пароли должны совпадать");
        }
        return true;
    }).trim(),
    body("name").isLength({min: 2}).withMessage("Имя должно быть минимум 2 символа").trim()
]

exports.courseValidators = [
    body('title').isLength({min: 1}).withMessage("Минимальная длина названия 1 символ").trim(),
    body('price').isNumeric().withMessage("Введите корректную цену"),
    body('img', 'Введите корректный URL картинки').isURL()
]