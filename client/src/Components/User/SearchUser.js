import React, { useRef, useState } from 'react'
import axios from 'axios'

function SearchUser({ headers, boardId }) {
    const stayFocusRef = useRef(null)
    const [searchQ, setSearchQ] = useState('')
    const [selectedUser, setSelect] = useState(null)
    const [userDetails, setUserDetails] = useState([])
    const [permision, setPer] = useState("View")

    const fetchUsers = (query) => {
        setSearchQ(query)
        stayFocusRef.current.focus()
        if (query !== '') {
            axios.post('/user/search', { query }, { headers })
                .then((res) => {
                    setUserDetails(res.data.user)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const Select = (id, name) => {
        setSearchQ('')
        setUserDetails([])
        setSelect({ id, name })
    }

    const Submit = () => {
        const payload = {
            boardId,
            memId: selectedUser.id
        }
        if (permision !== "View") payload.permision = permision

        axios.put('/board/addmember', { ...payload }, { headers })
            .then((res) => {
                setSelect(null)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div>
            {
                !selectedUser &&
                <input
                    className="input-box"
                    type="text"
                    placeholder="user name..."
                    value={searchQ}
                    ref={stayFocusRef}
                    onChange={(e) => fetchUsers(e.target.value)}
                />
            }

            {
                selectedUser &&
                <div>
                    <p>{selectedUser.name}</p>
                    <select
                        className="input-box"
                        value={permision}
                        onChange={e => setPer(e.target.value)}
                    >
                        <option value="View">View</option>
                        <option value="Ask">Ask</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <button onClick={Submit}>Add</button>
                </div>
            }

            {
                !selectedUser &&
                userDetails.map(item => {
                    return (
                        <div key={item._id} className="search-lists">
                            <p onClick={() => Select(item._id, item.userName)}>
                                {item.userName}
                            </p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SearchUser