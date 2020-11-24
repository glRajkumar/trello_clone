const express = require('express')
const Test = require('./TestModel')

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const test = await Test.find()
            .populate("test.listOrder", "status title body order")
            .sort('-createdAt')
            .lean()

        res.json({ test })
    } catch (error) {
        res.status(400).json({ error, msg: "Cannot get boards" })
    }
})

router.post("/", async (req, res) => {
    try {
        const test = new Test()
        await test.save()

        res.json({ test })

    } catch (error) {
        res.status(400).json({ error, msg: "Board creation failed" })
    }
})

router.put("/add", async (req, res) => {
    const { id, name } = req.body
    const test = {
        name,
        listOrder: []
    }
    try {
        let updated = await Test.findByIdAndUpdate(id, { $push: { test } }, { new: true })
        res.json({ updated })

    } catch (error) {
        res.status(400).json({ error, msg: "Board public status updation failed" })
    }
})

router.put("/can", async (req, res) => {
    const { id, name } = req.body

    try {
        let updated = await Test.findByIdAndUpdate(id, { $pull: { test: { name } } }, { new: true })
        res.json({ updated })

    } catch (error) {
        res.status(400).json({ error, msg: "Board public status updation failed" })
    }
})

router.put("/add-list", async (req, res) => {
    const { id, name, taskid, num } = req.body

    try {
        let updated = await Test.findOneAndUpdate({ _id: id, "test.name": name }, {
            $push: { "test.$.listOrder": taskid }
        }, { new: true })
        res.json({ updated })

        // let updated = await Test.findOneAndUpdate({ _id: id, "test.name": name }, {
        //     $push: { "test.$.listOrder": { $each: [taskid], $position: num } }
        // }, { new: true })
        // res.json({ updated })

    } catch (error) {
        res.status(400).json({ error, msg: "Board public status updation failed" })
    }
})

router.put("/can-list", async (req, res) => {
    const { id, name, taskid } = req.body

    try {
        let updated = await Test.findOneAndUpdate({ _id: id, "test.name": name }, { $pull: { "test.$.listOrder": taskid } }, { new: true })
        res.json({ updated })

    } catch (error) {
        res.status(400).json({ error, msg: "Board public status updation failed" })
    }
})

router.put("/reorder", async (req, res) => {
    const { id, name, from, to } = req.body

    try {
        let test = await Test.findById(id)
        let oldList = test.test.filter(item => item.name === name)[0].listOrder
        let remaings = oldList.filter((list, i) => i !== from)

        let newList = [
            ...remaings.slice(0, to),
            oldList[from],
            ...remaings.slice(to)
        ]

        let updated = test.test.map(item => {
            if (item.name === name) {
                return {
                    ...item,
                    listOrder: newList
                }
            } else {
                return item
            }
        })
        test.test = updated
        await test.save()
        res.json({ test })

    } catch (error) {
        res.status(400).json({ error, msg: "Board public status updation failed" })
    }
})

router.put("/relist", async (req, res) => {
    const { id, from, to } = req.body

    try {
        let test = await Test.findById(id)
        let oldList = test.test
        let remaings = oldList.filter((list, i) => i !== from)

        let newList = [
            ...remaings.slice(0, to),
            oldList[from],
            ...remaings.slice(to)
        ]

        test.test = newList
        await test.save()
        res.json({ test, newList })

    } catch (error) {
        res.status(400).json({ error, msg: "Board public status updation failed" })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
    try {
        await Test.findByIdAndDelete(id)
        res.json({ msg: "Board deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Cannot delete the board" })
    }
})

module.exports = router