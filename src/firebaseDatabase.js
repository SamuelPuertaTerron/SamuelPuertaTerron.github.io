export function setData(db, username, score) {
    saveUserData(db, username, score);
}

function saveUserData(db, username, score) {

    set(ref(db, `users/${username}`), {
        username: username,
        score: score,
    })
        .then(() => {
            console.log("User data saved successfully");
        })
        .catch((error) => {
            console.log("Error: " + error.message);
        });
}