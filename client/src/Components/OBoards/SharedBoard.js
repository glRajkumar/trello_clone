import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Common'
import "../../CSS/board.css"
import SharedLists from './SharedLists'
import useSDetailed from '../Customs/useSDetailed'
import { Container, Draggable } from 'react-smooth-dnd'
import { useDispatch } from 'react-redux'
import { TASK_REORDER, TASK_REGROUP } from '../../Store/actionTypes'
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
    const { boardid } = useParams()
    const dispatch = useDispatch()
    const { permision, detailed, loading, taskStatus, createNewStatus } = useSDetailed(boardid, headers)
    const [create, setCreate] = useState(false)
    const [newStatus, setStatus] = useState("")
    const [listDnD, setlistDnD] = useState(initDnDState)

    const reOrder = () => {
        let payload = {
            boardid,
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
                        boardId: boardid,
                        taskid: payload.from.id,
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
                        boardId: boardid,
                        taskid: payload.from.id,
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
                boardid,
                dragFrom: removedIndex,
                dragTo: addedIndex
            }
            // reOrderStatus(payload)
        }
        setlistDnD({
            dragFrom: null,
            dragTo: null
        })
    }

    return !loading ? (
        <div className="board" style={detailed.bg?.isColour ? { backgroundColor: detailed.bg?.name } : { backgroundImage: `url(${'/static/' + detailed.bg?.name})` }}>
            <div className="board-head">
                <div className="bh-top"> {detailed.boardName} </div>
                <div className="bh-top"> {detailed.catagery} </div>
            </div>

            <Container
                groupName="status"
                style={colDragStyle}
                orientation="horizontal"
                getChildPayload={i => i}
                nonDragAreaSelector=".nondrag"
                onDragStart={e => console.log("drag col start ", e)}
                onDragEnd={e => console.log("drag col end ", e)}
                onDrop={e => onColumnDrop(e)}
                onDragEnter={() => console.log("drag col enter ")}
                onDragLeave={() => console.log("drag col leave ")}
                onDropReady={p => console.log("drag col drop ready ", p)}
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'staus-drop-preview'
                }}
            >
                {
                    taskStatus.map(status => {
                        return (
                            <Draggable key={status}>
                                <strong>{status}</strong>
                                <SharedLists
                                    status={status}
                                    headers={headers}
                                    boardid={boardid}
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
                                <p className="list-add new-status" onClick={() => setCreate(prev => !prev)}>Create new status</p>
                                :
                                <div className="list-lasts">
                                    <input
                                        className="input-box"
                                        type="text"
                                        placeholder="add new title..."
                                        value={newStatus}
                                        onChange={e => setStatus(e.target.value)}
                                    />
                                    <button onClick={() => {
                                        createNewStatus(newStatus)
                                        setCreate(false)
                                        setStatus("")
                                    }}>
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
