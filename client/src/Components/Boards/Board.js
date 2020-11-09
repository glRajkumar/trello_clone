import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Common'
import Axios from 'axios'
import "../../CSS/board.css"
import Lists from './Lists'

function Board({ headers }) {
    const { boardid } = useParams()
    const [loading, setLoad] = useState(true)
    const [boardDetails, setBoardDetails] = useState(null)

    useEffect(() => {
        Axios.get(`/board/${boardid}`, { headers })
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
                <p> {boardDetails.boardName} </p>
                <p> {boardDetails.catagery} </p>
                <p> {boardDetails.isPublic ? "Make private" : "Make public"} </p>
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