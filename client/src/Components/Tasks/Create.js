import React, { useState } from 'react'
import Catageries from './Catageries'
import { useDispatch } from "react-redux"
import { TASK_ADD } from "../../Store/actionTypes"
import axios from 'axios'

function Create({ headers }) {
    const dispatch = useDispatch()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [catagery, setCatagery] = useState(Catageries[0])

    const submit = async () => {
        if (title === "" && body === "") {
            console.log("at create submit")
            console.log({ title, body, catagery })
            axios.post('/task', { title, body, catagery }, { headers })
                .then((res) => {
                    console.log(res.data)
                    const payload = {
                        title,
                        body,
                        catagery,
                        _id: res.data.id,
                        updatedAt: Date.now()
                    }
                    dispatch({ type: TASK_ADD, payload })
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
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <input
                className="input-box"
                type="text"
                value={body}
                onChange={e => setBody(e.target.value)}
            />

            <select className="input-box" value={catagery} onChange={e => setCatagery(e.target.value)}>
                {
                    Catageries.map(catagery => {
                        return (
                            <option key={catagery} value={catagery}> {catagery} </option>
                        )
                    })
                }
            </select>

            <button onClick={submit}>Submit</button>
        </div>
    )
}

export default Create