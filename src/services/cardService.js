import http from './httpService';

const apiEndpoint = '/cards';

export function saveCard(card) {
  if (card._id) {
    const body = { ...card };
    delete body._id;
    return http.put(`${apiEndpoint}/${card._id}`, body);
  }

  return http.post(`/decks/${card._deck}/cards`, card);
}

export function getCards() {
  return http.get(apiEndpoint);
}

export function getCardsInDeck(deckId) {
  return http.get(`/decks/${deckId}/cards`);
}

export function getCard(cardId) {
  return http.get(`${apiEndpoint}/${cardId}`);
}

export function deleteCard(cardId) {
  return http.delete(`${apiEndpoint}/${cardId}`);
}
