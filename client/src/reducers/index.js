import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools } from 'redux-devtools-extension'
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import uploadReducer from "./uploadReducer";
import appReducer from "./appReducer";


const rootReducer = combineReducers({
    user: userReducer,
    files: fileReducer,
    upload: uploadReducer,
    upload: uploadReducer,
    app: appReducer
})

// export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
export const store = createStore(rootReducer, applyMiddleware(thunk))
