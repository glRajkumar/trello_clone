import React from 'react'
import { Link, useHistory } from "react-router-dom"
import Loading from '../Common/Loading'
import useBoards from '../Customs/useBoards'
import "../../CSS/allboards.css"

function AllBoards({ headers }) {
    const history = useHistory()
    const { boards, loading, error, Delete } = useBoards(headers)

    return !loading
        ?
        (
            <div>
                {
                    !loading && boards.length > 0 &&
                    <div className="allb-container">
                        {
                            boards.map((board) => {
                                return (
                                    <div
                                        className="wrapper"
                                        key={board._id}
                                    >
                                        <p onClick={() => history.push(`/board/${board._id}`)}><strong>{board.boardName}</strong></p>
                                        <p onClick={() => history.push(`/board/${board._id}`)}>{board.catagery}</p>
                                        <button className="board-del" onClick={() => Delete(board._id)}>
                                            Delete
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </div>
                }

                {
                    !loading && boards.length === 0 &&
                    <div>
                        Start your first Trello....
                        <Link to="/create-board">board</Link>
                    </div>
                }

                {
                    error &&
                    <div className="alert"> Somthing went wrong... </div>
                }

            </div>
        )
        : (<Loading />)
}

export default AllBoards