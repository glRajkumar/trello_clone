import React from 'react'
import Loading from '../Common/Loading'
import useActivity from '../Customs/useActivity'

function Activity({ headers, boardId }) {
    const {
        initLoad, activities, actLoading, hasMore,
        actError, getActivity
    } = useActivity(boardId, headers)

    return initLoad ? (
        <div className="activity">
            <h3>Activities</h3>
            {
                activities.map((act, i) => {
                    return (
                        <div className="activity-body" key={`${act.postedBy}${i}`}>
                            <div className="activity-user">
                                <p>{act.postedBy[0].toUpperCase()}</p>
                            </div>
                            <div className="activity-content">
                                <strong>{act.postedBy}</strong>
                                {` - ${act.description}`}
                            </div>
                        </div>
                    )
                })
            }

            {
                actLoading &&
                <Loading />
            }

            {
                (hasMore && !actLoading) &&
                <button onClick={getActivity}>Load More</button>
            }

            {
                actError &&
                <div>error...</div>
            }
        </div>
    )
        : <Loading />
}

export default Activity