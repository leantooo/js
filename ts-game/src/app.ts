import Brain from "./brain";
import UI from "./ui";

function validateIndexHtml() {
    if (document.querySelectorAll("#app").length != 1) {
        throw Error("More or less than one div with id 'app' found!");
    }
    if (document.querySelectorAll("div").length != 1) {
        throw Error("More or less than one div found in index.html!");
    }
}

function main() {
    validateIndexHtml();
    let appDiv = document.querySelector<HTMLDivElement>("#app")!;
    let brain = new Brain();
    let ui = new UI(brain, appDiv);

    const pauseMenu = document.getElementById('pause-menu') as HTMLDivElement;
    const resumeButton = document.getElementById('resume-button') as HTMLButtonElement;
    const newgameButton = document.getElementById('newgame-button') as HTMLButtonElement;

    resumeButton.addEventListener('click', function() {
        brain.resume();
        pauseMenu.style.display = 'none';
    });
      
      newgameButton.addEventListener('click', function() {
        brain.resetGame();
        pauseMenu.style.display = 'none';
    });
    
    function gameLoop() {
        if (!brain.paused) {
            brain.moveBall(); // Move the ball only if not paused
            brain.checkWin();
            ui.draw(); // Redraw the UI
        }
        requestAnimationFrame(gameLoop); // Continue the loop
    }

    brain.waitForSpaceToStart();
    gameLoop(); // Start the game loop

    document.addEventListener('keydown', (e) => {
        if (brain.paused) return;
        switch (e.key) {
            case 'a':
            case 'ArrowLeft':
                brain.startMovePaddle(brain.paddle, -0.01);
                break;
            case 'd':
            case 'ArrowRight':
                brain.startMovePaddle(brain.paddle, 0.01);
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (brain.paused) return;
        switch (e.key) {
            case 'a':
            case 'ArrowLeft':
                brain.stopMovePaddle(brain.paddle);
                break;
            case 'd':
            case 'ArrowRight':
                brain.stopMovePaddle(brain.paddle);
                break;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!brain.paused) {
            switch (e.key) {
                case 'Escape':
                case ' ':
                    brain.pause();
                    pauseMenu.style.display = 'block';
                    break;
            }
        } else {
            switch (e.key) {
                case 'Escape':
                case ' ':
                    brain.resume();
                    pauseMenu.style.display = 'none';
                    break;
            }
        }
    });
}

// =============== ENTRY POINT ================
console.log("App startup...");
main();
