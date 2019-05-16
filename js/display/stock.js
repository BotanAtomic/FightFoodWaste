let list = [];

function onStockSuccess(data) {
    if (data) {
        list = JSON.parse(data);
        fillTable();
    }
}

function updateTableElement(city, fields, value) {
    // Update element status
    list.forEach(warehouse => {
        if (warehouse.city === city) {
            warehouse[fields] = value;
        }
    });

    // Redraw table
    fillTable(true);
}

let open = {};

function updateOpen(product, value) {
    open[product] = value;
}

function getPackageList(city, packages) {

    const tbody = $(`#div-${city}`).find("tbody");

    const item = {};
    const data = {};

    packages.forEach(package => {

        let dateobj = new Date(+package.date.arrival).toLocaleString('fr-FR');
        let userName = package.user["giver.name"];

        if (package.package != undefined) {

            package.package.forEach(product => {
                data[product] = {
                    counter: 0,
                    date: 0,
                    user: 0,
                };
                item[product] ? item[product]++ : item[product] = 1;

                data[product].counter = item[product];
                data[product].date = dateobj;
                data[product].user = userName;

            });
        }
    });

    Object.keys(data).forEach(async product => {
        const tr = $("<tr></tr>");

        await getProductName(product, (name) => {
            tr.append(`<th scope='row'>${data[product].counter}x</th>`);
            tr.append(`<td> ${name}</td> `);

            const actionTd = $("<td></td>");
            !open[product] && actionTd.append(`<a style='color:grey' onclick='updateOpen(${product},true);  fillTable(true);' href='#' class='link_button fas fa-plus-square '> </a>`);
            open[product] && actionTd.append(`<a style='color:red' onclick='updateOpen(${product},false); fillTable(true);' href='#' class='link_button fas fa-minus-square '> </a>`);

            tr.append(actionTd);

            if (open[product] == true) {
                const openTd = $("<td colspan='12'> </td>");

                const openTable = $(`
                <table>  
                   
                </table>`);
                const opentBody = $(`<tbody> </tbody>`);

                let counter = 1;

                packages.forEach(package => {
                    if (package.package != undefined) {

                        
                        package.package.forEach(produit => {

                            if (produit == product) {

                                let date = new Date(+package.date.arrival).toLocaleString('fr-FR');
                                let userName = package.user["giver.name"];

                                const openTr = $("<tr> </tr>");

                                openTr.append(`<th scope='row'> ${counter} </th>`);
                                openTr.append(`<td> Received Date : ${date} </td>`);
                                openTr.append(`<td> Giver : ${userName} </td>`);
                                openTr.append(`<td> <i class="far fa-share-square"></i> </td>`);

                                opentBody.append(openTr);

                                counter++;
                            }
                        });
                    }
                });

                openTable.append(opentBody);
                openTd.append(openTable);

                tbody.append(tr);
                tbody.append(openTd);
            }

            !open[product] ? tbody.append(tr) : null;
        });
    });
}

let active = 0;

function fillTable(clear) {

    if (clear) {
        // Clear current table
        $("#tab-title").empty();
        $("#tab-content").empty();
    }

    list.sort((a, b) => b.city - a.city).forEach(async (warehouse, i) => {
        const li = $("<li class='nav-item'> </li>");

        const a = $(`<a class="nav-link" id="${warehouse.city}-tab" 
        data-toggle="tab" role="tab" aria-controls="${warehouse.city}">${warehouse.city} [${await getAddressRequest(warehouse.location)}]</a>`);

        i == active ? a.addClass("active") : a.removeClass("active");
        i == active ? a.attr("aria-selected", "true") : a.attr("aria-selected", "false");

        a.attr("onclick", `active = ${i};fillTable(true);`);

        li.append(a);
        $("#tab-title").append(li);

        const div = $(`<div class="tab-pane fade " id="div-${warehouse.city}" role="tabpanel" aria-labelledby="${warehouse.city}-tab"></div>`);
        i == active ? div.addClass("show active") : null;

        div.load("../../elements/stock/table.html", function () {
            $("#tab-content").append(div);
            getPackageList(warehouse.city, warehouse.stock);
        });

    });

}


function onStockFailed(errorCode) {
    alert("Error getting stocks " + errorCode);
}

function generateTable() {
    if (isUserLogged()) {

        getStockRequest(getUserInfo("token"), onStockSuccess, onStockFailed);
    } else {
        window.location = "../login";
    }
}