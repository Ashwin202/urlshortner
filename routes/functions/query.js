module.exports = {
  getURLTable() {
    return `SELECT * FROM urltable`;
  },
  fetchLongURL(short) {
    return `SELECT longurl FROM urltable WHERE  shorturl="${short}";`;
  },
  hitsAddup(short) {
    return `UPDATE urltable SET hits=hits+1 WHERE  shorturl="${short}";`;
  },
  getSMSTable() {
    return `SELECT * FROM sms`;
  },
  getSMSbyId(id) {
    return `select template from sms where id="${id}";`;
  },
};
