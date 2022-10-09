const { Axios } = require("axios");

const wordApiClient = new Axios({
  baseURL: "https://wordsapiv1.p.rapidapi.com/words",
  headers: {
    "X-RapidAPI-Key": "9eb52d7fecmshbc3f88a7b8f18e1p1cc529jsne4185eb188b8",
    "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
    "Content-Type": "application/json",
  },
  transformResponse: (data) => JSON.parse(data),
});

module.exports = wordApiClient;
