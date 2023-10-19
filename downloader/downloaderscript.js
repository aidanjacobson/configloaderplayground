function getStoreName() {
    var params = new URLSearchParams(location.search);
    return params.get("store");
}

window.onload = async function() {
    storeName = getStoreName();
    var configLoader = new ConfigLoader({store: storeName, securityKey: localStorage.jsonstore_dkey});
    var json = await configLoader.downloadConfig();
    var blob = new Blob([JSON.stringify(json)], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = storeName + ".json";
    console.log(storeName);
    a.click();
    await oneSecond();
    window.close();
}

function oneSecond() {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, 1000);
    });
}