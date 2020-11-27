import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Draggable } from 'react-smooth-dnd'
import axios from 'axios'
import { DeleteIcon } from '../Common/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { TASK_ADD, TASK_DELETE } from '../../Store/actionTypes'

function Lists({ headers, boardid, status, isMine, taskStatus, setlistDnD, reOrder }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const { detailed } = useSelector(state => state.task)
    const tasks = detailed.filter(d => d._id === boardid)[0]?.tasks.filter(task => task.status === status)[0]?.tasks
    const [showForm, setShow] = useState(false)
    const [title, setTitle] = useState('')

    const getCardPayload = (status, pos) => {
        let id = tasks.filter((task, i) => i === pos)[0]._id
        setlistDnD(prev => {
            return {
                ...prev,
                dragFrom: {
                    id,
                    status,
                    pos
                }
            }
        })
        return {
            id,
            pos,
            status
        }
    }

    const onDragStart = e => {
        // console.log("drag started", e)
        setlistDnD(prev => {
            return {
                ...prev,
                dragTo: {
                    ...prev.dragTo,
                    status: e.payload.status
                }
            }
        })
    }

    const onDragEnter = (status) => {
        // console.log("drag enter:", status)
        setlistDnD(prev => {
            return {
                ...prev,
                dragTo: {
                    ...prev.dragTo,
                    status
                }
            }
        })
    }

    const onDragDropReady = (p) => {
        // console.log('Drop ready: ', p)
        const { addedIndex } = p
        setlistDnD(prev => {
            return {
                ...prev,
                dragTo: {
                    ...prev.dragTo,
                    pos: addedIndex
                }
            }
        })
    }

    const onDragEnd = e => {
        // console.log("drag end", e)
    }

    const onDropCard = (e) => {
        // console.log("drag drop", e)
        reOrder()
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
        axios.delete(`/task/${boardid}/${id}/${status}`, { headers })
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
            <Container
                groupName="list"
                getChildPayload={i => getCardPayload(status, i)}
                onDragStart={e => onDragStart(e)}
                onDragEnd={e => onDragEnd(e)}
                onDrop={e => onDropCard(e)}
                onDragEnter={() => onDragEnter(status)}
                onDragLeave={() => console.log("drag leave:", status)}
                onDropReady={p => onDragDropReady(p)}
                dragClass="list-ghost"
                dropClass="list-ghost-drop"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'list-drop-preview'
                }}
                dropPlaceholderAnimationDuration={200}
            >
                {
                    tasks?.length > 0 &&
                    tasks.map((list, i) => {
                        return (
                            <Draggable key={list._id}>
                                <div className="list-cont">
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
                            </Draggable>
                        )
                    })
                }
            </Container>

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