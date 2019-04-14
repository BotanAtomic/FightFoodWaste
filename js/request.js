
function doRequest(api,method,data, onSuccess, onError)
{
    var xhr = new XMLHttpRequest();
    var url = "http://51.75.203.112/api/";

    xhr.open(method, url + api, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 ) 
        {
            if(xhr.status === 200)
            {
                onSuccess(xhr.responseText);
            }    
            else
            {
                onError(xhr.status);
            }
        }
    };

    var data = data instanceof String ? data : JSON.stringify(data);
    xhr.send(data);
}

/***********************************User Request******************************************* */

function loginRequest(email,password,callback,error)
{
    doRequest("user/login/", "POST", {email, password} ,callback, error );
}

function registerRequest(name,forename,email,type,password,callback,error)
{
    doRequest("user/register/","POST",{ email, password, name, forename, type },callback,error);
}

/**************************************************************************************** */


/***********************************Packages Request******************************************* */

function createPackageRequest(token,package,callback,error){
    doRequest("delivery/create/", "POST", {token, package} ,callback, error );
}

function getPackageRequest(token,all,status,callback,error){
    doRequest("delivery/get/", "POST", {token,all,status} ,callback, error );
}


/**************************************************************************************** */

