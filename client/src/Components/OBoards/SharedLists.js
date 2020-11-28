import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Draggable } from 'react-smooth-dnd'
import axios from 'axios'
import { DeleteIcon } from '../Common/Icons'
import { useDispatch, useSelector } from 'react-redux'
import { STASK_ADD, STASK_DELETE } from '../../Store/actionTypes'

function SharedLists({ headers, boardId, status, permision, taskStatus, setlistDnD, reOrder }) {
    const dispatch = useDispatch()
    const { detailed } = useSelector(state => state.stask)
    const history = useHistory()
    const tasks = detailed.filter(d => d._id === boardId)[0]?.tasks.filter(task => task.status === status)[0]?.tasks
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
                boardId,
                title,
                status
            }

            axios.post("/task", { ...payload }, { headers })
                .then((res) => {
                    dispatch({
                        type: STASK_ADD,
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

    const DelTitle = (taskId) => {
        axios.delete(`/task/${boardId}/${taskId}/${status}`, { headers })
            .then(() => {
                let payload = {
                    boardId,
                    taskId,
                    status
                }
                dispatch({ type: STASK_DELETE, payload })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const detailForword = (list) => {
        const forwordState = {
            ...list,
            boardId,
            status,
            permision,
            taskStatus
        }
        history.push(`/sharedtask/${list._id}`, { forwordState })
    }

    return (
        <div className="lists">
            <Container
                groupName="list"
                nonDragAreaSelector=".nondrag"
                getChildPayload={i => getCardPayload(status, i)}
                onDragStart={e => onDragStart(e)}
                onDragEnd={e => onDragEnd(e)}
                onDrop={e => onDropCard(e)}
                onDragEnter={() => onDragEnter(status)}
                onDragLeave={() => {
                    return
                    // console.log("drag leave:", status)
                }}
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
                    tasks.map(list => {
                        return (
                            <Draggable key={list._id}>
                                <div className={`list-cont ${permision !== "View" ? "" : "nondrag"} `}>
                                    <p onClick={() => detailForword(list)}>
                                        {list.title}
                                    </p>
                                    {
                                        permision !== "View" &&
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
                permision !== "View" && !showForm &&
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

export default SharedLists