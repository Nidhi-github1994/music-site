"use strict";


let xhr; 
let albumInfo = [];
let songsInfo = [];

//all the DOM Elements
const _displayAlbum = document.getElementById("album-list");
const _searchItem = document.getElementById("input-item");
const _serachButton = document.getElementById("search-btn");


//check for the subcription if the local storage is not set then redirect to the home page 
function checkForSubscription(){
    let email = localStorage.getItem("email");
    if(email == null){
        alert("Plase subscribe to view the page");
        document.location = "index.html";
    }
    else{return true;}
}


//function for the xhr request
function xmlHttpRequest(parameter, index){
    xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    let argument = parameter;
    let pageIndex = index;
    xhr.open("GET", "https://deezerdevs-deezer.p.rapidapi.com/search?q='" + argument + "'&index=" + pageIndex + "&limit=50");
    xhr.setRequestHeader("x-rapidapi-host", "deezerdevs-deezer.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "e4b18eca08msh4b189d0eddc1567p102bc4jsned4f75eac788");
    xhr.send(null);

}


//function to get the images of the album
function getAlbumImage(){
    xhr.onload = function(){
        let  wholeData = JSON.parse(xhr.responseText);
        let imageLink;
        let name;
        for(var i in wholeData.data){
            imageLink = wholeData.data[i].album.cover_medium;
            name = wholeData.data[i].album.title;
            if(albumInfo.length == 0){
                albumInfo.push({[name]: imageLink});
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
                
                for(var key in albumInfo[albumInfo.length -1]){
                    if(key != name){
                        albumInfo.push({[name]: imageLink});
                    }
                }
            }
                
        }
        displayAlbumImages(albumInfo);
    }
}


//function to display the images from the array 
function displayAlbumImages(albumInfo){
    let name;
    let imageLink;
    _displayAlbum.innerHTML = "";
    for(let i = 0; i < albumInfo.length; i++){
        for(var key in albumInfo[i]){
            name = key;
            imageLink = albumInfo[i][key];
            _displayAlbum.innerHTML += "<li><img src=" + imageLink +"><br><label class='name'>" + name + "</label></li>";
        }
    }        
    clickHandlerImages(); 
}


//function to attach the click event handler to the images
function clickHandlerImages(){
    let albumImages = _displayAlbum.getElementsByTagName("img");
    let albumNames = _displayAlbum.getElementsByTagName("label");
    
    for(let i = 0; i < albumImages.length; i++){
        albumImages[i].onclick = function(){
            getSongListForAlbum(albumNames[i].innerHTML);
        }
    }
}


//function to get the songs of the clicked album
function getSongListForAlbum(name){
    let albumName = name;
    xmlHttpRequest(albumName);
    xhr.onload = function(){
        let songsData = JSON.parse(xhr.responseText);
        let trackId;
        let trackTitle;
        let trackSource;
        let trackAlbum;
        let trackRank;
        let trackArtist
        
        for(var i  in songsData.data){
            trackId = songsData.data[i].id;
            trackTitle = songsData.data[i].title;
            trackSource = songsData.data[i].preview;
            trackAlbum = songsData.data[i].album.title;
            trackRank = songsData.data[i].rank;
            trackArtist = songsData.data[i].artist.name;
            
            //store the values when album name matches with clciked item
            if(trackAlbum == albumName){
                songsInfo.push({trackId, trackTitle, trackRank, trackAlbum, trackArtist, trackSource});
            }
        }
        
        //store the array in session storage so that "artist-songs.html" page can display that song and user redirected to that page 
        sessionStorage.setItem("songlist", JSON.stringify(songsInfo));
        document.location = "songs.html";
    }
}
        

//function to search the album
let searchAlbum = (event) => {
    event.preventDefault();
    let searchItem = _searchItem.value;
    let serchResultList = [];
    if(searchItem == ""){
        alert("Please Enter album name to search");
    }
    else{
        
        for(let i = 0; i < albumInfo.length; i++){
            for(let key in albumInfo[i]){
                
                //remove the extra spaces and make the case insensative 
                if(key.toUpperCase().replace(/\s+/g, '').includes( searchItem.toUpperCase().replace (/\s+/g, '') ) ){
                    serchResultList.push({[key]: albumInfo[i][key]});
                }
            }
        }
        
         
        
        //if there is no data found then execute this code
        if(serchResultList.length == 0){
            _displayAlbum.innerHTML = 'No matching Information';
        }
        
        //display the matching album
        else{
            displayAlbumImages(serchResultList);
            }
        };
    }



//onload function
window.onload = function(){
    
    //ckeck for the loaclstorage variable
    if(checkForSubscription()){
        var parameter = ' ';
        xmlHttpRequest(parameter,0);
        getAlbumImage();
    }
    //search button onclick event
    _serachButton.onclick = searchAlbum;    
}            




	
	





    
