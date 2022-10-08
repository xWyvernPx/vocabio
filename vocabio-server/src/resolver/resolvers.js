const accountModel = require("../model/account.model");
const { hash, verify } = require("argon2");
const { signToken } = require("../helper/jwt");
const { MutationReturnObject } = require("../helper/graphqlReturnobject");
const deckModel = require("../model/deck.model");
const wordApiClient = require("../helper/wordapi.client");
const wordLibModel = require("../model/wordlib.model");
const { wordDictClient } = require("../helper/worddict.client");
const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      console.log(context.req);
      return "Hello world";
    },
    me: (parent, args, { req, res }) => {
      return req.user;
    },
    login: async (_, { username, password }, { req, res }) => {
      const AUTH_COOKIE_NAME = "sid";
      const account = await accountModel.findOne({ username: username });
      const isPasswordCorrect = await verify(account.password, password);
      if (isPasswordCorrect) {
        res.cookie(AUTH_COOKIE_NAME, signToken({ id: account._id }), {
          httpOnly: true,
        });
        return account;
      }
    },
    learningWords: async (_, args, { req, res }) => {
      if (req.user) {
        const userId = req?.user?._id;
        console.log(userId);
        let deck = await deckModel.findOne(
          { account: userId },
          {},
          {
            populate: ["account"],
          }
        );
        if (!deck)
          deck = await deckModel.create({
            account: userId,
            learned: [],
            learning: [],
          });
        deck?.learning.filter((wordInLearningDeck) => {});
        return deck?.learning;
      } else {
        return [];
      }
      // return {};
    },
    suggestLearningWords: async (_, args, { req, res }) => {
      const userId = req?.user?._id;
      const NUMBER_WORDS_SUGGEST = 10;
      let words = [];
      const isDeckContainTheWord = (deck, word) => {
        return (
          deck.learned.includes(word) ||
          deck.learning.some((deckItem) => deckItem.word === word)
        );
      };
      if (userId) {
        let deck = await deckModel.findOne({ account: userId });
        if (!deck)
          deck = await deckModel.create({
            account: userId,
            learned: [],
            learning: [],
          });
        while (words.length < NUMBER_WORDS_SUGGEST) {
          let NUMBER_WORDS_LEFT = NUMBER_WORDS_SUGGEST - words.length;
          const wordsSuggest = await wordLibModel.aggregate(
            [{ $sample: { size: NUMBER_WORDS_LEFT } }],
            {}
          );
          const wordsSuggestFilter = await Promise.all(
            wordsSuggest
              .filter((word) => !isDeckContainTheWord(deck, word))
              .map(({ name }) =>
                wordDictClient
                  .get(`/${name}`)
                  .then((result) => result.data[0])
                  .then((word) => ({
                    name: word?.word,
                    desc: word?.meanings[0]?.definitions[0]?.definition,
                    phonetics: word?.phonetics,
                  }))
              )
          );
          words = [
            ...words,
            ...wordsSuggestFilter.filter((word) => word.name != null),
          ];
        }
      }
      return words;
    },
  },

  Mutation: {
    addWordToLearningList: async (_, { word }, { req, res }) => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      const userId = req?.user?._id;
      if (userId) {
        let deck = await deckModel.findOne({ account: userId });
        if (!deck)
          deck = await deckModel.create({
            account: userId,
            learned: [],
            learning: [],
          });
        const isLeared =
          deck.learned.includes(word) ||
          deck.learning.some((wordInDeck) => wordInDeck.word === word);
        if (!isLeared) {
          deck.learning.push({
            word: word,
            reviewLevel: 1,
            nextReview: new Date(),
          });
          const updateResult = await deckModel.updateOne(
            { _id: deck._id },
            deck
          );
          if (updateResult.modifiedCount > 0) return true;
        } else return false;
      }
    },
    addWordKnownList: async (parent, { word }, { req, res }) => {
      const userId = req?.user?._id;
      if (userId) {
        let deck = await deckModel.findOne({ account: userId });
        if (!deck)
          deck = await deckModel.create({
            account: userId,
            learned: [],
            learning: [],
          });
        const isLeared = deck.learned.includes(word);
        if (!isLeared) deck.learned.push(word);
        const result = await deckModel.updateOne({ _id: deck._id }, deck);
        return true;
      }
    },
    register: async (parent, args, { req, res }) => {
      // console.log(args);
      const AUTH_COOKIE_NAME = "sid";
      const existedAccount = await accountModel.findOne({
        username: args.username,
      });
      const isExisted = existedAccount?._id != null;
      if (!isExisted) {
        const encryptedPassword = await hash(args.password);
        const account = await accountModel.create({
          ...args,
          password: encryptedPassword,
        });
        res.cookie(AUTH_COOKIE_NAME, signToken({ id: account._id }), {
          httpOnly: true,
        });
        return account;
      } else return existedAccount;
    },
  },
};
module.exports = resolvers;
