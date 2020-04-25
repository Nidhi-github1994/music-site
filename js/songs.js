"use strict";

//DOM elements
const _displaySongs = document.getElementById("song-list");
let _playButtons = document.getElementsByClassName("play-btn");
let _audioElements = document.getElementsByClassName("audio-tag");


//function to check the session variable of array to diaplay 
function checkSession(){
    let sessionArray = sessionStorage.getItem("songlist");
    if(sessionArray != ''){
        return true;
    }
    else{
        location.href = "artists.html";
    }
}


//function to diaplay the songs stored in the session 
function displaySongs(){
    let songsInfo = JSON.parse(sessionStorage.getItem("songlist"));
    
    if(songsInfo.length != 0){
        _displaySongs.innerHTML = "<tr><th>Title</th><th>Rank</th><th>Album</th><th>Artist</th><th>Song</th></tr>" 
        for(let i = 0; i < songsInfo.length; i++){
            _displaySongs.innerHTML += "<tr><td>" + songsInfo[i].trackTitle + "</td><td>" + songsInfo[i].trackRank + "</td><td>" + songsInfo[i].trackAlbum + "</td><td>" + songsInfo[i].trackArtist + "</td><td><a class='play-btn'>Play</a><audio controls  class='audio-tag'><source src='" + songsInfo[i].trackSource + "' type='audio/mpeg'></audio></td></tr>";
        }
        
        //remove the contol attribute from the audio tag
        for(var i = 0; i < _audioElements.length; i++){
            _audioElements[i].controls = false;
            _audioElements[i].load();
        }
    }
    else{
        _displaySongs.innerHTML = "No matching Item Found";
    }
}


//function to display audio controls when user click on the play button in the table
let displayAudioControls = function(){
   for(var i = 0; i < _audioElements.length; i++){
        _audioElements[i].controls = false;
        _audioElements[i].load();
    }
    
    if(this.innerHTML == "Play"){
        for(var i = 0; i < _playButtons.length; i++){
            _playButtons[i].innerHTML="Play";
        }
        this.innerHTML = "Stop";
        this.nextElementSibling.controls = true;
        this.nextElementSibling.load();
    }
    else{
        this.innerHTML = "Play";
    }
}


//onload function
window.onload = function(){
    if(checkSession()){
        displaySongs();
    }
    setTimeout(function(){
        for(var i = 0; i < _playButtons.length; i++){
            _playButtons[i].onclick = displayAudioControls;
        }
    }, 2000);
}
