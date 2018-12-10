import http from './httpService';

const apiEndpoint = '/decks';

function deckUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getDecks() {
  return http.get(apiEndpoint);
}

export function saveDeck(deck) {
  if (deck._id) {
    const body = { ...deck };
    delete body._id;
    return http.put(deckUrl(deck._id), body);
  }

  return http.post(apiEndpoint, deck);
}

export function createDeck(deck) {
  return http.post(apiEndpoint, deck);
}

export function deleteDeck(deckId) {
  return http.delete(`${apiEndpoint}/${deckId}`);
}
