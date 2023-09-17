import express, { json } from 'express';
import { availabilityRouter as conductorAvailabilityRouter } from './conductors/routes/availability';
import { conductorRouter } from './conductors/routes/conductor';
import { availabilityRouter as meetingPlaceAvailabilityRouter } from './meeting-place/routes/availability';
import { meetingPlaceRouter } from './meeting-place/routes/meeting-place';
import { programRouter } from './programs/routes/program';
import { periodRouter } from './registries/routes/period';
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
app.use('/api/v1/meeting-places', meetingPlaceRouter);
app.use('/api/v1/meeting-places', meetingPlaceAvailabilityRouter);
app.use('/api/v1/conductors', conductorRouter);
app.use('/api/v1/conductors', conductorAvailabilityRouter);
app.use('/api/v1/registries/periods', periodRouter);
app.use('/api/v1', registryRouter);
app.use('/api/v1/programs', programRouter);

app.all('*', invalidPathMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
