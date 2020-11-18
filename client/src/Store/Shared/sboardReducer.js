import {
    SBOARD_INIT,
    SBOARD_LOADING,
    SBOARD_GET,
    SBOARD_EXIT,
    SBOARD_ERROR
} from '../actionTypes'

const initialState = {
    boards: [],
    isExisted: [
        {
            skip: 0,
            hasMore: true,
            url: "/public",
            isLoaded: false
        },
        {
            skip: 0,
            hasMore: true,
            url: "/boards",
            isLoaded: false
        }
    ],
    loading: true,
    error: ""
}

const sboardReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SBOARD_INIT:
            return {
                ...initialState
            }

        case SBOARD_LOADING:
            return {
                ...state,
                loading: true
            }

        case SBOARD_EXIT:
            return {
                ...state,
                isExisted: state.isExisted.map(val => {
                    if (val.url === payload) {
                        return {
                            ...val,
                            isLoaded: true
                        }
                    } else {
                        return val
                    }
                })
            }

        case SBOARD_GET:
            if (payload.boards.length < 10) {
                return {
                    ...state,
                    loading: false,
                    boards: [
                        ...state.boards,
                        ...payload.boards
                    ],
                    isExisted: state.isExisted.map(val => {
                        if (val.url === payload.url) {
                            return {
                                ...val,
                                skip: val.skip + 10,
                                hasMore: false,
                            }
                        } else {
                            return val
                        }
                    })
                }
            } else {
                return {
                    ...state,
                    loading: false,
                    boards: [
                        ...state.boards,
                        ...payload.boards
                    ],
                    isExisted: state.isExisted.map(val => {
                        if (val.url === payload.url) {
                            return {
                                ...val,
                                skip: val.skip + 10
                            }
                        } else {
                            return val
                        }
                    })
                }
            }

        case SBOARD_ERROR:
            return {
                ...state,
                loading: false,
                error: "Something went wrong..."
            }

        default: return state
    }
}

export default sboardReducer