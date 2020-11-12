import { useEffect } from 'react'
import { BOARD_GET, BOARD_DELETE, DET_DELETE, BOARD_ERROR } from "../../Store/actionTypes"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

function useBoards(headers) {
    const { boards, loading, error } = useSelector(state => state.board)
    const dispatch = useDispatch()

    console.log({ boards, loading, error })
    useEffect(() => {
        if (boards.length === 0) {
            axios.get('/board/boards', { headers })
                .then((res) => {
                    const payload = {
                        boards: res.data.boards
                    }
                    console.log(res.data.boards)
                    dispatch({ type: BOARD_GET, payload })
                })
                .catch((err) => {
                    console.log(err)
                    dispatch({ type: BOARD_ERROR })
                })
        }
    }, [])

    const Delete = (id) => {
        axios.delete(`/board/${id}`, { headers })
            .then(() => {
                dispatch({ type: BOARD_DELETE, payload: id })
                dispatch({ type: DET_DELETE, payload: id })
            })
            .catch((err) => {
                console.log(err)
                dispatch({ type: BOARD_ERROR })
            })
    }

    return { boards, loading, error, Delete }
}

export default useBoards