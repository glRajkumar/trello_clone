import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Catageries from "./Catageries"
import { BOARD_ADD } from '../../Store/actionTypes'
import { useDispatch } from 'react-redux'
import axios from 'axios'

function CreateBoard({ headers }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [boardName, setBoardName] = useState('')
    const [catagery, setCatagery] = useState(Catageries[0])

    const Submit = () => {
        if (boardName !== "") {
            axios.post("/board", { boardName, catagery }, { headers })
                .then((res) => {
                    const payload = {
                        _id: res.data.id,
                        boardName,
                        catagery
                    }
                    dispatch({ type: BOARD_ADD, payload })
                    history.push('/')
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    return (
        <div className="form-box">
            <input
                className="input-box"
                type="text"
                placeholder="board-name"
                value={boardName}
                onChange={e => setBoardName(e.target.value)}
            />

            <div>
                Board catagery :
                <select className="input-box" value={catagery} onChange={e => setCatagery(e.target.value)}>
                    {
                        Catageries.map(catagery => {
                            return (
                                <option key={catagery} value={catagery}> {catagery} </option>
                            )
                        })
                    }
                </select>
            </div>

            <button onClick={Submit}>Submit</button>
        </div>
    )
}

export default CreateBoard