import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Common'
import "../../CSS/board.css"
import Lists from './Lists'
import OtherUser from '../User/OtherUser'
import SearchUser from '../User/SearchUser'
import useDetailed from '../Customs/useDetailed'

function Board({ headers }) {
    const { boardid } = useParams()
    const { taskStatus, isMine, loading, detailed, Private, createNewStatus } = useDetailed(boardid, headers)
    const [showMem, setshowMem] = useState(false)
    const [open, setOpen] = useState(false)
    const [addU, setAddU] = useState(false)
    const [create, setCreate] = useState(false)
    const [newStatus, setStatus] = useState("")

    return !loading ? (
        <div className="board" style={detailed[0].bg?.isColour ? { backgroundColor: detailed[0].bg?.name } : { backgroundImage: `url(${'/static/' + detailed[0].bg?.name})` }}>
            <div className="board-head">
                <div className="bh-top"> {detailed[0].boardName} </div>
                <div className="bh-top"> {detailed[0].catagery} </div>
                {
                    isMine &&
                    <>
                        <div className="bh-top" onClick={Private}> {detailed[0].isPublic ? "Make private" : "Make public"} </div>
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
                    taskStatus.map(status => {
                        return (
                            <div key={status}>
                                <strong>{status}</strong>
                                <Lists
                                    status={status}
                                    headers={headers}
                                    boardid={boardid}
                                    isMine={isMine}
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