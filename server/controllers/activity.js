const express = require('express')
const auth = require('../middlewares/auth')
const Activity = require('../models/Activity')

const router = express.Router()

router.get("/:boardId", auth, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const { boardId } = req.params

    try {
        let activities = await Activity.find({ boardId })
            .select("postedBy description createdAt -_id")
            .populate("postedBy", "userName -_id")
            .sort('-createdAt')
            .skip(skip)
            .limit(10)
            .lean()

        activities = activities.map(({ postedBy, ...activity }) => {
            return {
                ...activity,
                postedBy: postedBy.userName
            }
        })

        res.json({ activities })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get activites for the board" })
    }
})

module.exports = router