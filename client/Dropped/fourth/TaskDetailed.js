import React from 'react'
import { useDispatch } from "react-redux"
import { TASK_EDIT, TASK_EDIT_WSTATUS } from '../../Store/actionTypes'
import TaskBody from '../SharedComp/TaskBody'

function TaskDetailed({ list, headers, taggleTask, isMine, permision }) {
    const dispatch = useDispatch()

    const editTask = (payload, originalStatus) => {
        if (payload.toStatus) {
            dispatch({ type: TASK_EDIT_WSTATUS, payload })
        } else {
            payload.status = originalStatus
            dispatch({ type: TASK_EDIT, payload })
        }
        taggleTask()
    }

    return (
        <TaskBody
            list={list}
            headers={headers}
            taggleTask={taggleTask}
            canSubmit={isMine || permision !== "View"}
            editTask={editTask}
        />
    )
}

export default TaskDetailed




/// first
import React from 'react'
import { useDispatch } from "react-redux"
import { TASK_EDIT, TASK_EDIT_WSTATUS } from '../../Store/actionTypes'
import TaskBody from '../SharedComp/TaskBody'
import axios from 'axios'

function TaskDetailed({ list, headers, taggleTask, isMine, permision }) {
    const dispatch = useDispatch()

    const Submit = (original, details) => {
        const payload = {
            taskId: original._id
        }
        if (original.title !== details.title) {
            payload.title = details.title
        }
        if (original.body !== details.body) {
            payload.body = details.body
        }
        if (original.status !== details.status) {
            payload.fromStatus = original.status
            payload.toStatus = details.status
        }

        axios.put('/task', { ...payload }, { headers })
            .then(() => {
                payload.boardId = original.boardId
                if (payload.toStatus) {
                    dispatch({ type: TASK_EDIT_WSTATUS, payload })
                } else {
                    payload.status = original.status
                    dispatch({ type: TASK_EDIT, payload })
                }
                taggleTask()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <TaskBody
            list={list}
            taggleTask={taggleTask}
            canSubmit={isMine || permision !== "View"}
            Submit={Submit}
        />
    )
}

export default TaskDetailed