/**
 * Formatting Utilities
 * Functions for formatting currency, dates, numbers, etc.
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { CURRENCY, DATE_FORMATS } from '@constants'

/**
 * Format price/currency
 * @param {number|string} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 *
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency("999.99") // "$999.99"
 */
export const formatCurrency = (amount, currency = CURRENCY.CODE) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numAmount)) {
    return `${CURRENCY.SYMBOL}0.00`
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Date format string (default: FULL)
 * @returns {string} Formatted date string
 *
 * @example
 * formatDate("2024-01-15T10:30:00") // "January 15, 2024 10:30"
 * formatDate(new Date(), DATE_FORMATS.SHORT) // "Jan 15, 2024"
 */
export const formatDate = (date, formatStr = DATE_FORMATS.FULL) => {
  if (!date) return ''

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatStr)
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 *
 * @example
 * formatRelativeTime("2024-01-13T10:00:00") // "2 days ago"
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return ''
  }
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 *
 * @example
 * truncateText("This is a very long product description", 20)
 * // "This is a very long..."
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
