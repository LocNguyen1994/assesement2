/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
/*eslint-env browser*/
var nav = document.querySelector(".nav");
var close = document.querySelector(".closebtn");
var lekkerAdd = document.querySelector(".lekkerAdd");

console.log("test1");


function openAdd(){
    console.log("hallo");
    document.querySelector(".algemeen").style.display = "block";
}



function openNav(){
    console.log("test");
            document.getElementById("myNav").style.width = "80%";
        }

function closeNav(){
//                document.querySelector(".algemeen").style.display = "none";
            document.getElementById("myNav").style.width = "0%";
        }

lekkerAdd.addEventListener('click', openAdd);
nav.addEventListener('click', openNav);
close.addEventListener('click', closeNav);
lekkerAdd.addEventListener('click', openAdd);