const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const { create, listIconPacks, addiconpack, updateIconPack, deleteIconPack } = require('../controllers/iconpack');

const router = express.Router();

router.get('/iconpack/list', verifyToken, listIconPacks);
router.post('/iconpack/add', verifyToken, addiconpack);
router.post('/iconpack/update/:id', verifyToken, updateIconPack);
router.get('/iconpack/delete/:id', verifyToken, deleteIconPack);


module.exports = router;