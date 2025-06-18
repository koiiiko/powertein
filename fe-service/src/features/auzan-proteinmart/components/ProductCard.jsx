import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const ProductCard = ({ product }) => {
  // Ensure product data is available before rendering
  if (!product) {
    return null; // Or a loading/placeholder card
  }

  // Check if product.rating is a valid number
  const rating = parseFloat(product.rating);
  const isValidRating = typeof rating === 'number' && !isNaN(rating);

  return (
    <Link
      to={`/mart/${product.id}`} // Link to the product detail page
      className="border p-4 rounded-lg shadow h-full flex flex-col hover:shadow-lg transition-shadow block"
    >
      {/* Use product.imageUrl from backend data */}
      {/* Added basic error handling for image loading */}
      <img
        src={product.image || 'https://via.placeholder.com/150'}
        alt={product.namaProduct}
        className="w-full h-48 object-cover mb-4 rounded flex-shrink-0"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }}
      />
       <div className = "flex flex-col">

      <h2 className="text-lg font-semibold mb-2 text-gray-800">{product.namaProduct}</h2>
      <p className="text-gray-600 text-sm mb-4 flex-grow max-h-20 overflow-hidden">{product.deskripsi || 'No description available.'}</p>
       <div className="text-yellow-500 text-sm whitespace-nowrap">
       {isValidRating
        ? '⭐'.repeat(Math.floor(rating)) + ` ${rating.toFixed(1)}`
        : 'No rating'}
      </div>
       <div className = "text-lg font-bold text-blue-600">Rp{product.harga ? product.harga.toLocaleString('id-ID') : 'N/A'}</div>
         </div>
    </Link>
  );
};

export default ProductCard;