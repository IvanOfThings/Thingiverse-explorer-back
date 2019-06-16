import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router'
import thingiverseRouter from './api/controllers/things/router'
export default function routes(app: Application): void {
  app.use('/api/v1/things', thingiverseRouter);
  app.use('/api/v1/examples', examplesRouter);
};