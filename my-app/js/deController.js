/* eslint-disable no-trailing-spaces, no-undef */

const Config = require('./config.js');
const DataEngine = require('./dataEngine.js');
const _Pouchdb = require('./_pouchdb.js');
const async = require('async');

module.exports = class DeController extends DataEngine {
  constructor (username, password) {
    let config = new Config();
    super(config.deUrl, config.deProt, username, password);
    this._pouchdb = new _Pouchdb();
    this.config = config;
  }

  /**
   * 根据商家id 获取商家信息
   * @param {JSON} id 
   */
  select_local_business ({id}) {
    let pouchdb = this._pouchdb;
    let db = pouchdb.createDatabase(this.config.dbname.business);

    let promise = new Promise((resolve, reject) => {
      pouchdb.get(db, id).then((result) => {
        resolve(result);
      }, (err) => {
        reject(err);
      });
    });
    return promise;
  }

  /**
   * 根据商家id 插入商家信息
   * @param {JSON} id 
   */
  insert_local_business ({id}) {
    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.queryBusinessOrStore({id})
        .then((result) => {
          try {
            result = JSON.parse(result);
            let business = {};
            business._id = result.nid;
            business.title = result.title;
            business.category_id = result.field_category.id;
            business.status = result.status;
            business.is_new = result.is_new;
            business.logo = null;
            business.username = that.username;
            business.password = that.password;
            business.store_list = {};
            if (result.hasOwnProperty('field_business_logo')) {
              if (result.field_business_logo.hasOwnProperty('file')) {
                let id = result.field_business_logo.file.id;
                that.querFile({id})
                  .then((result) => {
                    result = JSON.parse(result);
                    business.logo = result.url;
                    that.insert_business({doc: business})
                      .then((result) => {
                        resolve(result);
                      }, (err) => {
                        reject(err);
                      });             
                  }, (err) => {
                    that.insert_business({doc: business})
                      .then((result) => {
                        resolve(result);
                      }, (err) => {
                        reject(err);
                      });
                  });
              } else {
                that.insert_business({doc: business})
                  .then((result) => {
                    resolve(result);
                  }, (err) => {
                    reject(err);
                  });
              }
            }
          } catch (error) {
            console.log(error);
            reject(error);
          }
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   *  修改商家信息
   * @param {JSON} doc 
   */
  insert_business ({doc}) {
    let that = this;
    let pouchdb = that._pouchdb;
    let db = pouchdb.createDatabase(that.config.dbname.business);

    let promise = new Promise((resolve, reject) => {
      pouchdb.destroyDatabase(db)
        .then((result) => {
          let db = pouchdb.createDatabase(that.config.dbname.business);
          pouchdb.put(db, doc)
            .then((result) => {
              resolve(result);
            }, (err) => {
              reject(err);
            });
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 修改商家门店列表
   * @param {JSON} id 
   */
  update_local_business_storelist ({id}) {
    let that = this;
    let pouchdb = that._pouchdb;
    let db = pouchdb.createDatabase(that.config.dbname.business);

    let promise = new Promise((resolve, reject) => {
      that.queryStoreList({id})
        .then((result) => {
          try {
            result = JSON.parse(result);
            let list = result.list;
            let store_list = {};
            for (let i in list) {
              let store = list[i];
              store._id = store.nid;
              store_list[store.nid] = store;
            }

            let doc = {
              _id: id,
              store_list: store_list
            };

            pouchdb.updateDoc(db, doc)
              .then((result) => {
                resolve(result);
              }, (err) => {
                reject(err);
              });
          } catch (error) {
            reject(error);
          }
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 插入当前使用门店信息
   * @param {JSON} doc 
   */
  insert_local_store ({doc}) {
    let that = this;
    let pouchdb = that._pouchdb;

    let db = pouchdb.createDatabase(that.config.dbname.store);

    let promise = new Promise((resolve, reject) => {
      pouchdb.destroyDatabase(db)
        .then((result) => {
          let db = pouchdb.createDatabase(that.config.dbname.store);
          pouchdb.put(db, doc)
            .then((result) => {
              resolve(result);
            }, (err) => {
              reject(err);
            });
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 查询当前正在使用的门店信息
   * @param {JSON} id 
   */
  select_local_store ({options}) {
    let that = this;
    let pouchdb = that._pouchdb;
    let db = pouchdb.createDatabase(that.config.dbname.store);
    let promise = new Promise((resolve, reject) => {
      pouchdb.allDocs(db, options)
        .then((result) => {
          resolve(result);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   *  根据商家分类id插入商家分类信息
   * @param {JSON} id 
   */
  insert_local_category ({id}) {
    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.queryCategoryDetail({id})
        .then((result) => {
          try {
            result = JSON.parse(result);
            let docs = result.list;
            for (let i in docs) {
              docs[i]._id = docs[i].tid;
            }
            that.insert_category({docs})
              .then((result) => {
                resolve(result);
              }, (err) => {
                reject(err);
              });
          } catch (error) {
            reject(error);
          }
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   *  插入分类信息
   * @param {Array<JSON>} docs
   */
  insert_category ({docs}) {
    let that = this;
    let pouchdb = that._pouchdb;
    let db = pouchdb.createDatabase(that.config.dbname.category);

    let promise = new Promise((resolve, reject) => {
      pouchdb.destroyDatabase(db)
        .then((result) => {
          let db = pouchdb.createDatabase(that.config.dbname.category);
          pouchdb.bulkDocs(db, docs)
            .then((result) => {
              resolve(result);
            }, (err) => {
              reject(err);
            });
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 查询商家下所有分类信息
   * 
   * eg options: {
   *   include_docs: true,
       attachments: true
   * }
   * @param {JSON} options 
   */
  select_local_catetory ({options}) {
    let pouchdb = this._pouchdb;
    let db = pouchdb.createDatabase(this.config.dbname.category);

    let promise = new Promise((resolve, reject) => {
      pouchdb.allDocs(db, options)
        .then((result) => {
          resolve(result);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 根据商家id, 门店sid 插入产品信息
   * @param {JSON} id 
   */
  insert_local_product ({id, tags}) {
    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.queryProductList({id})
        .then((result) => {
          try {
            result = JSON.parse(result);
            let list = result.list;
            let salesList = {}; // 存放销售范围数据
            async.map(list, (item, callback) => {
              let image = item.field_product_image_middle;
              let sales = item.field_product_sales_domain;
              let sales_id_str = '';
              if (sales.length > 0) {
                for (let s in sales) {
                  let sales_id = sales[s].id + '';
                  salesList[sales_id] = {};
                  if (s == (sales.length - 1)) // eslint-disable-line
                    sales_id_str += sales_id;
                  else 
                    sales_id_str += sales_id + ',';
                }
              }
              item._id = item.product_id;
              item.sales = sales_id_str;
              if (image.hasOwnProperty('file')) {
                that.querFile({id: image.file.id})
                  .then((result) => {
                    try {
                      result = JSON.parse(result);
                      item.image = result.url;
                      callback(null, item);
                    } catch (error) {
                      callback(null, item);
                    }
                  }, (err) => {
                    callback(null, item);
                  });
              } else {
                callback(null, item);
              }
            }, (err, results) => {
              let productList = results;
              let new_salesList = salesList;
              let sales_keys = Object.keys(salesList);
              if (sales_keys.length > 0) {
                for (let id in salesList) {
                  that.queryCollectionItem({id})
                    .then((_result) => {
                      try {
                        _result = JSON.parse(_result);
                        let tags_included = _result.field_sales_territory.field_tags_included;
                        let tags_excluded = _result.field_sales_territory.field_tags_excluded;
      
                        let isincluded = null;
      
                        for (let n in tags_included) {
                          if ((tags_included[n].id).indexOf(tags) > -1) 
                            isincluded = true;
                        }
                        
      
                        for (let e in tags_excluded) {
                          if ((tags_excluded[e].id).indexOf(tags) > -1) 
                            isincluded = false;
                        }
      
                        new_salesList[id] = {
                          isincluded: isincluded,
                          price: _result.field_sales_price,
                          date: _result.field_sales_territory.field_datetime
                        };
                      } catch (error) {
                        console.log(_result);
                        reject('获取销售范围失败');
                      }
                      if (id === sales_keys[sales_keys.length - 1]) {
                        that.screen_product_sales({productList, new_salesList})
                          .then((result) => {
                            resolve(result);
                          }, (err) => {
                            reject(err);
                          });
                      }
                    }, (err) => {
                      reject('获取销售范围失败');
                    });
                }
              } else {
                resolve();
              }
            });
          } catch (error) {
            reject(error);
          }
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 筛选销售范围
   * @param {JSON} param0 
   */
  screen_product_sales ({productList, new_salesList}) {
    let that = this;
    let docs = [];
    let promise = new Promise((resolve, reject) => {
      async.map(productList, (product, callback) => {
        let sales_list = product.sales.split(',');
        for (let s in sales_list) {
          let sales = new_salesList[sales_list[s]];
          if (sales !== undefined && sales !== {}) {
            if (sales.hasOwnProperty('isincluded')) {
              if (sales.isincluded) {
                product.isuse = true;
                product.times = sales_list[s].date;
                if (sales.price.hasOwnProperty('amount')) {
                  product.price = sales.price.amount;
                }
                if (product._id === '3535') {
                  callback(false, '');
                } else {
                  callback(null, product);
                }
              }
            } else {
              callback(false, {});
            }
          } else {
            callback(false, {});
          }
        }
      }, (err, results) => {
        docs = results;
        for (let i in docs) {
          if (docs[i] === '') {
            docs.splice(i, 1);
            i = i - 1;
          }
        }
        that.insert_product({docs})
          .then((result) => {
            resolve(result);
          }, (err) => {
            reject(err);
          });
      });
    });
    return promise;
  }

  /**
   * 插入产品数据
   * @param {Array<JSON>} docs 
   */
  insert_product ({docs}) {
    let that = this;
    let pouchdb = that._pouchdb;
    let db = pouchdb.createDatabase(that.config.dbname.product);

    let promise = new Promise((resolve, reject) => {
      pouchdb.destroyDatabase(db)
        .then((result) => {
          let db = pouchdb.createDatabase(that.config.dbname.product);
          pouchdb.bulkDocs(db, docs)
            .then((result) => {
              resolve(result);
            }, (err) => {
              reject(err);
            });
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

   
  /**
   * 查询门店下所有产品信息
   * @param {options} JSON 
   */
  select_local_product ({options}) {
    let pouchdb = this._pouchdb;
    let db = pouchdb.createDatabase(this.config.dbname.product);

    let promise = new Promise((resolve, reject) => {
      pouchdb.allDocs(db, options)
        .then((result) => {
          resolve(result);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  // 查询商家员工信息
  insert_local_user ({id}) {
    let that = this;
    // let pouchdb = that._pouchdb;
    // let db = pouchdb.createDatabase(that.config.dbname.user);

    let promise = new Promise((resolve, reject) => {
      that.queryStoreList({id})
        .then((result) => {
          try {
            result = JSON.parse(result);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 根据商家id 门店id 插入门店优惠信息
   * @param {JSON} {} 
   */
  insert_local_mkt ({bid, sid}) {
    let that = this;
    let pouchdb = that._pouchdb;
    let db = pouchdb.createDatabase(that.config.dbname.markting);

    let promise = new Promise((resolve, reject) => {
      that.queryMarkting({bid, sid})
        .then((result) => {
          try {
            result = JSON.parse(result);
            let list = result.list;
            let docs = [];
            for (let i in list) {
              let m = list[i];
              m._id = m.nid;
              docs.push(m);
            }
            pouchdb.destroyDatabase(db)
              .then((re) => {
                if (docs.length > 0) {
                  let db = pouchdb.createDatabase(that.config.dbname.markting);
                  pouchdb.bulkDocs(db, docs)
                    .then((result) => {
                      resolve(result);
                    }, (err) => {
                      reject(err);
                    });
                } else {
                  resolve({'ok': true});
                }
              }, (err) => {
                reject(err);
              });
          } catch (error) {
            reject(error);
          }
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   *  查询门店所有优惠信息
   * @param {options} JSON 
   */
  select_all_local_mkt({options}) {
    let that = this;
    let pouchdb = that._pouchdb;
    let db = pouchdb.createDatabase(that.config.dbname.markting);

    let promise = new Promise((resolve, reject) => {
      pouchdb.allDocs(db, options)
        .then((result) => {
          resolve(result);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 查询满足条件的优惠信息
   * @param {JSON} obj
   * @param {Array} fields
   */
  select_local_mkt ({obj, fields}) {
    let that = this;
    
    let pouchdb = that._pouchdb;
    let db = pouchdb.createDatabase(that.config.dbname.markting);
    
    let promise = new Promise((resolve, reject) => {
      pouchdb.createIndex(db, fields).then((result) => {
        pouchdb.find(db, obj).then((result) => {
          resolve(result);
        }, (err) => {
          reject(err);
        });
      }, (err) => {
        reject(err);
      });
    });
    return promise;
  }

  /**
   * 计算优惠信息
   * @param {JSON} product 
   * @param {JSON} amount 
   * @param {JSON} mkt 
   */
  calculation_mkt ({product, total, mkt}) {
    let obj = {};
    const _product = product;
    let promise = new Promise((resolve, reject) => {
      try {
        for (let i in mkt) {
          let _products = JSON.parse(JSON.stringify(_product));
          let _mkt = mkt[i];
          // 判断产品规则
          if (_mkt.hasOwnProperty('field_mkt_rule_product')) {
            if (_products !== undefined) {
              if (_products.id !== _mkt.field_mkt_rule_product.id)
                continue;
            } else 
              continue;
          }

          // 判断购买数量规则
          if (_mkt.hasOwnProperty('field_mkt_rule_num')) {
            if (_products !== undefined) {
              if (_products.num < parseInt(_mkt.field_mkt_rule_num))
                continue;
            } else 
              continue;
          }

          // 判断购买金额
          if (_mkt.hasOwnProperty('field_mkt_rule_amount')) {
            if (total.amount !== undefined) {
              if (total.amount < parseInt(_mkt.field_mkt_rule_amount.amount))
                continue;
            } else 
              continue;
          }

          // 筛选类型
          switch (_mkt.field_mkt_cate) {
            case 'discount':
              if (_mkt.hasOwnProperty('field_mkt_rule_product')) {
                _products.discount = _products.price * parseInt(_mkt.field_mkt_pref_discount) / 10;
                _products.discount_type = 'product_discount';
              } else if (!_mkt.hasOwnProperty('field_mkt_rule_product')) {
                total.discount = total.amount * parseInt(_mkt.field_mkt_pref_discount) / 10;
                _products.discount_type = 'amount_discount';
              }
              obj[_mkt.nid] = _products;
              break;
            case 'amount':
              if (_mkt.hasOwnProperty('field_mkt_rule_product')) {
                _products.discount = _products.price - parseInt(_mkt.field_mkt_pref_amount.amount);
                _products.discount_type = 'product_amount';
              } else if (!_mkt.hasOwnProperty('field_mkt_rule_product')) {
                total.discount = total.amount - parseInt(_mkt.field_mkt_pref_amount.amount);
                _products.discount_type = 'amount_amount';
              }
              obj[_mkt.nid] = _products;
              break;
            case 'product':
              if (_mkt.hasOwnProperty('field_mkt_rule_product')) {
                _products.pref_product = _mkt.field_mkt_pref_product.id;
                _products.discount_type = 'product_product';
              } else if (!_mkt.hasOwnProperty('field_mkt_rule_product')) {
                total.pref_product = _mkt.field_mkt_pref_product.id;
                _products.discount_type = 'amount_product';
              }
              obj[_mkt.nid] = _products;
              break;
            case 'add':
              _products.add_price = _mkt.field_mkt_add_price.amount;
              _products.pref_product = _mkt.field_mkt_pref_product.id;
              _products.discount_type = 'add_product';
              obj[_mkt.nid] = _products;
              break;
          }
        }
        resolve(obj);
      } catch (error) {
        reject(new Error(error));
      }
    });
    return promise;
  }
}
