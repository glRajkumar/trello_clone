import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DET_EDIT, DET_GET } from '../../Store/actionTypes'
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
    const [taskStatus, setStatus] = useState(["To-do", "Doing", "Done"])
    const [loading, setLoad] = useState(!isPresent)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isPresent) {
            axios.get(`/board/${boardid}`, { headers })
                .then((res) => {
                    let payload = {
                        ...res.data.boards[0]
                    }
                    setLoad(false)
                    setDetailed(res.data.boards)
                    dispatch({ type: DET_GET, payload })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [])

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
        taskStatus,
        Private
    }
}

export default useDetailed