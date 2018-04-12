/* global fetch */
const baseUrl = 'https://zh.wikipedia.org/w/api.php?action=query&origin=*&list=search&utf8&format=json';
const wikiDetailUrl = 'https://zh.wikipedia.org/?curid=';

function getLocationDetail(title) {
  return fetch(`${baseUrl}&srsearch=${title}`);
}
