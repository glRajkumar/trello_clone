import React from 'react'
import { useHistory } from "react-router-dom"
import { getBg } from "../utils/general"

function BoardList({ boards, isMine, Delete }) {
    const history = useHistory()

    return (
        <div className="allb-container">
            {
                boards.map((board) => {
                    return (
                        <div
                            className="wrapper"
                            key={board._id}
                            style={getBg(board.bg)}
                        >
                            <p onClick={() => history.push(`/board/${board._id}`, { isMine })}>
                                <strong>{board.boardName}</strong>
                            </p>
                            <p onClick={() => history.push(`/board/${board._id}`, { isMine })}>
                                {board.catagery}
                            </p>

                            {
                                isMine
                                    ?
                                    <button className="board-del" onClick={() => Delete(board._id)}>
                                        Delete
                                    </button>
                                    :
                                    <p>
                                        {board.postedBy.userName}
                                    </p>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default BoardList