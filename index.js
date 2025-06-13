require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/polizas', require('./routes/polizaRoutes'))

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión', err))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`))
