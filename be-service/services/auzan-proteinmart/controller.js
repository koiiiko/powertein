// This file contains the logic for handling product requests.
// It will include fetching data from Tokopedia (or a stored source),
// filtering, and searching.

const { con } = require('../../database'); // Import database connection

// Placeholder function to fetch products (list)
async function getProducts({
  category,
  searchTerm
}) {
  return new Promise((resolve, reject) => {
    let sql = "SELECT id, namaProduct, image, harga, rating, deskripsi, kategori FROM product"; // Select only the columns needed for the list view
    const conditions = [];
    const values = [];

    if (category && category !== 'All') {
      conditions.push("kategori = ?");
      values.push(category);
    }

    if (searchTerm) {
      const searchTermPattern = `%${searchTerm}%`;
      conditions.push("(namaProduct LIKE ? OR deskripsi LIKE ?)");
      values.push(searchTermPattern, searchTermPattern);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    con.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error fetching products from database:", err);
        reject(err);
        return;
      }

      console.log(`Successfully fetched products from database`);
      resolve(results); // Return the results
    });
  });
}

// New function to fetch a single product by ID
async function getProductById(productId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM product WHERE id = ?"; // Select all columns for detail view
        con.query(sql, [productId], (err, results) => {
            if (err) {
                console.error(`Error fetching product with ID ${productId} from database:`, err);
                reject(err);
                return;
            }

            if (results.length === 0) {
                // Product not found
                resolve(undefined);
                return;
            }

            console.log(`Successfully fetched product with ID from database`);
            resolve(results[0]); // Return the first (and only) result
        });
    });
}


module.exports = {
  getProducts,
  getProductById, // Export the new function
};