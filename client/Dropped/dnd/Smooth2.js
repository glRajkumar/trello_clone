import React, { useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import './sm.css'

const defaultData = [
    { _id: "1a", name: "1a" }, { _id: "2b", name: "2b" }, { _id: "3c", name: "3c" }, { _id: "4d", name: "4d" },
    { _id: "5e", name: "5e" }, { _id: "6f", name: "6f" }, { _id: "7g", name: "7g" }, { _id: "8h", name: "8h" }
]

const allData = [
    {
        colId: "col1",
        list: defaultData.map(item => {
            return {
                id: `cal1 - ${item._id}`,
                name: `cal1 - ${item.name}`
            }
        })
    },
    {
        colId: "col2",
        list: defaultData.map(item => {
            return {
                id: `cal2 - ${item._id}`,
                name: `cal2 - ${item.name}`
            }
        })
    }
]

const colums = ["col1", "col2", "col3", "col4", "col5", "col6", "col7", "col8"]
const largeData = colums.map(col => {
    return {
        colId: col,
        list: defaultData.map(item => {
            return {
                id: `${col} - ${item._id}`,
                name: `${col} - ${item.name}`
            }
        })
    }
})

function Smooth2() {
    const [data, setData] = useState(largeData)
    const [dndTo, setDnDTo] = useState({
        status: "",
        pos: ""
    })

    const getCardPayload = (colId, index) => {
        return {
            id: data.filter(it => it.colId === colId)[0].list[index].id,
            pos: index,
            status: colId
        }
    }

    const onDragStart = e => {
        // console.log("drag started", e)
        setDnDTo(prev => {
            return {
                ...prev,
                status: e.payload.status
            }
        })
    }

    const onDragEnter = (status) => {
        // console.log("drag enter:", status)
        setDnDTo(prev => {
            return {
                ...prev,
                status
            }
        })
    }

    const onDragDropReady = (p) => {
        // console.log('Drop ready: ', p)
        const { addedIndex } = p
        setDnDTo(prev => {
            return {
                ...prev,
                pos: addedIndex
            }
        })
    }

    const onDragEnd = e => {
        // console.log("drag end", e)
    }

    const sameList = (payload) => {
        let remaing = data.filter(item => item.colId === payload.status)[0]
            .list.filter((list, i) => i !== payload.pos)
        let newList = [
            ...remaing.slice(0, dndTo.pos),
            data.filter(item => item.colId === payload.status)[0].list[payload.pos],
            ...remaing.slice(dndTo.pos)
        ]
        setData(prev => prev.map(item => {
            if (item.colId === dndTo.status) {
                return {
                    ...item,
                    list: newList
                }
            } else {
                return item
            }
        }))
    }

    const reList = (payload) => {
        let current = data.filter(item => item.colId === payload.status)[0]
            .list.filter((list, i) => i === payload.pos)[0]
        let remaing = data
            .filter(item => item.colId === dndTo.status)[0]
            .list
        let newList = [
            ...remaing.slice(0, dndTo.pos),
            current,
            ...remaing.slice(dndTo.pos)
        ]
        setData(prev => prev.map(item => {
            if (item.colId === dndTo.status) {
                return {
                    ...item,
                    list: newList
                }
            } else if (item.colId === payload.status) {
                return {
                    ...item,
                    list: item.list.filter((l, i) => i !== payload.pos)
                }
            } else {
                return item
            }
        }))
    }

    const onDropCard = (e) => {
        // console.log("drag drop", e)
        const { removedIndex, addedIndex, payload } = e
        if (removedIndex || addedIndex) {
            if (payload.status === dndTo.status) {
                sameList(payload)
            } else {
                if (!addedIndex) {
                    reList(payload)
                }
            }
        }

        if (removedIndex === 0 && !addedIndex) {
            reList(payload)
        }
    }

    const onColumnDrop = (e) => {
        // console.log("drag drop", e)
        const { removedIndex, addedIndex } = e
        if (removedIndex !== null && addedIndex !== null) {
            if (removedIndex !== addedIndex) {
                let remaing = data.filter((item, i) => i !== removedIndex)
                let newList = [
                    ...remaing.slice(0, addedIndex),
                    ...data.filter((item, i) => i === removedIndex),
                    ...remaing.slice(addedIndex)
                ]
                setData(newList)
            }
        }
    }

    return (
        <div className="fistCheck">
            <Container
                groupName="status"
                orientation="horizontal"
                getChildPayload={i => i}
                onDragStart={e => console.log("drag col start ", e)}
                onDragEnd={e => console.log("drag col end ", e)}
                onDrop={e => onColumnDrop(e)}
                onDragEnter={() => console.log("drag col enter ")}
                onDragLeave={() => console.log("drag col leave ")}
                onDropReady={p => console.log("drag col drop ready ", p)}
                dragClass="card-ghost"
                dropClass="card-ghost-drop"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'cards-drop-preview'
                }}
            >
                {
                    data.map(item => {
                        return (
                            <Draggable key={item.colId}>
                                <h1>{item.colId}</h1>
                                <Container
                                    groupName="list"
                                    getChildPayload={i => getCardPayload(item.colId, i)}
                                    onDragStart={e => onDragStart(e)}
                                    onDragEnd={e => onDragEnd(e)}
                                    onDrop={e => onDropCard(e)}
                                    onDragEnter={() => onDragEnter(item.colId)}
                                    onDragLeave={() => console.log("drag leave:", item.colId)}
                                    onDropReady={p => onDragDropReady(p)}
                                    dragClass="card-ghost"
                                    dropClass="card-ghost-drop"
                                    dropPlaceholder={{
                                        animationDuration: 150,
                                        showOnTop: true,
                                        className: 'cards-drop-preview'
                                    }}
                                    dropPlaceholderAnimationDuration={200}
                                >
                                    {
                                        item.list.map((list, i) => {
                                            return (
                                                <Draggable key={list.id}>
                                                    <div className="drag-holder">
                                                        {list.name}
                                                    </div>
                                                </Draggable>
                                            )
                                        })
                                    }
                                </Container>
                            </Draggable>
                        )
                    })
                }
            </Container>
        </div>
    )
}

export default Smooth2



// *** second test ***

// function Smooth2() {
//     const [data, setData] = useState(allData)
//     const [dndTo, setDnDTo] = useState({
//         status: "",
//         pos: ""
//     })

//     const getCardPayload = (colId, index) => {
//         return {
//             id: data.filter(it => it.colId === colId)[0].list[index].id,
//             pos: index,
//             status: colId
//         }
//     }

//     const onDragStart = e => {
//         // console.log("drag started", e)
//         setDnDTo(prev => {
//             return {
//                 ...prev,
//                 status: e.payload.status
//             }
//         })
//     }

//     const onDragEnter = (status) => {
//         // console.log("drag enter:", status)
//         setDnDTo(prev => {
//             return {
//                 ...prev,
//                 status
//             }
//         })
//     }

//     const onDragDropReady = (p) => {
//         // console.log('Drop ready: ', p)
//         const { addedIndex } = p
//         setDnDTo(prev => {
//             return {
//                 ...prev,
//                 pos: addedIndex
//             }
//         })
//     }

//     const onDragEnd = e => {
//         // console.log("drag end", e)
//     }

//     const sameList = (payload) => {
//         let remaing = data.filter(item => item.colId === payload.status)[0]
//             .list.filter((list, i) => i !== payload.pos)
//         let newList = [
//             ...remaing.slice(0, dndTo.pos),
//             data.filter(item => item.colId === payload.status)[0].list[payload.pos],
//             ...remaing.slice(dndTo.pos)
//         ]
//         setData(prev => prev.map(item => {
//             if (item.colId === dndTo.status) {
//                 return {
//                     ...item,
//                     list: newList
//                 }
//             } else {
//                 return item
//             }
//         }))
//     }

//     const reList = (payload) => {
//         let current = data.filter(item => item.colId === payload.status)[0]
//             .list.filter((list, i) => i === payload.pos)[0]
//         let remaing = data
//             .filter(item => item.colId === dndTo.status)[0]
//             .list
//         let newList = [
//             ...remaing.slice(0, dndTo.pos),
//             current,
//             ...remaing.slice(dndTo.pos)
//         ]
//         setData(prev => prev.map(item => {
//             if (item.colId === dndTo.status) {
//                 return {
//                     ...item,
//                     list: newList
//                 }
//             } else if (item.colId === payload.status) {
//                 return {
//                     ...item,
//                     list: item.list.filter((l, i) => i !== payload.pos)
//                 }
//             } else {
//                 return item
//             }
//         }))
//     }

//     const onDropCard = (e) => {
//         // console.log("drag drop", e)
//         const { removedIndex, addedIndex, payload } = e
//         if (removedIndex || addedIndex) {
//             if (payload.status === dndTo.status) {
//                 sameList(payload)
//             } else {
//                 if (!addedIndex) {
//                     reList(payload)
//                 }
//             }
//         }

//         if (removedIndex === 0 && !addedIndex) {
//             reList(payload)
//         }
//     }

//     return (
//         <div className="fistCheck">
//             {
//                 data.map(item => {
//                     return (
//                         <div key={item.colId}>
//                             <h1>{item.colId}</h1>
//                             <Container
//                                 groupName="list"
//                                 getChildPayload={i => getCardPayload(item.colId, i)}
//                                 onDragStart={e => onDragStart(e)}
//                                 onDragEnd={e => onDragEnd(e)}
//                                 onDrop={e => onDropCard(e)}
//                                 onDragEnter={() => onDragEnter(item.colId)}
//                                 onDragLeave={() => console.log("drag leave:", item.colId)}
//                                 onDropReady={p => onDragDropReady(p)}
//                                 dragClass="card-ghost"
//                                 dropClass="card-ghost-drop"
//                                 dropPlaceholder={{
//                                     animationDuration: 150,
//                                     showOnTop: true,
//                                     className: 'cards-drop-preview'
//                                 }}
//                                 dropPlaceholderAnimationDuration={200}
//                             >
//                                 {
//                                     item.list.map((list, i) => {
//                                         return (
//                                             <Draggable key={list.id}>
//                                                 <div className="drag-holder">
//                                                     {list.name}
//                                                 </div>
//                                             </Draggable>
//                                         )
//                                     })
//                                 }
//                             </Container>
//                         </div>
//                     )
//                 })
//             }
//         </div>
//     )
// }




//  *** first test ***

// function Smooth2() {
//     const [data, setData] = useState(defaultData)

//     const getCardPayload = (index) => {
//         return data[index]
//     }

//     const onDropCard = (e) => {
//         const { removedIndex: from, addedIndex: to, payload } = e
//         let remaing = data.filter((l, i) => i !== from)
//         console.log("remaing", remaing)
//         let newList = [
//             ...remaing.slice(0, to),
//             data[from],
//             ...remaing.slice(to)
//         ]
//         console.log("new", newList)
//         // console.log("drag drop", e)
//         setData(newList)
//     }

//     return (
//         <div className="fistCheck">
//             <Container
//                 groupName="col"
//                 onDragStart={e => console.log("drag started", e)}
//                 onDragEnd={e => console.log("drag end", e)}
//                 onDrop={e => onDropCard(e)}
//                 onDragEnter={(index) => console.log("drag enter:", data[index])}
//                 onDragLeave={e => console.log("drag leave:", e)}
//                 onDropReady={p => console.log('Drop ready: ', p)}
//                 getChildPayload={index =>
//                     getCardPayload(index)
//                 }
//                 dragClass="card-ghost"
//                 dropClass="card-ghost-drop"
//                 dropPlaceholder={{
//                     animationDuration: 150,
//                     showOnTop: true,
//                     className: 'cards-drop-preview'
//                 }}
//                 dropPlaceholderAnimationDuration={200}
//             >
//                 {data.map((item, i) => {
//                     return (
//                         <Draggable key={item._id}>
//                             <div className="drag-holder">
//                                 {item.name}
//                             </div>
//                         </Draggable>
//                     )
//                 })}
//             </Container>
//         </div>
//     )
// }
