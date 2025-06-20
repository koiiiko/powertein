const express = require("express");
const {
  ArticleTaskService, ReactionTaskService
} = require("./controller");

const router = express.Router();

router.get("/articles", ArticleTaskService.fetchArticles);
router.get("/articles/:id", ArticleTaskService.fetchArticleById);
router.post("/articles", ArticleTaskService.createArticle);
router.put("/articles/:id", ArticleTaskService.updateArticle);
router.delete("/articles/:id", ArticleTaskService.deleteArticle);
router.post("/articles/:id/reaction", ReactionTaskService.handleReaction);

module.exports = router;
