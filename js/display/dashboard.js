let list = null;

function onPackageSuccess(data) {
    list = JSON.parse(data);

    if (list)
        fillTable();
}

function onPackageFailed(errorCode) {
    alert("Error getting package failed : " + errorCode);
}

function onPackageUpdateSuccess(data, id, status) {
    console.log(data,id,status);
    updateTableElement();
}

function onPackageUpdateFailed(errorCode) {
    alert("Update package failed : " + errorCode);
}

function addMap(mapID, location) {
    macarte = L.map(mapID, { zoomControl: false }).setView([location[0], location[1]], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
}

function toggleMenu() {
    
}

function updatePackage(status, id) {
    updatePackageRequest(getUserInfo("token"), id, status, onPackageUpdateSuccess, onPackageUpdateFailed);
}

function updateTableElement(id,status){
    // Clear current table
    $("#table_dashboard").find("tbody").empty();

    // Update element status
    list.forEach(package => {
        if(package._id === id){
            package.status = status;
        }
    });

    // Redraw table
    fillTable();
}

function fillTable() {
    let counter = list.length;

    list.forEach(package => {
        console.log(package);
        let packageId = package._id;
        let dateobj = new Date(+package.date.creation).toLocaleDateString('fr-FR', { timeZone: 'UTC' });
        let userName = package.user["root.name"];
        let packageList = package.package;
        let location = package.location;
        let status = STATUS[package.status];

        const tbody = $("#table_dashboard").find("tbody");
        tbody.append("<tr>");
        tbody.append(`<th scope='row'>${counter}</th>`);
        tbody.append(`<td>${dateobj}</td> `);
        tbody.append(`<td>${userName}</td>`);
        tbody.append(`<td> <span style='background-color:${status.color}' class='status'> ${status.name} </span> </td> `);

        const actionTd = $("<td></td>");
        actionTd.append(`<a style='color:red' onclick='updatePackage(4,"${packageId}")' href='#' class='link_button fas fa-ban '> </a>`);
        actionTd.append(`<a onclick='updatePackage(${package.status + 1},"${packageId}" )' href='#' class='link_button fas fa-forward '> </a>`);
        actionTd.append(`<a style='color:grey' onclick='' href='#' class='link_button fas fa-plus-square '> </a>`);

        tbody.append(actionTd);
        tbody.append("</tr>");

        counter--;
    });
}

function generateTableAdmin() {
    if (isUserLogged() && getUserInfo("permission") == 1) {
        getPackageRequest(getUserInfo("token"), true, [0, 1, 2, 3, 4], onPackageSuccess, onPackageFailed);
    }
    else {
        window.location = "../login";
    }
}

function generateTableUser() {
    if (isUserLogged() && getUserInfo("permission") == 0) {
        getPackageRequest(getUserInfo("token"), false, [0, 1, 2, 3, 4], onPackageSuccess, onPackageFailed);
    }
    else {
        window.location = "../login";
    }
}