const { Router } = require('express');

// import controller
const userController = require('../controllers/user.controller');

// import auth middleware
// const authMiddleware = require('../middlewares/auth.middleware');

// start router
const router = Router();

router.post('/', userController.create);

module.exports = router;