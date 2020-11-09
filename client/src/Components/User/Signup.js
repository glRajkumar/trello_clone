import React, { useState, useRef, useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import Loading from '../Common/Loading'
import { useNvalid, useEvalid, usePvalid } from '../Customs/useValidation'
import useInput from '../Customs/useInput'
import axios from 'axios'

const Signup = () => {
    const [userName, unonChange, unmsg, unerr] = useInput('', useNvalid)
    const [email, eonChange, emsg, eerr] = useInput('', useEvalid)
    const [password, ponChange, pmsg, perr] = useInput('', usePvalid)

    let unameRef = useRef('')
    let emailRef = useRef('')
    let passRef = useRef('')
    let SubRef = useRef('')

    const [logfail, setLogfail] = useState(false)
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    useEffect(() => {
        unameRef.current.focus()
    }, [])

    function unameKeyDown(e) {
        if (e.key === "Enter") emailRef.current.focus()
    }

    function emailKeyDown(e) {
        if (e.key === "Enter") passRef.current.focus()
    }

    function passKeyDown(e) {
        if (e.key === "Enter") SubRef.current.focus()
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            if (unerr === false && eerr === false && perr === false && userName !== "" && email !== "" && password !== "") {
                setLoading(true)
                await axios.post("/user/register", { userName, email, password })
                history.push("/login")
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
            setLogfail(true)
        }
    }

    return !loading ? (
        <div className="form-box">
            { logfail &&
                <div className="alert">
                    Invalid Sign Up credentials
            </div>
            }

            <label htmlFor="name"> User Name </label>
            <input
                className="input-box"
                ref={unameRef}
                onKeyDown={unameKeyDown}
                name="name"
                type="text"
                value={userName}
                onChange={unonChange}
            />
            {
                unerr && <div className="alert"> {unmsg} </div>
            }

            <label htmlFor="email"> Email </label>
            <input
                className="input-box"
                ref={emailRef}
                onKeyDown={emailKeyDown}
                name="email"
                type="email"
                value={email}
                onChange={eonChange}
            />
            {
                eerr && <div className="alert"> {emsg} </div>
            }

            <label htmlFor="password"> Password </label>
            <input
                className="input-box"
                ref={passRef}
                onKeyDown={passKeyDown}
                name="password"
                type="password"
                value={password}
                onChange={ponChange}
            />
            {
                perr && <div className="alert"> {pmsg} </div>
            }

            <button
                ref={SubRef}
                onClick={onSubmit}
            >Sign Up</button>

            <h4>Already have an account, <Link to="/login">Log In</Link></h4>
        </div>
    ) : (<Loading />)
}

export default Signup