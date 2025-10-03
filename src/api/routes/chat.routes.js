const { Router } = require('express');

// import controller
const chatController = require('../controllers/chat.controller');
const upload = require('../middlewares/uploadMiddleware');

// import auth middleware
// const authMiddleware = require('../middlewares/auth.middleware');

// start router
const router = Router();

router.post('/ask', upload.single('file'), chatController.ask);
router.post('/', chatController.get);

module.exports = router;