import express from 'express'
import { db } from './database.js'

export const router = express.Router()

router.post('/', (req, res, next) => {
  console.log(req.headers)
  res.json({
    message: 'I got the following body!',
    body: req.body
  })
})

router.get('/tasks', async (req, res, next) => {
  const sql = 'SELECT * FROM tasks'
  const [rows] = await db.execute(sql)
  res.json(rows)
})

router.get('/tasks/search', async (req, res, next) => {
  let search = req.query?.search
  search = `%${search}%`
  
  const sql = `
  SELECT * FROM tasks
  
  WHERE title LIKE ? OR description LIKE ?
  `
  const [rows] = await db.execute(sql, [search, search])
  res.json(rows)
})

router.get('/tasks/:id', async (req, res, next) => {
  const sql = 'SELECT * FROM tasks WHERE id = ?'
  const [rows] = await db.execute(sql, [req.params.id])
  res.json(rows)
})

router.get('/tasks/status/:status', async (req, res, next) => {
  const status = req.params.status;

  const sql = 'SELECT * FROM tasks WHERE status = ?';
  const [rows] = await db.execute(sql, [status]);
  res.json(rows);
});


router.post('/tasks', async (req, res, next) => {
  const title = req.body.title
  const description = req.body.description

  const sql = `INSERT INTO tasks (title, description) VALUES (?, ?)`
  const [data] = await db.execute(sql, [title, description])

  // console.log(data)
  res.status(201).json({
    "id": data.insertId
  })
})

router.put('/tasks/:id', async (req, res, next) => {
  const id = req.params.id
  const title = req.body.title
  const description = req.body.description
  const status = req.body.status

  const sql = `
    UPDATE tasks SET
    title = ?,
    description = ?,
    status = ?
    WHERE id = ?
  `
  const [data] = await db.execute(sql, [title, description, id, status])
  //console.log(data)
  res.status(204).send()
})

router.patch('/tasks/:id', async (req, res, next) => {
  const id = req.params.id
  const title = req.body.title
  const description = req.body.description
  const status = req.body.status

const sql = `
  UPDATE tasks SET
  title = ?,
  description = ?,
  status = ?
  WHERE id = ?
`
const [data] = await db.execute(sql, [title, description, status, id])
//console.log(data)
res.status(204).send()
})

router.delete('/tasks/:id', async (req, res, next) => {
  const id = req.params.id
  const sql = `DELETE FROM tasks WHERE id = ?`
  const [data] = await db.execute(sql, [id])
  //console.log(data)
  res.status(204).send()
})

router.delete('/tasks', async (req, res, next) => {
  const sql = `DELETE FROM tasks`
  const [data] = await db.execute(sql)
  //console.log(data)
  res.status(204).send()
})
