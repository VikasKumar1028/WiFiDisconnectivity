var axios = require('axios');
var https = require('https');

module.exports = function (baseUrl, accountId, apiKey, keepAliveAgent){
  var baseUrl = baseUrl + '/' + accountId + '/scls/:deviceId/containers/:containerId';

  function HttpClient() {
  }

  HttpClient.post = function(containerId, deviceId, content) {
    var url = baseUrl.replace(':containerId', containerId) + '/contentInstances';
    url = url.replace(':deviceId', deviceId);
    console.log("url:"+url);
    var keepAliveAgent = new https.Agent({keepAlive: true});

    return axios.post(url, content, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        'apiKey': apiKey
      },
      agent: keepAliveAgent
    });
  };

  return HttpClient;
}
