import React from 'react'
import Loading from '../Common/Loading'
import useTasks from '../Customs/useTasks'
import Card from './Card'

function Tasks({ headers }) {
    const { init, tasks, loading, error } = useTasks(headers)
    console.log("at Tasks")
    console.log({ init, tasks, loading, error })

    return !init ? (
        <div>
            {
                tasks.length > 0 &&
                tasks.map(task => {
                    return (
                        <Card
                            _id={task._id}
                            title={task.title}
                            body={task.body}
                            catagery={task.catagery}
                            updatedAt={task.updatedAt}
                        />
                    )
                })
            }

            {
                error && <div>Something went wrong</div>
            }
        </div>
    )
        : (<Loading />)
}

export default Tasks