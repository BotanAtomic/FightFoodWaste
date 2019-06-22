function checkTopButton() {
    if (isUserLogged()) {
        $("#top-button").html(`Bonjour ${getUserInfo('forename')}`);
        $("#top-button").attr('href', '');
        $("#disconnect-button").show();
    } else {
        $("#disconnect-button").hide();
    }
}

function loadNavBar() {
    $("header").load("../../elements/navbar.html");
}

function loadFooter(){
    $("footer").load("../../elements/footer.html");
}

function loadDashboard() {
    if (isUserLogged()) {
        if (getUserInfo('type') === 1 || getUserInfo('permission') === 1) {
            $("#dashboard-content").load("../../elements/dashboard/admin.html");
        } else {
            $("#dashboard-content").load("../../elements/dashboard/user.html");
        }
    } else {
        window.location = "../login";
    }
}

function loadPackages() {
    if (isUserLogged()) {
        $("#package-content").load("../../elements/package/table.html");
    } else {
        window.location = "../login";
    }
}

function loadStocks() {
    if (isUserLogged() && getUserInfo('permission') === 1) {
        $("#stock-content").load("../../elements/stock/index.html");
    } else {
        window.location = "../login";
    }
}

function loadMap() {
    if (isUserLogged()) {
        $("#map-content").load("../../elements/map/index.html");
    } else {
        window.location = "../login";
    }
}

function loadServices() {
    if (isUserLogged()) {
        $("#service-content").load("../../elements/service/index.html");
    } else {
        window.location = "../login";
    }
}
function loadAccount() {
    if (isUserLogged()) {
        $("#account-content").load("../../elements/account/user.html");
    } else {
        window.location = "../login";
    }
}

function loadUsers(){
    if(isUserLogged() && getUserInfo('permission') === 1){
       $("#users-content").load("../../elements/users/index.html")
    }else {
        window.location = "../login";
    }
}

function loadWebgl(){
    $("#webgl-view").load("../../elements/webgl/index.html");
}