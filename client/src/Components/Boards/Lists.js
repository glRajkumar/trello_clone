import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { DeleteIcon } from '../Common/Icons'

function Lists({ lists, headers, boardid, status, isMine }) {
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

    const DelTitle = (id) => {
        axios.delete(`/task/${boardid}/${id}`, { headers })
            .then(() => {
                let newData = tasks.filter(t => t._id !== id)
                setTasks(newData)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="lists">
            {
                tasks.length > 0 &&
                tasks.map((list) => {
                    return (
                        <div className="list-cont" key={list._id}>
                            <p onClick={() => history.push(`/taskdetails/${list._id}`)}>
                                {list.title}
                            </p>
                            {
                                isMine &&
                                <p onClick={() => DelTitle(list._id)}>
                                    <DeleteIcon />
                                </p>
                            }
                        </div>
                    )
                })
            }

            {
                isMine && !showForm &&
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