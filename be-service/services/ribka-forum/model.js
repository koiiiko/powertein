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
    let query;
    let params;

    if (image === undefined || image === null || image === "") {
      // Jangan update image
      query = `
        UPDATE article 
        SET title = ?, content = ?, updated_at = NOW() 
        WHERE id = ?
      `;
      params = [title, content, id];
    } else {
      // Update image
      const imageBuffer = Buffer.from(image, "base64");
      query = `
        UPDATE article 
        SET title = ?, content = ?, image = ?, updated_at = NOW() 
        WHERE id = ?
      `;
      params = [title, content, imageBuffer, id];
    }

    con.query(query, params, (err, result) => {
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

// Fungsi untuk update like count - Alternative approach
const updateLikeCount = (articleId, increment = true) => {
  return new Promise((resolve, reject) => {
    // First, get current value
    con.query(
      "SELECT like_count FROM article WHERE id = ?",
      [articleId],
      (err, results) => {
        if (err) {
          console.error("Error getting current like count:", err);
          return reject(err);
        }

        const currentCount = results[0]?.like_count || 0;
        const newCount = increment
          ? Math.max(0, currentCount + 1)
          : Math.max(0, currentCount - 1);

        console.log("Like count update:", {
          articleId,
          currentCount,
          newCount,
          increment,
        });

        // Then update with new value
        con.query(
          "UPDATE article SET like_count = ? WHERE id = ?",
          [newCount, articleId],
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error("Error updating like count:", updateErr);
              return reject(updateErr);
            }
            console.log("Like count update result:", updateResult);
            resolve(updateResult);
          }
        );
      }
    );
  });
};

// Fungsi untuk update dislike count - Alternative approach
const updateDislikeCount = (articleId, increment = true) => {
  return new Promise((resolve, reject) => {
    // First, get current value
    con.query(
      "SELECT dislike_count FROM article WHERE id = ?",
      [articleId],
      (err, results) => {
        if (err) {
          console.error("Error getting current dislike count:", err);
          return reject(err);
        }

        const currentCount = results[0]?.dislike_count || 0;
        const newCount = increment
          ? Math.max(0, currentCount + 1)
          : Math.max(0, currentCount - 1);

        console.log("Dislike count update:", {
          articleId,
          currentCount,
          newCount,
          increment,
        });

        // Then update with new value
        con.query(
          "UPDATE article SET dislike_count = ? WHERE id = ?",
          [newCount, articleId],
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error("Error updating dislike count:", updateErr);
              return reject(updateErr);
            }
            console.log("Dislike count update result:", updateResult);
            resolve(updateResult);
          }
        );
      }
    );
  });
};

module.exports = {
  getAllArticles,
  getArticleById,
  addArticleToDB,
  updateArticleInDB,
  deleteArticleFromDB,
  updateLikeCount,
  updateDislikeCount,
};
