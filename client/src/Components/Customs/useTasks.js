import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TASK_GET } from "../../Store/actionTypes"
import axios from 'axios'

function useTasks(boardid, headers) {
    console.log("at useTask")
    console.log(headers)
    const [init, setInit] = useState(true)
    const { tasks, loading, error } = useSelector(state => state.tasks)
    const dispatch = useDispatch()

    console.log({ tasks, loading, error })

    useEffect(() => {
        axios.get(`/task/${boardid}`, { headers })
            .then((res) => {
                console.log(res.data.tasks)
                const payload = {
                    tasks: res.data.tasks
                }
                dispatch({ type: TASK_GET, payload })
            })
            .catch((err) => {
                console.log(err)
            })

        setInit(false)
    }, [])

    return { init, tasks, loading, error }
}

export default useTasks