import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

function Lists({ lists, headers, boardid, status }) {
    const history = useHistory()
    const [showForm, setShow] = useState(false)
    const [title, setTitle] = useState('')

    const Submit = () => {
        if (title !== "") {
            if (status) {
                axios.post("/task", { title, boardid, status }, { headers })
                    .then((res) => {
                        console.log(res.data)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                axios.post("/task", { title, boardid }, { headers })
                    .then((res) => {
                        console.log(res.data)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
        setTitle("")
        setShow(prev => !prev)
    }

    return (
        <div className="lists">
            {
                lists.length > 0 &&
                lists.map((list) => {
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
                <>
                    <input
                        className="input-box"
                        type="text"
                        placeholder="add new title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <button onClick={Submit}>Save</button>
                    <button onClick={() => setShow(prev => !prev)}>Cancel</button>
                </>
            }
        </div>
    )
}

export default Lists