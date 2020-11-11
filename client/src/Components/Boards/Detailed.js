import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Loading } from '../Common'
import Axios from 'axios'

function Detailed({ headers }) {
    const history = useHistory()
    const { taskId } = useParams()
    const [loading, setLoad] = useState(true)
    const [details, setDetails] = useState({})
    const [original, setOriginal] = useState({})
    const { _id } = useSelector(state => state.auth)

    useEffect(() => {
        Axios.get(`/task/task/${taskId}`, { headers })
            .then((res) => {
                setDetails(res.data.tasks)
                setOriginal(res.data.tasks)
                setLoad(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

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
                history.goBack()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return !loading ? (
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
                details.board.postedBy === _id &&
                <button onClick={Submit}>Save</button>
            }

        </div>
    )
        : (<Loading />)
}

export default Detailed
