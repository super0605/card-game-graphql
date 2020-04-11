const nock = require('nock');

const { getGameExample } = require('./schemas/gamesSchemas');
const {
  common: { gameApiBaseUrl }
} = require('../../config');

exports.mockGetGame = gameId =>
  nock(`${gameApiBaseUrl}`)
    .get(`/games/${gameId}`)
    .reply(200, getGameExample({ gameId }));

exports.mockCreateGame = playerName =>
  nock(`${gameApiBaseUrl}`)
    .post('/games', { game: { playerName } })
    .reply(201, getGameExample({ playerName }));