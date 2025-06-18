import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppsLayout from '../../../components/layout'; // Correct import path

const ProductDetailPage = () => {
  const { productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch specific product data from backend API
        console.log(`Fetching product with ID: ${productId} from backend`);
        const response = await fetch(`/auzan-proteinmart/products/${productId}`);

        if (!response.ok) {
          // Handle cases where the product is not found (e.g., 404 status)
          if (response.status === 404) {
            setProduct(null);
            setError('Produk tidak ditemukan.');
          } else {
            // Handle other HTTP errors
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          console.log("Product Data from Backend:", data);
          setProduct(data);
        }

      } catch (err) {
        setError('Gagal memuat detail produk.'); // Generic error message for fetch issues
        console.error('Error fetching product details:', err);
        setProduct(null); // Clear product on error
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }

  }, [productId]); // Dependency array: refetch when productId changes

  const handleBuyNow = () => {
    if (product && product.tokopediaLink) {
      // TODO: Implement stock check logic here before redirecting (based on scraped stock data)
      // For now, just redirect
      window.open(product.tokopediaLink, '_blank'); // Open in new tab
    } else {
      alert('Tautan Tokopedia tidak tersedia untuk produk ini.');
    }
  };

  // Check if product.rating is a valid number
  let rating = 0;
  let isValidRating = false;

  if (product && product.rating) {
    rating = parseFloat(product.rating);
    isValidRating = typeof rating === 'number' && !isNaN(rating);
  }


  // Render loading, error, or product details
  return (
    <AppsLayout>
      <div className="container mx-auto p-4">
        {/* Breadcrumb - Example structure, adjust as needed */}
        <div className="text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:underline">Home (PowerTein)</Link>
          &gt;
          <Link to="/mart" className="hover:underline">Katalog Produk</Link>
          &gt; {product ? product.namaProduct : '...'}
        </div>

        {loading && <p>Memuat detail produk...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && product && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Image */}
            <div className="md:w-1/3 flex-shrink-0">
              <img
                src={product.image || 'https://via.placeholder.com/400x300'}
                alt={product.namaProduct}
                className="w-full h-auto object-cover rounded-lg shadow"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300'; }}
              />
            </div>

            {/* Product Details */}
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold mb-4">{product.namaProduct}</h1>

              {/* Display rating and reviews */}
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 text-lg mr-2">
                  {isValidRating
                    ? '⭐'.repeat(Math.floor(rating)) + ` ${rating.toFixed(1)}`
                    : 'No rating'}
                </span>
                {/* Assuming reviews count is available from backend */}
                {product.reviewCount !== undefined && (
                  <span className="text-gray-600 text-sm">({product.reviewCount} Reviews)</span>
                )}
              </div>

              <p className="text-xl font-semibold text-blue-600 mb-4">Rp{product.harga ? product.harga.toLocaleString('id-ID') : 'N/A'}</p>

               {/* Category */}
               {product.kategori && (
                 <p className="text-gray-700 text-sm mb-1"><span className="font-semibold">Kategori:</span> {product.kategori}</p>
               )}

              {/* Short Description */}
              <p className="text-gray-700 mb-6">{product.deskripsi || 'No description available.'}</p>

              {/* Additional Details (Brand, Weight, Flavors - based on UI) */}
              {/* Assuming these fields are available in the backend data */}
              {product.brand && (
                <p className="text-gray-700 text-sm mb-1"><span className="font-semibold">Brand:</span> {product.brand}</p>
              )}
              {product.weight && (
                <p className="text-gray-700 text-sm mb-1"><span className="font-semibold">Berat bersih:</span> {product.weight}</p>
              )}

              {product.flavors && ( // Assuming flavors might be an array or string
                <p className="text-gray-700 text-sm mb-6"><span className="font-semibold">Rasa tersedia:</span> {Array.isArray(product.flavors) ? product.flavors.join(', ') : product.flavors}</p>
              )}


              {/* Stock Information (based on last scrape) */}
              {product.stock !== undefined && (
                <div className={`mb-6 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Status Stok Terakhir: {product.stock > 0 ? `Tersedia (${product.stock} unit)` : 'Stok Habis'}
                  {/* TODO: Add info about when stock was last updated */}
                </div>
              )}


              {/* Buy Now Button */}
              {/* Only show the button if tokopediaUrl exists */}
              {product.tokopediaLink ? (
                <button
                  onClick={handleBuyNow}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={product.stock !== undefined && product.stock <= 0}
                >
                  {product.stock !== undefined && product.stock <= 0 ? 'Stok Habis' : 'Beli di Tokopedia'}
                  {/* You can add an icon here if desired, e.g., a shopping bag or external link icon */}
                </button>
              ) : (
                <p className="text-gray-500 text-sm">Tautan pembelian tidak tersedia.</p>
              )}


            </div>
          </div>
        )}

        {!loading && !error && !product && <p>Produk tidak ditemukan.</p>}

      </div>
    </AppsLayout>
  );
};

export default ProductDetailPage;