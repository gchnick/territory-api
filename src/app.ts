import express, { json } from 'express';
import { corsMiddleware } from './middlewares/cors';
import { territoryRouter } from './territories/routes/territory';

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');

app.use('/api/v1/territories', territoryRouter);

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
