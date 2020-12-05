import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Container, Draggable } from 'react-smooth-dnd'
import io from 'socket.io-client'
import LiveLists from './LiveLists'
import axios from 'axios'

const initDnDState = {
    dragFrom: null,
    dragTo: null
}

const colDragStyle = {
    overflowX: "scroll",
    minHeight: "80vh",
    display: "grid",
    gridTemplateColumns: "repeat(100, minmax(250px, 1fr))"
}

let socket;

function LiveBoard({ headers }) {
    const history = useHistory()
    const { room } = useParams()
    const { state } = useLocation()
    const createStatusRef = useRef(null)
    const [detailed, setDetailed] = useState(state.board)
    const [create, setCreate] = useState(false)
    const [newStatus, setStatus] = useState("")
    const [listDnD, setlistDnD] = useState(initDnDState)

    useEffect(() => {
        socket = io("/")
        socket.emit("enter-room", { room: detailed.room })

        socket.on("update-board", (data) => {
            console.log(data)
        })

        return () => leave()
    }, [])

    const leave = () => {
        socket.on('disconnect')
        socket.off()
        history.push('/')
    }

    const createNewStatus = (status) => {
        let payload = {
            boardId: detailed._id,
            status
        }

        axios.put("/board/add-status", { ...payload }, { headers })
            .then((res) => {
                console.log(res.data)
                setDetailed(prev => {
                    return {
                        ...prev,
                        taskStatus: [
                            ...prev.taskStatus,
                            status
                        ],
                        tasks: [
                            ...prev.tasks,
                            {
                                status,
                                tasks: []
                            }
                        ]
                    }
                })
                console.log(payload)
                socket.emit("update-board", {
                    room,
                    payload: {
                        status,
                        action: "new-status"
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const addTitle = (payload) => {
        setDetailed(prev => {
            return {
                ...prev,
                tasks: prev.tasks.map(task => {
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
        })
        console.log(payload)
        payload.action = "new-title"
        socket.emit("update-board", {
            room,
            payload
        })
    }

    const delTitle = (payload) => {
        setDetailed(prev => {
            return {
                ...prev,
                tasks: prev.tasks.map(task => {
                    if (task.status === payload.status) {
                        return {
                            ...task,
                            tasks: task.tasks.filter(t => t._id !== payload.taskId)
                        }
                    } else {
                        return task
                    }
                })
            }
        })
        console.log(payload)
        payload.action = "del-title"
        socket.emit("update-board", {
            room,
            payload
        })
    }

    const reOrderStatus = (payload) => {
        let { taskStatus, tasks } = detailed
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
        setDetailed(prev => {
            return {
                ...prev,
                taskStatus: newTaskStatus,
                tasks: newTasks
            }
        })
        axios.put("/board/reorder-status", { boardId: detailed._id, from: payload.dragFrom, to: payload.dragTo }, { headers })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getBg = (bg) => {
        let background = {}
        if (bg) {
            if (bg.isColour) {
                background.backgroundColor = bg.name
                return background
            } else {
                background.backgroundImage = `url('/static/${bg.name}')`
                return background
            }
        } else {
            return
        }
    }

    const reOrder = () => {
        let payload = {
            boardId: detailed._id,
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
                        boardId: detailed._id,
                        taskId: payload.from.id,
                        status: payload.from.status,
                        to: payload.to.pos
                    }, { headers })
                        .then((res) => {
                            console.log(res)
                            setDetailed(prev => {
                                return {
                                    ...prev,
                                    tasks: prev.tasks.map(task => {
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
                            })
                            console.log(payload)
                            payload.action = "reorder-list"
                            socket.emit("update-board", {
                                room,
                                payload
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {
                    axios.put("/board/restatus-task", {
                        boardId: detailed._id,
                        taskId: payload.from.id,
                        fromStatus: payload.from.status,
                        toStatus: payload.to.status,
                        to: payload.to.pos
                    }, { headers })
                        .then((res) => {
                            console.log(res)
                            setDetailed(prev => {
                                return {
                                    ...prev,
                                    tasks: prev.tasks.map(task => {
                                        let current = prev.tasks.filter(t => t.status === payload.from.status)[0].tasks.filter((task, i) => i === payload.from.pos)[0]
                                        current.status = payload.to.status
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
                            })
                            console.log(payload)
                            payload.action = "restatus-list"
                            socket.emit("update-board", {
                                room,
                                payload
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            }
        }
        setlistDnD({
            dragFrom: null,
            dragTo: null
        })
    }

    const onColumnDrop = (e) => {
        const { removedIndex, addedIndex } = e
        if (removedIndex !== null && addedIndex !== null && removedIndex !== addedIndex) {
            let payload = {
                boardId: detailed._id,
                dragFrom: removedIndex,
                dragTo: addedIndex
            }
            reOrderStatus(payload)
            console.log(payload)
            payload.action = "reorder-status"
            socket.emit("update-board", {
                room,
                payload
            })
        }
        setlistDnD({
            dragFrom: null,
            dragTo: null
        })
    }

    const doNothing = e => { return }

    const addStatus = () => {
        createNewStatus(newStatus)
        setStatus("")
        createStatusRef.current.focus()
    }

    return (
        <div className="board" style={getBg(detailed.bg)}>
            <div className="board-head">
                <div className="bh-top"> {detailed.boardName} </div>
                <div className="bh-top"> {detailed.catagery} </div>
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
                    detailed.taskStatus?.map(status => {
                        return (
                            <Draggable key={status} className="status-holder">
                                <p className="status-title"><strong className="column-drag-handle">{status}</strong></p>
                                <LiveLists
                                    status={status}
                                    headers={headers}
                                    boardId={detailed._id}
                                    list={detailed.tasks.filter(t => t.status === status)[0].tasks}
                                    taskStatus={detailed.taskStatus}
                                    setlistDnD={setlistDnD}
                                    reOrder={reOrder}
                                    addTitle={addTitle}
                                    delTitle={delTitle}
                                />
                            </Draggable>
                        )
                    })
                }

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
            </Container>
        </div>
    )
}

export default LiveBoard
