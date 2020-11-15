import React from 'react'
import { Link } from 'react-router-dom'

function UnAuther() {
    return (
        <div className="modalBox">
            <h3>
                You should login first or if you new to our web, Please signup.
                Please go back to signup <Link to="/signup">Signup</Link> or login <Link to="/login">Login</Link>
            </h3>
        </div>
    )
}

export default UnAuther