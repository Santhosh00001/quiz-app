const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion={};
let acceptingAnswers = false;
let score=0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy")
.then(response => response.json())
.then(loadedquestions => {
    console.log(loadedquestions.results);
    if(loadedquestions.results.length === 0 ){
        throw new Error('No questions found');
    }
    questions = loadedquestions.results.map(loadedquestion => {
        const formattedQuestion ={
            question: loadedquestion.question
        };

        const answerchoices = [...loadedquestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random()*3)+1;
        answerchoices.splice(
            formattedQuestion.answer -1,
            0,
            loadedquestion.correct_answer
        );

        answerchoices.forEach((choice,index) => {
            formattedQuestion["choice" +(index+1)]=choice;
        });
        return formattedQuestion;
    });
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    startGame();
    
})
.catch(error => console.error('Error:', error));

//constants//
const CORRECT_BONUS=10;
const MAX_QUESTIONS =3;
 
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions=[...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        //go to the end page
        localStorage.setItem("MostRecentScore",score);
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //update the progress bar
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}% `;
    const questionIndex=Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

   choices.forEach(choice => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];

   });
   availableQuestions.splice(questionIndex,1);

   acceptingAnswers = true;

};

choices.forEach(choice => {
    choice.addEventListener("click" , e => {
       if(!acceptingAnswers) return ;

        acceptingAnswers = false;
        const selectedChoice =e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = 
            selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        if(classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}












