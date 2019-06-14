function handleUpdate(event) {
    console.log(event);
    alert("Goole");
} 

async function fillUserInfo() {
    $("#form_register_email").val(getUserInfo("email"));
    $("#skills").val(getUserInfo("skills")); 

    let address = await getAddressRequest(getUserInfo("location").coordinates,true);
    $("#form_register_address").val(address);

}

$(document).ready(function () {
    $("#title-name").append(getUserInfo("forename"));
    fillUserInfo();
});