import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TASK_DELETE } from "../../Store/actionTypes"
import axios from 'axios'

function Card({ _id, title, body, catagery, updatedAt }) {
    const { token } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const headers = {
        Authorization: "Bearer " + token
    }

    const onDelete = (id) => {
        axios.delete(`/task/${id}`, { headers })
            .then((res) => {
                console.log(res.data)
                dispatch({ type: TASK_DELETE, payload: id })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div key={_id}>
            <div>
                <p>Title : {title} </p>
                <p>Body: {body} </p>
                <p>Catagery: {catagery} </p>
                <p> {new Date(updatedAt).toLocaleString('en-GB')} </p>
            </div>
            <div>
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </div>
    )
}

export default Card