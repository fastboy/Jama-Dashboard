const express = require('express');
const { setupStatus, createInitialAdmin } = require('../controllers/setup');

const router = express.Router();

router.get('/setup/status', setupStatus);
router.post('/setup', createInitialAdmin);

module.exports = router;
