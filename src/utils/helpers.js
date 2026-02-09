/**
 * Helper Utilities
 * General-purpose helper functions
 */

/**
 * Calculate cart total
 * @param {Array} items - Cart items
 * @returns {number} Total amount
 */
export const calculateCartTotal = (items) => {
  if (!items || items.length === 0) return 0

  return items.reduce((total, item) => {
    const price = parseFloat(item.productPrice || item.price || 0)
    const quantity = parseInt(item.quantity || 0, 10)
    return total + price * quantity
  }, 0)
}

/**
 * Scroll to top of page
 * @param {boolean} smooth - Use smooth scrolling
 */
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  })
}
