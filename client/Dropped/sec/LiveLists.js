import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Draggable } from 'react-smooth-dnd'
import { DeleteIcon } from '../Common/Icons'
import axios from 'axios'

function LiveLists({ headers, boardId, status, taskStatus, list, setlistDnD, reOrder, addTitle, delTitle }) {
    const history = useHistory()
    const newTitleRef = useRef(null)
    const [showForm, setShow] = useState(false)
    const [tasks, setTasks] = useState(list)
    const [title, setTitle] = useState('')

    useEffect(() => {
        setTasks(list)
    }, [list])

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
                    payload._id = res.data.id
                    addTitle(payload)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        setTitle("")
        newTitleRef.current.focus()
    }

    const DelTitle = (taskId) => {
        axios.delete(`/task/${boardId}/${taskId}/${status}`, { headers })
            .then(() => {
                let payload = {
                    boardId,
                    taskId,
                    status
                }
                delTitle(payload)
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
                    tasks.length > 0 &&
                    tasks.map(list => {
                        return (
                            <Draggable key={list._id}>
                                <div className="list-cont">
                                    <p onClick={() => detailForword(list)}>
                                        {list.title}
                                    </p>
                                    {
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
                !showForm &&
                <p
                    className="list-add"
                    onClick={() => {
                        setShow(prev => !prev)
                        setTimeout(() => {
                            newTitleRef.current.focus()
                        }, 0)
                    }}
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
                        ref={newTitleRef}
                        onKeyDown={e => e.key === "Enter" ? Submit() : null}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <button onClick={Submit}>Save</button>
                    <button onClick={() => setShow(prev => !prev)}>Cancel</button>
                </div>
            }
        </div>
    )
}

export default LiveLists