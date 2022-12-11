const jwt = require("jsonwebtoken")
const userRepository = require("../repository/userRepository")
const { CustomError } = require("../helpers/error/CustomError");

const PostLoginController = async (req, res, next) => {
    try {
        const { Username, Userpassword } = req.body
        let userInfo = await userRepository.getByUserame(Username)
        if (userInfo && (userInfo?.Userpassword) === Userpassword) {
            const token = jwt.sign({
                Username: Username,
                Userpassword: Userpassword,
                UserId: userInfo.UserId,
                Email:userInfo.Email,
                Birthdate:userInfo.Birthdate,
                UniversityId: userInfo.Universite,
                UniversityName: userInfo.UniversityName,
                Department: userInfo.Bolum,
                expiresIn: '1d',
                issuer: 'www.kulubum.co'
            }, process.env.SECRET_KEY)
            delete userInfo?.Userpassword
            res.cookie('KulubumCo', token, { maxAge: 24 * 60 * 60 * 1000 }).json({ message: "Login  basarili", data: userInfo, success: true })
        } else {
            return next(new CustomError("Bilglieri yanlış girdiniz", 403))
        }
    } catch (error) {
        return next(new CustomError(error, 403))
    }

}
const DeleteCookie = async (req, res, next) => {
    try {
        cookie = req.cookies;
        if (cookie?.KulubumCo) {
            res.clearCookie('KulubumCo')
        }
        res.json({ message: "Çıkış basarili", success: true });

    } catch (error) {
        return next(new CustomError(error, 500))
    }
}
const CreateUserControllers = async (req, res, next) => {

    let { Username, Email } = req.body
    try {
        // Username Check
        let usernameControl = await userRepository.getByUserame(Username)
        if (usernameControl) {
            return res.status(400).json({
                success: false,
                message: "Kullanıcı adı eşsiz olmalı"
            })
        }
        // EmailCheck
        let emailControl = await userRepository.getByEmail(Email)
        if (emailControl) {
            return res.status(400).json({
                success: false,
                message: " Email adı eşsiz olmalı!"
            })
        }
        // Register Check
        const data = await userRepository.createdUser(req.body)
        if (data) {
            return res.status(200).json({ message: "kayit basarili", data: data, success: true })

        } else {
            next(new CustomError("Kayitta hata olustu daha sonra tekrar deneyiniz!", 400))
        }
    } catch (error) {
        next(new CustomError(error, 400))
    }

}
module.exports = {
    PostLoginController,
    CreateUserControllers,
    DeleteCookie
}