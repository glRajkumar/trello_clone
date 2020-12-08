import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';

function Join({ headers }) {
    const history = useHistory()
    const [room, setRoom] = useState('')
    const [pass, setPass] = useState("")
    const [err, setErr] = useState(false)

    const submit = () => {
        if (room && pass) {
            axios.post("/room/join", { room, pass }, { headers })
                .then((res) => {
                    let board = {
                        room,
                        Admin: false,
                        ...res.data.board,
                        roomId: res.data.roomId,
                        taskStatus: res.data.board.tasks.map(task => task.status)
                    }
                    history.push(`/live/${room}`, { board })
                })
                .catch((err) => {
                    console.log(err)
                    setErr(true)
                })
        }
    }

    return (
        <div className="form-box">
            <h1>Join</h1>

            {
                err &&
                <div>
                    something went wrong...
                </div>
            }

            <input
                placeholder="Room"
                className="input-box"
                type="text"
                onChange={e => setRoom(e.target.value)}
            />

            <input
                placeholder="Password"
                className="input-box"
                type="password"
                onChange={e => setPass(e.target.value)}
            />

            <button onClick={submit}>
                Join In the live board
            </button>
        </div>
    )
}

export default Join