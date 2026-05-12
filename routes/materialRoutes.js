const express = require('express');
const router = express.Router();
const controller = require('../controllers/materialController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

router.get('/', controller.listMaterials);
router.get('/:id', controller.getMaterial);
router.post('/', auth.required, controller.createMaterial);
router.put('/:id', auth.required, controller.updateMaterial);
router.delete('/:id', auth.required, controller.deleteMaterial);

module.exports = router;
