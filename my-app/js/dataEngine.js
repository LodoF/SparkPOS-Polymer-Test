const BasicHttp = require('./basicHttp.js');
module.exports = class DataEngine extends BasicHttp {
  constructor (host, port, username, password) {
    super();
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.auth = 'Basic ' +  new Buffer(this.username + ':' + this.password).toString('base64');
  }

  /**
   * 查询商家或门店信息
   * @param {String} id 商家id
   */
  queryBusinessOrStore ({id}) {
    let options = {
      host: this.host,
      protocol: 'https:',
      method: 'GET',
      path: '/node/' + id + '.json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      },
      port: this.port
    };
    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.request(options)
        .then((data) => {
          console.log(data);
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 获取商家下所有门店列表
   * @param {String} id 商家id
   */
  queryStoreList ({id}) {
    let options = {
      host: this.host,
      protocol: 'https:',
      method: 'GET',
      path: '/node.json?type=stores&og_group_ref=' + id,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      },
      port: this.port
    };

    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.request(options)
        .then((data) => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
  * 获取门店下所有员工
  * @param {String} id 门店id
  */
  queryStoreUser ({id}) {
    let options = {
      host: this.host,
      protocol: 'https:',
      method: 'GET',
      path: '/user.json?field_store=' + id,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      },
      port: this.port
    };

    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.request(options)
        .then((data) => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 获取用户详细信息
   * @param {*} id 用户id
   */
  queryUserDetail ({id}) {
    let options = {
      host: this.host,
      protocol: 'https:',
      method: 'GET',
      path: '/user/' + id + '.json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      },
      port: this.port
    };

    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.request(options)
        .then((data) => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 查询商家分类属性
   * @param {String} id 分类id
   */
  queryCategoryDetail ({id}) {
    let options = {
      host: this.host,
      protocol: 'https:',
      method: 'GET',
      path: '/taxonomy_term.json?vocabulary=' + id,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      },
      port: this.port
    };

    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.request(options)
        .then((data) => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
  * 查询商家下所有产品
  * @param {String} id 商家id
  */
  queryProductList ({id}) {
    let options = {
      host: this.host,
      protocol: 'https:',
      method: 'GET',
      path: '/commerce_product.json?og_group_ref=' + id,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      },
      port: this.port
    };

    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.request(options)
        .then((data) => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 获取某个产品的具体信息
   * @param {String} id 产品id
   */
  queryProductDetail ({id}) {
    let options = {
      host: this.host,
      protocol: 'https:',
      method: 'GET',
      path: '/commerce_product/' + id + '.json?embed[field_collection_item]=2&embed[commerce_line_item]=2&embed[node]=2',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      },
      port: this.port
    };

    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.request(options)
        .then((data) => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 获取某销售范围属性
   * @param {String} id  销售范围属性
   */
  queryCollectionItem ({id}) {
    let options = {
      host: this.host,
      protocol: 'https:',
      method: 'GET',
      path: '/field_collection_item/' + id + '.json?embed[node]=2',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      },
      port: this.port
    };

    console.info('post info :', options);
    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.request(options)
        .then((data) => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 获取文件属性
   * @param {String} id 文件id
   */
  querFile ({id}) {
    let options = {
      host: this.host,
      protocol: 'https:',
      method: 'GET',
      path: '/file/' + id + '.json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      },
      port: this.port
    };
    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.request(options)
        .then((data) => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }

  /**
   * 查询商家优惠信息
   * @param {JSON} id 商家id
   */
  queryMarkting({bid, sid}) {
    let options = {
      host: this.host,
      protocol: 'https:',
      method: 'GET',
      path: '/node.json?type=marketing_rules&og_group_ref=' + bid + '&field_mkt_rule_store=' + sid + '&status=1',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.auth
      },
      port: this.port
    };
    let that = this;

    let promise = new Promise((resolve, reject) => {
      that.request(options)
        .then((data) => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
    return promise;
  }
}