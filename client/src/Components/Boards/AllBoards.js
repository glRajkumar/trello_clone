import React from 'react'
import { Link } from "react-router-dom"
import BoardList from '../SharedComp/BoardList'
import useBoards from '../Customs/useBoards'
import Loading from '../Common/Loading'
import "../../CSS/allboards.css"

function AllBoards({ headers }) {
    const { boards, loading, error, Delete } = useBoards(headers)

    return !loading
        ?
        (
            <div className="all-con">
                {
                    !loading && boards.length > 0 &&
                    <BoardList
                        boards={boards}
                        isMine={true}
                        Delete={Delete}
                    />
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