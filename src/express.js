import express from 'express'
export const app = express()

// Middleware to parse JSON data as part of the body
app.use(express.json())

// Use the public folder for HTML index
app.use(express.static('public'))

// Error handler for 404
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Global errorhandler
app.use((err, req, res, next) => {
  const status = err.status || 500
  console.error(err)
  res.status(status).json({
    status,
    message: err.message
  })
})
