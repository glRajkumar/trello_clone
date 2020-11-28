import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SDET_GET, SNEWSTATUS, STASK_RELIST } from '../../Store/actionTypes'
import axios from "axios"

function useSDetailed(boardId, headers) {
    const { sboard, stask } = useSelector(state => state)
    const [isPresent] = useState(stask.detailed.some(d => d._id === boardId))
    const [detailed, setDetailed] = useState(
        isPresent
            ? stask.detailed.filter(d => d._id === boardId)[0]
            : {
                boardName: "",
                catagery: "",
                postedBy: "",
                tasks: [],
                taskStatus: []
            }
    )
    const [loading, setLoad] = useState(!isPresent)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isPresent) {
            axios.get(`/shared/${boardId}`, { headers })
                .then((res) => {
                    let boardDetails = sboard.boards.filter(b => b._id === boardId)
                    let payload = {
                        ...boardDetails[0],
                        ...res.data.board,
                        taskStatus: res.data.board.tasks.map(task => task.status)
                    }
                    setLoad(false)
                    setDetailed(payload)
                    dispatch({ type: SDET_GET, payload })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [])

    const createNewStatus = (status) => {
        let payload = {
            boardId,
            status
        }
        axios.put("/board/add-status", { ...payload }, { headers })
            .then(() => {
                dispatch({ type: SNEWSTATUS, payload })
                setDetailed(prev => {
                    return {
                        ...prev,
                        taskStatus: [
                            ...prev.taskStatus,
                            status
                        ],
                        tasks: [
                            ...prev.tasks,
                            {
                                status,
                                tasks: []
                            }
                        ]
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const reOrderStatus = (payload) => {
        let { taskStatus, tasks } = stask.detailed.filter(d => d._id === boardId)[0]
        let remaings = taskStatus.filter((item, i) => i !== payload.dragFrom)
        let newTaskStatus = [
            ...remaings.slice(0, payload.dragTo),
            taskStatus[payload.dragFrom],
            ...remaings.slice(payload.dragTo)
        ]
        let remaingTasks = tasks.filter((item, i) => i !== payload.dragFrom)
        let newTasks = [
            ...remaingTasks.slice(0, payload.dragTo),
            tasks[payload.dragFrom],
            ...remaingTasks.slice(payload.dragTo)
        ]
        setDetailed(prev => {
            return {
                ...prev,
                taskStatus: newTaskStatus,
                tasks: newTasks
            }
        })
        axios.put("/board/reorder-status", { boardId, from: payload.dragFrom, to: payload.dragTo }, { headers })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
        payload.newTaskStatus = newTaskStatus
        payload.newTasks = newTasks
        dispatch({ type: STASK_RELIST, payload })
    }

    return {
        permision: detailed?.permision,
        loading,
        detailed,
        taskStatus: detailed.taskStatus,
        createNewStatus,
        reOrderStatus
    }
}

export default useSDetailed