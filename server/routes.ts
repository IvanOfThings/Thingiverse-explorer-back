import { Application } from 'express';
import thingiverseRouter from './api/controllers/things/router'
export default function routes(app: Application): void {
  app.use('/api/v1/things', thingiverseRouter);
};