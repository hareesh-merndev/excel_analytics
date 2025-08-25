import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  const { instruction, data } = req.body;

  if (!instruction || !Array.isArray(data)) {
    return res.status(400).json({ message: 'Invalid instruction or data' });
  }

  let updatedData = [...data];

  try {
    // Simple logic examples based on keywords in instruction
    if (instruction.toLowerCase().includes('rename')) {
      const [_, from, to] = instruction.match(/rename\s+(\w+)\s+to\s+(\w+)/i) || [];
      if (from && to) {
        updatedData = updatedData.map(row => {
          const newRow = { ...row };
          for (const key in newRow) {
            if (String(newRow[key]).toLowerCase() === from.toLowerCase()) {
              newRow[key] = to;
            }
          }
          return newRow;
        });
      }
    }

    if (instruction.toLowerCase().includes('add column')) {
      const [_, column, defaultValue = ''] = instruction.match(/add column (\w+)(?: with value (\w+))?/i) || [];
      if (column) {
        updatedData = updatedData.map(row => ({ ...row, [column]: defaultValue }));
      }
    }

    if (instruction.toLowerCase().includes('add row')) {
      const newRow = {};
      const pairs = instruction.match(/(\w+)=([\w\s]+)/g) || [];
      pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        newRow[key.trim()] = value.trim();
      });
      updatedData.push(newRow);
    }

    if (instruction.toLowerCase().includes('update')) {
      const match = instruction.match(/update row (\d+) column (\w+) to (.+)/i);
      if (match) {
        const [, rowIndex, col, value] = match;
        if (updatedData[rowIndex - 1]) {
          updatedData[rowIndex - 1][col] = value;
        }
      }
    }

    res.json(updatedData);
  } catch (err) {
    console.error('Simulated edit error:', err);
    res.status(500).json({ message: 'Failed to simulate AI edit' });
  }
});

export default router;
