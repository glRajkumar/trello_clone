import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BOARD_GET, BOARD_DELETE } from "../../Store/actionTypes"
import axios from 'axios'

function useBoards(headers) {
    const { boards, loading, error } = useSelector(state => state.board)
    const dispatch = useDispatch()
    console.log("useboards")
    console.log({ boards, loading, error })

    useEffect(() => {
        axios.get('/board/boards', { headers })
            .then((res) => {
                console.log("at getting data")
                console.log(res.data.boards)
                const payload = {
                    boards: res.data.boards
                }
                dispatch({ type: BOARD_GET, payload })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const Delete = (id) => {
        axios.delete(`/board/${id}`, { headers })
            .then((res) => {
                console.log(res.data)
                dispatch({ type: BOARD_DELETE, payload: id })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return { boards, loading, error, Delete }
}

export default useBoards