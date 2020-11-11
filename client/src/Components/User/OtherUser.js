import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "../../CSS/userlists.css"

function OtherUser({ headers, boardId }) {
    const [loading, setLoad] = useState(true)
    const [users, setUser] = useState([])

    useEffect(() => {
        axios.get(`/board/members/${boardId}`, { headers })
            .then((res) => {
                setUser(res.data.members[0].members)
                setLoad(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const Remove = (_id) => {
        axios.put('/board/removememb', { boardId, _id }, { headers })
            .then((res) => {
                console.log(res.data)
                let newData = users.filter(u => u._id !== _id)
                setUser(newData)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="userlists">
            {
                users.length > 0 &&
                users.map(user => {
                    return (
                        <div className="user-lst" key={user._id}>
                            <div>
                                <p>user : <strong>{user.user.userName}</strong></p>
                                <p>perm : {user.permision}</p>
                            </div>
                            <button onClick={() => Remove(user._id)}>remove</button>
                        </div>
                    )
                })
            }
            {
                loading && <p>loading....</p>
            }
            {
                !loading && users.length === 0 &&
                <p>no members..</p>
            }
        </div>
    )
}

export default OtherUser