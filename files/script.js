const timer;
let time = questions.length * 15;
const scoreBoard = document.getElementById("ScoreBoard");
let qIndex = 0;
let score = 0;
const choicesEl = document.getElementsByClassName("ans");
const clock = document.getElementById("time");
const beginButton = document.getElementById("begin-btn");
const qCard = document.getElementById("quizCard");
const resultInfo = document.getElementById("result");
const submitBtn = document.getElementById("submit");
const initialsEl = document.getElementById("initials");
const ltrBtn = document.getElementsByClassName("pick");

const mp3Yes = new Audio("files/luigi.mp3");
const mp3Nope = new Audio("files/nope.mp3");
const mp3end = new Audio("files/muppet.mp3");

function startQuiz ()
{
    // hide start screen
    const startScreenEl = document.getElementById("start-screen");
    startScreenEl.setAttribute("class", "hide");
    beginButton.setAttribute("class", "hide");

    // un-hide questions section
    const foot = document.getElementById("footer");
    foot.removeAttribute("class", "hide");
    qCard.removeAttribute("class", "hide");
    scoreBoard.removeAttribute("class", "hide");

    // start timer
    timer = setInterval(clockTick, 1000);

    // show starting time
    clock.textContent = time;
    const nextButton = document.getElementById("next-btn");
    nextButton.onclick = onNextBtnClick;
    showQuestion(qIndex);
    updateQuestionTitle(qIndex);
    registerABCD();
}

function disableButtons(state){
    Array.from(document.getElementsByClassName("pick")).forEach(
        function(answerBtn) {
            answerBtn.disabled = state; 
        }
    );

}

function loadNextQuestion ()
{   disableButtons(false);
    qIndex++;
    showQuestion(qIndex); 
    updateQuestionTitle(qIndex);
}

function onNextBtnClick(){
    if (qIndex === (questions.length - 2)) {
        (this).textContent = "Finish";
        loadNextQuestion();
    }
    else if (qIndex === (questions.length-1)){ 
        quizEnd();

    }else {
        loadNextQuestion();
    } 
}


function updateQuestionTitle (questionNumber)
{
    let title = document.getElementById("question-title");
    title.textContent = "Question ";
    title.append(questionNumber + 1 + ":");
}

function showQuestion (questionNumber)
{
    //get question from array
    let q = questions[questionNumber];

    //update H3 with current question
    const titleQ = document.getElementById("qOutput");
    titleQ.textContent = questions[questionNumber].question;

    // clear out any old question choices
    choicesEl.innerHTML = "";

    //loop over choices
    q.choices.forEach(function (ans, i)
    {
        choicesEl[i].setAttribute("value", ans);
        //print choices
        choicesEl[i].textContent = ans;
        
    });
}
function registerABCD(){
    Array.from(document.getElementsByClassName("pick")).forEach(
        function(honza) {
            honza.onclick = answerClick; 
        }
    );

    }
function answerClick ()
{   disableButtons(true);
    // if incorrect answer
    if (this.value != questions[qIndex].answer) {
        score += 0;
        time -= 10;

        if (time < 0) {
            time = 0;
        }
        // display new time on page
        clock.textContent = time;

        //play "wrong" sound effect
        mp3Nope.play();
        resultInfo.textContent = "NOPE!";
    } else {
        // play "right" sound effect
        mp3Yes.play();
        resultInfo.textContent = "CORRECT!";
        score +=20;
    }

    // flash right/wrong feedback on page for half a second
    resultInfo.setAttribute("class", "result");
    setTimeout(function ()
    {
        resultInfo.setAttribute("class", "result hide");
    }, 1000);
   
}

function quizEnd ()
{
    // stop timer
    clearInterval(timer);

    // show end screen
    let endScreenEl = document.getElementById("end-screen");
    endScreenEl.removeAttribute("class");
    clock.removeAttribute("class", "hide");

    // show final score
    let finalScoreEl = document.getElementById("final-score");
    finalScoreEl.textContent = score;

    // hide questions section
    qCard.setAttribute("class", "hide");
    mp3end.play();
}

function clockTick ()
{
    // update time
    time--;
    clock.textContent = time;

    // check if user ran out of time
    if (time <= 0) {
        quizEnd();
    }
}

function saveHighscore ()
{
    // get value of input box
    let initials = initialsEl.value.trim();

    // make sure value wasn't empty
    if (initials !== "") {
        // get saved scores from localstorage, or if not any, set to empty array
        let highscores =
            JSON.parse(window.localStorage.getItem("highscores")) || [];

        // format new score object for current user
        let newScore = {
            score: score,
            initials: initials
        };

        // save to localstorage
        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));

        // redirect to next page
        window.location.href = "scores.html";
    }
}

function checkForEnter (event)
{
    // "13" represents the enter key
    if (event.key === "Enter") {
        saveHighscore();
    }
}
// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
beginButton.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;







