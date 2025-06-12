import React from 'react';

const ProductCard = ({ product }) => {
  // Ensure product data is available before rendering
  if (!product) {
    return null; // Or a loading/placeholder card
  }

  return (
    <div className="border p-4 rounded-lg shadow h-full flex flex-col"> {/* Added h-full and flex-col for consistent height */}
      {/* Use product.imageUrl from backend data */}
      {/* Added basic error handling for image loading */}
      <img
        src={product.imageUrl || 'https://via.placeholder.com/150'}
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded flex-shrink-0" // flex-shrink-0 prevents image from shrinking
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }} // Fallback on error
      />
      <h2 className="text-lg font-semibold mb-2">{product.name}</h2> {/* Added mb-2 */}
      {/* Added max-h-20 and overflow-hidden for description to prevent cards from stretching */}
      <p className="text-gray-600 text-sm mb-4 flex-grow max-h-20 overflow-hidden">{product.description || 'No description available.'}</p> {/* Added flex-grow and mb-4 */}
      <div className="flex justify-between items-center mt-auto"> {/* Added mt-auto to push to bottom */}
        {/* Ensure price is formatted correctly */}
        <span className="text-lg font-bold text-blue-600">Rp{product.price ? product.price.toLocaleString('id-ID') : 'N/A'}</span>
        {/* Display rating */}
        <span className="text-yellow-500 text-sm">
          {product.rating ? '⭐'.repeat(Math.floor(product.rating)) + ` ${product.rating.toFixed(1)}` : 'No rating'}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;