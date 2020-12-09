import React, { useEffect, useState } from 'react'
import ListBody from '../SharedComp/ListBody'

function LiveLists({ headers, boardId, status, taskStatus, list, setlistDnD, reOrder, addTitle, delTitle, taggleTask }) {
    const [tasks, setTasks] = useState(list)

    useEffect(() => {
        setTasks(list)
    }, [list])

    return (
        <ListBody
            tasks={tasks}
            status={status}
            isMine={true}
            taskStatus={taskStatus}
            headers={headers}
            boardId={boardId}
            canAddTask={true}
            setlistDnD={setlistDnD}
            reOrder={reOrder}
            addTitle={addTitle}
            delTitle={delTitle}
            taggleTask={taggleTask}
        />
    )
}

export default LiveLists