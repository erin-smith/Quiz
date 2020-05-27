var timer;
var time = questions.length * 15;
var scoreBoard = document.getElementById("ScoreBoard");
var qIndex = 0;
var score = 0;
var choicesEl = document.getElementsByClassName("ans");
var clock = document.getElementById("time");
var beginButton = document.getElementById("begin-btn");
var qCard = document.getElementById("quizCard");
var resultInfo = document.getElementById("result");
var submitBtn = document.getElementById("submit");
var initialsEl = document.getElementById("initials");
var ltrBtn = document.getElementsByClassName("pick");



function startQuiz ()
{
    // hide start screen
    var startScreenEl = document.getElementById("start-screen");
    startScreenEl.setAttribute("class", "hide");
    beginButton.setAttribute("class", "hide");

    // un-hide questions section
    var foot = document.getElementById("footer");
    foot.removeAttribute("class", "hide");
    qCard.removeAttribute("class", "hide");
    scoreBoard.removeAttribute("class", "hide");

    // start timer
    timer = setInterval(clockTick, 1000);

    // show starting time
    clock.textContent = time;
    var nextButton = document.getElementById("next-btn");
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
    var title = document.getElementById("question-title");
    title.textContent = "Question ";
    title.append(questionNumber + 1 + ":");
}

function showQuestion (questionNumber)
{
    //get question from array
    var q = questions[questionNumber];

    //update H3 with current question
    var titleQ = document.getElementById("qOutput");
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

        // play "wrong" sound effect
        //sfxWrong.play();
        resultInfo.textContent = "Wrong!";
    } else {
        // play "right" sound effect
        //sfxRight.play();
        resultInfo.textContent = "Correct!";
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
    var endScreenEl = document.getElementById("end-screen");
    endScreenEl.removeAttribute("class");
    clock.removeAttribute("class", "hide");

    // show final score
    var finalScoreEl = document.getElementById("final-score");
    finalScoreEl.textContent = score;

    // hide questions section
    qCard.setAttribute("class", "hide");
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
    var initials = initialsEl.value.trim();

    // make sure value wasn't empty
    if (initials !== "") {
        // get saved scores from localstorage, or if not any, set to empty array
        var highscores =
            JSON.parse(window.localStorage.getItem("highscores")) || [];

        // format new score object for current user
        var newScore = {
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







