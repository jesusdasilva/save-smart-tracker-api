import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('API SaveSmartTracker funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
