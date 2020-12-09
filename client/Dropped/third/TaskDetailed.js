import React, { useRef, useState } from 'react'
import { useDispatch } from "react-redux"
import { PlusIcon } from "../Common/Icons"
import { TASK_EDIT, TASK_EDIT_WSTATUS } from '../../Store/actionTypes'
import axios from 'axios'

function TaskDetailed({ list, headers, taggleTask }) {
    const textAreaRef = useRef(null)
    const dispatch = useDispatch()
    const [details, setDetails] = useState(list)
    const [original] = useState(list)

    const autoResize = (e) => {
        setDetails(prev => {
            return {
                ...prev,
                body: e.target.value
            }
        })

        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
    }

    const Submit = () => {
        const payload = {
            taskId: original._id
        }
        if (original.title !== details.title) {
            payload.title = details.title
        }
        if (original.body !== details.body) {
            payload.body = details.body
        }
        if (original.status !== details.status) {
            payload.fromStatus = original.status
            payload.toStatus = details.status
        }

        axios.put('/task', { ...payload }, { headers })
            .then(() => {
                payload.boardId = original.boardId
                if (payload.toStatus) {
                    dispatch({ type: TASK_EDIT_WSTATUS, payload })
                } else {
                    payload.status = original.status
                    dispatch({ type: TASK_EDIT, payload })
                }
                taggleTask()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const plusStyle = {
        width: "24px",
        height: "24px",
        transform: "rotate(45deg)",
        float: "right"
    }

    return (
        <div className="form-box detailed">
            <p onClick={() => taggleTask()}>
                <PlusIcon style={plusStyle} />
            </p>
            <input
                className="input-box"
                type="text"
                placeholder="title"
                value={details.title}
                onChange={e => setDetails(prev => {
                    return {
                        ...prev,
                        title: e.target.value
                    }
                })}
            />

            <textarea
                ref={textAreaRef}
                className="input-box"
                placeholder="describe the details of your task..."
                style={{ minHeight: "200px" }}
                value={details.body}
                onChange={e => autoResize(e)}
            />

            <select
                className="input-box"
                value={details.status}
                onChange={e => setDetails(prev => {
                    return {
                        ...prev,
                        status: e.target.value
                    }
                })}
            >
                {
                    details.taskStatus.map(status => {
                        return (
                            <option key={status} value={status}> {status} </option>
                        )
                    })
                }
            </select>

            {
                (details.isMine || details.permision !== "View") &&
                <button onClick={Submit}>Save</button>
            }

        </div>
    )
}

export default TaskDetailed