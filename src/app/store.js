/**
 * Redux Store Configuration
 * Configures Redux Toolkit store with Redux Persist
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage

// Import reducers
import authReducer from '@features/auth/authSlice'
import cartReducer from '@features/cart/cartSlice'
import productsReducer from '@features/products/productsSlice'
import ordersReducer from '@features/orders/ordersSlice'
import wishlistReducer from '@features/wishlist/wishlistSlice'
import uiReducer from '@features/ui/uiSlice'

/**
 * Redux Persist Configuration
 * - Persist auth and cart state in localStorage
 * - Other states are session-only
 */
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // Only persist auth and cart
  whitelist: ['auth', 'cart'],
  // Blacklist states that should NOT be persisted
  blacklist: ['products', 'orders', 'wishlist', 'ui'],
}

/**
 * Root Reducer
 * Combines all feature reducers
 */
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productsReducer,
  orders: ordersReducer,
  wishlist: wishlistReducer,
  ui: uiReducer,
})

/**
 * Persisted Reducer
 * Wraps root reducer with Redux Persist
 */
const persistedReducer = persistReducer(persistConfig, rootReducer)

/**
 * Configure Store
 * Create Redux store with middleware
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Redux Persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.MODE !== 'production', // Enable Redux DevTools in development
})

/**
 * Persistor
 * Creates persistor for PersistGate
 */
export const persistor = persistStore(store)

/**
 * Export types for TypeScript (if needed in future)
 * export type RootState = ReturnType<typeof store.getState>
 * export type AppDispatch = typeof store.dispatch
 */
