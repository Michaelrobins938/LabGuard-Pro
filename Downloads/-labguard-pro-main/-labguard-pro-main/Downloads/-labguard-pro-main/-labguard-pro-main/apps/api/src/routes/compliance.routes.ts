import { Router } from 'express'

const router = Router()

// TODO: Implement compliance routes
router.get('/templates', (req, res) => {
  res.json({ message: 'List templates - to be implemented' })
})

router.post('/reports', (req, res) => {
  res.json({ message: 'Generate reports - to be implemented' })
})

export default router 