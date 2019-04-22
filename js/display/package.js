let list = null;

function onPackageSuccess(data) {
    list = JSON.parse(data);

    if (list)
        fillTable(false);
}

function onPackageFailed(errorCode) {
    alert("Error getting package failed : " + errorCode);
}

function onPackageUpdateSuccess(data, id, status) {
    updateTableElement(id,"status",status);
}

function onPackageUpdateFailed(errorCode) {
    alert("Update package failed : " + errorCode);
}

function addMap(mapID, location) {
    macarte = L.map(mapID, { zoomControl: false }).setView([location[0], location[1]], 11);

    L.marker([location[0],location[1]]).addTo(macarte);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
}

async function addPackageList(id,package) {
    const tBody = $("#"+id);

    const data = {};

    package.forEach(item => data[item] ? data[item]++ : data[item] = 1);

    console.log(package);

    Object.keys(data).forEach(async item => {
        const tr = $("<tr></tr>");
        console.log(item);
        await getProductName(item, (name) => {
            tr.append(`<th scope='row'>${data[item]}x</th>`);
            tr.append(`<td> ${name}</td> `);
            //tr.append(`<td> Lien openfood </td>`);
        });
        tBody.append(tr);
    });
}

function updatePackage(status, id) {
    updatePackageRequest(getUserInfo("token"), id, status, onPackageUpdateSuccess, onPackageUpdateFailed);
}

function updateTableElement(id,fields,value){
    // Update element status
    list.forEach(package => {
        if(package._id == id){
            package[fields] = value;
        }
    });

    // Redraw table
    fillTable(true);
}

function fillTable(clear) {

    if(clear){
        // Clear current table
        $("#table_dashboard").find("tbody").empty();
    }

    let counter = 1;

    list.forEach(package => {
        console.log(package);
        let packageId = package._id;
        let dateobj = new Date(+package.date.creation).toLocaleString('fr-FR');

        let userName = package.user["root.name"];
        let packageList = package.package;
        let location = package.location;
        let status = STATUS[package.status];

        const tbody = $("#table_dashboard").find("tbody:first");
        const tr = $("<tr></tr>");

        tr.append(`<th scope='row'>${counter}</th>`);
        tr.append(`<td>${dateobj}</td> `);
        tr.append(`<td>${userName}</td>`);
        tr.append(`<td> <span style='background-color:${status.color}' class='status'> ${status.name} </span> </td> `);

        const actionTd = $("<td></td>");
        status.id < 3 && actionTd.append(`<a style='color:red' onclick='updatePackage(4,"${packageId}")' href='#' class='link_button fas fa-ban '> </a>`);
        status.id < 3 && actionTd.append(`<a onclick='updatePackage(${package.status + 1},"${packageId}" )' href='#' class='link_button fas fa-forward '> </a>`);
        !package.open && actionTd.append(`<a style='color:grey' onclick='updateTableElement("${packageId}","open",${!package.open});' href='#' class='link_button fas fa-plus-square '> </a>`);
        package.open && actionTd.append(`<a style='color:red' onclick='updateTableElement("${packageId}","open",${!package.open});' href='#' class='link_button fas fa-minus-square '> </a>`);

        tr.append(actionTd);
        tbody.append(tr);

        if (package.open){
            tbody.append(`<td  colspan='5'> 
                            <div class='table-menu'>
                                <div class='sub-menu' id='map_${counter}'> </div>
                                <div class='sub-menu'> 
                                    <table class="table">
                                        <tbody id='package_${counter}'>
                                        </tbody>  
                                    </table>
                                </div>
                             </div>
                        </td>`);

            addMap("map_"+counter,location);
            addPackageList("package_" + counter,packageList);
        }

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