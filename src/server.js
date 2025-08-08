const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolioRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => res.send('WealthManager backend is running'));
app.use('/api/portfolio', portfolioRoutes);
app.use((req,res)=> res.status(404).json({ error: 'Not Found' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
