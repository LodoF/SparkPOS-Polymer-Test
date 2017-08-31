// let PouchDB = require('pouchdb-core').plugin(require('pouchdb-adapter-websql'));
// let PouchDB = require('pouchdb');

/* eslint-disable no-undef,  no-unused-vars */
module.exports = class _Pouchdb {

  /**
   * create Database
   * @param {String} name
   * @param {String} adapter
   */
  createDatabase (name) {
    let db = new PouchDB(name, {adapter: 'websql'});
    return db;
  }

  /**
   * destroy Database
   * @param {Database} db
   */
  destroyDatabase (db) {
    let promise = new Promise((resolve, reject) => {
      db.destroy((err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
    return promise;
  }

  /**
   * close db
   * @param {*} db
   */
  close (db) {
    let promise = new Promise((resolve, reject) => {
      db.close(() => {
        resolve(response);
      });
    });
    return promise;
  }

  /**
   * Create a new document
   * @param {*} db
   * @param {JSON} doc
   */
  put (db, doc) {
    let promise = new Promise((resolve, reject) => {
      db.put(doc, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
    return promise;
  }

  /**
   * get document
   * @param {*} db
   * @param {String} id
   */
  get (db, id) {
    let promise = new Promise((resolve, reject) => {
      db.get(id, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
    return promise;
  }

  /**
   * bulk Get Document
   * @param {*} db
   * @param {Array<JSON>} docs
   */
  bulkGet (db, docs) {
    let promise = new Promise((resolve, reject) => {
      db.bulkGet({docs: docs}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
    return promise;
  }

  /**
   * update document
   * @param {*} db
   * @param {JOSN} doc
   */
  updateDoc (db, doc) {
    let promise = new Promise((resolve, reject) => {
      db.get(doc._id, (err, _doc) => {
        if (err) {
          reject(err);
        } else {
          for (let v in doc) {
            if (v !== '_id') {
              if (typeof (doc[v]) === 'object') {
                _doc[v] = Object.assign(_doc[v], doc[v]);
              } else {
                _doc[v] = doc[v];
              }
            }
          }
          db.put(_doc, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response);
            }
          });
        }
      });
    });
    return promise;
  }

  /**
   * remove document
   * @param {*} db
   * @param {String} id
   */
  remove (db, id) {
    let promise = new Promise((resolve, reject) => {
      db.get(id, (err, _doc) => {
        if (err) {
          reject(err);
        } else {
          db.remove(_doc, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response);
            }
          });
        }
      });
    });
    return promise;
  }

  /**
   *  bulk Create Document
   * @param {*} db
   * @param {Array<JSON>} docs
   */
  bulkDocs (db, docs) {
    let promise = new Promise((resolve, reject) => {
      db.bulkDocs(docs, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
    return promise;
  }

  /**
   * get All Document
   * @param {*} db
   * @param {JSON} options
   */
  allDocs (db, options) {
    let promise = new Promise((resolve, reject) => {
      db.allDocs(options, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
    return promise;
  }

  /**
   * listen to database changes
   * @param {*} db
   * @param {JSON} options
   * @param {FUNCTION} fun
   */
  changes (db, options, fun) {
    let changes = db.changes(options).on('change', (change) => {
      fun(changes, change);
    }).on('complete', (info) => {
      fun(changes, info);
    }).on('error', (err) => {
      fun(changes, err);
    });
  }

  /**
   * cancel database changes
   * @param {*} changes
   */
  cancelChanges (changes) {
    changes.cancel();
  }

  /**
   * replicate a database
   * @param {*} src
   * @param {*} target
   * @param {JSON} options
   * @param {FUCTION} fun
   */
  replicate (src, target, options, fun) {
    PouchDB.replicate(src, target, options)
      .on('change', (info) => {
      // handle change
        fun('change', info);
      }).on('paused', (err) => {
      // replication paused (e.g. replication up to date, user went offline)
        fun('paused', err);
      }).on('active', () => {
      // replicate resumed (e.g. new changes replicating, user went back online)
        fun('active');
      }).on('denied', (err) => {
      // a document failed to replicate (e.g. due to permissions)
        fun('denied', err);
      }).on('complete', (info) => {
      // handle complete
        fun('denied', info);
      }).on('error', (err) => {
      // handle error
        fun('denied', err);
      });
  }

  /**
   * sync
   * @param {*} src
   * @param {*} target
   * @param {JSON} options
   * @param {*} fun
   */
  sync (src, target, options, fun) {
    PouchDB.sync(src, target, options)
      .on('change', (info) => {
      // handle change
        fun('change', info);
      }).on('paused', (err) => {
      // replication paused (e.g. replication up to date, user went offline)
        fun('paused', err);
      }).on('active', () => {
      // replicate resumed (e.g. new changes replicating, user went back online)
        fun('active');
      }).on('denied', (err) => {
      // a document failed to replicate (e.g. due to permissions)
        fun('denied', err);
      }).on('complete', (info) => {
      // handle complete
        fun('denied', info);
      }).on('error', (err) => {
      // handle error
        fun('denied', err);
      });
  }

  /**
   * save an attachment
   * @param {*} db
   * @param {JSON} doc
   */
  putAttachment (db, doc) {
    let promise = new Promise((resolve, reject) => {
      db.putAttachment(doc.id, doc.name, doc.attachment, doc.type, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    return promise;
  }

  /**
   * View cleanup
   * @param {*} db
   */
  viewCleanup (db) {
    let promise = new Promise((resolve, reject) => {
      db.viewCleanup((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return promise;
  }

  /**
   * Compact the database
   * @param {*} db
   */
  compact (db) {
    let promise = new Promise((resolve, reject) => {
      db.compact((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return promise;
  }

  /**
   * create index
   * @param {*} db
   * @param {Array} fields
   */
  createIndex (db, fields) {
    let promise = new Promise((resolve, reject) => {
      db.createIndex({
        index: {
          fields: fields
        }
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return promise;
  }

  /**
   * find index
   * @param {*} db
   * @param {JSON} obj
   */
  find (db, obj) {
    let promise = new Promise((resolve, reject) => {
      db.find(obj, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return promise;
  }
}