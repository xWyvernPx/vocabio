const { gql } = require("apollo-server-express");
const typeDefs = gql`
  type Account {
    _id: String
    username: String
    password: String
    avatar: String
    email: String
  }
  type WordPronunciation {
    read: String
    file: String
  }
  type Word {
    _id: ID
    name: String
    desc: String
    lexicalCategory: String
    pronunciation: WordPronunciation
  }
  type WordInDeck {
    word: [ID]
    wordInfomation: Word
    reviewLevel: Int
    nextReview: Date
  }
  type Deck {
    account: String
    accountbelonged: Account
    learned: [ID]
    learning: [WordInDeck]
  }
  type Query {
    accounts: [Account]
    hello: String
    me: Account
  }
  type Mutation {
    register(
      username: String
      password: String
      email: String
      avatar: String
    ): Account
    login(username: String, password: String): Account
  }
`;
module.exports = typeDefs;
