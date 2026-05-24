import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import router from './routes/route.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(express.json())
app.use('/api/works', router)   

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})