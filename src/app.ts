import express, { json } from 'express';
import { conductorRouter } from './conductors/routes/conductor';
import { registryRouter } from './registries/routes/registry';
import { corsMiddleware } from './shared/middlewares/cors';
import { errorHandlerMiddleware } from './shared/middlewares/error-handler';
import { invalidPathMiddleware } from './shared/middlewares/invalid-path';
import { territoryRouter } from './territories/routes/territory';

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable('x-powered-by');

app.use('/api/v1/territories', territoryRouter);
app.use('/api/v1/conductors', conductorRouter);
app.use('/api/v1/territories', registryRouter);

app.all('*', invalidPathMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
