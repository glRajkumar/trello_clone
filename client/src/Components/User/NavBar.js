import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AUTH_LOGOUT, BOARD_INIT, SBOARD_INIT, SDET_INIT, DET_INIT } from '../../Store/actionTypes'
import { Link, useHistory } from 'react-router-dom'
import { HomeIcon, Trello } from '../Common/Icons'
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
        dispatch({ type: BOARD_INIT })
        dispatch({ type: SBOARD_INIT })
        dispatch({ type: DET_INIT })
        dispatch({ type: SDET_INIT })
        history.push('/login')
    }

    const MiniProfile = () => (
        <div className="mini">
            <ul>
                <li><strong> {userName} </strong></li>
                <li><Link onClick={() => setOpen(prev => !prev)} to="/public">Public Boards</Link></li>
                <li><Link onClick={() => setOpen(prev => !prev)} to="/allsharedboards">Shared Boards</Link></li>
                <li><button onClick={logout}>Log out</button></li>
            </ul>
        </div>
    )

    return (
        <div className="nav">
            {
                auth &&
                <div className="home">
                    <Link to="/">
                        <HomeIcon id="homehover" />
                    </Link>
                    <Link to="/">
                        <p id="nav-board">
                            <Trello />
                            <span>Boards</span>
                        </p>
                    </Link>
                </div>
            }

            <div className="logo">
                <Link to="/">
                    <Trello id="reverse" />
                    <strong>Trello</strong>
                </Link>
            </div>

            {
                !auth ?
                    <div id="login">
                        <p><Link to="/signup">Sign up</Link></p>
                        <p><Link to="/login">Log in</Link></p>
                    </div>
                    :
                    <div className="pro-con">
                        <div id="fl">
                            <div id="plus">
                                <Link to="/create-board">
                                    +
                                </Link>
                            </div>
                            <div className="username" onClick={() => setOpen(prev => !prev)}>
                                {userName[0].toUpperCase()}
                            </div>
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