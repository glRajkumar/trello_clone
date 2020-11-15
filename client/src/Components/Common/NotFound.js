import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className="modalBox">
            <h3>
                The path is not found, Please try again in correct path.
                <Link to='/'>Home</Link>
            </h3>
        </div>
    )
}

export default NotFound