import React, { useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { TASK_EDIT } from '../../Store/actionTypes'
import Axios from 'axios'

function Detailed({ headers }) {
    const history = useHistory()
    const { taskId } = useParams()
    const { state } = useLocation()
    const dispatch = useDispatch()
    const [details, setDetails] = useState(state.forwordState)
    const [original] = useState(state.forwordState)

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
            payload.status = details.status
        }

        Axios.put('/task', { ...payload }, { headers })
            .then(() => {
                const { taskId, ...changes } = payload
                const actPayload = {
                    taskid: taskId,
                    boardid: state.forwordState.boardid,
                    info: changes
                }
                dispatch({ type: TASK_EDIT, payload: actPayload })
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
                className="input-box"
                type="text"
                placeholder="describe the details of your task..."
                value={details.body}
                onChange={e => setDetails(prev => {
                    return {
                        ...prev,
                        body: e.target.value
                    }
                })}
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
                <option value="To-do">To-do</option>
                <option value="Doing">Doing</option>
                <option value="Done">Done</option>
            </select>

            {
                details.isMine &&
                <button onClick={Submit}>Save</button>
            }

        </div>
    )
}

export default Detailed
