const { Axios } = require("axios");

const wordDictClient = new Axios({
  baseURL: `https://api.dictionaryapi.dev/api/v2/entries/en`,
  headers: {
    "Content-Type": "application/json",
  },
  transformResponse: (data) => JSON.parse(data),
});
module.exports = { wordDictClient };
