if("serviceWorker" in navigator){
    navigator.serviceWorker.register("../sw.js").then(
        registration => {
            console.log("SW registered");
            console.log(registration);
        }
    ).catch(error => {
        console.log("SW failed");
    })
}

const AppUrl = 'https://secret-script.herokuapp.com/script/';
if(localStorage.getItem('AllItems')==null){
    let allFilesData = {
    
    }
    localStorage.setItem('AllItems', JSON.stringify(allFilesData));
}
let Data = JSON.parse(localStorage.getItem('AllItems'));
if(Data.username != null){
    animatToast(`Signed as ${Data['username']}`, 'azure');
    const data = {
        username: "This is to store data",
        email: Data.username,
        password: localStorage.getItem('AllItems')
    };
    if(window.navigator.onLine){
        fetch(AppUrl+Data.username,{method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)})
        .then(res => {
            return res.json();
        })
        .then(response => {
            if(response.msg == 'Updated successfully'){
                setTimeout(() => {
                    animatToast('Data backup succesful !', 'rgb(217, 159, 255)');
                }, 2000);
            }
            else{
                setTimeout(() => {
                    animatToast('Data backup failed !', 'pink');
                }, 2000);
            }
        });
    }
    else{
        setTimeout(() => {
            animatToast('Data backup failed !', 'pink');
        }, 2000);
    }
}

if(localStorage.getItem('InFileMode')==null){
    localStorage.setItem('InFileMode', JSON.stringify({file:0}));
    console.log(JSON.parse(localStorage.getItem('InFileMode')));
}

let clicked = false;
const content = document.querySelector('.content');
function triggerFirstClick() {
    document.querySelector('.tools').style.transform='translateX(-50%)';
    document.querySelector('.editBtn').classList.add('hide');
    clicked=true;
    content.contentEditable=true;
    content.focus();
    console.log('Clicked');
}

function printIt(){
    console.log('typing...');
    savedata();
}

let dark=1;
if(localStorage.getItem("DarkModeEditApp") == "on"){
    document.querySelector('.circle').classList.add('move');
    document.querySelector('.toggleme').classList.add('move');
    dark=0;
}
function toggleCirc() {
    document.querySelector('.circle').classList.toggle('move');
    document.querySelector('.toggleme').classList.toggle('move');
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
    renderer();
}

function toggleMenu() {
    document.querySelector('.menuItems').classList.toggle('active');
    document.querySelector('.opacitor').classList.toggle('active');
}

function saveAndExit() {
    savedata();
    document.querySelector('.editBtn').classList.remove('hide');
    document.querySelector('.tools').style.transform='translateX(0%)';
    content.contentEditable=false;
    renderer();
    animatToast("Temp file saved !", "rgb(175, 255, 206)");
}

function refreshContent() {
    localStorage.setItem('InFileMode', JSON.stringify({file:0}));
    renderer();
    content.innerHTML = "";
}

const allbtns = document.querySelectorAll('.btn');
let size = 0;
let color = 0;
allbtns.forEach(butn => {
    
    butn.addEventListener('click', () => {
        let command = butn.dataset['element'];
        let colorOfPallete = "#fdff70";
        let colorOfFont = "white";
        if(localStorage.getItem('DarkModeEditApp') == 'off'){
            colorOfPallete = "#9D0000";
            colorOfFont = "black";
        }
        if(command == 'foreColor'){
            if(color == 0){
                document.execCommand(command, false, colorOfPallete);
                butn.style.color = colorOfPallete;
                color = 1;
            }
            else{
                document.execCommand(command, false, colorOfFont);
                butn.style.color = colorOfFont;
                color = 0;
            }
        }
        else if(command == 'fontSize'){
            
            if(size == 0){
                document.execCommand(command, false, 5);
                size = 1;
            }
            else{
                document.execCommand(command, false, 4);
                size = 0;
            }
        }
        else
            document.execCommand(command, false, null);

        savedata();
    });
});

function savedata() {
    const status = JSON.parse(localStorage.getItem('InFileMode'));
    const source = document.querySelector('.content').innerHTML;
    let AllTextItems = JSON.parse(localStorage.getItem('AllItems'));
    if(status.file == 0){
        AllTextItems[0]={
            name:'Unsaved file',
            data:source
        }
    }
    else{
        AllTextItems[status.file]={
            name:AllTextItems[status.file].name,
            data:source
        }
    }  
    localStorage.setItem('AllItems', JSON.stringify(AllTextItems));
}


function popSaveAs() {
    document.querySelector('.saveAs').classList.toggle('show');
    document.querySelector('.opacitor3').classList.toggle('active');
}

function animatToast(msg, bgColor) {
    const toastNote = document.querySelector('.toastNotify');
    if(toastNote.classList = "toastNotify animate")
        toastNote.classList.remove('animate');
    toastNote.innerHTML = msg;
    toastNote.style.backgroundColor = bgColor;
    toastNote.classList.add('animate');
    setTimeout(() => {
        toastNote.classList.remove('animate');
    }, 1500);
    //console.log(toastNote.classList);
}

function popupfiles() {
    document.querySelector('.chooseFiles').classList.toggle('show');
    document.querySelector('.opacitor2').classList.toggle('active');
}



function CreateFile() {
    const filename = document.querySelector('.fileName').value;
    const Data = document.querySelector('.content').innerHTML;
    
    let i=1;
    let AllTextItems = JSON.parse(localStorage.getItem('AllItems'));
    while(AllTextItems[i]!=null){
        i++;
    }
    AllTextItems[i] = {
        name:filename,
        data:Data
    }   
    localStorage.setItem('AllItems', JSON.stringify(AllTextItems));
    localStorage.setItem('InFileMode', JSON.stringify({file:i}));
    popSaveAs();
    renderer();
}

function openFile(id) {
    if(id == 0)
        localStorage.setItem('InFileMode', JSON.stringify({file:0}));
    else
        localStorage.setItem('InFileMode', JSON.stringify({file:id}));
    
    popupfiles();
    renderer();
}

function deleteItem(id) {
    
    if(confirm("Confirm deletion?")){
        let AllTextItems = JSON.parse(localStorage.getItem('AllItems'));
        let deltion = {};
        let num=0;
        let i=0;
        while(AllTextItems[i]!=null){
            if(i == id){
                localStorage.setItem('InFileMode', JSON.stringify({file:0}));
                console.log(`Deleted id: ${i} file: ${localStorage.getItem('InFileMode')}`);
            }
            else{
                deltion[num++] = AllTextItems[i];
            }
            i++;
        }
        localStorage.setItem('AllItems', JSON.stringify(deltion));

        console.log(deltion);
        animatToast("Deleted successfully!", "pink");
        renderer();
    }
    else{
        animatToast("Calcelled deletion!", "pink");
    }
}

function SyncDataBackup() {
    let Available_App_Data = JSON.parse(localStorage.getItem('AllItems'));
    if(Available_App_Data.username!=null){
        let uname = Available_App_Data.username;
        if(uname!=""){
        
            fetch(AppUrl+uname)
            .then(res => {
                return res.json();
            })
            .then(response => {
                console.log(response.password);
                let i=1, j=0;
                let downloade_App_Data = JSON.parse(response.password);
                while (Available_App_Data[i]!=null)
                    i++;

                while (downloade_App_Data[j] != null) {
                    Available_App_Data[i] = downloade_App_Data[j];
                    i++;
                    j++;
                }

                localStorage.setItem('AllItems', JSON.stringify(Available_App_Data));
            })
            .catch(err => {
                console.error(err);
            })
        }
    }
}

function renderer() {
    const status = JSON.parse(localStorage.getItem('InFileMode'));
    let AllTextItems = JSON.parse(localStorage.getItem('AllItems'));
    //console.log(AllTextItems);
    if(AllTextItems[status.file] != null)
        document.querySelector('.content').innerHTML = AllTextItems[status.file].data;

    if(status.file != 0){
        document.querySelectorAll('.filenameDisplay').forEach(nameOf => {
            nameOf.textContent = AllTextItems[status.file].name;
        });
        document.querySelectorAll('.hideIf').forEach(nameOf => {
            nameOf.style.display = "none";
        });
    }
    else{
        document.querySelectorAll('.filenameDisplay').forEach(nameOf => {
            nameOf.textContent = "Select file";
        });
        document.querySelectorAll('.hideIf').forEach(nameOf => {
            nameOf.style.display = "flex";
        });
    }
    let j=1;
    let Str = "<li onclick='openFile(0)'><p>Unsaved file</p></li>"
    while(AllTextItems[j]!=null){
        Str = Str.concat(`<li><div class='nameOfFile' onclick='openFile(${j})'><p> ${AllTextItems[j].name}</p></div> <div class='delIcon' onclick="deleteItem(${j})"><i class="fas fa-trash-alt"></i></div></li>`);
        j++;
    }
    document.querySelector('.allFiles').innerHTML = Str;
    
    //To set theme
    const fonts = document.querySelectorAll('font');
    if(localStorage.getItem('DarkModeEditApp') == 'off'){
        fonts.forEach(font => {
            console.log('red color');
            if(font.color){
                font.color = "#9D0000";
            }
        });
    }
    else if(localStorage.getItem('DarkModeEditApp') == 'on'){
        fonts.forEach(font => { 
            console.log('yellow color');
            if(font.color){
                font.color = "#fdff70";
            }
        });
    }
}
renderer();