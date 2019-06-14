let user;

function handleLogin(event) {
    event.preventDefault();

    let email = $("#form_login_email").val();
    let password = $("#form_login_password").val();

    if (email && password)
        loginRequest(email, password, onLogin, onLoginFailed);
}

function handleRegistration(event) {
    console.log("Register");
    event.preventDefault();

    let email = $("#form_register_email").val();
    let name = $("#form_register_name").val();
    let forename = $("#form_register_forename").val();
    let password = $("#form_register_password").val();
    let type = $("#form_register_type").val();
    let address = $("#form_register_address").val();
    let agreement = $("#form_register_email").val();
    let skills = $("#skills").val();

    if (+type === 0) {
        skills = skills.toLowerCase().split(",");
    } else {
        skills = [];
    }

    getLatLong(address).then(coordinates => {
        if (email && name && forename && password && agreement && address) {
            registerRequest(name, forename, email, type, [coordinates.lat, coordinates.lng], password, skills, onRegister, onRegisterFailed);
        }
    });
}

function onLogin(data) {
    user = JSON.parse(data);
    window.sessionStorage.setItem('user', data);

    window.location = "../dashboard";
}

function onRegister(data) {
    window.location = "../login/";
}


function onRegisterFailed(statusCode) {
    alert("Registration failed : " + statusCode);
}

function onLoginFailed(statusCode) {
    alert("Bad username or password : " + statusCode);
}

function isUserLogged() {

    if (window.sessionStorage.getItem('user') != null) {
        if (!user)
            user = JSON.parse(window.sessionStorage.getItem('user'));

        return true;
    }
    return false;
}

function getUserInfo(field) {
    return user[field];
}

function userDisconnect() {
    window.sessionStorage.removeItem('user');
}
