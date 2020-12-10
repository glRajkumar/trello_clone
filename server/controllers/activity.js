const express = require('express')
const auth = require('../middlewares/auth')
const { Activity, Action } = require('../models/Activity')

const router = express.Router()

router.get("/:id", auth, async (req, res) => {
    const { id } = req.params

    try {
        const { actions } = await Activity.findById(id)
            .select("actions -_id")
            .populate({
                path: "actions",
                populate: {
                    path: "postedBy",
                    select: "userName -_id"
                },
                select: "-__v"
            })

        res.json({ actions })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get activites for the board" })
    }
})

router.post("/", auth, async (req, res) => {
    const { boardId } = req.body

    try {
        const activity = new Activity({ boardId })
        await activity.save()
        res.json({ activity })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot create activity" })
    }
})

router.post("/act", auth, async (req, res) => {
    const { activityId, description } = req.body


    try {
        const action = new Action({ postedBy: req.user._id, description })
        await action.save()

        await Activity.findByIdAndUpdate(activityId, {
            $push: { actions: action._id }
        })

        res.json({ action, activity })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot create activity" })
    }
})

module.exports = router