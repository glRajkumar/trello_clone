import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Common'
import "../../CSS/board.css"
import Lists from './Lists'
import OtherUser from '../User/OtherUser'
import SearchUser from '../User/SearchUser'
import useDetailed from '../Customs/useDetailed'
import { useDispatch } from 'react-redux'
import { TASK_RELIST, TASK_REORDER, TASK_REGROUP } from '../../Store/actionTypes'

const initDnDState = {
    id: "",
    dragFrom: null,
    dragTo: null,
    isDragging: false
}

function Board({ headers }) {
    const { boardid } = useParams()
    const dispatch = useDispatch()
    const { taskStatus, isMine, loading, detailed, Private, createNewStatus } = useDetailed(boardid, headers)
    const [showMem, setshowMem] = useState(false)
    const [open, setOpen] = useState(false)
    const [addU, setAddU] = useState(false)
    const [create, setCreate] = useState(false)
    const [newStatus, setStatus] = useState("")
    const [listDnD, setlistDnD] = useState(initDnDState)
    const [dnd, setDnd] = useState(initDnDState)

    const hanDragStart = e => {
        let dragFrom = Number(e.currentTarget.dataset.position)
        setDnd({
            ...dnd,
            dragFrom,
            isDragging: true
        })
    }

    const hanDragOver = e => {
        e.preventDefault()
    }

    const hanDragDrop = e => {
        e.preventDefault()
        e.currentTarget.id = ""
        let payload = {
            boardid,
            ...dnd
        }
        console.log("drop")
        console.log(payload)
        dispatch({ type: TASK_RELIST, payload })
        setDnd({ ...initDnDState })
    }
    // console.log(dnd)
    const hanDragEnter = (e) => {
        e.preventDefault()
        let dragTo = Number(e.currentTarget.dataset.position)
        console.log(dragTo)
        if (dragTo !== dnd.dragTo) {
            setDnd({
                ...dnd,
                dragTo
            })
        }
    }

    const hanDragLeave = e => {
        e.currentTarget.id = ""
    }

    const hanDragEnd = e => {
        console.log("end")
    }

    const setListDnDData = (data) => {
        setlistDnD(prev => {
            return {
                ...prev,
                ...data
            }
        })
    }

    const reOrder = () => {
        let payload = {
            boardid,
            from: listDnD.dragFrom,
            to: listDnD.dragTo,
            id: listDnD.id
        }
        if (payload.from.status === payload.to.status) {
            dispatch({ type: TASK_REORDER, payload })
        } else {
            dispatch({ type: TASK_REGROUP, payload })
        }
        setlistDnD({ ...initDnDState })
    }

    return !loading ? (
        <div className="board" style={detailed.bg?.isColour ? { backgroundColor: detailed.bg?.name } : { backgroundImage: `url(${'/static/' + detailed.bg?.name})` }}>
            <div className="board-head">
                <div className="bh-top"> {detailed.boardName} </div>
                <div className="bh-top"> {detailed.catagery} </div>
                {
                    isMine &&
                    <>
                        <div className="bh-top" onClick={Private}> {detailed.isPublic ? "Make private" : "Make public"} </div>
                        <div className="board-users bh-top">
                            <div onClick={() => setOpen(prev => !prev)}>other users</div>
                            <div>
                                {
                                    open &&
                                    <div className="board-useroption">
                                        <div>
                                            <p onClick={() => { setshowMem(prev => !prev); setAddU(false) }}>members</p>
                                            {
                                                showMem &&
                                                <div>
                                                    <OtherUser headers={headers} boardId={boardid} />
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <p onClick={() => { setAddU(prev => !prev); setshowMem(false) }}>add users</p>
                                            {
                                                addU &&
                                                <div>
                                                    <SearchUser headers={headers} boardId={boardid} />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </>
                }
            </div>

            <div className="board-lists">
                {
                    taskStatus.map((status, i) => {
                        return (
                            <div
                                className="list-holder"
                                // draggable="true"
                                // onDragStart={e => hanDragStart(e)}
                                // onDragEnter={e => hanDragEnter(e)}
                                // onDragOver={e => hanDragOver(e)}
                                // onDrop={e => hanDragDrop(e)}
                                // onDragLeave={e => hanDragLeave(e)}
                                // onDragEnd={e => hanDragEnd(e)}
                                // data-position={i}
                                key={status}
                            >
                                <strong>{status}</strong>
                                <Lists
                                    status={status}
                                    headers={headers}
                                    boardid={boardid}
                                    isMine={isMine}
                                    taskStatus={taskStatus}
                                    setListDnDData={setListDnDData}
                                    reOrder={reOrder}
                                />
                            </div>
                        )
                    })
                }

                <div>
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
            </div>
        </div>
    )
        : (<Loading />)
}

export default Board