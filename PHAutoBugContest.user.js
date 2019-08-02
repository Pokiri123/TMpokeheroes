// ==UserScript==
// @name         PH - Auto Bug Contest
// @namespace    https://github.com/warpKaiba
// @version      1.0
// @description  try to take over the world!
// @author       Kaiba
// @match        http*://pokeheroes.com/bugcontest*
// @grant        GM.xmlHttpRequest
// @connect      pokeheroes.com
// @connect      staticpokeheroes.com
// @downloadURL  https://github.com/warpKaiba/TMpokeheroes/raw/master/PHAutoBugContest.user.js
// @icon         https://vignette.wikia.nocookie.net/pkmnshuffle/images/7/7f/Ducklett.png/revision/latest?cb=20170409032016
// ==/UserScript==

// This script needs GM.xmlHttpRequest to break CORS so it can get the URL of the pokemon sprites that spawn in the game
// The sprites are loaded in through a redirect link to obscure their pokedex number.
// Using GM.xmlHttpRequest lets it follow the redirect and get the actual URL of the sprite, which has the pkdx number in it
// Normally, since the sprites are hosted on a different domain, your browser would prevent this from happening
// because being able to send requests to a different domain can open security holes. Don't worry though, this script
// ONLY opens a tunnel between pokeheroes.com (domain of the obscured URLs) and staticpokeheroes.com (the real URLs)

// The reason why this needs to be done is the pokedex number is needed to check if its a bug type.

var activePokemons = $(".innerpkmn").not("[style*=display]").not("[style*='margin-left: -100px']") //this is every pokemon sprite that is currently visible
var pokeImage;
var previousPoke;
bugTime = 131; // gives it some extra time ;)

var preBuggyInterval = setInterval(function(){
    activePokemons = $(".innerpkmn").not("[style*=display]").not("[style*='margin-left: -100px']") // refresh the list of visible pokemon
    if (activePokemons.length > 0 && activePokemons[0] != previousPoke) { // if the game is loaded and we haven't checked the pokemon type yet ..
        previousPoke = activePokemons[0]
        pokeImage = activePokemons[0].firstChild.src
        getRealId(pokeImage, activePokemons[0]) // run the getRealId function below
    }
}, 150)


function getRealId(img, obj) {
    GM.xmlHttpRequest({ // get the real URL of the pokemon sprite for the pkdx #
        method: "GET",
        url: img,
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "text/xml"
        },
        onload: function(response) {
            var responseXML = null;
            // Inject responseXML into existing Object (only appropriate for XML content).
            if (!response.responseXML) {
                responseXML = new DOMParser()
                    .parseFromString(response.responseText, "text/xml");
            }

            var realId = response.finalUrl.match(/\d(\d+)/)[1] // <---- the pkdx #

            if (parseInt(realId) == 413 || parseInt(realId) == 412 ) { //special case cus the pokedex doesnt have burmy/wormadams types
                obj.click()
                console.log("burmy/wormadamn is a bug :) ")
                return; // don't waste time by asking the pokedex
            }


            $.ajax({ // ask the on-site pokedex what type(s) the pokemon is
                type:"POST",
                url:"includes/ajax/pokedex/view_entry.php",
                data:{
                    'pkdxnr':realId,
                },
                success: function(data) {
                    var name = data.split('<span style="font-size: 14pt; font-weight: bold">#')[1].split("</span>")[0];
                    name = name.split(" ");
                    name.splice(0,1);
                    name = name.join(" ");

                    var pkdxType1 = data.split('type_icons/')[1].split('">')[0]
                    var pkdxType2 = "";

                    if (data.split("type_icons/").length > 2) { //only set the 2nd type if it actually has 2 types
                        pkdxType2 = data.split('type_icons/')[2].split('">')[0]
                    }
                    if (pkdxType1.includes("bug.gif") || pkdxType2.includes("bug.gif")) { // is it a bug :)?
                        console.log(name + "....?..yes... a bug.... fucuuuuuuck!!!! ahh!")
                        obj.click()
                    } else { // its not a bug >:(...
                        obj.style = "display: none"
                        console.log(name + " not a bug. ufkc you.") //script doesnt like non-bug types bcus they suck. Bye.
                    }
                }
            })
        }
    })
}