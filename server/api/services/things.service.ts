import Promise from 'bluebird';
import L from '../../common/logger'
import request from 'request';
import querystring from "querystring";

let id = 0;
interface Example {
  id: number,
  name: string
};

const examples: Example[] = [
  { id: id++, name: 'example 0' },
  { id: id++, name: 'example 1' }
];

export class ThingsService {
  all(): Promise<Example[]> {
    L.info(examples, 'fetch all examples');
    return Promise.resolve(examples);
  }

  byId(id: number): Promise<Example> {
    L.info(`fetch example with id ${id}`);
    return this.all().then(r => r[id])
  }

  getThingFromThingiverse(accessToken: string, id: number): Promise<any> {
    L.info(`fetch thing with id ${id}`);

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

  getToken(code: string): Promise<any> {
    const queryString = querystring.stringify({
      code: code,
      client_id: process.env.THINGIVERSE_CLIENT_ID,
      client_secret: process.env.THINGIVERSE_CLIENTE_SECRET,
      redirect_uri: "http://localhost:3000"
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

  getListFromThingiverse(accessToken: string, property: string): Promise<any> {
    L.info(`fetch thing list ${property}`);
    if (!accessToken) {
      return Promise.resolve(null);
    }
    if (["newest", "latest", "featured", "popular"].includes(property)) {
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
    }
  }
}

export default new ThingsService();