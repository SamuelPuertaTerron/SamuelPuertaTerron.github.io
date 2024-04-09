const elementsToDisable = document.querySelectorAll('.panel, .settings, .game');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('popup-icon');
const popupContent = document.getElementById('popupContent');
const popupMessage = document.getElementById('popupMessage');

function displayPopup(message, durationInSeconds) {
    popupMessage.textContent = message;
    popup.style.display = 'block';

    setTimeout(function () {
        closePopup.click();
        popup.style.display = 'none';
    }, durationInSeconds * 1000);
}

closePopup.addEventListener('click', function () {
    popup.style.display = 'none';
});

