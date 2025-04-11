const express = require('express');
const router = express.Router();
const { getOferentesListos } = require('../controllers/oferentesController');

// /api/v1/oferentesListos/:id
router.get('/:id', getOferentesListos);

module.exports = router;
