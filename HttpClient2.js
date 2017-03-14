var axios = require('axios');
var https = require('https');

function HttpClient2(baseUrl, accountId, apiKey, keepAliveAgent){
  var baseUrl = baseUrl + '/' + accountId + '/scls/:deviceId/containers/:containerId';
  this.baseUrl = baseUrl;
  this.accountId = accountId;
  this.apiKey = apiKey;
}

HttpClient2.prototype.get = function(containerId, deviceId) {

    var url = this.baseUrl.replace(':containerId', containerId) + '/contentInstances';
    url = url.replace(':deviceId', deviceId);
    console.log("url:"+url);
    var keepAliveAgent = new https.Agent({keepAlive: true});

    return axios.get(url, {
      params: {
        'apiKey': this.apiKey
      },
      agent: keepAliveAgent
    });
}

module.exports = HttpClient2;
