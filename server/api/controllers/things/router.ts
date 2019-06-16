import express from 'express';
import controller from './controller';
export default express.Router()
    .get('/callback', controller.callback)
    .get('/things/:id', controller.getThing)
    .get('/list/:property', controller.getList);