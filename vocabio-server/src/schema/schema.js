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
  type WordDefinition {
    definition: String
    example: String
    synonyms: [String]
  }
  type WordMeaning {
    partOfSpeech: String
    definitions: [WordDefinition]
  }
  type WordInDetail {
    word: String
    phonetic: String
    phonetics: [WordPhonetic]
    origin: String
    meanings: [WordMeaning]
  }
  type WordPhonetic {
    text: String
    audio: String
  }
  type Word {
    _id: ID
    name: String
    desc: String
    phonetics: [WordPhonetic]
    lexicalCategory: String
    pronunciation: WordPronunciation
  }
  type WordInDeck {
    word: ID
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
  type ReviewLevel {
    level: Int
    reviewAfterPeriod: Int
  }
  type Query {
    accounts: [Account]
    hello: String
    me: Account
    login(username: String, password: String): Account
    learningWords: [WordInDeck]
    allLearningWords: [WordInDeck]
    suggestLearningWords: [Word]
    getDetailWord(word: String): WordInDetail
    reviewLevels: [ReviewLevel]
    getKnownWords: [String]
    logout: Boolean
  }
  type Mutation {
    addWordKnownList(word: String): Boolean
    addWordToLearningList(word: String): Date
    reviewWordUpLevel(word: String): Boolean
    reviewWordKeepLevel(word: String): Boolean
    TODO: String

    register(
      username: String
      password: String
      email: String
      avatar: String
    ): Account
  }
`;
module.exports = typeDefs;
