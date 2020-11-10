import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

function Lists({ lists, headers, boardid, status }) {
    const history = useHistory()
    const [tasks, setTasks] = useState(lists)
    const [showForm, setShow] = useState(false)
    const [title, setTitle] = useState('')

    const Submit = () => {
        if (title !== "") {
            const payload = {
                boardid,
                title
            }
            if (status) {
                payload.status = status
            }
            axios.post("/task", { ...payload }, { headers })
                .then((res) => {
                    console.log(res.data)
                    setTasks(prev => {
                        return [
                            ...prev,
                            {
                                _id: res.data.id,
                                ...payload
                            }
                        ]
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        setTitle("")
        setShow(prev => !prev)
    }

    return (
        <div className="lists">
            {
                tasks.length > 0 &&
                tasks.map((list) => {
                    return (
                        <p
                            className="list-cont"
                            key={list._id}
                            onClick={() => history.push(`/taskdetails/${list._id}`)}
                        >
                            {list.title}
                        </p>
                    )
                })
            }

            {
                !showForm &&
                <p
                    className="list-add"
                    onClick={() => setShow(prev => !prev)}
                >
                    Add new title
                </p>
            }

            {
                showForm &&
                <div className="list-lasts">
                    <input
                        className="input-box"
                        type="text"
                        placeholder="add new title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <button onClick={Submit}>Save</button>
                    <button onClick={() => setShow(prev => !prev)}>Cancel</button>
                </div>
            }
        </div>
    )
}

export default Lists