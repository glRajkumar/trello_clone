import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DET_EDIT, DET_GET, NEWSTATUS, TASK_RELIST } from '../../Store/actionTypes'
import { newStatusBuilder, reOrderStatusHelp } from '../utils/dataManager'
import axios from "axios"

function useDetailed(boardId, headers, ownBoard) {
    const { auth, board, sboard, task } = useSelector(state => state)
    const [isPresent] = useState(task.detailed.some(d => d._id === boardId))
    const [detailed, setDetailed] = useState(
        isPresent
            ? task.detailed.filter(d => d._id === boardId)[0]
            : {
                boardName: "",
                catagery: "",
                postedBy: "",
                isPublic: "",
                tasks: [],
                taskStatus: []
            }
    )
    const [loading, setLoad] = useState(!isPresent)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isPresent) {
            axios.get(`/board/${boardId}`, { headers })
                .then((res) => {
                    let boardDetails
                    if (ownBoard) {
                        boardDetails = board.boards.filter(b => b._id === boardId)
                    } else {
                        boardDetails = sboard.boards.filter(b => b._id === boardId)
                    }
                    let payload = {
                        ...boardDetails[0],
                        ...res.data.board,
                        taskStatus: res.data.board.tasks.map(task => task.status)
                    }
                    setLoad(false)
                    setDetailed(payload)
                    dispatch({ type: DET_GET, payload })
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
                dispatch({ type: NEWSTATUS, payload })
                setDetailed(prev => newStatusBuilder(prev, payload))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const Private = () => {
        const payload = {
            boardId,
            info: {
                isPublic: !detailed.isPublic
            }
        }
        axios.put('/board/public', { boardId, isPublic: !detailed.isPublic }, { headers })
            .then(() => {
                setDetailed(prev => {
                    return {
                        ...prev,
                        isPublic: !detailed.isPublic
                    }
                })
                dispatch({ type: DET_EDIT, payload })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const reOrderStatus = (payload) => {
        //since I didn't have an central action store, new task are not saved in detailed, thats why 
        //I didn't give detailed as argument
        // let { taskStatus, tasks } = reOrderStatusHelp(detailed, payload)
        let taskDetatiled = task.detailed.filter(d => d._id === boardId)[0]
        let { taskStatus, tasks } = reOrderStatusHelp(taskDetatiled, payload)
        setDetailed(prev => {
            return {
                ...prev,
                taskStatus,
                tasks
            }
        })
        axios.put("/board/reorder-status", { boardId, from: payload.dragFrom, to: payload.dragTo }, { headers })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
        payload.taskStatus = taskStatus
        payload.tasks = tasks
        dispatch({ type: TASK_RELIST, payload })
    }

    return {
        loading,
        detailed,
        isMine: detailed?.postedBy === auth._id,
        permision: detailed?.permision,
        taskStatus: detailed.taskStatus,
        createNewStatus,
        reOrderStatus,
        Private
    }
}

export default useDetailed