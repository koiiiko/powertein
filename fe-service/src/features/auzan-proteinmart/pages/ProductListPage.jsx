import React, { useState, useEffect } from 'react';
import AppsLayout from '../../../components/layout'; // Corrected Import Path
import ProductCard from '../components/ProductCard';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dummy categories for now (should ideally come from backend)
  const categories = ['All', 'Whey', 'Casein', 'Vegan'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch data from backend API
        const queryParams = new URLSearchParams({
          searchTerm: searchTerm,
          category: selectedCategory !== 'All' ? selectedCategory : '' // Don't send category if 'All'
        }).toString();

        const response = await fetch(`/auzan-proteinmart/products?${queryParams}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
        setProducts([]); // Clear products on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory]); // Dependency array: refetch when searchTerm or selectedCategory changes

  return (
    <AppsLayout> {/* Wrap content with AppsLayout */}
      <div className="container mx-auto p-4"> {/* Keep existing content structure inside */}
        <h1 className="text-2xl font-bold mb-4">Katalog Produk Kebutuhan Protein</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Product Grid */}
        {loading && <p>Memuat produk...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              // Use the ProductCard component
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && !loading && !error && <p>Tidak ada produk ditemukan.</p>}
          </div>
        )}
      </div>
    </AppsLayout>
  );
};

export default ProductListPage;