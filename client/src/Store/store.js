import { createStore, combineReducers } from 'redux'
import AuthReducer from './Auth/AuthReducer'

const rootReducers = combineReducers({
    auth: AuthReducer,
})

const store = createStore(rootReducers)

export default store
