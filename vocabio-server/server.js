const app = require("./src/app");
const {} = require("apollo-server-express");
const { createServer } = require("http");
const { DateTypeDefinition, DateResolver } = require("graphql-scalars");

const { ApolloServer } = require("apollo-server-express");
const resolvers = require("./src/resolver/resolvers");
const typeDefs = require("./src/schema/schema");
const mongoose = require("mongoose");
const { verifyToken } = require("./src/helper/jwt");
const { decode, sign, verify } = require("jsonwebtoken");
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const accountModel = require("./src/model/account.model");

(async function startServer() {
  const httpServer = createServer(app);
  const apolloServer = new ApolloServer({
    schema: makeExecutableSchema({
      typeDefs: [DateTypeDefinition, typeDefs],
      resolvers: [resolvers],
    }),
    // typeDefs,

    // resolvers,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: async (expressContext) => {
      const AUTH_COOKIE_NAME = "sid";
      const cookies = expressContext.req.headers.cookie;
      const authCookie = cookies
        ? cookies.split(";").find((cookie) => cookie.includes(AUTH_COOKIE_NAME))
        : null;
      if (authCookie) {
        const cookieToken = authCookie.split("=")[1];
        // console.log(cookieToken);
        if (cookieToken) {
          const parsedToken = verifyToken(cookieToken);
          //prototype token { id : string,iat : number }
          const account = await accountModel.findOne({ _id: parsedToken?.id });
          expressContext.req.user = account;
        }
      }
      return expressContext;
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: "http://localhost:1212",
    },
  });
  mongoose
    .connect("mongodb://127.0.0.1:27017/", { dbName: "vocabio" })
    .then(() => {
      console.log("mongodb connection established");
      httpServer.listen(5551, () => {
        console.log(
          "app is listening at http://localhost:5551" + apolloServer.graphqlPath
        );
      });
    })
    .catch((err) => console.log("mongodb connection error: " + err.message));
})();
