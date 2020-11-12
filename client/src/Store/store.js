import { createStore, combineReducers } from 'redux'
import AuthReducer from './Auth/AuthReducer'
import boardReducer from './Board/boardReducer'
import taskReducer from './Task/taskReducer'

const rootReducers = combineReducers({
    auth: AuthReducer,
    board: boardReducer,
    task: taskReducer,
})

const store = createStore(rootReducers)

export default store
