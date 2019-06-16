import { RESTDataSource } from 'apollo-datasource-rest';
import l from './../../common/logger';


class thingsDatasource extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = "http://localhost:3500/api/v1/things";
	}

	getToken(auth: string): string {
		let partsAuth: string[] = auth.split(" ");
		let token: string = partsAuth[partsAuth.length - 1];
		return token;
	}
	async getList(kind: string, authorization: string) {
		return this.get(`/list/${kind}?access_token=${this.getToken(authorization)}`);
	}
	async getThing(id: number, authorization: string) {
		return this.get(`/things/${id}?access_token=${this.getToken(authorization)}`);
	}
}

export default thingsDatasource;
