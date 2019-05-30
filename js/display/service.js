let list = null;

function handleSocket(data) {

}

function onServiceSuccess(data) {
    list = JSON.parse(data);

    if (list){
            generateTable(true);
        }
}

function onServiceFailed(error) {
    alert("Failed getting services : ", error);
}

function generateTable(clear){
    if(clear){
        $("#table-services").find("tbody").empty();
    }
    const tbody =  $("#table-services").find("tbody");

    let counter = 1;

    list.forEach(user => {

        console.log(user);
       
        const tr = $("<tr>  </tr>");

        tr.append(`<th> ${counter}  </th>`);
        tr.append(`<th> ${user.forename} ${user.name} </th>`);
        tr.append(`<th> ${user.email} </th>`);
        tr.append(`<th> ${ Math.round(user.distance) } m </th>`);
        tr.append(`<th> ${user.skills} </th>`);
        tr.append(`<th> Action </th>`);

        counter++;
        tbody.append(tr);
    });
}

function generateService(skills) {
    if (isUserLogged()) {

        getServiceRequest(getUserInfo("token"), skills, onServiceSuccess, onServiceFailed);

    } else {
        window.location = "../login";
    }
}