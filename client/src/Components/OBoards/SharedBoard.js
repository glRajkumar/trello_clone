import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Common'
import axios from 'axios'
import "../../CSS/board.css"
import SharedLists from './SharedLists'

function SharedBoard({ headers }) {
    const { boardid } = useParams()
    const [loading, setLoad] = useState(true)
    const [boardDetails, setBoardDetails] = useState(null)

    useEffect(() => {
        axios.get(`/shared/${boardid}`, { headers })
            .then((res) => {
                setBoardDetails(res.data.boards[0])
                setLoad(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return !loading ? (
        <div className="board">
            <div className="board-head">
                <div> {boardDetails.boardName} </div>
                <div> {boardDetails.catagery} </div>
            </div>

            <div className="board-lists">
                <div>
                    <strong>To-Do</strong>
                    <SharedLists
                        lists={
                            boardDetails.tasks
                                .filter(task => task.status === "To-do")
                        }
                        headers={headers}
                        boardid={boardid}
                        permision={boardDetails.permision}
                    />
                </div>
                <div>
                    <strong>Doing</strong>
                    <SharedLists
                        lists={
                            boardDetails.tasks
                                .filter(task => task.status === "Doing")
                        }
                        status="Doing"
                        headers={headers}
                        boardid={boardid}
                        permision={boardDetails.permision}
                    />
                </div>
                <div>
                    <strong>Done</strong>
                    <SharedLists
                        lists={
                            boardDetails.tasks
                                .filter(task => task.status === "Done")
                        }
                        status="Done"
                        headers={headers}
                        boardid={boardid}
                        permision={boardDetails.permision}
                    />
                </div>
            </div>
        </div>
    )
        : (<Loading />)
}

export default SharedBoard
