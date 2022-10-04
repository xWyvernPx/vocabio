const app = require("./src/app");
const {} = require("apollo-server-express");
const { createServer } = require("http");
const { ApolloServer } = require("apollo-server-express");
const resolvers = require("./src/resolver/resolvers");
const typeDefs = require("./src/schema/schema");
const mongoose = require("mongoose");

const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
(async function startServer() {
  const httpServer = createServer(app);
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: async (expressContext) => {
      return expressContext;
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  mongoose
    .connect(
      "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0",
      { dbName: "vocabio" }
    )
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
