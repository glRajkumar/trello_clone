import {
    DET_INIT,
    DET_GET,
    DET_EDIT,
    NEWSTATUS,
    TASK_RELIST,
    TASK_REORDER,
    TASK_REGROUP,
    TASK_ADD,
    TASK_EDIT,
    TASK_EDIT_WSTATUS,
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

        case TASK_ADD:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardid) {
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

        case TASK_EDIT:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardid) {
                        return {
                            ...board,
                            tasks: board.tasks.map(task => {
                                if (task.status === payload.status) {
                                    return {
                                        ...task,
                                        tasks: task.tasks.map(task => {
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
                                    return task
                                }
                            })
                        }
                    } else {
                        return board
                    }
                })
            }

        case TASK_EDIT_WSTATUS:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardid) {
                        return {
                            ...board,
                            tasks: board.tasks.map(task => {
                                if (task.status === payload.status) {
                                    return {
                                        ...task,
                                        tasks: task.tasks.filter(t => t._id !== payload.taskid)
                                    }
                                } else if (task.status === payload.info.status) {
                                    return {
                                        ...task,
                                        tasks: [
                                            ...task.tasks,
                                            payload.info
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

        case TASK_DELETE:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardid) {
                        return {
                            ...board,
                            tasks: board.tasks.map(task => {
                                if (task.status === payload.status) {
                                    return {
                                        ...task,
                                        tasks: task.tasks.filter(t => t._id !== payload.taskid),
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

        case TASK_RELIST:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardid) {
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

        case TASK_REORDER:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardid) {
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

        case TASK_REGROUP:
            return {
                detailed: state.detailed.map(board => {
                    if (board._id === payload.boardid) {
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

        case DET_DELETE:
            return {
                detailed: state.detailed.filter(board => board._id !== payload)
            }

        default: return state
    }
}

export default taskReducer