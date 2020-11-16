import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from "redux-devtools-extension"
import AuthReducer from './Auth/AuthReducer'
import boardReducer from './Board/boardReducer'
import taskReducer from './Board/taskReducer'
import sboardReducer from './Shared/sboardReducer'
import staskReducer from './Shared/staskReducer'

const rootReducers = combineReducers({
    auth: AuthReducer,
    board: boardReducer,
    task: taskReducer,
    sboard: sboardReducer,
    stask: staskReducer,
})

const store = createStore(rootReducers, composeWithDevTools())

export default store
