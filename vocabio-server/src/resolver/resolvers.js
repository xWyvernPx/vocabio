const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      console.log(context.req);
      return "Hello world";
    },
  },
  // accounts: (parent, args, context) => {
  //   console.log(context);
  //   return
  // },
};
module.exports = resolvers;
