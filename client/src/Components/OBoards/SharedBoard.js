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
        <div className="board" style={detailed[0].bg?.isColour ? { backgroundColor: detailed[0].bg?.name } : { backgroundImage: `url(${'/static/' + detailed[0].bg?.name})` }}>
            <div className="board-head">
                <div className="bh-top"> {detailed[0].boardName} </div>
                <div className="bh-top"> {detailed[0].catagery} </div>
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
