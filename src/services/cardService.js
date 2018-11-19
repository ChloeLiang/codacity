import http from './httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/cards';

export function saveCard(card) {
  if (card._id) {
    const body = { ...card };
    delete body._id;
    return http.patch(`${apiEndpoint}/${card._id}`, body);
  }

  return http.post(`${apiUrl}/decks/${card._deck}/cards`, card);
}

export function getCardsInDeck(deckId) {
  return http.get(`${apiUrl}/decks/${deckId}/cards`);
}
