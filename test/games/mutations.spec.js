const { mutate } = require('../server.test'),
  { createGame, playTurn } = require('./graphql'),
  { mockCreateGame, mockPlayTurn, mockCreateGameRespondWithError } = require('../testUtils/mocks'),
  { getGameExample, getGameWithTurnsExample, databaseError } = require('../testUtils/schemas/gamesSchemas');

describe('games', () => {
  describe('mutations', () => {
    describe('createGame', () => {
      it('Service respond with 200, should create game successfuly', () => {
        const playerName = 'Paul';
        const expectedGame = getGameExample({ playerName });
        mockCreateGame(playerName, expectedGame);
        return mutate(createGame({ game: { playerName } })).then(res => {
          const {
            game: { id, turns, player, monster, monsterEffect, winner }
          } = expectedGame;
          expect(res.data.createGame).toMatchObject({
            game: {
              id,
              turns,
              player,
              monster,
              monsterEffect,
              winner
            }
          });
        });
      });

      it('Service respond with 503, should failed', () => {
        const playerName = 'Fred';
        mockCreateGameRespondWithError(playerName, databaseError);
        return mutate(createGame({ game: { playerName } })).then(res => {
          expect(res.data).toBe(null);
          expect(res.errors[0].message).toBe(databaseError.message);
          expect(res.errors[0].extensions.code).toBe(503);
        });
      });
    });

    it('should play turn successfuly', () => {
      const gameId = 'abc123';
      const expectedGame = getGameWithTurnsExample(gameId);
      mockPlayTurn(gameId, expectedGame);
      return mutate(playTurn(gameId, { turn: { cardPlayed: { value: 9, type: 'damage' } } })).then(res => {
        const {
          game: { id, turns, player, monster, monsterEffect, winner }
        } = expectedGame;
        expect(res.data.playTurn).toMatchObject({
          game: {
            id,
            turns,
            player,
            monster,
            monsterEffect,
            winner
          }
        });
      });
    });
  });
});
