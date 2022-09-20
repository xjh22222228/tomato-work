import { Middleware, PayloadAction } from '@reduxjs/toolkit'
import { SET_USER_INFO } from '@/store/userSlice'
import { LOCAL_STORAGE } from '@/constants'
import { RootState } from '@/store/index'

export const authMiddleware: Middleware<{}, RootState> =
	(storeApi) => (next) => (action: PayloadAction) => {
		if (SET_USER_INFO.match(action) && !!action.payload.token) {
			localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(action.payload))
			localStorage.setItem(LOCAL_STORAGE.LOGIN_NAME, action.payload.loginName)
		}

		return next(action)
	}
