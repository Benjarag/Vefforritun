// #########################################
// ### Setting up the game and the synth ###
// #########################################

let synth;

// TODO: Fetch the sequence needed, from the backend
let gameState = {
    sequence: [],
    userSequence: [],
    level: 0,
    highScore: 0,
    isPlaying: false,
};

// Sound mapping for each pad
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

// Helper function to map pad names to element IDs
const mapPadId = (pad) => {
    const mapping = {
        red: "pad-red",
        yellow: "pad-yellow",
        blue: "pad-blue",
        green: "pad-green"
    };
    return mapping[pad] || pad; // return the original if no mapping exists
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
// ### Setting up the game and the synth ###
// #########################################

// ####################
// ### Start Button ###
startButton.addEventListener("click", () =>{
    console.log("buttonStart-test")
    gameState.isPlaying = true;
    startGame();
});
// ####################

// ####################
// ### SOUND SELECT ###
soundSelect.addEventListener("change", () => {
    synth.oscillator.type = soundSelect.value;
});
// ####################

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

// Handle the pad clicks
const PadClick = (padId) => {
    if (gameState.isPlaying) { // only handle the click if the game is playing
        console.log(padId)
        playSound(padId);
        lightUpPad(padId);
        gameState.userSequence.push(padId);
        checkUserInput();
    }
};

// ###############################
// ### Listeners and pad cicks ###
// ###############################


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

// ##########################################
// ### PLAYING SOUND AND LIGHTING UP PADS ###
// ##########################################

// ###########################
// ### CHECKING USER INPUT ###
const checkUserInput = async () => {
    const currentIndex = gameState.userSequence.length - 1; // get the current index of the input

    // check for exact matching
    if (mapPadId(gameState.userSequence[currentIndex]) !== mapPadId(gameState.sequence[currentIndex])) {
        // if input was wrong
        console.error("Wrong input!");
        gameState.userSequence = [];
        gameState.isPlaying = false;
        return;
    }

    // If the entire sequence was correctly inputted
    if (gameState.userSequence.length === gameState.sequence.length) {
        gameState.isPlaying = false;
        try {
            const response = await axios.post("http://localhost:3000/api/v1/game-state/sequence", {
                sequence: gameState.sequence
            });
            // Update game state with new sequence and level
            gameState.sequence = response.data.gameState.sequence;
            gameState.level = response.data.gameState.level;
            gameState.highScore = response.data.gameState.highScore;
            gameState.userSequence = []; // Reset user input for next round
            updateUI(); // Update level and high score on UI
            playSequence(); // Play the new sequence for the user

        } catch (error) {
            console.error("Error posting sequence:", error);
        }
    }
};
// ###########################

// ##################
// ### GAME LOGIC ###
// ##################

// TODO: Game logic: Fetch sequences from the backend, 
// play them with correct timing, and validate user input.
const startGame = async () => {
    // Resume the AudioContext if it's suspended
    if (Tone.context.state === "suspended") {
    await Tone.context.resume();
    }

    // Initialize Tone.js after the user clicks the Start button
    if (!synth) {
    synth = new Tone.Synth().toDestination();
    }
    try {
      const response = await axios.put("http://localhost:3000/api/v1/game-state");
      gameState.sequence = response.data.gameState.sequence; // Save the sequence
      gameState.level = response.data.gameState.level; // Save the current level
      gameState.highScore = response.data.gameState.highScore; // Save the high score
      updateUI(); // Update the UI with the new level and high score
      playSequence(); // Play the sequence for the user to repeat
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

const playSequence = async () => {
    gameState.isPlaying = false; // Prevent user input while playing the sequence
    await new Promise(resolve => setTimeout(resolve, 1000)); // adding a 1 second delay before starting
    for (let i = 0; i < gameState.sequence.length; i++) {
        const padId = gameState.sequence[i];
        lightUpPad(padId)
        playSound(padId)
        await new Promise(resolve => setTimeout(resolve, 750));
    }
    gameState.isPlaying = true; // Allow user input after playing the sequence
}

const updateUI = async () => {
    // implement
    if (levelIndicator) {
        levelIndicator.textContent = gameState.level;
    }

    if (highScore) {
        highScore.textContent = gameState.highScore;
    }
}

// ##################
// ### GAME LOGIC ###
// ##################

