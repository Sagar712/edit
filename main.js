let dark=1;
const AppUrl = 'https://secret-script.herokuapp.com/script/';
if(localStorage.getItem("DarkModeEditApp") == "on"){
    dark=0;
}
if(localStorage.getItem('AllItems')==null){
    let allFilesData = {
        
    }
    localStorage.setItem('AllItems', JSON.stringify(allFilesData));
}

if(localStorage.getItem('AllItems')==null){
    let allFilesData = {
    
    }
    localStorage.setItem('AllItems', JSON.stringify(allFilesData));
}
let Data = JSON.parse(localStorage.getItem('AllItems'));
if(Data['username']!=null){
    document.querySelector('#uname').value = Data['username'];
    if(confirm(`Do you want to be logged in as ${Data['username']}`)){
        location.href = './ShowContent/show.html';
    }
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
async function saveUsername() {
    const uname = document.querySelector('#uname').value;
    if(uname.length<3){
        alert("Username should atleast contains 3 characters");
    }
    else{
        let Data = JSON.parse(localStorage.getItem('AllItems'));
        Data['username'] = uname;
        localStorage.setItem('AllItems', JSON.stringify(Data));
        const data = {
            username: "",
            email: uname,
            password: ""
        };
        await fetch(AppUrl,{method:'post', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)})
        .then(res => {
            return res.json();
        })
        .then(response => {
            console.log(response);
            if(response.msg == "user alreay exists!!"){
                alert(response.msg);
            }
            else{
                location.href = './ShowContent/show.html';
            }
        });
    }
}