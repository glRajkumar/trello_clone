export function newStatusBuilder(obj, payload) {
    return {
        ...obj,
        taskStatus: [
            ...obj.taskStatus,
            payload.status
        ],
        tasks: [
            ...obj.tasks,
            {
                status: payload.status,
                tasks: []
            }
        ]
    }
}

export function addNewTask(arr, payload) {
    let newArr = arr.map(task => {
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

    return newArr
}

export function taskEditer(arr, payload) {
    let { taskId, boardId, status, ...changes } = payload
    let newArr = arr.map(task => {
        if (task.status === status) {
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

    return newArr
}

export function taskEditerWithStatus(arr, payload) {
    let { taskId, boardId, fromStatus, toStatus, ...changes } = payload
    let current = arr.filter(t => t.status === fromStatus)[0].tasks.filter(t => t._id === taskId)[0]
    let newArr = arr.map(task => {
        if (task.status === fromStatus) {
            return {
                ...task,
                tasks: task.tasks.filter(t => t._id !== taskId)
            }
        } else if (task.status === toStatus) {
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

    return newArr
}

export function delExistTask(arr, payload) {
    let newArr = arr.map(task => {
        if (task.status === payload.status) {
            return {
                ...task,
                tasks: task.tasks.filter(t => t._id !== payload.taskId)
            }
        } else {
            return task
        }
    })

    return newArr
}

export function reOrderStatusHelp(obj, payload) {
    let { taskStatus, tasks } = obj
    let remaings = taskStatus.filter((item, i) => i !== payload.dragFrom)
    let newTaskStatus = [
        ...remaings.slice(0, payload.dragTo),
        taskStatus[payload.dragFrom],
        ...remaings.slice(payload.dragTo)
    ]
    let remaingTasks = tasks.filter((item, i) => i !== payload.dragFrom)
    let newTasks = [
        ...remaingTasks.slice(0, payload.dragTo),
        tasks[payload.dragFrom],
        ...remaingTasks.slice(payload.dragTo)
    ]

    return {
        ...obj,
        taskStatus: newTaskStatus,
        tasks: newTasks
    }
}

export function reOrderListHelp(arr, payload) {
    let newArr = arr.map(task => {
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

    return newArr
}

export function reGroupListHelp(arr, payload) {
    let current = arr.filter(t => t.status === payload.from.status)[0].tasks.filter((task, i) => i === payload.from.pos)[0]
    let newArr = arr.map(task => {
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

    return newArr
}

