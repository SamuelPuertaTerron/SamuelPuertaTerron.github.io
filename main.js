var currentYPos;
document.cookie = "SameSite=None;Secure"
onresize = resizeUI; //Resize Event
onload = start();

//Called once at the start of a load
function start() {
    resizeUI();
    move();
    muteIFrame();
}

function Save(name, variable) {
    localStorage.setItem(name, variable);
}

function Get(name, variable) {
    if(localStorage.getItem(name) != null) {
        localStorage.getItem(name, variable);
    }
}

function ResetURL() {
    history.pushState("", document.title, window.location.pathname + window.location.search);
}

function move() {
    var hidden = document.getElementById('hidden');
    var fadeIn = document.getElementById('start');
    hidden.style.opacity = 1;
    fadeIn.classList.toggle('fade');
}

function mobileUI() {
    var elem = document.getElementById('background-video');
    elem.style.display = 'none';
    var home = document.getElementById('background-image');
    home.style.display = 'block';
}

function desktopUI() {
    var elem = document.getElementById('background-video');
    elem.style.display = 'block';
    var home = document.getElementById('background-image');
    home.style.display = 'none';
}

function muteIFrame() {
    var iframe = document.getElementsByTagName('iframe')[0];

    iframe.contentWindow.postMessage('{"method":"setVolume", "value":0}','*');
}

function resizeUI()
{
    if($(window).width() <= 600) {
        mobileUI();
    }else {
        desktopUI();
    }
}