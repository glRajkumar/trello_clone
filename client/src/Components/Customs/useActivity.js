import { useEffect, useReducer, useState } from 'react'
import axios from 'axios'

const initialState = {
    activities: [],
    skip: 0,
    hasMore: true,
    actLoading: false,
    actError: ""
}

const activityRducer = (state, { type, payload }) => {
    switch (type) {
        case "LOADING":
            return {
                ...state,
                actLoading: true
            }

        case "GET":
            if (payload.activities.length < 5) {
                return {
                    ...state,
                    skip: state.skip + 5,
                    actLoading: false,
                    hasMore: false,
                    activities: [
                        ...state.activities,
                        ...payload.activities
                    ]
                }
            } else {
                return {
                    ...state,
                    skip: state.skip + 5,
                    actLoading: false,
                    activities: [
                        ...state.activities,
                        ...payload.activities
                    ]
                }
            }

        case "Add":
            return {
                ...state,
                activities: [
                    ...state.activities,
                    payload
                ]
            }

        default:
            return state
    }
}

function useActivity(boardId, headers) {
    const [initLoad, setInit] = useState(false)
    const [{ activities, skip, actLoading, hasMore, actError }, dispatch] = useReducer(activityRducer, initialState)

    useEffect(() => {
        getActivity()
        setInit(true)
    }, [])

    const getActivity = async () => {
        try {
            dispatch({ type: "LOADING" })
            const { data } = await axios.get(`/activity/${boardId}?skip=${skip}`, { headers })
            const payload = {
                activities: data.activities
            }
            console.log("activity")
            console.log(payload)
            dispatch({ type: "GET", payload })

        } catch (error) {
            console.log(error)
            dispatch({ type: "ERROR" })
        }
    }

    const addActivity = (payload) => {
        dispatch({ type: "ADD", payload })
    }

    return {
        initLoad,
        activities,
        actLoading,
        hasMore,
        actError,
        getActivity,
        addActivity
    }
}

export default useActivity