import React from 'react'
import TaskBody from '../SharedComp/TaskBody'

function LiveTaskDetailed({ list, headers, taggleTask, editTask }) {
    return (
        <TaskBody
            list={list}
            headers={headers}
            taggleTask={taggleTask}
            canSubmit={true}
            editTask={editTask}
        />
    )
}

export default LiveTaskDetailed



/// first
import React from 'react'
import axios from 'axios'
import TaskBody from '../SharedComp/TaskBody'

function LiveTaskDetailed({ list, headers, taggleTask, editTask }) {
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
                editTask(payload, original.status)
                // if (payload.toStatus) {
                // editTask(payload)
                // } else {
                //     payload.status = original.status
                //     editTask(payload)
                // }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <TaskBody
            list={list}
            taggleTask={taggleTask}
            canSubmit={true}
            Submit={Submit}
        />
    )
}

export default LiveTaskDetailed
