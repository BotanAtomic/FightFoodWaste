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

function onMailSuccess(data){
    alert("Success mail" + data);
}

function onMailError(error){
    alert("Could not send the email : " + error);
}

function sendEmail(email){
    console.log("Sending email : " + email);

    let skills = $("#skills").val();
    skills = skills.toLowerCase().split(",");

    if(skills) {
        sendMailServiceRequest(getUserInfo("token"),email,skills,onMailSuccess,onMailError); 
    }
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
        tr.append(`<th> ${ Math.round(user.distance/1000) } Km </th>`);
        tr.append(`<th> ${user.skills} </th>`);
        tr.append(`<th> <a href="#" onclick="sendEmail('${user.email}',)" > <i class="fa fa-envelope-square fa-2x"></i> </a> </th>`);

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