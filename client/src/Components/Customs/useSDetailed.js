import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SDET_GET, SNEWSTATUS } from '../../Store/actionTypes'
import axios from "axios"

function useSDetailed(boardid, headers) {
    const { sboard, stask } = useSelector(state => state)
    const [isPresent] = useState(stask.detailed.some(d => d._id === boardid))
    const [detailed, setDetailed] = useState(
        isPresent
            ? stask.detailed.filter(d => d._id === boardid)[0]
            : {
                boardName: "",
                catagery: "",
                postedBy: "",
                tasks: [],
            }
    )
    const [loading, setLoad] = useState(!isPresent)
    const dispatch = useDispatch()

    console.log("detailed", detailed)
    useEffect(() => {
        if (!isPresent) {
            axios.get(`/shared/${boardid}`, { headers })
                .then((res) => {
                    let boardDetails = sboard.boards.filter(b => b._id === boardid)
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

    const createNewStatus = (name) => {
        let payload = {
            boardId: detailed._id,
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
        permision: detailed?.permision,
        loading,
        detailed,
        taskStatus: detailed?.taskStatus || [],
        createNewStatus,
    }
}

export default useSDetailed