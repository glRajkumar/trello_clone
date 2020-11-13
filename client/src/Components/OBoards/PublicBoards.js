import React from 'react'
import OBoards from './OBoards'

function PublicBoards({ headers }) {
    return (
        <OBoards
            url="/public"
            headers={headers}
            text="There is no public board "
        />
    )
}

export default PublicBoards