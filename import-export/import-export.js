const inputDial = document.querySelector(".inputFile");
const LocalStorNameData = "AllItems"
const LocalStrIndex = "InFileMode"

function importHandle() {
    inputDial.click();
}

inputDial.addEventListener('change', function(e){
    const reader = new FileReader()
    reader.onload = function(){
        try{
            const allData = JSON.parse(reader.result);
            
            if(allData.data != null && allData.index != null){
                //console.log(allData.data);
                DataAppend(allData.data, allData.index);
                alert("import successful");
            }
            else{
                alert("import Failed !\nPossible reasons:"+
                    "\n• Wrong name\n• extension is not .json");
            }
        }
        catch(e){
            alert("import Failed !\nPossible reasons:"+
            "\n• wrong name\n• extension is not .json\n• file corrupted(very rare)");
        }

    }
    reader.readAsText(inputDial.files[0]);
});

function DataAppend(data, index) {
    let downloaded_data = data
    let downloaded_index = index
        
    if(localStorage.getItem(LocalStorNameData)==null){
        let db = JSON.stringify({});
        localStorage.setItem(LocalStorNameData, db);
    }
    if(localStorage.getItem(LocalStrIndex)==null){
        let db = JSON.stringify({});
        localStorage.setItem(LocalStrIndex, db);
    }

    let originalDb = JSON.parse(localStorage.getItem(LocalStorNameData));
    let originalInd = JSON.parse(localStorage.getItem(LocalStrIndex));
    console.log(originalDb);
    let j=1;
    while(originalDb[j]!=null){
        j++;
    }
    
    let i=1;
    while(downloaded_data[i]!=null){
        originalDb[j++] = downloaded_data[i];
        i++;
    }
    console.log(originalDb)
    localStorage.setItem(LocalStorNameData, JSON.stringify(originalDb));
    
    originalInd = downloaded_index
    console.log(originalInd);
    localStorage.setItem(LocalStrIndex, JSON.stringify(originalInd));
}

function exportFile() {
    let masterDb = {}
    let scriptDb = JSON.parse(localStorage.getItem(LocalStorNameData));
    let listDb = JSON.parse(localStorage.getItem(LocalStrIndex));
    if(scriptDb != null)
        masterDb.data = scriptDb;
    if(listDb != null)
        masterDb.index = listDb;
    console.log(masterDb);
    download(JSON.stringify(masterDb), "Back-Up(Edit App).json", "text/plain");
}

let template_start=`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        :root {
            --background-color: #fff;
            --text-color: #000000;
            --menu-item: #FF9029;
            --menu-item-active: #bb5a00;
            --menu-item-border: #b44800;
            --menu-text: #3C3C3C;
            --menu-border: #696969;
            --menuitem-click: #c2c2c2;
            --menu-text: #5F5F5F;
            --table-color: rgb(194, 194, 194);
            --table-border: rgb(97, 97, 97);
        }


        [data-theme="dark"] {
            --background-color: #2E2E2E;
            --text-color: #fff;
            --menu-item: #FF9029;
            --menu-item-active: #bb5a00;
            --menu-item-border: #b44800;
            --menu-text: #3C3C3C;
            --menu-border: #c2c2c2;
            --menuitem-click: #7c7c7c;
            --menu-text: #fff;
            --table-color: rgb(68, 68, 68);
            --table-border: rgb(146, 146, 146);
        }

        * {
            margin: 0;
            font-family: 'Kumbh Sans', sans-serif;
        }

        body {
            background-color: var(--background-color);
            max-width: 100vw;
            overflow-x: hidden;
            transition: 1s all ease;
            overscroll-behavior: contain;
        }

        .container {
            display: flex;
            justify-content: center;
            background-color: var(--background-color);
            z-index: 9;
            transition: 1s all ease;
        }

        .content {
            min-height: 25vh;
            width: 97%;
            align-self: center;
            font-size: 1.1rem;
            background-color: var(--background-color);
            color: var(--text-color);
            margin-top: 3rem;
            margin-bottom: 25vh;
            outline: none;
            border-radius: 5px;
            transition: 1s all ease;
        }

        .container pre {
            overflow-x: auto;
            white-space: pre-wrap;
            white-space: -moz-pre-wrap;
            white-space: -pre-wrap;
            white-space: -o-pre-wrap;
            word-wrap: break-word;
            transition: 1s all ease;
        }
    </style>
    <script>
            document.documentElement.setAttribute("data-theme", "dark")
    </script>
</head>

<body>
    <div class="container">
        <pre class="content">`


let template_end = `</pre>
</div>
</body>

</html>`

function exportThis() {
    let index = JSON.parse(localStorage.getItem(LocalStrIndex)).file
    let obj = JSON.parse(localStorage.getItem(LocalStorNameData))
    let html_data = obj[index].data
    let html_name = obj[index].name
    html_data = template_start+html_data+template_end
    download(html_data, html_name+'.html', 'text/plain')
}

function download(data, strFileName, strMimeType) {

    var self = window, // this script is only for browsers anyway...
        defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
        mimeType = strMimeType || defaultMime,
        payload = data,
        url = !strFileName && !strMimeType && payload,
        anchor = document.createElement("a"),
        toString = function(a){return String(a);},
        myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
        fileName = strFileName || "download",
        blob,
        reader;
        myBlob= myBlob.call ? myBlob.bind(self) : Blob ;
  
    if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
        payload=[payload, mimeType];
        mimeType=payload[0];
        payload=payload[1];
    }


    if(url && url.length< 2048){ // if no filename and no mime, assume a url was passed as the only argument
        fileName = url.split("/").pop().split("?")[0];
        anchor.href = url; // assign href prop to temp anchor
          if(anchor.href.indexOf(url) !== -1){ // if the browser determines that it's a potentially valid url path:
            var ajax=new XMLHttpRequest();
            ajax.open( "GET", url, true);
            ajax.responseType = 'blob';
            ajax.onload= function(e){ 
              download(e.target.response, fileName, defaultMime);
            };
            setTimeout(function(){ ajax.send();}, 0); // allows setting custom ajax headers using the return:
            return ajax;
        } // end if valid url?
    } // end if url?


    //go ahead and download dataURLs right away
    if(/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)){
    
        if(payload.length > (1024*1024*1.999) && myBlob !== toString ){
            payload=dataUrlToBlob(payload);
            mimeType=payload.type || defaultMime;
        }else{			
            return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
                navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
                saver(payload) ; // everyone else can save dataURLs un-processed
        }
        
    }//end if dataURL passed?

    blob = payload instanceof myBlob ?
        payload :
        new myBlob([payload], {type: mimeType}) ;


    function dataUrlToBlob(strUrl) {
        var parts= strUrl.split(/[:;,]/),
        type= parts[1],
        decoder= parts[2] == "base64" ? atob : decodeURIComponent,
        binData= decoder( parts.pop() ),
        mx= binData.length,
        i= 0,
        uiArr= new Uint8Array(mx);

        for(i;i<mx;++i) uiArr[i]= binData.charCodeAt(i);

        return new myBlob([uiArr], {type: type});
     }

    function saver(url, winMode){

        if ('download' in anchor) { //html5 A[download]
            anchor.href = url;
            anchor.setAttribute("download", fileName);
            anchor.className = "download-js-link";
            anchor.innerHTML = "downloading...";
            anchor.style.display = "none";
            document.body.appendChild(anchor);
            setTimeout(function() {
                anchor.click();
                document.body.removeChild(anchor);
                if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(anchor.href);}, 250 );}
            }, 66);
            return true;
        }

        // handle non-a[download] safari as best we can:
        if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
            url=url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
            if(!window.open(url)){ // popup blocked, offer direct download:
                if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
            }
            return true;
        }

        //do iframe dataURL download (old ch+FF):
        var f = document.createElement("iframe");
        document.body.appendChild(f);

        if(!winMode){ // force a mime that will download:
            url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
        }
        f.src=url;
        setTimeout(function(){ document.body.removeChild(f); }, 333);

    }//end saver




    if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
        return navigator.msSaveBlob(blob, fileName);
    }

    if(self.URL){ // simple fast and modern way using Blob and URL:
        saver(self.URL.createObjectURL(blob), true);
    }else{
        // handle non-Blob()+non-URL browsers:
        if(typeof blob === "string" || blob.constructor===toString ){
            try{
                return saver( "data:" +  mimeType   + ";base64,"  +  self.btoa(blob)  );
            }catch(y){
                return saver( "data:" +  mimeType   + "," + encodeURIComponent(blob)  );
            }
        }

        // Blob but not URL support:
        reader=new FileReader();
        reader.onload=function(e){
            saver(this.result);
        };
        reader.readAsDataURL(blob);
    }
    return true;
}; /* end download() */