import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TASK_ADD, TASK_DELETE } from '../../Store/actionTypes'
import ListBody from '../SharedComp/ListBody'

function Lists({ headers, boardId, status, isMine, permision, taskStatus, setlistDnD, reOrder, taggleTask }) {
    const dispatch = useDispatch()
    const { detailed } = useSelector(state => state.task)
    const tasks = detailed.filter(d => d._id === boardId)[0]?.tasks.filter(task => task.status === status)[0]?.tasks

    const addTitle = (payload) => {
        dispatch({ type: TASK_ADD, payload })
    }

    const delTitle = (payload) => {
        dispatch({ type: TASK_DELETE, payload })
    }

    return (
        <ListBody
            tasks={tasks}
            status={status}
            isMine={isMine}
            taskStatus={taskStatus}
            headers={headers}
            boardId={boardId}
            canAddTask={permision !== "View"}
            setlistDnD={setlistDnD}
            reOrder={reOrder}
            addTitle={addTitle}
            delTitle={delTitle}
            taggleTask={taggleTask}
        />
    )
}

export default Lists