let list = null;
let page = 1;
let limit = 15;

function handleSocket(data) {
    if (data.message === "add_package") {
        if (data.package) {
            let package = JSON.parse(data.package);
            list.unshift(package);
            fillTable(true);
        }
    }
    else if (data === "update_package") {
        generateTable(isDelivery, status);
    }
}

function onPackageSuccess(data) {
    list = JSON.parse(data);

    if (list)
        fillTable(true);
}

function onPackageFailed(errorCode) {
    alert("Error getting package failed : " + errorCode);
}

function onPackageUpdateSuccess(data, id, status) {
    updateTableElement(id, "status", status);
    socket.emit("broadcast", "update_package");
}

function onPackageUpdateFailed(errorCode) {
    alert("Update package failed : " + errorCode);
}

function addMap(mapID, location) {
    macarte = L.map(mapID, { zoomControl: false }).setView([location[0], location[1]], 11);

    L.marker([location[0], location[1]]).addTo(macarte);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
}

async function addPackageList(id, package) {
    const tBody = $("#" + id);

    const data = {};

    package.forEach(item => data[item] ? data[item]++ : data[item] = 1);

    Object.keys(data).forEach(item => {
        const tr = $("<tr></tr>");
        getProductName(item).then(name => {
            tr.append(`<th scope='row'>${data[item]}x</th>`);
            tr.append(`<td> ${name}</td> `);
            tBody.append(tr);
        });

    });
}

async function downloadSummary() {
    let userId = getUserInfo("token").substring(10);

    let rawData = "Date, Owner, Latitude, Longitude, Products";

    for (let i of list) {
        if (i.user.manager === userId && i.status === 3) {
            let date = new Date(+i.date.creation).toLocaleString('fr-FR');

            rawData += date + "," + i.user["giver.name"] + ",";
            rawData += i.location + ",";

            for (let packageKey of i.package) {
                const productName = await getProductName(packageKey);
                rawData += productName + "; ";
            }

            rawData += "\n";
        }
    }

    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(rawData));
    element.setAttribute('download', "summary.csv");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function updatePackage(status, id) {
    updatePackageRequest(getUserInfo("token"), id, status, onPackageUpdateSuccess, onPackageUpdateFailed);
}

function updateTableElement(id, fields, value) {
    // Update element status
    list.forEach(package => {
        if (package._id === id) {
            if(fields == "status" && value > 0){
                package.user["manager.name"] = getUserInfo("name") + " " +  getUserInfo("forename");
            }
            package[fields] = value;
        }
    });

    // Redraw table
    fillTable(true);
}

function fillTable(clear) {

    if (clear) {
        // Clear current table
        $("#table_dashboard").find("tbody").empty();
    }

    let counter = 1;

    list.forEach(package => {
        let packageId = package._id;
        let dateobj = new Date(+package.date.creation).toLocaleString('fr-FR');

        let userName = package.user["giver.name"];
        let packageList = package.package;
        let location = package.location;
        let status = STATUS[package.status];

        let manager = package.status >= 1 ? package.user["manager.name"] : null;

        const tbody = $("#table_dashboard").find("tbody:first");
        const tr = $("<tr></tr>");

        tr.append(`<th scope='row'>${counter}</th>`);
        tr.append(`<td>${dateobj}</td> `);
        tr.append(`<td> ${userName} </td>`);
        tr.append(`<td> ${manager != null ? manager : ""} </td>`);
        tr.append(`<td> <span style='background-color:${status.color}' class='status'> ${status.name} </span> </td> `);

        const actionTd = $("<td></td>");
        status.id < 3 && actionTd.append(`<a style='color:red' onclick='updatePackage(4,"${packageId}")' href='#' class='link_button fas fa-ban '> </a>`);
        status.id < 3 && actionTd.append(`<a onclick='updatePackage(${package.status + 1},"${packageId}" )' href='#' class='link_button fas fa-forward '> </a>`);
        !package.open && actionTd.append(`<a style='color:grey' onclick='updateTableElement("${packageId}","open",${!package.open});' href='#' class='link_button fas fa-plus-square '> </a>`);
        package.open && actionTd.append(`<a style='color:red' onclick='updateTableElement("${packageId}","open",${!package.open});' href='#' class='link_button fas fa-minus-square '> </a>`);

        tr.append(actionTd);
        tbody.append(tr);

        if (package.open) {
            tbody.append(`<td  colspan='5'> 
                            <div class='table-menu'>
                                <div class='sub-menu' id='map_${counter}'> </div>
                                <div class='sub-menu'> 
                                    <table class="package-table">
                                        <tbody id='package_${counter}'>
                                        </tbody>  
                                    </table>
                                </div>
                             </div>
                        </td>`);

            addMap("map_" + counter, location);
            addPackageList("package_" + counter, packageList);
        }

        counter++;
    });
}

function generateTable(isDelivery, status) {
    if (isUserLogged()) {
        $('#page-display').html(page);
        let skip = (limit * (page - 1));

        // Hide class menu 
        $("#selection-content").css("display", "none");

        // Show table 
        $("#data-content").removeAttr("style");

        getPackageRequest(getUserInfo("token"), isDelivery, skip, limit, status, false, onPackageSuccess, onPackageFailed);
    } else {
        window.location = "../login";
    }
}
