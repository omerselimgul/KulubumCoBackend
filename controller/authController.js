const jwt = require("jsonwebtoken")
const { registerHandler, getUserByUsername } = require("../DataBase/dbcontrollers");
const { CustomError } = require("../helpers/error/CustomError");

const PostLoginController = async (req, res, next) => {
    var { username, password } = req.body;
    // console.log(username, password)
    if (username !== null && password !== null) {
        let userInfo = await getUserByUsername(username)
        if (userInfo && parseInt(userInfo[0]?.userpassword) === password) {
            // console.log(userInfo)

            const token = jwt.sign({
                username: username,
                password: password,
                userid: userInfo[0].UserId,
                expiresIn: '1d',
                issuer: 'www.kulubum.co'
            }, process.env.SECRET_KEY)

            res.cookie('token',token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }).json({ message: "Login  basarili", data: userInfo[0], success: true })
        } else {
            return next(new CustomError("Bilglieri yanlış girdiniz", 403))
        }
    } else {
        return next(new CustomError("Tüm alanları doldurunuz", 400))
    }


}
const RegisterControllers = async (req, res, next) => {
    let { username, password } = req.body
    if (username === null || password === null) {
        next(new CustomError("Tüm alanları doldurunuz ", 405))
    } else {
        try {
            registerHandler(username, password)
                .then(response => {
                    if (response) {
                        res.status(200).json({ message: "kayit basarili", data: response[0], success: true })
                        // .redirect('/api/login')
                    } else {

                        next(new CustomError("Kayitta hata olustu daha sonra tekrar deneyiniz!", 400))
                    }
                })
                .catch(err => {
                    next(new CustomError(err, 400))
                })
        } catch (error) {
            next(new CustomError(" Hashing işleminde hata olustu lütfen daha sonra tekrar deneyiniz ", 405))
        }

    }


}
module.exports = {
    PostLoginController,
    RegisterControllers
}