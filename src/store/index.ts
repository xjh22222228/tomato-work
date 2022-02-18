// Copyright 2018-present the xiejiahe. All rights reserved. MIT license.
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import systemReducer from './systemSlice'
import companyReducer from './companySlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    system: systemReducer,
    company: companyReducer
  },
})

export default store

export type IStore = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type GetState = () => RootState
