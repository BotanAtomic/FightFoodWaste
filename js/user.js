let user;

function handleLogin(event) {
    event.preventDefault();

    let email = $("#form_login_email").val();
    let password = $("#form_login_password").val();

    if (email && password)
        loginRequest(email, password, onLogin, onLoginFailed);
}

function handleRegistration(event) {
    event.preventDefault();
    
    let email = $("#form_register_email").val();
    let name = $("#form_register_name").val();
    let forename = $("#form_register_forename").val();
    let password = $("#form_register_password").val();
    let type = $("#form_register_type").val();

    let agreement = $("#form_register_email").val();

    if (email && name && forename && password && agreement)
        registerRequest(name, forename, email, type, password, onRegister, onRegisterFailed);
}

function onLogin(data) {
    user = JSON.parse(data);

    window.localStorage.setItem('user', data);

    window.location = "../dashboard";
}

function onRegister(data) {
    alert("Sucessfull signup ");
    gotoPage("login.html");
}


function onRegisterFailed(statusCode) {
    alert("Registration failed : " + statusCode);
}

function onLoginFailed(statusCode) {
    alert("Bad username or password : " + statusCode);
}

function isUserLogged() {
    if( window.localStorage.getItem('user') != null ){
        if( !user ){
            user = JSON.parse(window.localStorage.getItem('user'));
        }
        return true;
    }
    return false;   
}

function getUserInfo(field) {
    return user[field];
}

function userDisconnect() {
    window.localStorage.removeItem('user');
}
