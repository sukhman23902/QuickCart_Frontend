/**
 * UI Redux Slice
 * Manages UI state (notifications, loading, drawer, etc.)
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: [],
  globalLoading: false,
  sidebarOpen: false,
  themeMode: 'light', // 'light' or 'dark'
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Show notification
     * @param {Object} payload - { message, variant: 'success'|'error'|'info'|'warning' }
     */
    showNotification: (state, action) => {
      const { message, variant = 'info', duration = 3000 } = action.payload
      state.notifications.push({
        id: Date.now(),
        message,
        variant,
        duration,
      })
    },

    /**
     * Hide notification
     * @param {number} payload - Notification ID
     */
    hideNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      )
    },

    clearNotifications: (state) => {
      state.notifications = []
    },

    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },

    openSidebar: (state) => {
      state.sidebarOpen = true
    },

    closeSidebar: (state) => {
      state.sidebarOpen = false
    },

    /**
     * Set theme mode
     * @param {string} payload - 'light' or 'dark'
     */
    setThemeMode: (state, action) => {
      state.themeMode = action.payload
    },

    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
    },
  },
})

// Export actions
export const {
  showNotification,
  hideNotification,
  clearNotifications,
  setGlobalLoading,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  setThemeMode,
  toggleThemeMode,
} = uiSlice.actions

// Export selectors
export const selectNotifications = (state) => state.ui.notifications
export const selectGlobalLoading = (state) => state.ui.globalLoading
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectThemeMode = (state) => state.ui.themeMode

// Export reducer
export default uiSlice.reducer
