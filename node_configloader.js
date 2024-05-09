var request = require("request");

/*
options {
    securityKey: String,
    store: String
}
*/

function ConfigLoader(options) {
    var endpoint = "https://aidanjacobson.duckdns.org:42069";
    var storageEndpoint, validateEndpoint, pingEndpoint, listEndpoint, deleteEndpoint;
    var setEndpoints = function(endpointNew) {
        endpoint = endpointNew;
        storageEndpoint = endpoint + "/store/" + options.store;
        validateEndpoint = endpoint + "/validate/" + options.securityKey;
        pingEndpoint = endpoint + "/ping";
        listEndpoint = endpoint + "/list"
        deleteEndpoint = endpoint + "/delete"
    }
    setEndpoints(endpoint);
    var _this = this;
    _this.config = {};
    _this.validate = async function() {
        validateEndpoint = endpoint + "/validate/" + options.securityKey;
        var response = await xhrGet(validateEndpoint);
        return response.valid;
    }
    var xhrGet = function(url) {
        return new Promise(function(resolve, reject) {
            var requestOptions = {
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "Security-key": options.securityKey
                }
            }
            request.get(requestOptions, function(e, res, body) {
                resolve(JSON.parse(body));
            })
        });
    }
    var xhrPost = function(url, data) {
        return new Promise(function(resolve, reject) {
            var requestOptions = {
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "Security-key": options.securityKey
                },
                json: data
            }
            request.post(requestOptions, function(e, res, body) {
                resolve();
            })
        });
    }
    _this.downloadConfig = async function() {
        _this.config = await xhrGet(storageEndpoint);
        return _this.config;
    }
    _this.uploadConfig = async function() {
        if (options.store == "") return;
        await xhrPost(storageEndpoint, _this.config);
    }

    _this.ping = async function() {
        return await xhrGet(pingEndpoint);
    }

    _this.listStores = async function() {
        return await xhrGet(listEndpoint);
    }

    _this.deleteStore = async function(storeName) {
        return (await xhrGet(deleteEndpoint + "/" + storeName)).status == "success";
    }
}

module.exports = ConfigLoader;