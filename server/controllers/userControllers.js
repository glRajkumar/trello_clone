const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')
const User = require('../models/User')
require('dotenv').config()

const router = express.Router()

router.get('/me', auth, async (req, res) => {
    try {
        res.json({ ...req.user._doc })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot find the user" })
    }
})

router.post('/register', async (req, res) => {
    const { userName, email, password } = req.body

    try {
        const userExist = await User.findOne({ email }).select("_id")
        if (userExist) return res.status(400).json({ msg: "Email is already exists" })
        if (password === "") return res.status(400).json({ msg: "Password shouldn't be empty" })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const user = new User({ userName, email, password: hash })
        await user.save()
        res.json({ msg: "User Saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "User Creation failed" })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ msg: "cannot find user in db" })
        if (password === "") return res.status(400).json({ msg: "Password shouldn't be empty" })

        const result = await bcrypt.compare(password, user.password)
        if (!result) return res.status(400).json({ msg: "password not matched" })

        const payload = { userId: user._id }
        const newToken = jwt.sign(payload, process.env.jwtSecretKey, { expiresIn: '18h' })
        user.token = user.token.concat(newToken)
        await user.save()

        const { password: pass, token, __v, ...userDetails } = user._doc

        res.json({ token: newToken, ...userDetails })

    } catch (error) {
        res.status(400).json({ error, msg: "User LogIn failed" })
    }
})

router.post("/logout", auth, async (req, res) => {
    const { user, token } = req

    try {
        await User.updateOne({ _id: user._id }, { $pull: { token } })
        res.json({ msg: "User logged out successfully" })
    } catch (error) {
        res.status(400).json({ error, msg: "User log out failed" })
    }
})

module.exports = router