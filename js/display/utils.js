function checkTopButton() {
    if(isUserLogged()) {
        $("#top-button").html(`Bonjour ${getUserInfo('forename')}`);
        $("#top-button").attr('href', '');

        let disconnectButton = $('<button/>',
        {
            text: 'Disconnect',
            click: userDisconnect()
        });
        
    }
} 

function loadNavBar()
{
    $("header").load("../../elements/navbar.html"); 
}

function loadFooter()
{
    $("footer").load("../../elements/footer.html"); 
}

function loadDashboard()
{
    if(isUserLogged()){
        console.log("Logged");
        if(getUserInfo('type') == 1) {
            console.log("admin");
            $("#dashboard-content").load("../../elements/dashboard/admin.html");
        }
        else{
            console.log("user");
            $("#dashboard-content").load("../../elements/dashboard/user.html");
        }
    }
    else{
        window.location = "../login";
    }
}