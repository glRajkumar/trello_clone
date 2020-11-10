const publicReducer = (state, { type, payload }) => {
    switch (type) {
        case "BOARD_LOADING":
            return {
                ...state,
                loading: true
            }

        case "BOARD_GET":
            if (payload.boards.length < 10) {
                return {
                    ...state,
                    skip: state.skip + 10,
                    loading: false,
                    boards: [
                        ...state.boards,
                        ...payload.boards
                    ],
                    hasMore: false
                }
            } else {
                return {
                    ...state,
                    skip: state.skip + 5,
                    loading: false,
                    boards: [
                        ...state.boards,
                        ...payload.boards
                    ]
                }
            }

        case "BOARD_ERROR":
            return {
                ...state,
                loading: false,
                error: "Something went wrong..."
            }

        default: return state
    }
}

export default publicReducer