import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { DeleteIcon } from '../Common/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { TASK_ADD, TASK_DELETE } from '../../Store/actionTypes'

const initDnDState = {
    id: "",
    dragFrom: null,
    dragTo: null,
    isDragging: false
}

function Lists({ headers, boardid, status, isMine, taskStatus, setListDnDData, reOrder }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const { detailed } = useSelector(state => state.task)
    const tasks = detailed.filter(d => d._id === boardid)[0]?.tasks.filter(task => task.status === status)[0]?.tasks
    const [showForm, setShow] = useState(false)
    const [title, setTitle] = useState('')
    const currentItem = useRef(null)

    // const [list, setList] = useState(tasks || [])
    const [dnd, setDnd] = useState(initDnDState)

    // setTimeout(() => {
    //     setList(tasks)
    // }, 0)

    const hanDragStart = e => {
        let dragFrom = {
            status: e.currentTarget.dataset.status,
            pos: Number(e.currentTarget.dataset.position)
        }
        let id = e.currentTarget.dataset.id

        let data = {
            dragFrom,
            isDragging: true,
            id
        }
        currentItem.current = e.target
        setTimeout(() => {
            currentItem.current.style.display = "none"
            // currentItem.current.classList.add("ad")
        }, 0)
        setListDnDData(data)
        setDnd({
            ...dnd,
            dragFrom,
            isDragging: true,
            id
        })
    }

    const hanDragOver = e => {
        e.preventDefault()
    }

    const hanDragDrop = e => {
        e.preventDefault()
        e.currentTarget.id = ""

        reOrder()
        setDnd({ ...initDnDState })
    }

    const hanDragEnter = (e) => {
        e.preventDefault()
        let dragTo = {
            status: e.currentTarget.dataset.status,
            pos: Number(e.currentTarget.dataset.position)
        }
        let id = e.currentTarget.dataset.id

        // setList(prev => {
        //     let newList = prev
        //     let current = newList[dnd.dragFrom.pos]
        //     let remaings = newList.filter((item, i) => i !== dnd.dragFrom.pos)
        //     newList = [
        //         ...remaings.slice(0, dragTo.pos),
        //         current,
        //         ...remaings.slice(dragTo.pos)
        //     ]
        //     return newList
        // })
        setListDnDData({ dragTo })
        if (id !== dnd.id) {
            setDnd({
                ...dnd,
                dragTo
            })
        }
        // e.currentTarget.id = ""
    }

    const hanDragLeave = e => {
        e.currentTarget.id = ""
        // targeItem.current.style.marginTop = "0"
    }

    const hanDragEnd = e => {
        console.log("end")
        currentItem.current.style.display = "flex"
        // currentItem.current.classList.remove("ad")
    }

    const Submit = () => {
        if (title !== "") {
            const payload = {
                boardid,
                title,
                status
            }

            axios.post("/task", { ...payload }, { headers })
                .then((res) => {
                    // let disPayload = {
                    //     _id: res.data.id,
                    //     ...payload
                    // }
                    dispatch({
                        type: TASK_ADD,
                        payload: {
                            _id: res.data.id,
                            ...payload
                        }
                    })
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
                    taskid: id,
                    status
                }
                dispatch({ type: TASK_DELETE, payload })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const detailForword = (list) => {
        const forwordState = {
            ...list,
            boardid,
            isMine,
            taskStatus
        }
        history.push(`/taskdetails/${list._id}`, { forwordState })
    }

    return (
        <div className="lists">
            {
                tasks?.length > 0 &&
                tasks.map((list, i) => {
                    return (
                        <div
                            draggable="true"
                            onDragStart={e => hanDragStart(e)}
                            onDragEnter={e => hanDragEnter(e)}
                            onDragOver={e => hanDragOver(e)}
                            onDrop={e => hanDragDrop(e)}
                            onDragLeave={e => hanDragLeave(e)}
                            onDragEnd={e => hanDragEnd(e)}
                            data-position={i}
                            data-id={list._id}
                            data-status={status}
                            className="list-cont"
                            // className={`list-cont ${dnd.dragTo?.pos > Number(i) ? "move" : ""}`}
                            id={dnd.dragTo?.pos === Number(i) ? "dropArea" : ""}
                            key={list._id}
                        >
                            <p onClick={() => detailForword(list)}>
                                {list.title}
                            </p>
                            {
                                isMine &&
                                <p onClick={() => DelTitle(list._id)}>
                                    <DeleteIcon />
                                </p>
                            }
                        </div>
                    )
                })
            }

            {
                isMine && !showForm &&
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

export default Lists




// .move{
//     transform: translateY(100%);
// }

// #dropArea{
//     background-color: aqua;
//     position: relative;
//     /* transform: translateY(100%); */
// }
// .ad{
//     background-color: rgba(0, 0, 0, .1);
//     color: rgba(0, 0, 0, .1);
// }

// .ad p{
// visibility: hidden;
// }

// #dropArea::before{
//     content: "Drop here";
//     color: #fff;
//     text-align: center;
//     position: absolute;
//     /* top: -100%; */
//     background-color: #fff;
//     border: 1px solid black;
// }

// .list-holder{
//     max-height: 100%;
//     display: flex;
//     flex-direction: column;
//     background-color: rgba(0, 0, 0, .1);
// }

