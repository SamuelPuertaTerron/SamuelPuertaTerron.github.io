export function setData() {
    console.log("Set data");
}

function saveUserData(db, ...params) {
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
