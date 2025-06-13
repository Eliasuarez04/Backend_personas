const express = require('express')
const router = express.Router()
const controller = require('../controllers/polizaController')

router.post('/', controller.crearPoliza)
router.get('/', controller.obtenerPolizas)
router.get('/:id', controller.obtenerPoliza)
router.put('/:id', controller.actualizarPoliza)
router.delete('/:id', controller.eliminarPoliza)

module.exports = router
