const Https = require('https');
const Http = require('http');
module.exports = class BasicHttp {
  request ({ host, protocol = 'http:', method = 'GET', path = '/', headers, port = 80, data = '', timeout = 2 * 1000}) {
    let options = {
      protocol: protocol,
      hostname: host,
      method: method,
      path: path,
      port: port,
      headers: headers,
      timeout: timeout
    };
    console.log(options);
    let send = Http;
    if (options.protocol === 'https:')
      send = Https;
    let promise = new Promise((resolve, reject) => {
      const req = send.request(options, (res) => {
        res.setEncoding('utf8');
        let str = '';
        res.on('data', (chunk) => {
          str += chunk;
        });
        res.on('end', () => {
          console.log(str);
          resolve(str);
        });
      });

      req.on('error', (e) => {
        console.log(e);
        reject(new Error(e));
      });
      req.write(data);
      req.end();
    });

    return promise;
  }
}