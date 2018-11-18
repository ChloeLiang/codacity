import http from './httpService';
import { apiUrl } from '../config.json';

const apiEndpoint = apiUrl + '/decks';

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
    return http.patch(deckUrl(deck._id), body);
  }

  return http.post(apiEndpoint, deck);
}
