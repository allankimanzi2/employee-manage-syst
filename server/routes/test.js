import express from 'express';
const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: '🎯 Server and MongoDB are running!' });
});

export default router;
