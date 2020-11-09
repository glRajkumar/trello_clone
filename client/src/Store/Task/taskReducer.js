import { TASK_LOADING, TASK_GET, TASK_ADD, TASK_EDIT, TASK_DELETE, TASK_ERROR } from '../actionTypes'

const initState = {
    tasks: [],
    loading: true,
    error: ""
}

const taskReducer = (state = initState, { type, payload }) => {
    switch (type) {
        case TASK_LOADING:
            return {
                ...state,
                loading: true
            }

        case TASK_GET:
            console.log("payload at get")
            console.log(payload)
            return {
                ...state,
                loading: false,
                tasks: [
                    ...state.tasks,
                    ...payload.tasks
                ]
            }

        case TASK_ADD:
            console.log("payload at add")
            console.log(payload)
            return {
                ...state,
                tasks: state.tasks.push({ ...payload })
            }

        case TASK_EDIT:
            console.log("payload at edit")
            console.log(payload)
            const newData = state.tasks.map(task => {
                if (task._id === payload.id) {
                    return {
                        ...task,
                        ...payload
                    }
                } else {
                    return task
                }
            })
            return {
                ...state,
                tasks: newData
            }

        case TASK_DELETE:
            console.log("payload at delete")
            console.log(payload)
            return {
                ...state,
                tasks: state.tasks.filter(t => t._id !== payload)
            }

        case TASK_ERROR:
            return {
                ...state,
                loading: false,
                error: "Something went wrong..."
            }

        default: return state
    }
}

export default taskReducer