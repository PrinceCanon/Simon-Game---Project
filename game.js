// Variables
var gamePattern = [];
var userClickedPattern = [];
var buttonColors = ["red", "blue", "green", "yellow"];
var level = 0;
var countdown = 3;
var intervalId;
var levelTitle = $("#level-title");
var countdownDisplay = $("#countdownDisplay");
var firstKeyPressDetected = false; // Flag to track if the first key press has occurred

countdownDisplay.hide(); // Hide countdown display

function handleFirstKeyPress(event) {
    firstKeyPressDetected = true; // Set the flag to true
    if (firstKeyPressDetected === true) {
        startInterval();
    
        $("#level-title").text("Level " + level);
    }
    console.log("First key pressed:", event.key); // DEBUG
}

$(document).keydown(function() {
    if (firstKeyPressDetected === false) {
        handleFirstKeyPress(event);
        $(document).off("keydown"); // Removes the event listener
    }
});

// 3 second interval for Will to play.
function startInterval() {
    $(".btn").off("click");
    countdown = 3; // Reset countdown
    countdownDisplay.text("Will plays in " + countdown + "...");
    countdownDisplay.show(); // Show countdown display
    intervalId = setInterval(function() {
        countdown--;
        if (countdown > 0) {
            countdownDisplay.text("Will plays in " + countdown + "...");
        } else {
            console.log("Countdown finished!");
            clearInterval(intervalId);
            countdownDisplay.hide(); // Hide countdown display
            nextSequence();
        }
    }, 1000);
}

// Will's sequence
function nextSequence() {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];

    $("#" + randomChosenColor).addClass("flash");
    console.log(randomChosenColor + " clicked!"); // Debug

    setTimeout(() => {
        $("#" + randomChosenColor).removeClass("flash");
    }, 100);

    userClickedPattern = [];
    gamePattern.push(randomChosenColor);

    console.log(gamePattern);

    // Plays the corresponding button sound.
    playSound(randomChosenColor);

    userSequence();
};

// Checking user's array with game's array.
function checkAnswer(userChosenColor) {
    var lastIndex = userClickedPattern.length - 1;

    // Check if the last user choice is correct
    if (userClickedPattern[lastIndex] === gamePattern[lastIndex]) {
        // If the user has completed their sequence
        if (userClickedPattern.length === gamePattern.length) {
            level++; // Increment level
            levelTitle.text("Level " + level);
            // Show countdown for next round
            startInterval();
        }
    } else {
        // Game Over
        console.log("Game over.");
        resetGame(); // Reset the game state
    }
}

function userSequence() {
    // Logs the user's clicked button and adds it to their User Patter.
    $(".btn").off("click").on("click", function() { // Remove previous click handlers and starts a new one.
        var userChosenColor = $(this).attr("id");
        console.log("User chose: " + userChosenColor); // Debug

        userClickedPattern.push(userChosenColor);
        animatePress(userChosenColor);
        playSound(userChosenColor);

        checkAnswer(userChosenColor);
        console.log(userClickedPattern);
        })
}

// Plays the corresponding button sound.
function playSound(name) {
    var audio = new Audio("./sounds/" + name + ".mp3");
    audio.play();
}

// Plays the sound for wrong answers.
function wrongAnswer() {
    var audio = new Audio("./sounds/wrong.mp3");
    audio.play();
}

// Adds User's button click shadow class.
function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(() => {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

// Reset game state
function resetGame() {
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    gameOverEffect();
    $(".btn").off("click");
    $(document).on("keydown", handleFirstKeyPress);
    firstKeyPressDetected = false; // Reset the first key press flag
    countdownDisplay.hide(); // Hide countdown display
    levelTitle.text("You Lost! Press Any Key to Start"); // Prompt to start the game
}

function gameOverEffect() {
        // Applies game over effect for background.
        wrongAnswer()
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
}