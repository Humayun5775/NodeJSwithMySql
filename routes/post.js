const express = require('express');
const postsController = require('../controllers/post.controller');

const checkAuthMiddleware = require('../middleware/check-auth')

const router = express.Router();

// Route to create a new post using POST
router.post("/", checkAuthMiddleware.CheckAuth ,postsController.save);
router.get("/", postsController.index);
// Route to retrieve a post by its ID using GET
router.get("/:id", postsController.show);

module.exports = router;
