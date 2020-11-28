import React, { useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { STASK_EDIT, STASK_EDIT_WSTATUS } from '../../Store/actionTypes'
import { useDispatch } from 'react-redux'
import Axios from 'axios'

function SharedDetails({ headers }) {
    const history = useHistory()
    const { state } = useLocation()
    const { taskId } = useParams()
    const dispatch = useDispatch
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
            payload.fromStatus = original.status
            payload.toStatus = details.status
        }

        Axios.put('/task', { ...payload }, { headers })
            .then(() => {
                payload.boardId = original.boardId
                if (payload.toStatus) {
                    dispatch({ type: STASK_EDIT_WSTATUS, payload })
                } else {
                    payload.status = original.status
                    dispatch({ type: STASK_EDIT, payload })
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
                {
                    details.taskStatus.map(status => {
                        return (
                            <option key={status} value={status}> {status} </option>
                        )
                    })
                }
            </select>

            {
                details.permision !== "View" &&
                <button onClick={Submit}>Save</button>
            }

        </div>
    )
}

export default SharedDetails