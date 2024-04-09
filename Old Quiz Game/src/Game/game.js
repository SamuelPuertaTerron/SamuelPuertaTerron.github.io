function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};

var questionText = document.getElementById("questionText");
var scoreText = document.getElementById("scoreText");
var gameDiv = document.getElementById("game");
var buttonDiv = document.getElementById("gameButton");

var totalQuestions = quizData.questions.length;

var score = 0;

function init() {
    scoreText.style.display = 'none';
    var question = quizData.questions.pop();

    if (question == null) {
        questionText.textContent = "Well Done, you have completed today's quiz! \n";
        scoreText.style.display = 'block';
        scoreText.textContent = "Final Score: " + score + " / " + totalQuestions;
        return;
    }

    questionText.textContent = question.question;

    // Clear previous buttons
    buttonDiv.innerHTML = '';

    for (let i = 0; i < question.answers.length; i++) {
        var answer = document.createElement('button');
        answer.textContent = question.answers[i].Answer;
        buttonDiv.appendChild(answer);
        answer.addEventListener('click', function () {
            if (question.answers[i].Result) {
                console.log("Well Done... That is correct");
                score++;
                setData(score);
                question.hasAsnwered = true;
                buttonDiv.innerHTML = ''; // Remove all buttons
                questionText.textContent = "Well Done. That is correct!";
                delay(1500).then(() => {
                    init();
                });
            } else {
                question.hasAsnwered = true;
                buttonDiv.innerHTML = ''; // Remove all buttons
                questionText.textContent = "Sadly that is not correct.";
                delay(1500).then(() => {
                    init();
                });
            }
        });
    }
}

