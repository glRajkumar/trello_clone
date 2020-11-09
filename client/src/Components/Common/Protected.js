import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

const Protected = ({ component: Component, ...rest }) => {
    const auth = useSelector(state => state.auth)

    console.log("at protected")
    console.log(auth)

    const headers = {
        Authorization: "Bearer " + auth.token
    }

    return (
        <Route {...rest} render={
            props => {
                if (auth) {
                    return <Component {...rest} {...props} headers={headers} />
                } else {
                    return <Redirect to='/unauth' />
                }
            }
        } />
    )
}

export default Protected