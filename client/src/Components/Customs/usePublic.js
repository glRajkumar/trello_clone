import { useEffect, useState, useReducer } from 'react'
import publicReducer from '../../reducers/publicReducer'
import axios from 'axios'

const initialState = {
    boards: [],
    skip: 0,
    hasMore: true,
    loading: true,
    error: ""
}

function usePublic(url, headers) {
    const [init, setInit] = useState(true)
    const [{ boards, skip, hasMore, loading, error }, dispatch] = useReducer(publicReducer, initialState)

    useEffect(() => {
        getBoards()
        setInit(false)
    }, [])

    const getBoards = () => {
        dispatch({ type: "BOARD_LOADING" })
        axios.get(`/board${url}/?skip=${skip}`, { headers })
            .then((res) => {
                const payload = {
                    boards: res.data.boards
                }
                dispatch({ type: "BOARD_GET", payload })
            })
            .catch((err) => {
                console.log(err)
                dispatch({ type: "ERROR" })
            })
    }

    return { init, boards, hasMore, loading, error, getBoards }
}

export default usePublic