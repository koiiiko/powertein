const express = require('express');
const { fetchArticles, fetchArticleById, createArticle, updateArticle, deleteArticle} = require('./controller');

const router = express.Router();

router.get('/articles', fetchArticles);
router.get('/articles/:id', fetchArticleById);
router.post('/articles', createArticle);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

module.exports = router;