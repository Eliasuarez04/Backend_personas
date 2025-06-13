const Poliza = require('../models/Poliza')

// Crear
exports.crearPoliza = async (req, res) => {
  try {
    const poliza = new Poliza(req.body)
    await poliza.save()
    res.status(201).json(poliza)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Leer todas
exports.obtenerPolizas = async (req, res) => {
  const polizas = await Poliza.find()
  res.json(polizas)
}

// Leer una
exports.obtenerPoliza = async (req, res) => {
  const poliza = await Poliza.findById(req.params.id)
  if (!poliza) return res.status(404).json({ mensaje: 'No encontrada' })
  res.json(poliza)
}

// Actualizar
exports.actualizarPoliza = async (req, res) => {
  const poliza = await Poliza.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(poliza)
}

// Eliminar
exports.eliminarPoliza = async (req, res) => {
  await Poliza.findByIdAndDelete(req.params.id)
  res.json({ mensaje: 'Poliza eliminada' })
}
