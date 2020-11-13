import React from 'react'
import { Loading } from '../Common'
import { useHistory } from "react-router-dom"
import useSBoard from '../Customs/useSBoard'

function OBoards({ headers, text, url }) {
    const { boards, isLoadedState, loading, error, getBoards } = useSBoard(url, headers)
    const history = useHistory()

    return isLoadedState.isLoaded
        ?
        (
            <div>
                {
                    isLoadedState.isLoaded && boards.length > 0 &&
                    <div className="allb-container">
                        {
                            boards.map((board) => {
                                return (
                                    <div className="wrapper" key={board._id}>
                                        <p onClick={() => history.push(`/sharedboard/${board._id}`)}>
                                            <strong>{board.boardName}</strong>
                                        </p>
                                        <p onClick={() => history.push(`/sharedboard/${board._id}`)}>
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
                        {text}
                    </div>
                }

                {
                    !loading && isLoadedState.hasMore &&
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

export default OBoards