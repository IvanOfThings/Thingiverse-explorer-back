import Promise from 'bluebird';
import L from '../../common/logger'
import request from 'request';
import querystring from "querystring";

export class ThingsService {

  /**
  * Exchanges the code given by the thingiverse server and the secret for a valid Token.
  * @param  {string} code code given by thingiverse server in the second phase of negotiation
  * @return  {Promise<any>} Promise with the server response.
  */
  getToken(code: string): Promise<any> {
    const queryString = querystring.stringify({
      code: code,
      client_id: process.env.THINGIVERSE_CLIENT_ID,
      client_secret: process.env.THINGIVERSE_CLIENTE_SECRET
    });

    let tokenUrl = `https://www.thingiverse.com/login/oauth/access_token?${queryString}`;

    return new Promise<any>((resolve, reject) => {
      request.post((tokenUrl), function (error, response, body) {
        if (error || response.statusCode !== 200) {
          L.error(`Error getting data ${error}`);
          L.error(` Status code ${response.statusCode}`);
          reject(error);
        } else {
          let bodyParams = querystring.parse(body);
          let access_token: string = bodyParams.access_token[0];
          resolve({ access_token: bodyParams.access_token });
        }
      });
    });
  }




  /**
  * A new Thing is obtained using the Bearer token given and the if for a Thing at thingiverse.
  * @param  {string} accessToken Bearer Token provided
  * @param  {string} id for the Thing that is wanted to retrive from thingiverse backend
  * @return  {Promise<any>} Promise with the server response.
  */
  getThingFromThingiverse(accessToken: string, id: number): Promise<any> {
    L.trace(`fetch thing with id ${id}`);

    const options = {
      url: `https://api.thingiverse.com/things/${id}/`,
      headers: { Authorization: `Bearer ${accessToken}` },
      json: true
    };

    return new Promise((resolve, reject) => {
      request.get(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
          L.error(`Error getting data ${error}`);
          L.error(` Status code ${response.statusCode}`);
          reject(error);
        }
        resolve(body);
      });
    });
  }

  /**
  * USes the Bearer token given and the property wich by is wanted to sort the result and a list of things from thingiverse are retrieved.
  * @param  {string} accessToken Bearer Token provided
  * @param  {string} property Parameter ask the server in a particular order for the info, it could be one of the following values: ["newest", "popular" or "featured"]
  * @return  {Promise<any>} Promise with the server response.
  */
  getListFromThingiverse(accessToken: string, property: string): Promise<any> {
    L.trace(`fetch thing list ${property}`);
    if (["newest", "featured", "popular"].includes(property)) {
      const options = {
        url: `https://api.thingiverse.com/${property}/`,
        headers: { Authorization: `Bearer ${accessToken}` },
        json: true
      };

      return new Promise((resolve, reject) => {
        request.get(options, function (error, response, body) {
          if (error || response.statusCode !== 200) {
            L.error(`Error getting data ${error}`);
            L.error(` Status code ${response.statusCode}`);
            reject(error);
          }
          resolve(body);
        });
      });
    } else {
      return new Promise(((resolve, reject) => reject("The value for parameter property is not allowed, chose one of: 'newest', 'featured' or 'popular'")));
    }
  }
}

export default new ThingsService();