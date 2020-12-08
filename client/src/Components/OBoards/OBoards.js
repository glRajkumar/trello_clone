import React from 'react'
import { Loading } from '../Common'
import useSBoard from '../Customs/useSBoard'
import BoardList from '../SharedComp/BoardList'

function OBoards({ headers, text, url }) {
    const { boards, isLoadedState, loading, error, getBoards } = useSBoard(url, headers)

    return isLoadedState.isLoaded
        ?
        (
            <div className="all-con">
                {
                    isLoadedState.isLoaded && boards.length > 0 &&
                    <BoardList
                        boards={boards}
                        isMine={false}
                    />
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