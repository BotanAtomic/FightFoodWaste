let list = null;
let command_status = ["TO_PROGRAM", "TAKEN", "IN_PROGRESS", "DONE", "CANCELED"];

function onPackageSuccess(data) {
    list = JSON.parse(data);

    if (list)
        fillTable();
}

function onPackageFailed(errorCode) {
    alert("Error getting package failed : " + errorCode);
}

function addMap(mapID, location) {
    macarte = L.map(mapID, { zoomControl: false }).setView([location[0], location[1]], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
}

function addAction(actionID) {
    $("#" + actionID).append("<a id='a-1_" + actionID + "'></a>");
    $("#a-1_" + actionID).attr({
        style: "color:red;margin-right :10px",
        href: "#",
        onclick: "alert('test')"
    })
        .addClass("link_button fas fa-ban fa-2x");

    $("#" + actionID).append("<a id='a-2_" + actionID + "'></a>");
    $("#a-2_" + actionID).attr({
        style: "margin-right :10px",
        href: "#",
        onclick: "alert('test2')"
    })
        .addClass("link_button fas fa-forward fa-2x");


    $("#" + actionID).append("<a id='a-3_" + actionID + "'></a>");
    $("#a-3_" + actionID).attr({
        href: "#",
        onclick: "alert('test3')"
    })
        .addClass("link_button fas fa-plus-square fa-2x");

}

function fillTable() {
    let counter = 0;
    list.forEach(package => {
        console.log(package);
        let dateobj = new Date(+package.date.creation).toLocaleDateString('fr-FR', { timeZone: 'UTC' });
        let userName = package.user["root.name"];
        let packageList = package.package;
        let location = package.location;
        let status = command_status[package.status];

        $("#table_dashboard").find("tbody").after("<tr>" +
            "<th scope='row'>" + counter + "  </th>" +
            "<td>" + dateobj + "</td> " +
            "<td>" + userName + "</td> " +
            "<td class='fas fa-archive fa-2x '></td> " +
            "<td id='map_" + counter + "' class='map'></td> " +
            "<td>" + status + "</td> " +
            "<td id='action_" + counter + "'></td> "
        );

        addAction("action_" + counter);
        addMap("map_" + counter, location);

        counter++;
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