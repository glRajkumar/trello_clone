import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Draggable } from 'react-smooth-dnd'
import { useDispatch } from 'react-redux'
import { STASK_REORDER, STASK_REGROUP } from '../../Store/actionTypes'
import useSDetailed from '../Customs/useSDetailed'
import SharedLists from './SharedLists'
import { Loading } from '../Common'
import "../../CSS/board.css"
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

function SharedBoard({ headers }) {
    const { boardId } = useParams()
    const dispatch = useDispatch()
    const createStatusRef = useRef(null)
    const { permision, detailed, loading, taskStatus, createNewStatus, reOrderStatus } = useSDetailed(boardId, headers)
    const [create, setCreate] = useState(false)
    const [newStatus, setStatus] = useState("")
    const [listDnD, setlistDnD] = useState(initDnDState)

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
                    dispatch({ type: STASK_REORDER, payload })
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
                    dispatch({ type: STASK_REGROUP, payload })
                }
            }
        }
        setlistDnD({
            dragFrom: null,
            dragTo: null
        })
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
        setlistDnD({
            dragFrom: null,
            dragTo: null
        })
    }

    const doNothing = e => {
        return
    }

    const addStatus = () => {
        createNewStatus(newStatus)
        setStatus("")
        createStatusRef.current.focus()
    }

    return !loading ? (
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
                    taskStatus.map(status => {
                        return (
                            <Draggable key={status} className="status-holder">
                                <p className="status-title">
                                    <strong className={permision !== "View" ? "column-drag-handle" : "nondrag"}>
                                        {status}
                                    </strong>
                                </p>
                                <SharedLists
                                    status={status}
                                    headers={headers}
                                    boardId={boardId}
                                    permision={permision}
                                    taskStatus={taskStatus}
                                    setlistDnD={setlistDnD}
                                    reOrder={reOrder}
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
        </div>
    )
        : (<Loading />)
}

export default SharedBoard
