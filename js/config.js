/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
module.exports = class Config {
  get ocUrl () {
    return 'oc.liansuola.com';
  }

  get ocPort () {
    return 443;
  }

  get pmtUrl () {
    return 'pmt.liansuola.com';
  }

  get pmtPort () {
    return 443;
  }

  get deUrl () {
    return 'de.liansuola.com';
  }

  get deProt () {
    return 443;
  }

  get newDeUrl () {
    return 'hello.longxianwen.net';
  }

  get newDeProt () {
    return 8888;
  }

  get dbname () {
    return  {
      order: 'orderInfo',
      business: 'business',
      store: 'storeInfo',
      category: 'category',
      product: 'product',
      user: 'user',
      markting: 'markting',
      product_setting: 'product_setting'
    };
  }

  get couchdbUrl () {
    return 'couchdb.sparkpad-dev.com:5984';
  }

  get couchdbUrl_cloud () {
    return 'couchdb-cloud.liansuola.com';
  }
}