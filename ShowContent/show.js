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
let clicked = false;
const content = document.querySelector('.content');
function triggerFirstClick() {
    document.querySelector('.tools').style.transform='translateX(-50%)';
        clicked=true;
        content.contentEditable=true;
        content.focus();
        console.log('Clicked');
}

function printIt(){
    console.log('typing...');
    savedata();
}

function saveAndExit() {
    savedata();
    document.querySelector('.tools').style.transform='translateX(0%)';
    content.contentEditable=false;
    renderer();
    animatToast("Temp file saved !", "rgb(175, 255, 206)");
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
    const source = document.querySelector('.content').innerHTML;
    localStorage.setItem('TextOfEditor', source);
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
    console.log(toastNote.classList);
}

function renderer() {
    document.querySelector('.content').innerHTML = localStorage.getItem('TextOfEditor');

    //To set theme
    const fonts = document.querySelectorAll('font');
    if(localStorage.getItem('DarkModeEditApp') == 'off'){
        fonts.forEach(font => {
            if(font.color == "#fdff70"){
                font.color = "#9D0000";
            }
        });
    }
    else if(localStorage.getItem('DarkModeEditApp') == 'on'){
        fonts.forEach(font => { 
            if(font.color == "#9D0000"){
                font.color = "#fdff70";
            }
        });
    }
}
renderer();