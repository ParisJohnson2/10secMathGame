$(document).ready(function () {
    let timeLeft = 10;
    let count = 0;
    let highscore = 0;
    let currQuestion;
    let downloadTimer;
    let points = document.getElementById("points");
    let operators = [];
    $('.largerCheckbox').prop("checked", false);

    let randomNumber = function (size) {
        return Math.ceil(Math.random() * size);
    }

    let problemSet = function () {
        let question = {};

        let rangeSlider = document.getElementById("sliderRange");
        let output = document.getElementById("output");
        output.innerHTML = rangeSlider.value;

        rangeSlider.oninput = function () {
            output.innerHTML = this.value;
        }

        let num1 = randomNumber(rangeSlider.value);
        let num2 = randomNumber(rangeSlider.value);
        let num3 = num1 * num2;
        let operator = operators[Math.floor(Math.random() * operators.length)];

        let getEquation = function (op) {
            switch (op) {
                case '+': question.answer = num1 + num2; return question.equation = String(num1) + " + " + String(num2); break;
                case '-': switch(true) { 
                    case (num1 > num2):
                        question.answer = num1 - num2; return question.equation = String(num1) + " - " + String(num2); break;
                    case (num1 < num2):
                        question.answer = num2 - num1; return question.equation = String(num2) + " - " + String(num1); break;
                }
                case '*': question.answer = num1 * num2; return question.equation = String(num1) + " * " + String(num2); break;
                case '/': question.answer = num3 / num1; return question.equation = String(num3) + " / " + String(num1); break;
            }
        }
        question.equation = getEquation(operator);

        if (operators.length === 0) {
            question.answer = num1 + num2;
            question.equation = String(num1) + ' + ' + String(num2);
        }
        return question;
    }

    let updateTime = function (time) {
        timeLeft += time;
        $('#countDown').text(timeLeft);
    }

    let updateScore = function (score) {
        count += score;
        points.innerHTML = count;
    }

    let updateHighScore = function (score) {
        if (score > highscore) {
            highscore = score;
            $('#highscore').text(highscore);
        }
    }

    let button = document.getElementById("reset")
    button.addEventListener("click", function () {
        if (!downloadTimer) {
            if (timeLeft === 0) {
                answer.disabled = false;
                $('.largerCheckbox').prop("checked", false);
                updateTime(10);
                updateHighScore(count);
                updateScore(-count);
            }
        }
    });

    let startGame = function () {
        if (!downloadTimer) {
            downloadTimer = setInterval(function () {
                updateTime(-1);
                if (timeLeft <= 0) {
                    clearInterval(downloadTimer);
                    downloadTimer = undefined;
                    answer.disabled = true;
                }
            }, 1000);
        }
    }

    let newQuestion = function () {
        currQuestion = problemSet();
        $('#equation').text(currQuestion.equation);
    }

    let checkAnswer = function (userAnswer, answer) {
        if (userAnswer === answer) {
            newQuestion();
            $('#answer').val('')
            updateTime(+1);
            updateScore(+1);
        }
    }

    let input = document.querySelector("input");
    input.addEventListener("keyup", function () {
        startGame();
        let answer = parseInt(document.getElementById("answer").value);
        checkAnswer(answer, currQuestion.answer);
    });

    Array.prototype.remove = function (value) {
        this.splice(this.indexOf(value), 1);
    }

    $('.largerCheckbox').change(function () {
        if ($(this).is(":checked")) {
            $(this).addClass('active');
            if (operators.includes(this.value) === false) operators.push(this.value);
        } else {
            $(this).removeClass('active');
            if (operators.includes(this.value) === true) operators.remove(this.value);
        }
    });

    newQuestion();

});