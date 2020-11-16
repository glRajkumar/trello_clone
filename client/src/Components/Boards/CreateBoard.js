import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Catageries, bgs } from "../utils"
import { BOARD_ADD } from '../../Store/actionTypes'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import "../../CSS/create.css";

function CreateBoard({ headers }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const [boardName, setBoardName] = useState('')
    const [catagery, setCatagery] = useState(Catageries[0])
    const [bg, setBg] = useState(bgs[0])

    const Submit = () => {
        if (boardName !== "") {
            let payload = { boardName, catagery }
            if (bg.name !== "rgb(255,255,255)") payload.bg = bg
            axios.post("/board", { ...payload }, { headers })
                .then((res) => {
                    if (bg.name === "rgb(255,255,255)") payload.bg = bg
                    payload._id = res.data.id
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
            <label htmlFor="board-name">Board name :</label>
            <input
                className="input-box"
                type="text"
                name="board-name"
                placeholder="board-name"
                value={boardName}
                onChange={e => setBoardName(e.target.value)}
            />

            <label htmlFor="board-catagery">Board catagery :</label>
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

            <div className="selbg">
                <div>selected background:</div>
                <div className="selected">
                    {
                        bg.isColour
                            ? <div style={{ backgroundColor: bg.name }}></div>
                            : <img src={`/static/${bg.name}`} alt={bg.name} />
                    }
                </div>
            </div>

            <div className="bg">
                {
                    bgs.map(bg => {
                        return (
                            <div key={bg.name} onClick={() => setBg(bg)}>
                                {
                                    bg.isColour
                                        ? <div style={{ backgroundColor: bg.name }}></div>
                                        : <img src={`/static/${bg.name}`} alt={bg.name} />
                                }
                            </div>
                        )
                    })
                }
            </div>

            <button onClick={Submit}>Submit</button>
        </div>
    )
}

export default CreateBoard