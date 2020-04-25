"use strict";

//all the DOM Elements
let _dropDown = document.getElementById("drop-down");
let _searchText = document.getElementById("search-item");
let _searchButton = document.getElementById("search-btn");
let _songListDisplay = document.getElementById("song-list");
let _playButtons = document.getElementsByClassName("play-btn");
let _audioElements = document.getElementsByClassName("audio-tag");
let _emailInput = document.getElementById("email");
let _subscribeButton = document.getElementById("subscribe-btn");


//global variable
let xhr; 
let searchType; 
let searchItem; 



//handle the dropdown of the search 
function initDropdown(){
    let cddActive = false;
        if($('.custom_dropdown').length){
            var dd = $('.custom_dropdown');
            var ddItems = $('.custom_dropdown ul li');
            var ddSelected = $('.custom_dropdown_selected');
            
            dd.on('click', function(){
                dd.addClass('active');
                cddActive = true;
                $(document).one('click', function cls(e){
                    if($(e.target).hasClass('cdd')){
                        $(document).one('click', cls);
                    }
                    else{
                        dd.removeClass('active');
                        cddActive = false;
                    }
                });
            });
            ddItems.on('click', function(){
                var sel = $(this).text();
                ddSelected.text(sel);
            });
        }
    }


//XML object to call the API with xhr object
function xmlHttpRequest(parameter){
        xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        
        //store the parameter and made dynamic URL
        let argument = parameter; 
        xhr.open("GET", "https://deezerdevs-deezer.p.rapidapi.com/search?q='" + argument + "'");
        xhr.setRequestHeader("x-rapidapi-host", "deezerdevs-deezer.p.rapidapi.com");
        xhr.setRequestHeader("x-rapidapi-key", "e4b18eca08msh4b189d0eddc1567p102bc4jsned4f75eac788");
        xhr.send();
        //alert("send");
}


//function which get the list of songs according to the search items 
function getSongListForSearchType(type, item){
    let searchType = type;
    let searchItem = item;
    let searchedSongsInfo = [];
    let trackId;
    let trackTitle;
    let trackSource;
    let trackAlbum;
    let trackRank;
    let trackArtist;
    
    //call the xmlhttprequest function
    xmlHttpRequest(searchItem, 0); 
    
    //add event listener when readystatechange event occure
    xhr.onload = function () {
    //alert("onload");
        
        if (xhr.readyState === xhr.DONE) {
            let songsData = JSON.parse(xhr.responseText);
            
            //loop through the data of the response and store data in the variables
            for(let i in songsData.data){
                trackId = songsData.data[i].id;
                trackTitle = songsData.data[i].title;
                trackSource = songsData.data[i].preview;
                trackAlbum = songsData.data[i].album.title;
                trackRank = songsData.data[i].rank;
                trackArtist = songsData.data[i].artist.name;
                
                //check search type and store same type of songs in single array
                //check whether search type is artist and store same type of songs in single array
                if(searchType == 'Artist'){
                    if(trackArtist.toUpperCase() == searchItem.toUpperCase()){
                        searchedSongsInfo.push({trackId, trackTitle, trackRank, trackAlbum, trackArtist, trackSource});
                    }
                }
                
                //check whether search type is album
                else if(searchType == 'Album'){
                    if(trackAlbum.toUpperCase() == searchItem.toUpperCase()){
                        searchedSongsInfo.push({trackId, trackTitle, trackRank, trackAlbum, trackArtist, trackSource});
                    }
                }
                
                //check whether search type is album
                else if(searchType == 'Song'){
                    if(trackTitle.toUpperCase() == searchItem.toUpperCase()){
                        searchedSongsInfo.push({trackId, trackTitle, trackRank, trackAlbum, trackArtist, trackSource});
                    }
                }
            }
            
            //store the array in session storage so that "artist-songs.html" page can display that song and user redirected to that page 
            sessionStorage.setItem("songlist", JSON.stringify(searchedSongsInfo));
            location.href = "songs.html";
        }
    };    
}


//function to search songs when user search song with type and song  
let searchSongs = (event) => {
    event.preventDefault();
    //get the value from the dropdown and textbox
    searchType = _dropDown.innerHTML;
    searchItem = _searchText.value;
    
    
    //validate the input item of the text box 
    if(searchItem != '' ){
        getSongListForSearchType(searchType, searchItem);
    }
    else{alert("Please enter the item to search");}
}
  


//function to display the Top10 songs 
function displaySongs(){
    let landingPageSongs = [];
    
    /*//process the response data which received from the API call when page loads 
    xhr.onload = function () {*/
        //parameters for the ajax call
    var settings = {
	       "async": true,
	       "crossDomain": true,
	       "url": "https://deezerdevs-deezer.p.rapidapi.com/search?q=''",
	       "method": "GET",
	       "headers": {
		      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
		      "x-rapidapi-key": "e4b18eca08msh4b189d0eddc1567p102bc4jsned4f75eac788"
	       }
    }
        //ajax call for the songs 
        $.ajax(settings).done(function (response) {
            let wholeData = response.data;
            console.log(wholeData);
            let trackName;
            let trackArtist;
            let trackAlbum;
            let trackSource;
            for(let i = 0; i < 10; i++){
                trackName = wholeData[i].title;
                trackArtist = wholeData[i].artist.name;
                trackAlbum = wholeData[i].album.title;
                trackSource = wholeData[i].preview;
                landingPageSongs.push({trackName, trackArtist, trackAlbum, trackSource});
            }
        
        
        //function to display the table of Top 10 songs
        displayLandingPageSongs(landingPageSongs);     
    });
}


//function to display the table of Top 10 songs
function displayLandingPageSongs(array){
    let songsInfo = array;
    _songListDisplay.innerHTML = "";
    
    //append the titlehead of the table and append the table dynamically 
    _songListDisplay.innerHTML = "<tr><th>Title</th><th>Album</th><th>Artist</th><th>Song</th></tr>" 
    
    for(let i = 0; i < songsInfo.length; i++){
        _songListDisplay.innerHTML += "<tr><td>" + songsInfo[i].trackName + "</td><td>" +  songsInfo[i].trackAlbum + "</td><td>" + songsInfo[i].trackArtist + "</td><td><a class='play-btn'>Play</a><audio controls  class='audio-tag'><source src='" + songsInfo[i].trackSource + "' type='audio/mpeg'></audio></td></tr>";
    }
    
    //remove the contol attribute of the all audio tag
    for(var i = 0; i < _audioElements.length; i++){
        _audioElements[i].controls = false;
        _audioElements[i].load();
    }
    
}


//function to display the audio controls when user click on the play button
let displayAudioControls = function(){
   
    //remove the contol of all the tags
   for(var i = 0; i < _audioElements.length; i++){
        _audioElements[i].controls = false;
        _audioElements[i].load();
    }
    
    //when the user click on the play button display the controls and text changes to stop
    if(this.innerHTML == "Play"){
        for(var i = 0; i < _playButtons.length; i++){
            _playButtons[i].innerHTML="Play";
        }
        this.innerHTML = "Stop";
        this.nextElementSibling.controls = true;
        this.nextElementSibling.load();
    }
    
    //else the text shows 'play'
    else{
        this.innerHTML = "Play";
    }
}


//function for the subscription part 
let subscription = () =>{
    
    //get the value from the local storage 
    let localStoageVariable = localStorage.getItem("email");
    let email = _emailInput.value;
    let emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;
    
    //validate the email entry 
    if(email == '' || !email.match(emailPattern)){
        alert("Please enter valid emailId");
    }
    
    //check for the existing subscription 
    else if(localStoageVariable != null){
        alert("You have already Subscribed")
    }
    
    else{
        localStorage.setItem("email", email);
        alert("Thanks for the subscription");
    }
}


//windows onload function
window.onload = function(){
    
    //call the dropdown functionality function
    initDropdown();
    
    //when user search something 
    _searchButton.onclick = searchSongs;
    
    //call the xmlHttpRequest to show Top 10 songs 
    xmlHttpRequest('');
    displaySongs();
    
    //event handler for the all play buttons in the table and that function waits untill the table drawn
    setTimeout(function(){
        for(var i = 0; i < _playButtons.length; i++){
            _playButtons[i].onclick = displayAudioControls;
        }
    }, 2000);
    
    //eventhandler for the subscription button
    _subscribeButton.onclick = subscription;
}