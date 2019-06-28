async function handleUpdate(event) {
    event.preventDefault();
    let email = $("#form_register_email").val();
    let skills = $("#skills").val();
    let password = $("#form_register_password").val();

    skills = skills.toLowerCase().split(",");
    let address = $("#form_register_address").val();

    let coordinates = await getLatLong(address);

    let requestMessage = $("#request_message");

    updateRequest(getUserInfo("token"), email, password, skills, {type:"Point", coordinates: [coordinates.lat, coordinates.lng]}, () => {
        user["skills"] = skills;
        user["email"] = email;
        user["location"].coordinates = coordinates;
        requestMessage.css("display", "");
    }, () => {
        requestMessage.val("An error occurred")
        requestMessage.css("display", "");
        requestMessage.css("color", "red");
    });

}

async function fillUserInfo() {
    $("#form_register_email").val(getUserInfo("email"));
    $("#skills").val(getUserInfo("skills"));

    let address = await getAddressRequest(getUserInfo("location").coordinates, true);
    $("#form_register_address").val(address);

}

$(document).ready(function () {
    $("#title-name").append(getUserInfo("forename"));
    fillUserInfo();
});