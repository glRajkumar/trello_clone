import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Common'
import "../../CSS/board.css"
import SharedLists from './SharedLists'
import useSDetailed from '../Customs/useSDetailed'

function SharedBoard({ headers }) {
    const { boardid } = useParams()
    const { permision, detailed, loading, taskStatus, createNewStatus } = useSDetailed(boardid, headers)
    const [create, setCreate] = useState(false)
    const [newStatus, setStatus] = useState("")

    return !loading ? (
        <div className="board" style={detailed.bg?.isColour ? { backgroundColor: detailed.bg?.name } : { backgroundImage: `url(${'/static/' + detailed.bg?.name})` }}>
            <div className="board-head">
                <div className="bh-top"> {detailed.boardName} </div>
                <div className="bh-top"> {detailed.catagery} </div>
            </div>

            <div className="board-lists">
                {
                    taskStatus.map(status => {
                        return (
                            <div key={status}>
                                <strong> {status} </strong>
                                <SharedLists
                                    status={status}
                                    headers={headers}
                                    boardid={boardid}
                                    permision={permision}
                                    taskStatus={taskStatus}
                                />
                            </div>
                        )
                    })
                }

                {
                    permision !== "View" &&
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
                }
            </div>
        </div>
    )
        : (<Loading />)
}

export default SharedBoard
