import React from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Common'
import "../../CSS/board.css"
import SharedLists from './SharedLists'
import useSDetailed from '../Customs/useSDetailed'

function SharedBoard({ headers }) {
    const { boardid } = useParams()
    const { permision, detailed, loading } = useSDetailed(boardid, headers)

    return !loading ? (
        <div className="board">
            <div className="board-head">
                <div> {detailed[0].boardName} </div>
                <div> {detailed[0].catagery} </div>
            </div>

            <div className="board-lists">
                <div>
                    <strong>To-Do</strong>
                    <SharedLists
                        headers={headers}
                        boardid={boardid}
                        permision={permision}
                    />
                </div>
                <div>
                    <strong>Doing</strong>
                    <SharedLists
                        status="Doing"
                        headers={headers}
                        boardid={boardid}
                        permision={permision}
                    />
                </div>
                <div>
                    <strong>Done</strong>
                    <SharedLists
                        status="Done"
                        headers={headers}
                        boardid={boardid}
                        permision={permision}
                    />
                </div>
            </div>
        </div>
    )
        : (<Loading />)
}

export default SharedBoard
