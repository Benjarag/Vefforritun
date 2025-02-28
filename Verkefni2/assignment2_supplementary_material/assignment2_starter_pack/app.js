// #########################################
// ### Setting up the game and the synth ###
// #########################################

let synth;

// gamestate object to keep track of the game
let gameState = {
    sequence: [], // sequence needed
    userSequence: [], // user input sequence
    level: 0,
    highScore: 0,
    isPlaying: false,
};

// mapping the pads to the sounds
const soundMap = {
    "pad-red": "C4",
    "pad-yellow": "D4",
    "pad-green": "E4",
    "pad-blue": "F4",
};

// keyboard support for the pads, Q, W, A, S
const keyMap = {
    "q": "pad-red",
    "w": "pad-yellow",
    "a": "pad-green",
    "s": "pad-blue"
}

// helper function to map pad names to element IDs
const mapPadId = (pad) => {
    const mapping = {
        red: "pad-red",
        yellow: "pad-yellow",
        blue: "pad-blue",
        green: "pad-green"
    };
    return mapping[pad] || pad; // returning the original if no mapping exists
};

// setting up the pads to get the tune when clicked
const pads = document.querySelectorAll(".pad"); // get all the pads
const startButton = document.getElementById("start-btn");
const replayButton = document.getElementById("replay-btn");
const soundSelect = document.getElementById("sound-select");
const levelIndicator = document.getElementById("level-indicator");
const highScore = document.getElementById("high-score");
const resetButton = document.getElementById("reset-btn");
const failureModal = document.getElementById("failure-modal");

// #########################################


// ####################
// ### Start Button ###
// ####################
startButton.addEventListener("click", () =>{
    console.log("buttonStart-test")
    gameState.isPlaying = true;
    startGame();
});

// #####################
// ### REPLAY BUTTON ###
// #####################
replayButton.addEventListener("click", () => {
    // disable replay button when replaying
    replayButton.disabled = true;
    gameState.isPlaying = false;
    playSequence();
});

// ####################
// ### RESET BUTTON ###
// ####################
resetButton.addEventListener("click", () => {
    failureModal.style.display = "none"; // add this to hide the modal when reset is clicked
    startGame(); // reset the game and restart
});

// ####################
// ### SOUND SELECT ###
// ####################
soundSelect.addEventListener("change", () => {
    if (synth) {
        synth.oscillator.type = soundSelect.value;
    }
});

// ###############################
// ### Listeners and pad cicks ###
// ###############################

// add the event listener to the pads
pads.forEach(pad => {
    pad.addEventListener("click", () => {
        PadClick(pad.id);
    });
});

// add the event listener to the keyboard
pads.forEach(pad => {
    window.addEventListener("keydown", (event) => {
        if (event.key in keyMap && pad.id === keyMap[event.key]) {
            PadClick(pad.id);
        }
    });
});

// handle the pad clicks
const PadClick = (padId) => {
    if (gameState.isPlaying) { // only if the game is playing
        console.log(padId);
        playSound(padId);
        lightUpPad(padId);
        gameState.userSequence.push(padId);
        checkUserInput();
    }
};

// #########################################


// ##########################################
// ### PLAYING SOUND AND LIGHTING UP PADS ###
// ##########################################

// TODO: Implement the playSound function
const playSound = (padId) => {
    const mappedPadId = mapPadId(padId);
    synth.triggerAttackRelease(soundMap[mappedPadId], "8n"); // play the sound for 0.5s
};

// TODO: Implement the lightUpPad function
const lightUpPad = (padId) => {
    // Map the padId from the backend to the actual element ID
    const mappedPadId = mapPadId(padId);
    const padElement = document.getElementById(mappedPadId);
    
    if (!padElement) {
        console.warn(`No element found with id: ${mappedPadId}`);
        return;
    }
    padElement.classList.add("active");
    setTimeout(() => {
        padElement.classList.remove("active");
    }, 300);
};

// #########################################


// ###########################
// ### CHECKING USER INPUT ###
// ###########################
const checkUserInput = async () => {
    const currentIndex = gameState.userSequence.length - 1; // get the current index of the input

    // check for exact matching
    if (mapPadId(gameState.userSequence[currentIndex]) !== mapPadId(gameState.sequence[currentIndex])) {
        // if input was wrong
        console.error("Wrong input!");
        gameState.userSequence = [];
        gameState.isPlaying = false;
        failureModal.style.display = "block";
        return;
    }

    // If the entire sequence was correctly inputted
    if (gameState.userSequence.length === gameState.sequence.length) { // checking length to check if the sequence is completed
        gameState.isPlaying = false;

        const url = "http://localhost:3000/api/v1/game-state/sequence";
        try {
            const response = await axios.post(url, { // post the sequence to the backend
                sequence: gameState.sequence // we send the correct sequence to the backend, because we already know that the user input is correct
            });
            // succesful, Update game state with new sequence and level
            console.log("Success: ", response.data);
            gameState.sequence = response.data.gameState.sequence;
            gameState.level = response.data.gameState.level;
            gameState.highScore = response.data.gameState.highScore;
            gameState.userSequence = []; // Reset user input for next round
            updateUI(); // Update level and high score on UI
            playSequence(); // Play the new sequence for the user

        } catch (error) {
            console.log("Error posting sequence:", error);
        }
    }
};

// ##################
// ### GAME LOGIC ###
// ##################

// TODO: Game logic: Fetch sequences from the backend, 
// play them with correct timing, and validate user input.
const startGame = async () => {
    // resuming the AudioContext if it's suspended
    if (Tone.context.state === "suspended") {
        await Tone.context.resume();
    }
    // Initialize Tone.js after the user clicks the Start button
    if (!synth) {
        synth = new Tone.Synth().toDestination();
    }
    try {

        replayButton.disabled = true;
        const response = await axios.put("http://localhost:3000/api/v1/game-state"); // put request to start the game and get the sequence
        gameState.sequence = response.data.gameState.sequence; // Save the sequence
        gameState.level = response.data.gameState.level; // Save the current level
        gameState.highScore = response.data.gameState.highScore; // Save the high score
        updateUI(); // Update the UI with the new level and high score
        playSequence(); // Play the sequence for the user to repeat
    } 
    catch (error) {
        console.error("Error starting the game:", error);
    }
};

const playSequence = () => {
    // disable user input and the replay button when the sequence is playing
    gameState.isPlaying = false;
    replayButton.disabled = true;

    setTimeout(() => {
        let index = 0;
        const playNextPad = () => {
            if (index < gameState.sequence.length) { // check if there are pads left to play
                const padId = gameState.sequence[index]; // get the pad id from the sequence
                lightUpPad(padId);
                playSound(padId);
                index++;
                // wait 750ms before playing the next pad
                setTimeout(playNextPad, 750);
            } else {
                // all the pads have been played, allow the user to input and enable replay
                gameState.isPlaying = true;
                replayButton.disabled = false;
            }
        };
        playNextPad();
    }, 1000); // wait 1 second before starting the sequence
};

const updateUI = async () => {
    if (levelIndicator) {
        levelIndicator.textContent = gameState.level; // update the level
    }

    if (highScore) {
        highScore.textContent = gameState.highScore; // update the high score
    }
}
