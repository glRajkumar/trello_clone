import { useEffect, useReducer } from 'react'
import boardReducer from "../../reducers/boards"
import axios from 'axios'

const initialState = {
    boards: [],
    loading: true,
    error: ""
}

function useBoards(headers) {
    const [{ boards, loading, error }, dispatch] = useReducer(boardReducer, initialState)

    useEffect(() => {
        axios.get('/board/boards', { headers })
            .then((res) => {
                const payload = {
                    boards: res.data.boards
                }
                dispatch({ type: "BOARD_GET", payload })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const Delete = (id) => {
        axios.delete(`/board/${id}`, { headers })
            .then((res) => {
                dispatch({ type: "BOARD_DELETE", payload: id })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return { boards, loading, error, Delete }
}

export default useBoards