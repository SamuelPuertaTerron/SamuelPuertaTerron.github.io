var currentYPos;

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

function loadtab(name) {
    currentYPos = window.scrollY;
    Save("ScrollPos", currentYPos); //Save Scroll Position
    ResetURL();

    var home = document.getElementById('home');
    home.style.display = 'none';
    var elem = document.getElementById(name);
    elem.style.display = 'block';
}

function closetab(name) {
    var elem = document.getElementById(name);
    elem.style.display = 'none';
    var home = document.getElementById('home');
    home.style.display = 'block';
    
    Get("ScrollPos", currentYPos); //Gets Scroll Position
    window.scrollTo(0, currentYPos);
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

function resizeUI()
{
    if($(window).width() <= 600) {
        mobileUI();
    }else {
        desktopUI();
    }
}

onresize = resizeUI; //Resize Event

resizeUI();
move();