import { BOARD_LOADING, BOARD_GET, BOARD_ADD, BOARD_EDIT, BOARD_DELETE, BOARD_ERROR } from '../actionTypes'

const initialState = {
    boards: [],
    loading: true,
    error: ""
}

const boardReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case BOARD_LOADING:
            return {
                ...state,
                loading: true
            }

        case BOARD_GET:
            return {
                ...state,
                loading: false,
                boards: [
                    ...state.boards,
                    ...payload.boards
                ]
            }

        case BOARD_ADD:
            return {
                ...state,
                boards: [
                    ...state.boards,
                    payload
                ]
            }

        case BOARD_EDIT:
            const newData = state.boards.map(board => {
                if (board._id === payload.id) {
                    return {
                        ...board,
                        ...payload
                    }
                } else {
                    return board
                }
            })
            return {
                ...state,
                boards: newData
            }

        case BOARD_DELETE:
            return {
                ...state,
                boards: state.boards.filter(t => t._id !== payload)
            }

        case BOARD_ERROR:
            return {
                ...state,
                loading: false,
                error: "Something went wrong..."
            }

        default: return state
    }
}

export default boardReducer