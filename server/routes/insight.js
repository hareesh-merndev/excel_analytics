// routes/insight.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty data sent for AI Insights.' });
    }

    const totalRows = data.length;
    const sampleKeys = Object.keys(data[0] || {});
    const numericFields = sampleKeys.filter(key =>
      data.every(row => !isNaN(Number(row[key])) && row[key] !== '')
    );

    const averages = numericFields.map(field => {
      const total = data.reduce((sum, row) => sum + Number(row[field] || 0), 0);
      const avg = (total / totalRows).toFixed(2);
      return `${field}: avg = ${avg}`;
    });

    const insightMessage = `
✅ AI Summary:
- Rows: ${totalRows}
- Fields: ${sampleKeys.join(', ')}

📊 Averages:
${averages.join('\n')}
    `;

    res.json({ message: insightMessage });
  } catch (error) {
    console.error('AI insight error:', error);
    res.status(500).json({ message: 'Server error while generating AI insights.' });
  }
});

export default router;
