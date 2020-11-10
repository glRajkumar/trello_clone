import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Common'
import axios from 'axios'
import "../../CSS/board.css"
import Lists from './Lists'
import OtherUser from '../User/OtherUser'
import SearchUser from '../User/SearchUser'

function Board({ headers }) {
    const { boardid } = useParams()
    const [loading, setLoad] = useState(true)
    const [showMem, setshowMem] = useState(false)
    const [open, setOpen] = useState(false)
    const [addU, setAddU] = useState(false)
    const [boardDetails, setBoardDetails] = useState(null)

    useEffect(() => {
        axios.get(`/board/${boardid}`, { headers })
            .then((res) => {
                setBoardDetails(res.data.boards[0])
                setLoad(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const Private = () => {
        axios.put('/board/public', { isPublic: !boardDetails.isPublic }, { headers })
            .then(() => {
                setBoardDetails(prev => {
                    return {
                        ...prev,
                        isPublic: !boardDetails.isPublic
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return !loading ? (
        <div className="board">
            <div className="board-head">
                <div> {boardDetails.boardName} </div>
                <div> {boardDetails.catagery} </div>
                <div onClick={Private}> {boardDetails.isPublic ? "Make private" : "Make public"} </div>
                <div className="board-users">
                    <div onClick={() => setOpen(prev => !prev)}>other users</div>
                    <div>
                        {
                            open &&
                            <div className="board-useroption">
                                <div>
                                    <p onClick={() => setshowMem(prev => !prev)}>members</p>
                                    {
                                        showMem &&
                                        <div>
                                            <OtherUser headers={headers} boardId={boardid} />
                                        </div>
                                    }
                                </div>
                                <div>
                                    <p onClick={() => setAddU(prev => !prev)}>add users</p>
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
            </div>

            <div className="board-lists">
                <div>
                    <strong>To-Do</strong>
                    <Lists
                        lists={
                            boardDetails.tasks
                                .filter(task => task.status === "To-do")
                        }
                        headers={headers}
                        boardid={boardid}
                    />
                </div>
                <div>
                    <strong>Doing</strong>
                    <Lists
                        lists={
                            boardDetails.tasks
                                .filter(task => task.status === "Doing")
                        }
                        status="Doing"
                        headers={headers}
                        boardid={boardid}
                    />
                </div>
                <div>
                    <strong>Done</strong>
                    <Lists
                        lists={
                            boardDetails.tasks
                                .filter(task => task.status === "Done")
                        }
                        status="Done"
                        headers={headers}
                        boardid={boardid}
                    />
                </div>
            </div>
        </div>
    )
        : (<Loading />)
}

export default Board