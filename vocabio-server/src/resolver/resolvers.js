const accountModel = require("../model/account.model");
const { hash, verify } = require("argon2");
const { signToken } = require("../helper/jwt");
const { MutationReturnObject } = require("../helper/graphqlReturnobject");
const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      console.log(context.req);
      return "Hello world";
    },
    me: (parent, args, { req, res }) => {
      return req.user;
    },
  },

  Mutation: {
    register: async (parent, args, { req, res }) => {
      // console.log(args);
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
  },
};
module.exports = resolvers;
