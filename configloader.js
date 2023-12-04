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
        await detectFastestEndpoint();
        validateEndpoint = endpoint + "/validate/" + options.securityKey;
        var response = await xhrGet(validateEndpoint);
        return response.valid;
    }
    var xhrGet = function(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.crossorigin = "";
            xhr.open("GET", url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Security-key", options.securityKey);
            xhr.send();
            xhr.onload = function() {
                resolve(JSON.parse(xhr.responseText));
            }
            xhr.onerror = function() {
                reject();
            }
        });
    }
    var xhrPost = function(url, data) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.crossorigin = "";
            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Security-key", options.securityKey);
            xhr.send(JSON.stringify(data));
            xhr.onload = function() {
                resolve(JSON.parse(xhr.responseText));
            }
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

    async function detectFastestEndpoint() {
        var remoteEndpoint = "https://aidanjacobson.duckdns.org:42069";
        /*
        var localEndpoint = "https://homeassistant.local:42069";
        var remotePromise = pingAndReturn(remoteEndpoint + "/ping", "remote");
        var localPromise = pingAndReturn(localEndpoint + "/ping", "local");
        var output = await Promise.any([remotePromise, localPromise]);
        if (output == "remote") {
            setEndpoints(remoteEndpoint);
        } else {
            setEndpoints(localEndpoint);
        }
        */
        setEndpoints(remoteEndpoint);
    }
    detectFastestEndpoint();

    async function pingAndReturn(url, retVal) {
        await xhrGet(url);
        return retVal;
    }

    _this.listStores = async function() {
        return await xhrGet(listEndpoint);
    }

    _this.deleteStore = async function(storeName) {
        return (await xhrGet(deleteEndpoint + "/" + storeName)).status == "success";
    }
}