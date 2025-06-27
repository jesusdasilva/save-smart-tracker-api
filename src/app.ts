import express from 'express';
import session from 'express-session';
import passport from './config/passport';
import routes from './routes';
import authRoutes from './routes/auth.routes';
import cors from 'cors';
import { setupSwagger } from './swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());
setupSwagger(app);
app.use('/api', routes);

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true en producción con HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API SaveSmartTracker funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
