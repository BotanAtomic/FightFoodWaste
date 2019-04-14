let list = null;

function onPackageSuccess(data)
{
    list = JSON.parse(data);
    
    if(list)
        fillTable();
}

function onPackageFailed(errorCode)
{
    alert("Error getting package failed : " + errorCode);
}

function fillTable()
{
    let counter = 0;
    list.forEach(package => {
        console.log(package.date.delivered.$date.$numberLong);
        let dateobj = new Date(+package.date.delivered.$date.$numberLong).toLocaleDateString('fr-FR', { timeZone: 'UTC' });

        let userName = package.user.client.$oid;
        let packageList = package.package;
        let location = package.location.coordinates;
        let status = package.status;

        let action = "<a href='#' onclick='alert('test')'> Delete </a>"

         $("#table_dashboard").find("tbody").after("<tr>" +
                                                         "<th scope='row'>" + counter + "  </th>"  + 
                                                         "<td>" + dateobj + "</td> " + 
                                                         "<td>" + userName + "</td> " + 
                                                         "<td>" + packageList + "</td> " + 
                                                         "<td>" + location + "</td> " + 
                                                         "<td>" + status + "</td> " + 
                                                         "<td>" + action + "</td> " 
                                                         );

        counter++;
    });
}

function generateTableAdmin()
{
    if(isUserLogged() && getUserInfo("permission") == 1){
        getPackageRequest(getUserInfo("token"),true,[0,1,2,3,4], onPackageSuccess ,onPackageFailed );
    }
    else{
        window.location = "../login";
    }
}

function generateTableUser()
{
    if(isUserLogged() && getUserInfo("permission") == 0){
        getPackageRequest(getUserInfo("token"),false,[0,1,2,3,4], onPackageSuccess, onPackageFailed );
    }
    else{
        window.location = "../login";
    }  
}