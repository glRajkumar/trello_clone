import {
    SDET_INIT,
    SDET_GET,
    STASK_ADD,
    STASK_EDIT,
    STASK_DELETE,
    SNEWSTATUS
} from '../actionTypes'

const initState = {
    detailed: []
}

const staskReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case SDET_INIT:
            return {
                ...initState
            }

        case SDET_GET:
            return {
                detailed: [
                    ...state.detailed,
                    payload
                ]
            }

        case SNEWSTATUS:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            taskStatus: [
                                ...board.taskStatus,
                                payload.name
                            ]
                        }
                    } else {
                        return board
                    }
                })
            }

        case STASK_ADD:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardid) {
                        return {
                            ...board,
                            tasks: [
                                ...board.tasks,
                                payload
                            ]
                        }
                    } else {
                        return board
                    }
                })
            }

        case STASK_EDIT:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardid) {
                        return {
                            ...board,
                            tasks: board.tasks.map(task => {
                                if (task._id === payload.taskid) {
                                    return {
                                        ...task,
                                        ...payload.info
                                    }
                                } else {
                                    return task
                                }
                            })
                        }
                    } else {
                        return board
                    }
                })
            }

        case STASK_DELETE:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardid) {
                        return {
                            ...board,
                            tasks: board.tasks.filter(t => t._id !== payload.taskid)
                        }
                    } else {
                        return board
                    }
                })
            }

        default: return state
    }
}

export default staskReducer