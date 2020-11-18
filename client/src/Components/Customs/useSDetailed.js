import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SDET_GET, SNEWSTATUS } from '../../Store/actionTypes'
import axios from "axios"

function useSDetailed(boardid, headers) {
    const { stask } = useSelector(state => state)
    const [isPresent] = useState(stask.detailed.some(d => d._id === boardid))
    const [detailed, setDetailed] = useState(
        isPresent
            ? stask.detailed.filter(d => d._id === boardid)
            : [{
                boardName: "",
                catagery: "",
                postedBy: "",
                tasks: [],
            }]
    )
    const [loading, setLoad] = useState(!isPresent)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isPresent) {
            axios.get(`/shared/${boardid}`, { headers })
                .then((res) => {
                    let otherStatus = [
                        ...new Set([
                            ...res.data.boards[0]
                                .tasks
                                .map(task => task.status)
                                .filter(a => a !== "To-do" && a !== "Done" && a !== "Doing")
                        ])
                    ]
                    let payload = {
                        ...res.data.boards[0],
                        taskStatus: ["To-do", "Doing", "Done", ...otherStatus]
                    }
                    setLoad(false)
                    setDetailed([payload])
                    dispatch({ type: SDET_GET, payload })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [])

    const createNewStatus = (name) => {
        let payload = {
            boardId: detailed[0]._id,
            name
        }
        dispatch({ type: SNEWSTATUS, payload })
        setDetailed(prev => prev.map(s => {
            return {
                ...s,
                taskStatus: [
                    ...s.taskStatus,
                    name
                ]
            }
        }))
    }

    return {
        permision: detailed[0]?.permision,
        loading,
        detailed,
        taskStatus: detailed[0]?.taskStatus || [],
        createNewStatus,
    }
}

export default useSDetailed