import { AUTH_LOADING, AUTH_ACTION, AUTH_LOGOUT, AUTH_ERROR } from "../actionTypes"

const intialState = {
    _id: "",
    userName: "",
    email: "",
    token: "",
    auth: false,
    loading: true,
    error: ""
}

const AuthReducer = (state = intialState, { type, payload }) => {
    switch (type) {
        case AUTH_LOADING:
            return {
                ...state,
                loading: true
            }

        case AUTH_ACTION:
            return {
                ...state,
                ...payload
            }

        case AUTH_LOGOUT:
            return {
                ...intialState
            }

        case AUTH_ERROR:
            return {
                ...state,
                loading: false,
                error: "Something went wrong..."
            }

        default: return state
    }
}

export default AuthReducer