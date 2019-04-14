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

