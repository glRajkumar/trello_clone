import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SDET_GET } from '../../Store/actionTypes'
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
                    let payload = {
                        ...res.data.boards[0]
                    }
                    setLoad(false)
                    setDetailed(res.data.boards)
                    dispatch({ type: SDET_GET, payload })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [])

    return {
        permision: detailed[0]?.permision,
        loading,
        detailed
    }
}

export default useSDetailed