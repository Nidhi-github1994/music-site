'use strict'

//DOM elements 
const _displayArtist = document.getElementById("display-artist");
const _albhabatesButton = document.getElementsByClassName("alpha-btn");
const _displayAllButton = document.getElementById("display-all");

//global variables
let xhr; 
let artistInfo = [];
let songsInfo = [];


//function to check for the localstorage variable
function checkForSubscription(){
    let email = localStorage.getItem("email");
    if(email == null){
        alert("Plase subscribe to view the page");
        document.location = "index.html";
    }
    else{return true;}
}


//function to get the data from the API with xhr object
function xmlHttpRequest(parameter, index){
        xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        let argument = parameter;
        let pageIndex = index;
        xhr.open("GET", "https://deezerdevs-deezer.p.rapidapi.com/search?q='" + argument + "'&index=" + index + "&limit=50");
        xhr.setRequestHeader("x-rapidapi-host", "deezerdevs-deezer.p.rapidapi.com");
        xhr.setRequestHeader("x-rapidapi-key", "e4b18eca08msh4b189d0eddc1567p102bc4jsned4f75eac788");
        xhr.send(null);

}


//function to get the images of the artist
function getArtistImage(){
    xhr.onload = () => {
        
        let wholeData = JSON.parse(xhr.responseText);
        let imageLink;
        let name;
        for(let i in wholeData.data){
            imageLink = wholeData.data[i].artist.picture_big;
            name = wholeData.data[i].artist.name;
            if(artistInfo.length == 0){
                artistInfo.push({[name]: imageLink});
            }
            else{
                /*for(let j = 0; j < artistName.length; j++){
                    for(let key in artistName[j]){
                        if(key != name){
                            //alert("hi");
                            artistName.push({[name]: imageLink});
                        }
                    }
                }*/
                
                for(var key in artistInfo[artistInfo.length -1]){
                    if(key != name){
                        artistInfo.push({[name]: imageLink});
                    }
                }
                
            }
                
        }
        //function call to diaplay images 
        displayArtistImages(artistInfo);
    }
}



//function to diaplay the data stored in the array 
function displayArtistImages(artistList){
    let name;
    let imageLink;
    let dislayList = artistList;
    _displayArtist.innerHTML = "";
    if(dislayList.length != 0){
        for(let i = 0; i < dislayList.length; i++){
            for(var key in dislayList[i]){
                name = key;
                imageLink = dislayList[i][key];
                _displayArtist.innerHTML += "<div class='artist'><div class='col-lg-3'><div class='artist_image'><img src=" + imageLink + " alt=''></div></div><label class='artist_name'>" + name + "</label></div>";
            }
        }   
         //attach click handler to the images 
        clickHandlerImages(); 
    }
    else{
        _displayArtist.innerHTML = "No matching Result Found";
    }
}


//funtion to attach the click events to each images 
function clickHandlerImages(){
    let artistImages = _displayArtist.getElementsByTagName("img");
    let artistNames = _displayArtist.getElementsByTagName("label");
    for(let i = 0; i < artistImages.length; i++){
        artistImages[i].onclick = () => {
            getSongListForArtist(artistNames[i].innerHTML);
        }
    }
}


//function to get the songs list of clicked artist
function getSongListForArtist(name){
    let artistName = name;
    xmlHttpRequest(artistName, 0);
    xhr.onload = () => {
        let songsData = JSON.parse(xhr.responseText);
        let trackId;
        let trackTitle;
        let trackSource;
        let trackAlbum;
        let trackRank;
        let trackArtist;
        for(let i in songsData.data){
            trackId = songsData.data[i].id;
            trackTitle = songsData.data[i].title;
            trackSource = songsData.data[i].preview;
            trackAlbum = songsData.data[i].album.title;
            trackRank = songsData.data[i].rank;
            trackArtist = songsData.data[i].artist.name;
            
            //store the songs of the clicked artist in array
            if(trackArtist == artistName){
                songsInfo.push({trackId, trackTitle, trackRank, trackAlbum, trackArtist, trackSource});
            }
        }
        
        //stored songs array in the session and redirected to the song page
        sessionStorage.setItem("songlist", JSON.stringify(songsInfo));
        location.href = "songs.html";
    }
}
        

//function to get the artist as per clicked alphabate
var getArtistAlphabatically = function(){
    let firstLatter;
    let alphabeticalList = [];
    let clikedButton = this;
    for(let i = 0; i < artistInfo.length; i++){
        for(let key in artistInfo[i]){
            firstLatter = key.substring(0,1);
            if(firstLatter == clikedButton.innerHTML){
                alphabeticalList.push({[key]: artistInfo[i][key]});
            }
        }
    }
    displayArtistImages(alphabeticalList);    
}



//onload finction 
window.onload = function(){
    if(checkForSubscription()){
        var parameter = ' ';
        xmlHttpRequest(parameter, 0);
        getArtistImage();
    
        for(let i = 0; i < _albhabatesButton.length; i++){
            _albhabatesButton[i].onclick = getArtistAlphabatically;
        }
    }
    
    _displayAllButton.onclick = () => {
        xmlHttpRequest(parameter, 0);
        getArtistImage();
    }

}

          



	
	





    
