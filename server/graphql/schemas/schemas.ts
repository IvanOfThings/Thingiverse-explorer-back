import { gql } from 'apollo-server-express';


const typeDefs = gql`

  type Query {
    """
    The query allows to obtain a list of things ordered depending on the requested parameter between some options (NEWEST, POPULAR, LATEST and FEATURED).
    """
    things(kind: String!): [Thing]!
    
    """
    The query gets a thing using its id
    """
    thing(id: Int!): Thing
  }



  type Thing implements Thinigable @key(fields: "id") {
    id: Int!
    name: String!
    thumbnail: String!
    url: String!
    creator: Creator!
    default_image: Image
    collect_count: Int
    like_count: Int
  }

  type simpleImage {
    id: ID
    name: String
    url: String
  }


  interface Thinigable {
    id: Int!
    name: String!
    thumbnail: String!
    url: String!
  }

  type listThingElement implements Thinigable @key(fields: "id") {
    id: Int!
    name: String!
    thumbnail: String!
    url: String!
    public_url: String
  }

extend type listThingElement @key(fields: "id") {
  thing: Thing @requires(fields: "id")
}

  type Image {
    id: Int
    name: String
    url: String
    sizes: [ImageSize]
  }

  
  type ImageSize {
    imageSize: String
    type: String
    url: String
  }
  
  type Creator {
    id: ID!
    name: String!
    first_name: String
    last_name: String
    url: String!
    public_url: String
    thumbnail: String    
  }

`;

export default typeDefs;