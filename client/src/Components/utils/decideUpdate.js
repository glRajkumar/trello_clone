import {
    newStatusBuilder, addNewTask, taskEditer,
    taskEditerWithStatus, delExistTask, reOrderStatusHelp,
    reOrderListHelp, reGroupListHelp
} from './dataManager'

function decideUpdate(obj, payload) {
    switch (payload.action) {
        case "new-status":
            return newStatusBuilder(obj, payload)

        case "new-title":
            return {
                ...obj,
                tasks: addNewTask(obj.tasks, payload)
            }

        case "task-edit":
            return {
                ...obj,
                tasks: taskEditer(obj.tasks, payload)
            }

        case "task-edit-withstatus":
            return {
                ...obj,
                tasks: taskEditerWithStatus(obj.tasks, payload)
            }

        case "del-title":
            return {
                ...obj,
                tasks: delExistTask(obj.tasks, payload)
            }

        case "reorder-status":
            return reOrderStatusHelp(obj, payload)

        case "reorder-list":
            return {
                ...obj,
                tasks: reOrderListHelp(obj.tasks, payload)
            }

        case "restatus-list":
            return {
                ...obj,
                tasks: reGroupListHelp(obj.tasks, payload)
            }

        default:
            return obj
    }
}

export default decideUpdate