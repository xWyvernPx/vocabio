const accountModel = require("../model/account.model");
const { hash, verify } = require("argon2");
const { signToken } = require("../helper/jwt");
const { MutationReturnObject } = require("../helper/graphqlReturnobject");
const deckModel = require("../model/deck.model");
const wordApiClient = require("../helper/wordapi.client");
const wordLibModel = require("../model/wordlib.model");
const { wordDictClient } = require("../helper/worddict.client");
const wordindeckModel = require("../model/wordindeck.model");
const reviewLevelModel = require("../model/reviewLevel.model");
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
          secure: true,
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
            populate: ["account", "learning"],
          }
        );
        if (!deck)
          deck = await deckModel.create({
            account: userId,
            learned: [],
            learning: [],
          });
        return deck?.learning.filter((wordInLearningDeck) => {
          const nextReview = wordInLearningDeck.nextReview;
          const now = new Date();
          return nextReview <= now;
        });
        //  deck?.learning;
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
    reviewLevels: async () => {
      return await reviewLevelModel.find();
    },
    getDetailWord: async (_, { word }, { req, res }) => {
      const result = await wordDictClient
        .get(`/${word}`)
        .then((result) => result.data[0]);
      console.log(result);
      return result;
    },
    getKnownWords: async (_, args, { req, res }) => {
      if (req.user) {
        const userId = req?.user?._id;
        console.log(userId);
        let deck = await deckModel.findOne(
          { account: userId },
          {},
          {
            populate: ["account", "learning"],
          }
        );
        if (!deck)
          deck = await deckModel.create({
            account: userId,
            learned: [],
            learning: [],
          });
        return deck?.learned;
        //  deck?.learning;
      } else {
        return [];
      }
    },
    allLearningWords: async (_, args, { req, res }) => {
      if (req.user) {
        const userId = req?.user?._id;
        console.log(userId);
        let deck = await deckModel.findOne(
          { account: userId },
          {},
          {
            populate: ["account", "learning"],
          }
        );
        if (!deck)
          deck = await deckModel.create({
            account: userId,
            learned: [],
            learning: [],
          });
        return deck?.learning;
        //  deck?.learning;
      } else {
        return [];
      }
    },
    logout: (_, args, { req, res }) => {
      if (res) {
        const AUTH_COOKIE_NAME = "sid";
        res.cookie(AUTH_COOKIE_NAME, "", {
          httpOnly: true,
          secure: true,
        });
        return true;
      }

      return false;
    },
  },

  Mutation: {
    reviewWordUpLevel: async (_, { word }, { req, res }) => {
      const userId = req?.user?._id;
      if (userId) {
        let deck = await deckModel
          .findOne({ account: userId })
          .populate(["learning"]);
        if (!deck)
          deck = await deckModel.create({
            account: userId,
            learned: [],
            learning: [],
          });

        const isInDeck = deck.learning.some(
          (deckItem) => deckItem.word === word
        );

        if (!isInDeck) return false;

        const wordInDeckId = deck.learning.find(
          (deckItem) => deckItem.word === word
        )._id;
        const MAX_REVIEW_LEVEL = 8;
        const wordInDeck = await wordindeckModel.findOne({ _id: wordInDeckId });
        const currentLevel = wordInDeck.reviewLevel;
        if (currentLevel >= MAX_REVIEW_LEVEL) {
          await deckModel.updateOne(
            { account: userId },
            { $pull: { learning: wordInDeckId }, $push: { learned: word } }
          );
          return true;
        }
        const nextLevel = await reviewLevelModel.findOne({
          level: currentLevel + 1,
        });
        wordInDeck.reviewLevel = nextLevel.level;
        const nextReviewDate = new Date();
        nextReviewDate.setDate(
          new Date().getDate() + nextLevel.reviewAfterPeriod
        );
        console.log(nextReviewDate);
        wordInDeck.nextReview = nextReviewDate;
        console.log(wordInDeck);
        await wordInDeck.save();
        return true;
      }
      return false;
    },
    reviewWordKeepLevel: async (_, { word }, { req, res }) => {
      const userId = req?.user?._id;
      if (userId) {
        let deck = await deckModel
          .findOne({ account: userId })
          .populate(["learning"]);
        if (!deck)
          deck = await deckModel.create({
            account: userId,
            learned: [],
            learning: [],
          });

        const isInDeck = deck.learning.some(
          (deckItem) => deckItem.word === word
        );

        if (!isInDeck) return false;

        const wordInDeckId = deck.learning.find(
          (deckItem) => deckItem.word === word
        )._id;

        const wordInDeck = await wordindeckModel.findOne({ _id: wordInDeckId });

        const currenLevel = await reviewLevelModel.findOne({
          level: wordInDeck.reviewLevel,
        });
        const nextReviewDate = new Date();
        nextReviewDate.setDate(
          new Date().getDate() + currenLevel.reviewAfterPeriod
        );
        console.log(nextReviewDate);
        wordInDeck.nextReview = nextReviewDate;
        console.log(wordInDeck);
        await wordInDeck.save();
        return true;
      }
      return false;
    },
    addWordToLearningList: async (_, { word }, { req, res }) => {
      const userId = req?.user?._id;
      if (userId) {
        let deck = await deckModel
          .findOne({ account: userId })
          .populate(["account", "learning"]);
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
          //   deck.learning.push({
          //     word: word,
          //     reviewLevel: 1,
          //     nextReview: new Date(),
          //   });
          //   const updateResult = await deckModel.updateOne(
          //     { _id: deck._id },
          //     deck
          //   );
          //   if (updateResult.modifiedCount > 0) return true;
          const newWord = await wordindeckModel.create({
            word: word,
            reviewLevel: 1,
            nextReview: new Date(),
          });
          const result = await deckModel.updateOne(
            { account: userId },
            { $push: { learning: newWord._id } }
          );
          if (result.modifiedCount > 0) return true;
        } else {
          return false;
        }
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
          secure: true,
        });
        return account;
      } else return existedAccount;
    },
  },
};
module.exports = resolvers;
