import React from 'react'
import { useDispatch } from 'react-redux'
import { AUTH_LOGOUT } from '../../Store/actionTypes'
import { Link, useHistory } from 'react-router-dom'
import "../../CSS/nav.css"

function NavBar({ auth }) {
    const history = useHistory()
    const dispatch = useDispatch()

    const logout = () => {
        localStorage.removeItem("task_token")
        localStorage.removeItem("task_token_exp")
        dispatch({ type: AUTH_LOGOUT })
        history.push('/login')
    }

    return (
        <div className="nav">
            <div>Trello</div>
            <ul>
                {
                    !auth
                        ? <>
                            <li> <Link to="/signup">Sign up</Link> </li>
                            <li> <Link to="/login">Log in</Link> </li>
                        </>
                        : <>
                            <li> <Link to="/shared">Shared Boards</Link> </li>
                            <li> <Link to="/public">Public Boards</Link> </li>
                            <li> <Link to="/create-board">Creat Board</Link> </li>
                            <li> <button onClick={logout}>Log out</button> </li>
                        </>
                }
            </ul>
        </div>
    )
}

export default NavBar