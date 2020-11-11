import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AUTH_LOGOUT } from '../../Store/actionTypes'
import { Link, useHistory } from 'react-router-dom'
import { UserIcon } from '../Common/Icons'
import "../../CSS/nav.css"

function NavBar() {
    const [open, setOpen] = useState(false)
    const { userName, auth } = useSelector(state => state.auth)
    const history = useHistory()
    const dispatch = useDispatch()

    const logout = () => {
        setOpen(prev => !prev)
        localStorage.removeItem("task_token")
        localStorage.removeItem("task_token_exp")
        dispatch({ type: AUTH_LOGOUT })
        history.push('/login')
    }

    const MiniProfile = () => (
        <div className="mini">
            <ul>
                <li><strong> {userName} </strong></li>
                <li><Link onClick={() => setOpen(prev => !prev)} to="/create-board">Creat Board</Link></li>
                <li><Link onClick={() => setOpen(prev => !prev)} to="/public">Public Boards</Link></li>
                <li><Link onClick={() => setOpen(prev => !prev)} to="/allsharedboards">Shared Boards</Link></li>
                <li><button onClick={logout}>Log out</button></li>
            </ul>
        </div>
    )

    return (
        <div className="nav">
            <div>Trello</div>

            {
                !auth ?
                    <ul className="nav-container">
                        <li><Link to="/signup">Sign up</Link></li>
                        <li><Link to="/login">Log in</Link></li>
                    </ul>
                    :
                    <div className="pro-con">
                        <div id="fl" onClick={() => setOpen(prev => !prev)}>
                            <UserIcon width="25px" height="25px" />
                        </div>
                        {
                            open &&
                            <MiniProfile />
                        }
                    </div>
            }
        </div>
    )
}

export default NavBar