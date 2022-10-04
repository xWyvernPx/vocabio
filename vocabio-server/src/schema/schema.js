const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Account {
    _id: String
    username: String
    password: String
    avatar: String
    email: String
  }
  type Query {
    accounts: [Account]
    hello: String
  }
`;
module.exports = typeDefs;
