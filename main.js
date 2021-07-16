
let dark=1;
if(localStorage.getItem("DarkModeEditApp") == "on"){
    dark=0;
}

function toggleCirc() {
    
    if(dark==1){
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("DarkModeEditApp", "on");
        dark=0;
    }
    else{
        document.documentElement.setAttribute("data-theme", "root");
        localStorage.setItem("DarkModeEditApp", "off");
        dark=1;
    }
}
function saveUsername() {
    const uname = document.querySelector('#uname').value;
    if(uname.length<3){
        alert("Username should atleast contains 3 characters");
    }
}