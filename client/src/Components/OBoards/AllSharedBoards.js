import React from 'react'
import OBoards from './OBoards'

function AllSharedBoards({ headers }) {
    return (
        <OBoards
            url="/boards"
            headers={headers}
            text="No one shared a board with you"
        />
    )
}

export default AllSharedBoards