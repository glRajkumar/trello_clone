import React from 'react'
import { Loading } from '../Common'
import { Link } from "react-router-dom"
import usePublic from '../Customs/usePublic'

function PublicBoards({ headers }) {
    const { init, boards, hasMore, loading, error, getBoards } = usePublic("/public", headers)

    return !init
        ?
        (
            <div>
                {
                    !init && boards.length > 0 &&
                    <div className="allb-container">
                        {
                            boards.map((board) => {
                                return (
                                    <div
                                        className="wrapper"
                                        key={board._id}
                                    >
                                        <p>
                                            <strong>{board.boardName}</strong>
                                        </p>
                                        <p>
                                            {board.catagery}
                                        </p>
                                        <p>
                                            {board.postedBy.userName}
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>
                }

                {
                    !loading && boards.length === 0 &&
                    <div>
                        Start the first publi Trello....
                        <Link to="/create-board">board</Link>
                    </div>
                }

                {
                    !loading && hasMore &&
                    <button onClick={getBoards}>Load more</button>
                }

                {
                    loading &&
                    <Loading />
                }

                {
                    error &&
                    <div className="alert"> Somthing went wrong... </div>
                }

            </div>
        )
        : (<Loading />)
}

export default PublicBoards