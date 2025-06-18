require('dotenv').config();
const { con } = require('../../database');

// Data produk yang akan dimasukkan
const productData = {
  namaProduct: 'ON Optimum Nutrition Whey Gold Standard 5 lbs Whey Protein Isolate WGS Milk Chocolate',
  image: 'https://via.placeholder.com/400x300?text=ON+Whey+Gold+Standard', // URL gambar dummy
  harga: 1350000, // Harga sebagai angka (sesuaikan jika kolom harga di DB bukan numerik)
  rating: 4.8, // Rating sebagai angka
  reviewCount: 120, // Jumlah review
  deskripsi: 'Whey Protein Isolate berkualitas tinggi dari Optimum Nutrition. Mengandung 24g protein per sajian, rendah gula dan lemak. Membantu pemulihan dan pertumbuhan otot.', // Deskripsi
  kategori: 'Whey', // Kategori
  brand: 'Optimum Nutrition', // Brand
  weight: '5 lbs (2.27 kg)', // Berat bersih
  flavors: 'Milk Chocolate, Double Rich Chocolate, Vanilla Ice Cream', // Rasa tersedia (contoh dengan beberapa rasa)
  tokopediaLink: 'https://www.tokopedia.com/rocketslippers/on-optimum-nutrition-whey-gold-standard-5-lbs-whey-protein-isolate-wgs-milk-chocolate-tanpa-bonus-918be?extParam=ivf%3Dtrue%26keyword%3Dwhey+protein+isolate%26search_id%3D20250614151932D947BF06A885DB1B0FN3%26src%3Dsearch&t_id=1749914393401&t_st=1&t_pp=search_result&t_efo=search_pure_goods_card&t_ef=goods_search&t_sm=&t_spt=search_result', // Link Tokopedia
};

con.connect(function(err) {
  if (err) {
    console.error("Error connecting to database for insertion:", err);
    return;
  }
  console.log("Connected to database for insertion!");

  // SQL query untuk INSERT data, mencakup semua kolom
  const sql = `INSERT INTO product (namaProduct, image, harga, rating, reviewCount, deskripsi, kategori, brand, weight, flavors, tokopediaLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    productData.namaProduct,
    productData.image,
    productData.harga,
    productData.rating,
    productData.reviewCount,
    productData.deskripsi,
    productData.kategori,
    productData.brand,
    productData.weight,
    productData.flavors,
    productData.tokopediaLink,
  ];

  con.query(sql, values, function(err, result) {
    if (err) {
      console.error("Error inserting product:", err);
    } else {
      console.log(`Product inserted successfully with ID: ${result.insertId}`);
      console.log("1 record inserted into product table");
    }

    con.end(); // Close the connection
  });
});
