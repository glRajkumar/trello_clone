import {
    SDET_INIT,
    SDET_GET,
    SNEWSTATUS,
    STASK_RELIST,
    STASK_REORDER,
    STASK_REGROUP,
    STASK_ADD,
    STASK_EDIT,
    STASK_EDIT_WSTATUS,
    STASK_DELETE
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
                                payload.status
                            ],
                            tasks: [
                                ...board.tasks,
                                {
                                    status: payload.status,
                                    tasks: []
                                }
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
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            tasks: board.tasks.map(task => {
                                if (task.status === payload.status) {
                                    return {
                                        ...task,
                                        tasks: [
                                            ...task.tasks,
                                            payload
                                        ]
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

        case STASK_EDIT:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        let { taskId, boardId, status, ...changes } = payload
                        return {
                            ...board,
                            tasks: board.tasks.map(task => {
                                if (task.status === payload.status) {
                                    return {
                                        ...task,
                                        tasks: task.tasks.map(task => {
                                            if (task._id === payload.taskId) {
                                                return {
                                                    ...task,
                                                    ...changes
                                                }
                                            } else {
                                                return task
                                            }
                                        })
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

        case STASK_EDIT_WSTATUS:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        let current = board.tasks.filter(t => t.status === payload.fromStatus)[0].tasks.filter(t => t._id === payload.taskId)[0]
                        let { taskId, boardId, fromStatus, toStatus, ...changes } = payload
                        return {
                            ...board,
                            tasks: board.tasks.map(task => {
                                if (task.status === payload.fromStatus) {
                                    return {
                                        ...task,
                                        tasks: task.tasks.filter(t => t._id !== payload.taskId)
                                    }
                                } else if (task.status === payload.toStatus) {
                                    return {
                                        ...task,
                                        tasks: [
                                            ...task.tasks,
                                            {
                                                ...current,
                                                ...changes
                                            }
                                        ]
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
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            tasks: board.tasks.map(task => {
                                if (task.status === payload.status) {
                                    return {
                                        ...task,
                                        tasks: task.tasks.filter(t => t._id !== payload.taskId),
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

        case STASK_RELIST:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            taskStatus: payload.newTaskStatus,
                            tasks: payload.newTasks
                        }
                    } else {
                        return board
                    }
                })
            }

        case STASK_REORDER:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        return {
                            ...board,
                            tasks: board.tasks.map(task => {
                                if (task.status === payload.from.status) {
                                    let current = task.tasks[payload.from.pos]
                                    let remaings = task.tasks.filter((item, i) => i !== payload.from.pos)
                                    let newList = [
                                        ...remaings.slice(0, payload.to.pos),
                                        current,
                                        ...remaings.slice(payload.to.pos)
                                    ]
                                    return {
                                        ...task,
                                        tasks: newList
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

        case STASK_REGROUP:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardId) {
                        let current = board.tasks.filter(t => t.status === payload.from.status)[0].tasks.filter((task, i) => i === payload.from.pos)[0]
                        current.status = payload.to.status
                        return {
                            ...board,
                            tasks: board.tasks.map(task => {
                                if (task.status === payload.to.status) {
                                    let remaings = task.tasks
                                    let newList = [
                                        ...remaings.slice(0, payload.to.pos),
                                        current,
                                        ...remaings.slice(payload.to.pos)
                                    ]
                                    return {
                                        ...task,
                                        tasks: newList
                                    }
                                } else if (task.status === payload.from.status) {
                                    return {
                                        ...task,
                                        tasks: task.tasks.filter((t, i) => i !== payload.from.pos)
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

        default: return state
    }
}

export default staskReducer