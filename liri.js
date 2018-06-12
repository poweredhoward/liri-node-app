require("dotenv").config();
var fs = require("fs");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);
// console.log(spotify);
var q;

function twitterf(){
    var params = {count: 20};
    twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        tweets.forEach( function(tweet){
            console.log("Tweet text: " + tweet.text + " at " + tweet.created_at.split("+")[0]);
            console.log("");
        })
    }
});


}

function spotifyf(){
     //MAKE SURE TO ADD A DEFAULT
     spotify.search({type: "track", query: q, limit: 3}, function(err, data){
        if(!err){
            var song = data.tracks.items[0];
            console.log("Artist: " + song.artists[0].name);
            console.log("Song title: " + song.name);
            console.log("Link to song: " + song.external_urls.spotify);
            console.log("Album: " + song.album.name);
        }
    })
}

function movief(){
    
    request("http://www.omdbapi.com/?apikey=trilogy&t="+q, function(error, response, body) {
    // console.log(JSON.parse(body).Title);
    body = JSON.parse(body);
    console.log("Title: " + body.Title);
    console.log("Year: " + body.Year);
    console.log("IMDB Rating: " + body.imdbRating + "/10");
    console.log("Rotten Tomatoes: " + body.Ratings[1].Value);
    console.log("Country Produced: " + body.Country);
    console.log("Language : " + body.Language);
    console.log("Plot: " + body.Plot);
    console.log("Starring: " + body.Actors);
});

}

function dof(){
    fs.readFile("random.txt", "utf8", function(err, data){
        if(!err){
            var query = data.split(",")[0];

            if( query === "my-tweets"){
                twitterf();
            }
            else if( query === "spotify-this-song"){
                q = data.split(",")[1];
                spotifyf();

            }
            else if (query === "movie-this"){
                q = data.split(",")[1];
                movief();
            }
            else{
                console.log("Try a different command");
            }

        }
    })
}

var query = process.argv[2];

if( query === "my-tweets"){
    twitterf();
}
else if( query === "spotify-this-song"){
    q = process.argv[3];
   spotifyf();

}
else if (query === "movie-this"){
    q = process.argv[3].replace(/\ /g, "+");
    movief();
}
else if(query === "do-what-it-says"){
   dof();
}
else{
    console.log("Try a different command");
}

