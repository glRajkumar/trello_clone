import React from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Common'
import "../../CSS/board.css"
import SharedLists from './SharedLists'
import useSDetailed from '../Customs/useSDetailed'

function SharedBoard({ headers }) {
    const { boardid } = useParams()
    const { permision, detailed, loading, taskStatus } = useSDetailed(boardid, headers)

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
            </div>
        </div>
    )
        : (<Loading />)
}

export default SharedBoard
