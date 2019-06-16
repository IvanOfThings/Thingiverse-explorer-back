
import request from 'request';
import L from '../../common/logger'

const baseURL = 'http://localhost:3500/api/v1/'
const resolvers = {
	Query: {
		things: async (_source, { kind }, context) => {
			const { dataSources, Authorization } = context;
			L.debug("In the Query linst of things");
			L.debug(Authorization);
			return dataSources.thingsDatasource.getList(kind, Authorization);
		},
		thing: async (_source, { id }, context) => {
			const { dataSources, Authorization } = context;
			L.debug("In the Query thing");
			L.debug(Authorization);
			return dataSources.thingsDatasource.getThing(id, Authorization);
		},
	},
	Thing: {
		thing: async (_source, { id }, context) => {
			const { dataSources, Authorization } = context;
			L.debug("In the Query thing");
			L.debug(Authorization);
			return dataSources.thingsDatasource.getThing(id, Authorization);
		},
	}
};

export default resolvers;