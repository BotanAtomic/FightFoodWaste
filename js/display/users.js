let list = null;

function onUsersSuccess(data) {
    if (data) {
        list = JSON.parse(data);
        fillTable();
    }
}

function onUsersFailed(error) {
    alert("Couldn't retrieve users list : " + error);
}

async function fillTable() {
    let table = $("#table-users");

    let counter = 0;

    for(let i = 0; i< list.length; i++){
        let user = list[i];
        const tbody = table.find("tbody:first");

        const tr = $("<tr></tr>");

        tr.append(`<td>${counter}</td> `);
        tr.append(`<td>${user.forename}</td> `);
        tr.append(`<td>${user.name}</td> `);
        tr.append(`<td>${user.email}</td> `);
        const address = await getAddressRequest(user.location, true);
        tr.append(`<td>${address}</td> `);
        tr.append(`<td>${TYPE[user.type]}</td> `);

        tbody.append(tr);

        counter++;
    }

}

function generateUsersTable() {
    if (isUserLogged()) {
        getAllUsersRequest(getUserInfo("token"), onUsersSuccess, onUsersFailed);
    } else {
        window.location = "../login";
    }
}