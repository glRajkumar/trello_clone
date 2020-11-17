import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DET_EDIT, DET_GET, NEWSTATUS } from '../../Store/actionTypes'
import axios from "axios"

function useDetailed(boardid, headers) {
    const { auth, task } = useSelector(state => state)
    const [isPresent] = useState(task.detailed.some(d => d._id === boardid))
    const [detailed, setDetailed] = useState(
        isPresent
            ? task.detailed.filter(d => d._id === boardid)
            : [{
                boardName: "",
                catagery: "",
                postedBy: "",
                isPublic: "",
                tasks: [],
            }]
    )
    const [loading, setLoad] = useState(!isPresent)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isPresent) {
            axios.get(`/board/${boardid}`, { headers })
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
                    dispatch({ type: DET_GET, payload })
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
        dispatch({ type: NEWSTATUS, payload })
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

    const Private = () => {
        const payload = {
            boardId: boardid,
            info: {
                isPublic: !detailed[0].isPublic
            }
        }
        axios.put('/board/public', { boardId: boardid, isPublic: !detailed[0].isPublic }, { headers })
            .then(() => {
                setDetailed(prev => prev.map(m => {
                    return {
                        ...m,
                        isPublic: !detailed[0].isPublic
                    }
                }))
                dispatch({ type: DET_EDIT, payload })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return {
        isMine: detailed[0]?.postedBy === auth._id,
        loading,
        detailed,
        taskStatus: detailed[0]?.taskStatus || [],
        createNewStatus,
        Private
    }
}

export default useDetailed