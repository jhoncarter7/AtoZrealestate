// eslint-disable-next-line no-unused-vars
import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import {persistReducer, persistStore} from 'redux-persist'
import storage from "redux-persist/lib/storage";

// combine use to combine more than one reducer in single rootReducer
const rootReducer = combineReducers({user: userReducer})

// persist config store all the rootReducer in localStorage with the name root
const persistConfig = {
    key: 'root',
    storage,
    version: 1
}
// this reducer target the value and connect it with config and then persisitconfig store the data inside the localstorage
const persistedReducer = persistReducer(persistConfig, rootReducer)

// now we replace the reducer with persistedReducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
   serializableCheck: false
    })
})
// now we use persistor to make store globally available
export const persistor = persistStore(store)