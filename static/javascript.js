"use strict";
/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
/*eslint-env browser*/

    var nav = document.querySelector(".nav");
    var close = document.querySelector(".closebtn");
    var toevoegenOpenen = document.querySelector(".toevoegenOpenen");
//    var toevoegenSluiten = document.querySelector("toevoegenSluiten");




function openNav() {

    document.getElementById("myNav").style.width = "80%";
}

function closeNav() {
    //                document.querySelector(".algemeen").style.display = "none";
    document.getElementById("myNav").style.width = "0%";
}


function toevoegenOpen() {
    document.querySelector(".uploaden").style.display = "flex";
}

//function toevoegensluit() {
//    console.log('hio');
//}

//            document.querySelector('toevoegenSluiten').addEventListener('click', toevoegensluiten);



toevoegenOpenen.addEventListener('click', toevoegenOpen);
//toevoegenSluiten.addEventListener('click', toevoegensluit);
nav.addEventListener('click', openNav);
close.addEventListener('click', closeNav);
