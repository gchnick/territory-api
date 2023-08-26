import express, { json } from 'express';
import { conductorRouter } from './conductors/routes/conductor';
import { corsMiddleware } from './shared/middlewares/cors';
import { territoryRouter } from './territories/routes/territory';

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');

app.use('/api/v1/territories', territoryRouter);
app.use('/api/v1/conductors', conductorRouter);

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
