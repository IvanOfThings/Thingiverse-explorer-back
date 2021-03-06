import ThingsService from '../../services/things.service';
import { Request, Response } from 'express';
import querystring from "querystring";
import L from '../../../common/logger';

export class Controller {

  /**
  * A new Thing is obtained using the Bearer token given and the if for a Thing at thingiverse.
  * @param  {Request} req Request received, shoud have a code as query parameter
  * @param  {Response} res Response that will be sent back to the client.
  */
  getThing(req: Request, res: Response): void {
    try {
      const { access_token } = req.query;
      const { property } = req.params;
      L.debug('Getting Thing ');

      const thing: Promise<any> = ThingsService.getThingFromThingiverse(access_token, parseInt(req.params.id));

      thing.then(r => {
        if (r) {
          L.debug('Newest thing obtained: ', thing);
          res.json(r);
        } else res.json({ errors: [{ message: "Resource not found" }] }).status(404).end();
      }).catch((error) => {
        L.error('Error ocurred obtaining a thing : ', error);
        return res.json({ errors: [{ message: "Resource not found" }] }).status(404).end();
      });
    } catch (error) {
      L.error('Error ocurred obtaining a thing : ', error);
      return res.json({ errors: [{ message: error }] }).status(500).end();
    }
  }


  /**
  * USes the Bearer token given and the property wich by is wanted to sort the result and a list of things from thingiverse are retrieved.
  * @param  {Request} req Request received, shoud have a code as query parameter
  * @param  {Response} res Response that will be sent back to the client.
  */
  getList(req: Request, res: Response): void {
    try {
      const { access_token } = req.query;
      const { property } = req.params;
      L.debug('Getting List ');
      const thingsList: Promise<any> = ThingsService.getListFromThingiverse(access_token, property);
      thingsList.then(r => {
        let promiseList = r.map((item) => {
          return ThingsService.getThingFromThingiverse(access_token, item.id);
        })
        Promise.all(promiseList).then(r => {
          L.debug('All promises fhinished');
          res.json(r).status(200).end();
        }).catch((error) => {
          L.error('Something went wrong : ', error);
          return res.json({ errors: [{ message: "Resource not found" }] }).status(404).end();
        })
      }).catch((error) => {
        L.error('Error ocurred obtaining a thing : ', error);
        return res.status(400).json({ errors: [{ message: error }] }).end();
      });
    } catch (error) {
      L.error('Something went wrong: ', error);
      return res.json({ errors: [{ message: error }] }).status(500).end();
    }
  }


  /**
  * Exchanges the code given by the thingiverse server and the secret for a valid Token.
  * @param  {Request} req Request received, shoud have a code as query parameter
  * @param  {Response} res Response that will be sent back to the client.
  */
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
        return res.json({ access_token: access_token }).status(200);
      });
    }
  }
}
export default new Controller();
