import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithPopup, signOut, onAuthStateChanged, deleteUser, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase, ref, set, get, remove } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js"

const firebaseConfig = {
    apiKey: "AIzaSyDA9kPnNJ5bOfGjSuIkmF1sv3-WK1xiD9A",
    authDomain: "quizify-game.firebaseapp.com",
    databaseURL: "https://quizify-game-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "quizify-game",
    storageBucket: "quizify-game.appspot.com",
    messagingSenderId: "396972475384",
    appId: "1:396972475384:web:d65d182b3fe8fa93fe4c0d",
    measurementId: "G-ZH9J8JSNRX"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider(app);

const button = document.getElementById("log_in_button");
const signOutButton = document.getElementById("signOutButton");
const deleteButton = document.getElementById("deleteButton");
const backButton = document.getElementById('backButton');
const logInScreen = document.getElementById("panel");
const gameScreen = document.getElementById('game');
const scoreTextHomeScreen = document.getElementById('scoreText');
const settingsPanel = document.getElementById('settingsPanel');
const gearIcon = document.getElementById("gearIcon");
const leaderboard = document.getElementById('leaderboardsButton');
const lbPanel = document.getElementById('leaderboards');
const lbButton = document.getElementById('backButtonSettings');

let currentUser = null;

document.addEventListener("DOMContentLoaded", function () {

    gearIcon.addEventListener("click", function () {
        logInScreen.style.display = 'none';
        settingsPanel.style.display = 'block';

        backButton.addEventListener('click', function () {
            logInScreen.style.display = 'block';
            settingsPanel.style.display = 'none';
        });
    });
});

onAuthStateChanged(auth, function (user) {
    if (user) {
        currentUser = user;
        button.textContent = "Play!";
        gearIcon.style.display = 'block';
        readScoreData().then((score) => {
            scoreTextHomeScreen.textContent = `Score: ${score}`;
        });
        // Fetch and display leaderboard data
        readLeaderboardData().then((score) => {
            displayLeaderboard(score);
        });
    } else {
        button.textContent = "Sign in to play!";
        gearIcon.style.display = 'none';
    }
});

lbButton.addEventListener('click', function(){
    lbPanel.style.display = 'none';
    settingsPanel.style.display = 'block';
});

leaderboard.addEventListener('click', function(){
    lbPanel.style.display = 'block';
    settingsPanel.style.display = 'none';
});

button.addEventListener('click', function () {
    if (!currentUser) {
        signInWithGoogle();
    } else {
        logInScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        init();
    }
});

signOutButton.addEventListener('click', function () {
    signOut(auth).then(() => {
        displayPopup(`Signed out user ${currentUser.displayName}`, 5);
        logInScreen.style.display = 'block';
        settingsPanel.style.display = 'none';
    })
        .catch((error) => {
            window.alert(error.message);
        });
});

deleteButton.addEventListener('click', function () {
    if (currentUser) {
        deleteUser(currentUser)
            .then(() => {
                removeUserData();
                displayPopup(`Successfully Deleted the user ${currentUser.displayName}`, 5);
            })
            .catch((error) => {
                console.error("Error: " + error.message);
            });
    }
});

function displayLeaderboard(leaderboard) {
    const leaderboardContainer = document.getElementById('leaderboards');
    leaderboardContainer.innerHTML = '<h1>Leaderboard</h1>';
    leaderboard.forEach((entry, index) => {
        var pElement = document.createElement('p');
        pElement.style.fontSize = '25px';
        pElement.textContent = "Username: " + entry.username + " has a score of " + entry.score;

        if (index === 0) {
            pElement.innerHTML += ' 🥇'; 
        } else if (index === 1) {
            pElement.innerHTML += ' 🥈'; 
        } else if (index === 2) {
            pElement.innerHTML += ' 🥉'; 
        }

        leaderboardContainer.appendChild(pElement);    
    });
}



function signInWithGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            currentUser = result.user;
            displayPopup(`Signed in as ${currentUser.displayName}`, 5);
            saveUserData(readScoreData()); //Set the score to zero at the start
        })
        .catch((error) => {
            window.alert(`${error.code} ${error.message}`);
        });
}

function saveUserData(score) {
    console.log(score);
    set(ref(database, `users/${currentUser.displayName}`), {
        username: currentUser.displayName,
        score: score,
    })
        .then(() => {
            console.log("User data saved successfully");
        })
        .catch((error) => {
            console.log("Error: " + error.message);
        });
}

function readLeaderboardData() {
    const leaderboardRef = ref(database, 'users');

    return get(leaderboardRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const leaderboardArray = [];
                snapshot.forEach((childSnapshot) => {
                    const userData = childSnapshot.val();
                    leaderboardArray.push({
                        username: userData.username,
                        score: userData.score
                    });
                });

                leaderboardArray.sort((a, b) => b.score - a.score); // Sort in descending order

                return leaderboardArray;
            } else {
                console.log("No leaderboard data available");
                return [];
            }
        })
        .catch((error) => {
            console.error("Error getting leaderboard data:", error);
            throw error; // Propagate the error further
        });
}


function readScoreData() {
    const userRef = ref(database, `users/${currentUser.displayName}`);

    return get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const score = userData.score;
                return score;
            } else {
                console.log("No data available for this user");
                return 0;
            }
        })
        .catch((error) => {
            console.error("Error getting user data:", error);
            throw error; // Propagate the error further
        });
}

function removeUserData() {
    const dataRef = ref(database, `users/${currentUser.displayName}`);
    remove(dataRef)
        .then(() => {
            displayPopup(`Deleted data from ${currentUser.displayName}`, 5);
            currentUser = null;
        })
        .catch((error) => {
            console.error("Error deleting data:", error);
        });
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};

var questionText = document.getElementById("questionText");
var scoreText = document.getElementById("scoreTextFinal");
var gameDiv = document.getElementById("game");
var buttonDiv = document.getElementById("gameButton");

var totalQuestions = quizData.questions.length;

let isFinished = false;

let questionScore = 0;

function init() {
    if (!isFinished) {
        scoreText.style.display = 'none';
        var question = quizData.questions.pop();

        if (question == null) {
            questionText.textContent = "Well Done, you have completed today's quiz! \n";
            scoreText.style.display = 'block';
            scoreText.textContent = "Final Score: " + questionScore + " / " + totalQuestions;
            delay(1500).then(()=>{
                isFinished = true;
                gameDiv.style.display = 'none';
                logInScreen.style.display = 'block';
            });
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
                    questionScore++;
                    saveUserData(questionScore);
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
    }else{
        scoreText.style.display = 'none';
        var question = quizData.questions.pop();
    
        if (question == null) {
            questionText.textContent = "Well Done, you have completed today's quiz! \n";
            scoreText.style.display = 'block';
            gameDiv.style.display = 'none';
            logInScreen.style.display = 'block';
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
}

