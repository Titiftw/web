/* eslint-env es6 */
import axios from 'axios';
import {isEmpty} from '~/lib/utils';
import settings from '~/config/general.config';

let baseUrl = '';
if (!process.browser) {
  baseUrl = settings.API_DOMAIN;
}

/**
 * Abstract function that make a GET request to the DBA API
 * @param {string} path
 * @returns {Promise}
 */
const makeGetRequest = (path, params = {}) => new Promise((resolve, reject) => {
  const config = {
    withCredentials: true,
    params,
  };
  axios.get(`${baseUrl}/api${path}`, config).then((result) => {
    resolve(result);
  }).catch((error) => {
    reject(error);
  });
});

/**
 * Abstract function that make a DELETE request to the DBA API
 * @param {string} path
 * @returns {Promise}
 */
const makeDeleteRequest = (path, params = {}) => new Promise((resolve, reject) => {
  const config = {
    withCredentials: true,
    params,
  };
  axios.delete(`${baseUrl}/api${path}`, config).then((result) => {
    resolve(result);
  }).catch((error) => {
    reject(error);
  });
});

/**
 * Abstract function that make a POST request to the DBA API
 * @param {string} path
 * @param {object} postData
 * @returns {Promise}
 */
const makePostRequest = (path, postData, config = {}) => new Promise((resolve, reject) => {
  const newConfig = {
    headers: {
      Accept: 'application/json',
    },
    withCredentials: true,
    ...config,
  };
  axios.post(`${baseUrl}/api${path}`, postData, newConfig).then((result) => {
    resolve(result);
  }).catch((error) => {
    reject(error);
  });
});

const api = {
  register(postData) {
    return makePostRequest('/register', postData);
  },
  login(postData) {
    return makePostRequest('/login', postData);
  },
  logout() {
    return makeGetRequest('/logout');
  },

  /**
     * Data
     */
  getGameData() {
    return makeGetRequest('/data/game');
  },
  getNews() {
    return makeGetRequest('/data/news');
  },
  getAppearanceData() {
    return makeGetRequest('/data/appearance');
  },
  getOnlinePlayers() {
    return makeGetRequest('/data/online/players');
  },
  getPlayerInfo(id) {
    return makeGetRequest(`/data/player/${id}`);
  },
  getRankingData(what, type, page, who) {
    const getData = {
      type,
      who,
      page,
    };
    return makeGetRequest(`/data/ranking/${what}`, getData);
  },

  /**
     * Account
     */
  getPlayer() {
    return makeGetRequest('/account/player');
  },
  getEvents() {
    return makeGetRequest('/account/events');
  },
  updateAppearance(data) {
    return makePostRequest('/account/appearance', data);
  },
  useTrainingPoint(what) {
    return makePostRequest(`/account/training/${what}`);
  },
  confirmAccount(id, token) {
    return makePostRequest(`/account/confirm/${id}/${token}`);
  },
  saveSettings(data) {
    return makePostRequest('/account/settings', data);
  },

  /**
     * Inventory
     */
  getInventoryObjects() {
    return makeGetRequest('/inventory/objects');
  },
  unequipObject(objectId) {
    return makePostRequest(`/inventory/unequip/${objectId}`);
  },
  equipObject(objectId) {
    return makePostRequest(`/inventory/equip/${objectId}`);
  },
  dropObject(objectId, nb) {
    return makePostRequest(`/inventory/drop/${objectId}`, {nb});
  },
  useObject(objectId, nb) {
    return makePostRequest(`/inventory/use/${objectId}`, {nb});
  },

  /**
     * Map
     */
  getMap() {
    return makeGetRequest('/map/');
  },
  getMiniMap() {
    return makeGetRequest('/map/mini');
  },
  enterBuilding(id) {
    return makeGetRequest(`/building/enter/${id}`);
  },
  deposit(buildingId, deposit) {
    return makePostRequest(`/building/bank/${buildingId}/deposit`, {deposit});
  },
  withdraw(buildingId, withdraw) {
    return makePostRequest(`/building/bank/${buildingId}/withdraw`, {withdraw});
  },
  teleport(buildingId, where) {
    return makePostRequest(`/building/teleport/${buildingId}`, {where});
  },
  buyObject(buildingId, objectId) {
    return makePostRequest(`/building/shop/${buildingId}/object/${objectId}`);
  },
  buySpell(buildingId, spellId) {
    return makePostRequest(`/building/shop/${buildingId}/spell/${spellId}`);
  },

  /**
     * Inbox
     */
  getInboxDirectory(directory = 'inbox') {
    return makeGetRequest(`/inbox/${directory}`);
  },
  postMessage(message) {
    return makePostRequest('/inbox/write', message);
  },
  replyMessage(id, message) {
    return makePostRequest(`/inbox/write/${id}`, message);
  },
  readMessage(id) {
    return makeGetRequest(`/inbox/read/${id}`);
  },
  deleteMessage(id) {
    return makeDeleteRequest(`/inbox/message/${id}`);
  },
  archiveMessage(id) {
    return makePostRequest(`/inbox/archive/${id}`);
  },
  clearMessages(type) {
    return makePostRequest(`/inbox/clear/${type}`);
  },

  /**
     * Action
     */
  convert() {
    return makePostRequest('/action/convert');
  },
  move(where) {
    return makePostRequest(`/action/move/${where}`);
  },
  spell(id, spellId, type) {
    let url = `/action/spell/${id}`;
    if (isEmpty(spellId)) {
      return makeGetRequest(url);
    }

    url = `${url}/${spellId}`;
    if (!isEmpty(type)) {
      url = `${url}/${type}`;
    }
    return makePostRequest(url);
  },
  attack(id, type) {
    let url = `/action/attack/${id}`;
    if (!isEmpty(type) && type !== 'attack') {
      url = `${url}/${type.replace('attack-', '')}`;
    }

    return makePostRequest(url);
  },
  pickup(id) {
    return makePostRequest(`/action/pickup/${id}`);
  },
  steal(id) {
    return makePostRequest(`/action/steal/${id}`);
  },
  analysis(id) {
    return makePostRequest(`/action/analysis/${id}`);
  },
  slap(id) {
    return makePostRequest(`/action/slap/${id}`);
  },
  heal(id) {
    return makePostRequest(`/action/heal/${id}`);
  },
  give(id, objectId, zenis) {
    if (isEmpty(objectId) && isEmpty(zenis)) {
      return makeGetRequest(`/action/give/${id}`);
    }

    if (isEmpty(objectId)) {
      return makePostRequest(`/action/give/${id}`, {zenis});
    }

    return makePostRequest(`/action/give/${id}/${objectId}`);
  },
  talkToNpc(id) {
    return makeGetRequest(`/action/talk/${id}`);
  },
  askQuest(id) {
    return makePostRequest(`/action/talk/${id}`);
  },

  /**
     * Guild
     */
  getGuilds() {
    return makeGetRequest('/guild/list');
  },
  joinGuild(id) {
    return makePostRequest(`/guild/join/${id}`);
  },
  leaveGuild() {
    return makePostRequest('/guild/leave');
  },
  createGuild(postData) {
    return makePostRequest('/guild/create', postData);
  },
  getGuildEvents() {
    return makeGetRequest('/guild/events');
  },
  getGuildMembers() {
    return makeGetRequest('/guild/members');
  },
  getGuildRequesters() {
    return makeGetRequest('/guild/members/requester');
  },
  adminRequest(id, decision) {
    return makePostRequest(`/guild/admin/requester/${id}`, {decision});
  },
  adminFired(id) {
    return makePostRequest(`/guild/admin/fired/${id}`);
  },
  adminSettings(postData) {
    return makePostRequest('/guild/admin/settings', postData);
  },
  adminRanks(postData) {
    return makePostRequest('/guild/admin/ranks', postData);
  },
  adminGeneral(id, postData) {
    return makePostRequest(`/guild/admin/ranks/${id}`, postData);
  },

  /**
     * Magic
     */
  getSpells() {
    return makeGetRequest('/magic/spells');
  },

  /**
     * Quests
     */
  getQuests() {
    return makeGetRequest('/quest/player');
  },
};

export default api;
