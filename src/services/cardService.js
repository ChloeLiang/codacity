import http from './httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/cards';

export function saveCard(card) {
  if (card._id) {
    const body = { ...card };
    delete body._id;
    return http.put(`${apiEndpoint}/${card._id}`, body);
  }

  return http.post(`${apiUrl}/decks/${card._deck}/cards`, card);
}

export function getCardsInDeck(deckId) {
  return http.get(`${apiUrl}/decks/${deckId}/cards`);
}

export function getCard(cardId) {
  return http.get(`${apiEndpoint}/${cardId}`);
}

export function deleteCard(cardId) {
  return http.delete(`${apiEndpoint}/${cardId}`);
}
