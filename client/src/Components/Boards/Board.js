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
    const { isMine, loading, detailed, Private } = useDetailed(boardid, headers)
    const [showMem, setshowMem] = useState(false)
    const [open, setOpen] = useState(false)
    const [addU, setAddU] = useState(false)

    return !loading ? (
        <div className="board">
            <div className="board-head">
                <div> {detailed[0].boardName} </div>
                <div> {detailed[0].catagery} </div>
                {
                    isMine &&
                    <>
                        <div onClick={Private}> {detailed[0].isPublic ? "Make private" : "Make public"} </div>
                        <div className="board-users">
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
                <div>
                    <strong>To-Do</strong>
                    <Lists
                        headers={headers}
                        boardid={boardid}
                        isMine={isMine}
                    />
                </div>
                <div>
                    <strong>Doing</strong>
                    <Lists
                        status="Doing"
                        headers={headers}
                        boardid={boardid}
                        isMine={isMine}
                    />
                </div>
                <div>
                    <strong>Done</strong>
                    <Lists
                        status="Done"
                        headers={headers}
                        boardid={boardid}
                        isMine={isMine}
                    />
                </div>
            </div>
        </div>
    )
        : (<Loading />)
}

export default Board