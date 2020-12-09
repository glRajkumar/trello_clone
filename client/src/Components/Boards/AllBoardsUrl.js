import React from 'react'
import useBoards from '../Customs/useBoards'
import { useHistory } from 'react-router-dom'
import { getBg } from '../utils/general'
import "../../CSS/boardurl.css"

function AllBoardsUrl({ headers, click }) {
    const { boards } = useBoards(headers)
    const history = useHistory()

    const goto = (id) => {
        history.push('/')
        click()
        setTimeout(() => {
            history.push(`/board/${id}`, { isMine: true })
        }, 0)
    }

    return (
        <div className="board-listurl">
            {
                boards.map(board => {
                    return (
                        <section
                            onClick={() => goto(board._id)}
                            key={board._id}
                            className="url-cont"
                        >
                            <div
                                className="url-bg"
                                style={getBg(board.bg)}>
                            </div>
                            <div className="url-name">
                                {board.boardName}
                            </div>
                        </section>
                    )
                })
            }
        </div>
    )
}

export default AllBoardsUrl