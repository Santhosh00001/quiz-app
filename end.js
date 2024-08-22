const username = document.getElementById("username");
const saveScorebtn = document.getElementById("saveScorebtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore =localStorage.getItem("MostRecentScore");

const highScores = JSON.parse(localStorage.getItem("HighScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup" ,() => {
    saveScorebtn.disabled=!username.value;
});

const saveHighScore = (e)=>{
    console.log("clicked the save button");
    e.preventDefault();

    const score = {
        score: parseInt(mostRecentScore,10),
        name: username.value
    };
    highScores.push(score);
    highScores.sort((a,b)=>b.score-a.score);
    highScores.splice(MAX_HIGH_SCORES);
    localStorage.setItem('HighScores',JSON.stringify(highScores));
    window.location.assign("/app.html");
};