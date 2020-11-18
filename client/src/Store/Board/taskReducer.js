import {
    DET_INIT,
    DET_GET,
    DET_EDIT,
    NEWSTATUS,
    TASK_ADD,
    TASK_EDIT,
    TASK_DELETE,
    DET_DELETE
} from '../actionTypes'

const initState = {
    detailed: []
}

const taskReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case DET_INIT:
            return {
                ...initState
            }

        case DET_GET:
            return {
                detailed: [
                    ...state.detailed,
                    payload
                ]
            }

        case DET_EDIT:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            ...payload.info
                        }
                    } else {
                        return board
                    }
                })
            }

        case NEWSTATUS:
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

        case TASK_ADD:
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

        case TASK_EDIT:
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

        case TASK_DELETE:
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

        case DET_DELETE:
            return {
                detailed: state.detailed.filter(board => board._id !== payload)
            }

        default: return state
    }
}

export default taskReducer