import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SBOARD_LOADING, SBOARD_GET, SBOARD_EXIT, SBOARD_ERROR } from '../../Store/actionTypes'
import axios from 'axios'

function useSBoard(url, headers) {
    const { boards, isExisted, loading, error } = useSelector(state => state.sboard)
    const currentBoard = boards.filter(board => board.titled === url)
    const isLoadedState = isExisted.filter(t => t.url === url)[0]
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isLoadedState.isLoaded) {
            dispatch({ type: SBOARD_EXIT, payload: url })
            getBoards()
        }
    }, [])

    const getBoards = () => {
        dispatch({ type: SBOARD_LOADING })
        axios.get(`/shared${url}/?skip=${isLoadedState.skip}`, { headers })
            .then((res) => {
                const payload = {
                    url,
                    boards: res.data.boards.map(m => {
                        return {
                            ...m,
                            titled: url
                        }
                    })
                }
                dispatch({ type: SBOARD_GET, payload })
            })
            .catch((err) => {
                console.log(err)
                dispatch({ type: SBOARD_ERROR })
            })
    }

    return { boards: currentBoard, isLoadedState, loading, error, getBoards }
}

export default useSBoard