let list = [];

const products = {};

async function onStockSuccess(data) {
    if (data) {
        list = JSON.parse(data);

        for (const warehouse of list) {
            warehouse.locationName = await getAddressRequest(warehouse.location);
            products[warehouse.locationName] = {};

            for (const product of warehouse.stock) {
                for (const productId of product.package) {
                    if (products[warehouse.locationName][productId]) {
                        let obj = products[warehouse.locationName][productId];
                        obj.quantity++;

                        if (!obj.information.some(i => i.date === +product.date.arrival)) {
                            obj.information.push({
                                date: +product.date.arrival, giver: product.user['giver.name']
                            });
                        }

                    } else {
                        products[warehouse.locationName][productId] = {
                            quantity: 1,
                            name: await getProductName(productId),
                            id: productId,
                            information: [
                                {date: +product.date.arrival, giver: product.user['giver.name']}
                            ]
                        }
                    }
                }
            }
        }

        fillTable();
    }
}

function toggleBody(body, event) {
    const element = $(document.getElementById(body));
    const button = $(event.target);

    if(element.is(":hidden")) {
        element.show();
        button.css('color', 'red');
        button.removeClass("fa-plus-square").addClass("fa-minus-square");
    } else {
        element.hide();
        button.css('color', 'grey');
        button.removeClass("fa-minus-square").addClass("fa-plus-square");
    }
}

function getPackageList(city, locationName) {

    const localProducts = products[locationName];

    const tbody = $(`#div-${city}`).find("tbody");

    Object.values(localProducts).forEach((value) => {
        const tr = $("<tr></tr>");

        tr.append(`<th scope='row'>${value.quantity}x</th>`);
        tr.append(`<td> ${value.name}</td> `);

        const actionTd = $("<td></td>");

        const openObjectId = `body-${value.id}-${city}`;
        const openTd = $(`<td id='${openObjectId}' colspan='12'> </td>`);

        const openTable = $(`
                <table>  
                   
                </table>`);
        const openBody = $(`<tbody> </tbody>`);



        value.information.forEach((v, i) => {
            let date = new Date(+v.date).toLocaleString('fr-FR');
            let userName = v.giver;

            const openTr = $("<tr> </tr>");

            openTr.append(`<th scope='row'> ${i} </th>`);
            openTr.append(`<td> Received Date : ${date} </td>`);
            openTr.append(`<td> Giver : ${userName} </td>`);

            openTr.css("border-top", "");

            openBody.append(openTr);
        });


        openTd.hide();

        actionTd.append(`<a style='color:grey' onclick='toggleBody("${openObjectId}", event);' class='link_button fas fa-plus-square'> </a>`);

        tr.append(actionTd);

        openTable.append(openBody);
        openTd.append(openTable);

        tbody.append(tr);
        tbody.append(openTd);
    });
}

let active = 0;

function fillTable(clear) {

    if (clear) {
        $("#tab-title").empty();
        $("#tab-content").empty();
    }

    list.sort((a, b) => b.city - a.city).forEach(async (warehouse, i) => {
        const li = $("<li class='nav-item'> </li>");

        const a = $(`<a class="nav-link" id="${warehouse.city}-tab"
        data-toggle="tab" role="tab" aria-controls="${warehouse.city}">${warehouse.city} [${warehouse.locationName}]</a>`);


        i === active ? a.addClass("active") : a.removeClass("active");
        i === active ? a.attr("aria-selected", "true") : a.attr("aria-selected", "false");

        a.attr("onclick", `active = ${i};fillTable(true);`);

        li.append(a);
        $("#tab-title").append(li);

        const div = $(`<div class="tab-pane fade " id="div-${warehouse.city}" role="tabpanel" aria-labelledby="${warehouse.city}-tab"></div>`);
        i === active ? div.addClass("show active") : null;

        div.load("../../elements/stock/table.html", function () {
            $("#tab-content").append(div);
            if (i === active)
                getPackageList(warehouse.city, warehouse.locationName);
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