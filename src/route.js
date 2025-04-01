import express from 'express'

export const router = express.Router()

router.post('/', (req, res, next) => {
  console.log(req.headers)
  res.json({
    message: 'I got the following body!',
    body: req.body
  })
})