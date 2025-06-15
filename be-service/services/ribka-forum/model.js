const { con } = require("../../database");

const getAllArticles = () => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM article", (err, results) => {
      if (err) return reject(err);
      // console.log("DB results:", results);
      resolve(results);
    });
  });
};

const getArticleById = (id) => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM article WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); 
    });
  });
};

const addArticleToDB = ({ title, content, username, user_id, image }) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO article (title, content, username, user_id, image, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    con.query(
      query,
      [
        title,
        content,
        username,
        user_id,
        image ? Buffer.from(image, "base64") : null,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const updateArticleInDB = ({ id, title, content, image }) => {
  return new Promise((resolve, reject) => {
    let imageBuffer = null;

    if (image === null || image === undefined || image === "") {
      imageBuffer = null;
    } else if (typeof image === "string") {
      imageBuffer = Buffer.from(image, "base64");
    } else {
      imageBuffer = image;
    }

    const query = `
      UPDATE article 
      SET title = ?, content = ?, image = ?, updated_at = NOW() 
      WHERE id = ?
    `;

    con.query(query, [title, content, imageBuffer, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteArticleFromDB = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM article WHERE id = ?";
    con.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getAllArticles,
  getArticleById,
  addArticleToDB,
  updateArticleInDB,
  deleteArticleFromDB,
};
