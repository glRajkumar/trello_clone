import React, { useRef, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { initDnDState, colDragStyle, getBg } from '../utils/general'
import TaskBody from './SharedComp/TaskBody'
import "../../CSS/board.css"

function BoardBody({ isMine, children }) {
    const createStatusRef = useRef(null)
    const [create, setCreate] = useState(false)
    const [newStatus, setStatus] = useState("")
    const [listDnD, setlistDnD] = useState(initDnDState)
    const [showDetails, setShowDetails] = useState(false)
    const [task, setTask] = useState({})

    const reOrder = () => {
        let payload = {
            boardId,
            from: listDnD.dragFrom,
            to: listDnD.dragTo
        }
        if (payload.from && payload.to) {
            let from = `${payload.from.status} ${payload.from.pos}`
            let to = `${payload.to.status} ${payload.to.pos}`
            let sameCheck = from === to

            if (!sameCheck) {
                if (payload.from.status === payload.to.status) {
                    axios.put("/board/reorder-task", {
                        boardId,
                        taskId: payload.from.id,
                        status: payload.from.status,
                        to: payload.to.pos
                    }, { headers })
                        .then((res) => {
                            console.log(res)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    dispatch({ type: TASK_REORDER, payload })
                } else {
                    axios.put("/board/restatus-task", {
                        boardId,
                        taskId: payload.from.id,
                        fromStatus: payload.from.status,
                        toStatus: payload.to.status,
                        to: payload.to.pos
                    }, { headers })
                        .then((res) => {
                            console.log(res)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    dispatch({ type: TASK_REGROUP, payload })
                }
            }
        }
        setlistDnD({ ...initDnDState })
    }

    const onColumnDrop = (e) => {
        // console.log("drag drop col", e)
        const { removedIndex, addedIndex } = e
        if (removedIndex !== null && addedIndex !== null && removedIndex !== addedIndex) {
            let payload = {
                boardId,
                dragFrom: removedIndex,
                dragTo: addedIndex
            }
            reOrderStatus(payload)
        }
        setlistDnD({ ...initDnDState })
    }

    const doNothing = e => {
        return
        // onDragEnter and onDragLeave doesn't have any parameter
        // if (e) {
        //     console.log("put the property name")
        //     console.log(e)
        // }
    }

    const addStatus = () => {
        createNewStatus(newStatus)
        setStatus("")
        createStatusRef.current.focus()
    }

    const taggleTask = (payload = {}) => {
        setTask(payload)
        setShowDetails(prev => !prev)
    }

    return (
        <div className="board" style={getBg(detailed.bg)}>
            <div className="board-head">
                <div className="bh-top"> {detailed.boardName} </div>
                <div className="bh-top"> {detailed.catagery} </div>
                {
                    isMine &&
                    children
                }
            </div>

            <Container
                groupName="status"
                style={colDragStyle}
                orientation="horizontal"
                getChildPayload={i => i}
                dragHandleSelector=".column-drag-handle"
                nonDragAreaSelector=".nondrag"
                onDragStart={e => doNothing(e)}
                onDragEnd={e => doNothing(e)}
                onDrop={e => onColumnDrop(e)}
                onDragEnter={() => doNothing()}
                onDragLeave={() => doNothing()}
                onDropReady={e => doNothing(e)}
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'staus-drop-preview'
                }}
            >
                {
                    taskStatus.map(status => {
                        return (
                            <Draggable key={status} className="status-holder">
                                <p className="status-title">
                                    <strong className={(isMine || permision !== "View") ? "column-drag-handle" : "nondrag"}>
                                        {status}
                                    </strong>
                                </p>
                                <Lists
                                    status={status}
                                    headers={headers}
                                    boardId={boardId}
                                    isMine={isMine}
                                    permision={permision}
                                    taskStatus={taskStatus}
                                    setlistDnD={setlistDnD}
                                    reOrder={reOrder}
                                    taggleTask={taggleTask}
                                />
                            </Draggable>
                        )
                    })
                }

                {
                    permision !== "View" &&
                    <div className="nondrag">
                        {
                            !create
                                ?
                                <p
                                    className="new-status"
                                    onClick={() => {
                                        setCreate(prev => !prev)
                                        setTimeout(() => {
                                            createStatusRef.current.focus()
                                        }, 0)
                                    }}>
                                    Create new status
                                </p>
                                :
                                <div className="list-lasts">
                                    <input
                                        className="input-box"
                                        type="text"
                                        placeholder="add new title..."
                                        value={newStatus}
                                        ref={createStatusRef}
                                        onKeyDown={e => e.key === "Enter" ? addStatus() : null}
                                        onChange={e => setStatus(e.target.value)}
                                    />
                                    <button onClick={addStatus}>
                                        Create
                                </button>
                                    <button onClick={() => setCreate(prev => !prev)}>Cancel</button>
                                </div>
                        }
                    </div>
                }
            </Container>

            {
                showDetails &&
                <div className="task-holder">
                    <TaskBody
                        list={task}
                        headers={headers}
                        taggleTask={taggleTask}
                        canSubmit={true}
                        editTask={editTask}
                    />
                </div>
            }
        </div>
    )
}

export default BoardBody