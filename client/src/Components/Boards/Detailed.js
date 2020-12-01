import React, { useRef, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { TASK_EDIT, TASK_EDIT_WSTATUS } from '../../Store/actionTypes'
import Axios from 'axios'

function Detailed({ headers }) {
    const textAreaRef = useRef(null)
    const history = useHistory()
    const { taskId } = useParams()
    const { state } = useLocation()
    const dispatch = useDispatch()
    const [details, setDetails] = useState(state.forwordState)
    const [original] = useState(state.forwordState)

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
            taskId
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

        Axios.put('/task', { ...payload }, { headers })
            .then(() => {
                payload.boardId = original.boardId
                if (payload.toStatus) {
                    dispatch({ type: TASK_EDIT_WSTATUS, payload })
                } else {
                    payload.status = original.status
                    dispatch({ type: TASK_EDIT, payload })
                }

                history.goBack()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="form-box">
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
                details.isMine &&
                <button onClick={Submit}>Save</button>
            }

        </div>
    )
}

export default Detailed
