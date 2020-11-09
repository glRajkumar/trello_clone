import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loading from './Loading'
import axios from 'axios'
import { AUTH_ACTION, AUTH_LOGOUT, AUTH_ERROR } from "../../Store/actionTypes"

function FirstCheck() {
    const history = useHistory()
    const [firstRender, setFirstRender] = useState(true)
    const dispatch = useDispatch()

    console.log("at firstcheck")

    const LOGOUT = async () => {
        localStorage.removeItem("task_token")
        localStorage.removeItem("task_token_exp")
        dispatch({ type: AUTH_LOGOUT })
        history.push('/login')
    }

    const logged = async () => {
        try {
            const existed = localStorage.getItem("task_token")
            const exp = localStorage.getItem("task_token_exp")
            const valid = 64800000 - (Date.now() - exp)

            if (existed) {
                if (valid > 0) {
                    const res = await axios.get("/user/me", {
                        headers: {
                            Authorization: "Bearer " + existed
                        }
                    })

                    const payload = {
                        ...res.data,
                        auth: true,
                        token: existed,
                        loading: false
                    }

                    dispatch({ type: AUTH_ACTION, payload })
                    history.push("/")
                    return

                } else {
                    LOGOUT()
                    return
                }
            } else {
                history.push("/signup")
                return
            }

        } catch (error) {
            LOGOUT()
            console.log(error)
            dispatch({ type: AUTH_ERROR })
        }
    }

    const oneTimeRender = () => {
        logged()
        setFirstRender(false)
    }

    if (firstRender) {
        oneTimeRender()
    }

    return (
        <div style={{ width: '100vw', height: "100vh" }}>
            <Loading />
        </div>
    )
}

export default FirstCheck