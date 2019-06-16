import ThingsService from '../../services/things.service';
import { Request, Response } from 'express';
import querystring from "querystring";
import L from '../../../common/logger';
import { removeDirectivesFromDocument } from 'apollo-utilities';

export class Controller {

  getList(req: Request, res: Response): void {
    const { access_token } = req.query;
    const { property } = req.params;
    L.debug('Getting List ');
    const thingsList: Promise<any> = ThingsService.getListFromThingiverse(access_token, property);

    thingsList.then(r => {
      if (r) {
        let promiseList = r.map((item) => {
          return ThingsService.getThingFromThingiverse(access_token, item.id);
        })
        Promise.all(promiseList).then(r => {
          L.debug('All promises fhinished');
          res.json(r).status(200).end();
        }).catch((error) => {
          L.error('Something went wrong : ', error);
          return res.status(404).end();
        })
      } else res.status(404).end();
    }).catch((error) => {
      L.error('Error ocurred obtaining a thing : ', error);
      return res.status(404).end();
    });

  }

  getThing(req: Request, res: Response): void {
    const { access_token } = req.query;
    const { property } = req.params;
    L.debug('Getting Thing ');

    const thing: Promise<any> = ThingsService.getThingFromThingiverse(access_token, req.params.id);

    thing.then(r => {
      if (r) {
        L.debug('Newest thing obtained: ', thing);
        res.json(r);
      } else res.status(404).end();
    }).catch((error) => {
      L.error('Error ocurred obtaining a thing : ', error);
      return res.status(404).end();
    });

  }

  callback(req: Request, res: Response): void {
    const { code } = req.query;
    if (code) {
      const newest: Promise<any> = ThingsService.getToken(code);
      L.debug('Gettin Token ');
      newest.then<any, void>((data) => {
        let { access_token } = data;
        res.cookie("access_token", access_token);
        const queryString = querystring.stringify({
          access_token: access_token
        });
        //res.redirect(`http:localhost:3000?${queryString}`);
        return res.json({ access_token: access_token }).status(200);
      });
    }
  }
}
export default new Controller();
