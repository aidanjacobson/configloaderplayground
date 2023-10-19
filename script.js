if (!localStorage.getItem("jsonstore_dkey")) promptForPassword();

function promptForPassword() {
    dkey = prompt("Enter decryption key");
    localStorage.setItem("jsonstore_dkey", dkey);
}

var configLoader;
window.onload = async function() {
    await initConfigLoader();
    await populateFileOpenerOptions();
}

async function initConfigLoader() {
    configLoader = new ConfigLoader({store: "", securityKey: localStorage.jsonstore_dkey});
    if (!(await configLoader.validate())) {
        localStorage.removeItem("jsonstore_dkey");
        location.reload();
    }
}

async function populateFileOpenerOptions() {
    fileList = await configLoader.listStores();
    fileTableBody.innerHTML = "";
    for (var i = 0; i < fileList.length; i++) {
        var fileName = fileList[i];
        var storeName = getStoreName(fileName);
        var tr = document.createElement("tr");
        tr.setAttribute("data-filename", fileName);
        tr.setAttribute("data-storename", storeName);

        var nameTd = document.createElement("td");
        nameTd.innerText = fileName;
        tr.append(nameTd);

        var editTd = document.createElement("td");
        var editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.onclick = editBtnClick;
        editTd.appendChild(editBtn);
        tr.append(editTd);

        var downloadTd = document.createElement("td");
        var downloadBtn = document.createElement("button");
        downloadBtn.innerText = "Download";
        downloadBtn.onclick = downloadBtnClick;
        downloadTd.appendChild(downloadBtn);
        tr.append(downloadTd);

        var deleteTd = document.createElement("td");
        var deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.onclick = deleteBtnClick;
        deleteTd.appendChild(deleteBtn);
        tr.append(deleteTd);

        fileTableBody.append(tr);
    }
}


function getStoreName(value) {
    var storeNameRE = /(.+)\.json/;
    var reResult = storeNameRE.exec(value);
    var storeName = reResult[1];
    return storeName;
}

function editBtnClick(e) {
    var storeName = e.target.parentElement.parentElement.getAttribute("data-storename");
    window.open("/editor/?store=" + storeName);
}

async function deleteBtnClick(e) {
    var storeName = e.target.parentElement.parentElement.getAttribute("data-storename");
    if (!confirm(`Are you sure you want to delete ${storeName}.json?`)) return;
    var response = await configLoader.deleteStore(storeName);
    await millis(50);
    populateFileOpenerOptions();
}

function downloadBtnClick(e) {
    var storeName = e.target.parentElement.parentElement.getAttribute("data-storename");
    window.open("/downloader/?store=" + storeName);
}

async function create() {
    var storeName = prompt("Enter new Store name");
    window.open("/editor/?store=" + storeName);
    await millis(1000);
    populateFileOpenerOptions();
}

window.onmessage = async function(e) {
    if (e.data == "reload") {
        console.log("refresh");
        await millis(50);
        populateFileOpenerOptions();
    }
}

function millis(m) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, m);
    });
}