// This file contains the logic for handling product requests.
// It will include fetching data from Tokopedia (or a stored source),
// filtering, and searching.

// Placeholder function to fetch products
async function getProducts({
  category,
  searchTerm
}) {
  // TODO: Implement integration with Tokopedia API or scraping.
  // This could involve:
  // 1. Calling external API/scraping function to get raw data.
  // 2. Processing the raw data into a consistent format.
  // 3. Storing/updating data in your local database (optional, but good for performance and daily updates).
  // 4. Filtering/searching the products based on category and searchTerm.

  // For now, return mock data.
  const mockProducts = [{
    id: '1',
    name: 'Whey Protein Isolate 1kg',
    description: 'High-quality whey protein isolate.',
    price: 450000,
    imageUrl: 'placeholder.jpg',
    rating: 4.5,
    category: 'Whey'
  }, {
    id: '2',
    name: 'Casein Protein 2kg',
    description: 'Slow-digesting casein protein.',
    price: 900000,
    imageUrl: 'placeholder.jpg',
    rating: 4.5,
    category: 'Casein'
  }, {
    id: '3',
    name: 'Vegan Protein Blend 750g',
    description: 'Plant-based protein blend.',
    price: 350000,
    imageUrl: 'placeholder.jpg',
    rating: 4.5,
    category: 'Vegan'
  }, {
    id: '4',
    name: 'Whey Protein Blend 750g',
    description: 'Blend of whey proteins.',
    price: 350000,
    imageUrl: 'placeholder.jpg',
    rating: 4.5,
    category: 'Whey'
  }, {
    id: '5',
    name: 'Casein Protein 1kg',
    description: 'Slow-digesting casein protein.',
    price: 450000,
    imageUrl: 'placeholder.jpg',
    rating: 4.5,
    category: 'Casein'
  }, {
    id: '6',
    name: 'Vegan Protein Isolate 1kg',
    description: 'Plant-based protein isolate.',
    price: 450000,
    imageUrl: 'placeholder.jpg',
    rating: 4.5,
    category: 'Vegan'
  }, // Add more mock data as needed
  ];

  let filteredProducts = mockProducts;

  if (category && category !== 'All') {
    filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  return filteredProducts;
}

module.exports = {
  getProducts,
};
