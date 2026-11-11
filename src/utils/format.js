export const priceLabel = (price, free = 'FREE') => (price === 0 ? free : `₹${price}`)
