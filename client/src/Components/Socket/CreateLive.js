import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Catageries } from "../utils/general"
import { useHistory } from 'react-router-dom'
import axios from 'axios'

function CreateLive({ headers }) {
    const { board, task } = useSelector(state => state)
    const [boardName, setBoardName] = useState('')
    const [catagery, setCatagery] = useState(Catageries[0])
    const [room, setRoom] = useState('')
    const [pass, setPass] = useState("")
    const [err, setErr] = useState(false)
    const history = useHistory()
    const initOb = {
        _id: null
    }

    const submit = async () => {
        const { _id: boardId, ...otherDetails } = board.boards.filter(board => board.boardName === boardName && board.catagery === catagery)[0] || initOb
        try {
            if (boardId) {
                const taskDetails = task.detailed.filter(d => d._id === boardId)
                let payload = {
                    _id: boardId,
                    Admin: true,
                    ...otherDetails,
                    room
                }
                if (!taskDetails.length) {
                    let boardData = await axios.get(`/board/${boardId}`, { headers })
                    payload = {
                        ...payload,
                        ...boardData.data.board,
                        taskStatus: boardData.data.board.tasks.map(task => task.status)
                    }
                } else {
                    payload = {
                        ...payload,
                        ...taskDetails[0]
                    }
                }

                let roomData = await axios.post('/room/create', { boardId, room, pass }, { headers })
                payload.roomId = roomData.data.roomId
                history.push(`/live/${room}`, { board: payload })

            } else {
                setErr(true)
            }

        } catch (error) {
            setErr(true)
            console.log(error)
        }
    }

    return (
        <div>
            <h2>Create a live board</h2>

            {
                err &&
                <div>
                    something went wrong...
                </div>
            }

            <input
                placeholder="Board name"
                className="input-box"
                type="text"
                value={boardName}
                onChange={e => setBoardName(e.target.value)}
            />

            <select
                name="board-catagery"
                className="input-box"
                value={catagery}
                onChange={e => setCatagery(e.target.value)}
            >
                {
                    Catageries.map(catagery => {
                        return (
                            <option key={catagery} value={catagery}> {catagery} </option>
                        )
                    })
                }
            </select>

            <input
                placeholder="Room"
                className="input-box"
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
            />

            <input
                placeholder="Password"
                className="input-box"
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
            />

            <button onClick={submit}>
                Create
            </button>
        </div>
    )
}

export default CreateLive