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

move();