import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { DeleteIcon } from '../Common/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { STASK_ADD, STASK_DELETE } from '../../Store/actionTypes'

function SharedLists({ headers, boardid, status, permision, taskStatus }) {
    const dispatch = useDispatch()
    const detailed = useSelector(state => state.stask)
    const history = useHistory()
    const tasks = detailed.detailed.filter(d => d._id === boardid)[0]?.tasks.filter(task => task.status === status)
    const [showForm, setShow] = useState(false)
    const [title, setTitle] = useState('')

    const Submit = () => {
        if (title !== "") {
            const payload = {
                boardid,
                title
            }
            if (status !== "To-do") payload.status = status

            axios.post("/task", { ...payload }, { headers })
                .then((res) => {
                    let payload = {
                        _id: res.data.id,
                        boardid,
                        title,
                        status
                    }
                    dispatch({ type: STASK_ADD, payload })
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
                let payload = {
                    boardid,
                    taskid: id
                }
                dispatch({ type: STASK_DELETE, payload })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const detailForword = (list) => {
        const forwordState = {
            ...list,
            boardid,
            permision,
            taskStatus
        }
        history.push(`/sharedtask/${list._id}`, { forwordState })
    }

    return (
        <div className="lists">
            {
                tasks?.length > 0 &&
                tasks.map((list) => {
                    return (
                        <div className="list-cont" key={list._id}>
                            <p onClick={() => detailForword(list)}>
                                {list.title}
                            </p>
                            {
                                permision !== "View" &&
                                <p onClick={() => DelTitle(list._id)}>
                                    <DeleteIcon />
                                </p>
                            }
                        </div>
                    )
                })
            }

            {
                permision !== "View" && !showForm &&
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

export default SharedLists