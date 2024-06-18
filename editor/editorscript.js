var configLoader;
var storeName = "";
var container, editor;

window.onload = async function() {
    storeName = getStoreName();
    configLoader = new ConfigLoader({store:storeName, securityKey: localStorage.jsonstore_dkey});
    initEditor();
    pageTitle.innerText = `Editing ${storeName}`;
    await retrieveStore();
}

function getStoreName() {
    var params = new URLSearchParams(location.search);
    return params.get("store");
}

async function retrieveStore() {
    var config = await configLoader.downloadConfig();
    editor.set(config);
}

function initEditor() {
    container = document.getElementById("jsoneditor");
    var options = {mode:"code"};
    editor = new JSONEditor(container, options);
}

async function save(doAlert=true) {
    configLoader.config = editor.get();
    await configLoader.uploadConfig();
    if (doAlert) alert("Config successfully saved.")
}

async function discard() {
    if (!confirm("Are you sure you want to discard your changes?")) return;
    await retrieveStore();
}

async function deleteFile() {
    if (!confirm("Are you sure you want to delete this file?")) return;
    await configLoader.deleteStore(storeName);
    sendReload();
    window.close();
}

function closeFile() {
    if (!confirm("Are you sure you want to close? Any unsaved work will be lost.")) return;
    window.close();
}

function sendReload() {
    window.opener.postMessage("reload");
}

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      save(true);
    }
  });