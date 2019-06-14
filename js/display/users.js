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

function fillTable() {
    let table = $("#table-users");

    let counter = 0;

    list.forEach(user => {

        const tbody = table.find("tbody:first");

        const tr = $("<tr></tr>");

        tr.append(`<td>${counter}</td> `);
        tr.append(`<td>${user.forename}</td> `);
        tr.append(`<td>${user.name}</td> `);
        tr.append(`<td>${user.email}</td> `);
        tr.append(`<td>${user.location.coordinates}</td> `);
        tr.append(`<td>${user.type}</td> `);
        tr.append(`<td> Action </td> `);

        tbody.append(tr);

        counter++;
    });
}

function generateUsersTable(type) {
    if (isUserLogged()) {
        getAllUsersRequest(getUserInfo("token"), onUsersSuccess, onUsersFailed);
    } else {
        window.location = "../login";
    }
}