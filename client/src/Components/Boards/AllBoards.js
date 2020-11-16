import React from 'react'
import { Link, useHistory } from "react-router-dom"
import Loading from '../Common/Loading'
import useBoards from '../Customs/useBoards'
import "../../CSS/allboards.css"

function AllBoards({ headers }) {
    const { boards, loading, error, Delete } = useBoards(headers)
    const history = useHistory()

    return !loading
        ?
        (
            <div className="all-con">
                {
                    !loading && boards.length > 0 &&
                    <div className="allb-container">
                        {
                            boards.map((board) => {
                                return (
                                    <div
                                        className="wrapper"
                                        key={board._id}
                                        style={board.bg.isColour ? { backgroundColor: board.bg.name } : { backgroundImage: `url(${'/static/' + board.bg.name})` }}
                                    >
                                        <p onClick={() => history.push(`/board/${board._id}`)}>
                                            <strong>{board.boardName}</strong>
                                        </p>
                                        <p onClick={() => history.push(`/board/${board._id}`)}>
                                            {board.catagery}
                                        </p>
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