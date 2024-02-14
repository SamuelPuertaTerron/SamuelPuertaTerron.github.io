document.addEventListener('DOMContentLoaded', function () {
    let text = 'Hello World... Welcome';
    let words = text.split(/\s+/);
    let outputElement = document.getElementById('output');
    let outputContainer = document.getElementById('outputContainer');
    let compilingElement = document.getElementById('compiling');
    let sampleOutputElement = document.getElementById('sampleOutput');
    let currentLine = "";
    let sampleDisplayed = false;

    let coloredText = 'Console.<span class="blue-text">Log</span>("<span class="green-text">' + currentLine + '</span>");';

    outputElement.innerHTML  = coloredText;

    function appendWord() {
        if (sampleDisplayed) {
            return;
        }

        if (words.length > 0) {
            currentLine += words.shift() + ' ';
            outputElement.innerHTML = 'Console.<span class="blue-text">Log</span>("<span class="green-text">' + currentLine + '</span>");';
        } else {
            compilingElement.innerHTML = "<span class='green-text'>Compiling...</span>"
            timer(2000, () => {
                compilingElement.innerHTML = "<span class='green-text'>Compiling Completed</span>"
                timer(500, () => {
                    compilingElement.innerHTML = "<span class='green-text'>Launching...</span>";
                    timer(500, () => { 
                        displaySampleText(); 
                    });
                });
            });
        }
    }

    function displaySampleText() {
        outputContainer.style.display = 'None';
        sampleOutputElement.style.display = 'block';
        sampleDisplayed = true;
    }

    document.addEventListener('keypress', function (event) {
        // Check if the pressed key is a letter or a space
        if (/^[a-zA-Z\s]$/.test(event.key)) {
            appendWord();
        }
    });
});

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};

const timer = async(time, func) =>{
    await delay(time);
    func();
}