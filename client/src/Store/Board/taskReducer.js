import {
    DET_INIT, DET_GET, DET_EDIT, NEWSTATUS,
    TASK_RELIST, TASK_REORDER, TASK_REGROUP, TASK_ADD,
    TASK_EDIT, TASK_EDIT_WSTATUS, TASK_DELETE, DET_DELETE
} from '../actionTypes'
import {
    newStatusBuilder, addNewTask, taskEditer,
    taskEditerWithStatus, delExistTask, reOrderStatusHelp,
    reOrderListHelp, reGroupListHelp
} from '../../Components/utils/dataManager'

const initState = {
    detailed: []
}

const taskReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case DET_INIT:
            return initState

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
                        return newStatusBuilder(board, payload)
                    } else {
                        return board
                    }
                })
            }

        case TASK_ADD:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            tasks: addNewTask(board.tasks, payload)
                        }
                    } else {
                        return board
                    }
                })
            }

        case TASK_EDIT:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            tasks: taskEditer(board.tasks, payload)
                        }
                    } else {
                        return board
                    }
                })
            }

        case TASK_EDIT_WSTATUS:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            tasks: taskEditerWithStatus(board.tasks, payload)
                        }
                    } else {
                        return board
                    }
                })
            }

        case TASK_DELETE:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            tasks: delExistTask(board.tasks, payload)
                        }
                    } else {
                        return board
                    }
                })
            }

        case TASK_RELIST:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        //we can do like follow since we doing all opertions in useDetailed
                        // return reOrderStatusHelp(board, payload) 
                        return {
                            ...board,
                            taskStatus: payload.taskStatus,
                            tasks: payload.tasks
                        }
                    } else {
                        return board
                    }
                })
            }

        case TASK_REORDER:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            tasks: reOrderListHelp(board.tasks, payload)
                        }
                    } else {
                        return board
                    }
                })
            }

        case TASK_REGROUP:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            tasks: reGroupListHelp(board.tasks, payload)
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