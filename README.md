<br />
<div align="center">
  <a >
    <img src="git/robot.svg" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Chess.com Analyzer</h3>

  <p align="center">
    🤖 Finding the best move on the board
    <br />
    <a href="https://github.com//Samuel-Hinchliffe/Chess.com-analyser"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com//Samuel-Hinchliffe/Chess.com-analyser/issues">Report Bug</a>
    ·
    <a href="https://github.com//Samuel-Hinchliffe/Chess.com-analyser/issues">Request Feature</a>
  </p>
</div>


# About 
This project is a free and open-source solution for anyone who wants to learn how to play chess using [Stockfish](https://stockfishchess.org/), an open-source chess engine. It serves as a [Stockfish](https://stockfishchess.org/) interface for the website [Chess.com](https://www.chess.com/), where [Stockfish](https://stockfishchess.org/) highlights the best moves for players. The project is a great resource for beginners who want to improve their chess skills without having to pay for expensive chess training solutions.

All as a small chrome extension. 
![robot](./git/feature.png)

## 💻 Features
You could provide a bullet-pointed list of the key features of your extension. This could include things like:

1. Highlighting the best move on the board
2. Using Stockfish for analysis and evaluation
3. Providing a free and open-source chess training solution
4. Working as a Chrome extension for easy use

## 🚀 Technologies Used
- 💻[WebAssembly](https://webassembly.org/): a binary instruction format so we can run Stockfish faster.
- 📜 [TypeScript](https://www.typescriptlang.org/): a typed superset of JavaScript that compiles to plain JavaScript.
- 🌐 [JavaScript](https://www.javascript.com/): a high-level programming language used for creating interactive web applications.
- 🔄 [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API): a technology used for caching and offline functionality in web applications.
- [♟️ Stockfish](https://stockfishchess.org/): an open-source chess engine used for analysis and evaluation of chess positions.
- 🤖 [UCI](https://en.wikipedia.org/wiki/Universal_Chess_Interface): a protocol used for communicating with chess engines like Stockfish.
- [🔌 Chrome API](https://developer.chrome.com/docs/extensions/reference/): a set of APIs used for creating extensions for Google Chrome.
- 📦 [Webpack](https://webpack.js.org/): for bundling

## Design
This uses a variety of design patterns to implement various functionalities in the code. These patterns were chosen to improve the quality of the code, increase its flexibility, and promote code reusability. Here's a brief summary of the design patterns used in this project and their significance:

- Singleton: This pattern is used to ensure that the default ```ChessSolver``` and ```STOCKFISH``` object is created only once, reducing memory usage and increasing efficiency.

- Facade: The facade pattern is used to simplify the interface of the Stockfish engine, making it easier to use by hiding its complexity behind a simpler interface.
```javascript
import ChessSolver from './classes/ChessSolver'
const chessSolver = new ChessSolver();
chessSolver.startGame();
```

- Factory: The factory pattern is used to create new instances of the ```ChessSolver``` class and Stockfish engine, making it easier to maintain and test. As well as making it easier to read from an abstract perspective.

- Observer: This pattern is used to register event listeners that listen for changes to the local storage, and trigger the relevant event handlers whenever there is a change. The reason for this is because, we need to communicate from the service worker to the DOM. Which by normal means, you cannot! But by observing points of the chrome API you can manipulate the DOM by proxy. 
```javascript
// Manage Changes to local storage.
chrome.storage.onChanged.addListener((changes) => {

    const { enabled, isSolving } = changes;

    if (enabled && enabled.newValue === false) {
        this.engine.postMessage('stop');
    }

    if (isSolving) {
        this.isSolving = isSolving.newValue;
    }
});
```

- Dependency Injection: The ChessSolver class uses dependency injection to allow for greater flexibility and customizability, making the code more reusable. You can see this by seeing the config files, we will manually inject a default configuration if one is not provided.

- Don't Repeat Yourself (DRY): The project follows the DRY principle, minimizing code duplication by creating functions only once, reducing redundancy and increasing readability.

- Object-Oriented Programming (OOP): The ChessSolver class is an example of OOP, using classes, objects and interfaces to encapsulate data and behavior, providing a clean and modular code structure.

Here are some useful links to learn more about these design patterns:

1. [Singleton](https://refactoring.guru/design-patterns/singleton)
2. [Facade](https://refactoring.guru/design-patterns/facade)
3. [Factory](https://refactoring.guru/design-patterns/factory-method)
4. [Observer](https://refactoring.guru/design-patterns/observer)
5. [Dependency Injection](https://refactoring.guru/design-patterns/dependency-injection)
6. [Don't Repeat Yourself (DRY)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
7. [Object-Oriented Programming (OOP)](https://en.wikipedia.org/wiki/Object-oriented_programming)

## Usage Instructions
To use this extension, follow the steps below:

1. Download and install the extension from the Chrome Web Store or from the GitHub repository.
2. Navigate to a chess game on Chess.com.
3. Click on the extension icon in your browser's toolbar.
4. Activate the extension and wait for it to analyze the game.
5. Once the analysis is complete, the extension will highlight the best move for you to make.1

## Development Instructions
1. Clone the repository to your local machine
2. Install the necessary dependencies by running npm install
3. To build the project, run npm run build
4. To run the extension in development mode, navigate to chrome://extensions/ in Google  Chrome and enable Developer mode. Then, click on "Load unpacked" and select the dist folder from the cloned repository.
5. Start a game on Chess.com and click on the extension icon to activate the extension and see the best move.

Note: Make sure to reload the extension after making any changes to the code by clicking on the "reload" button on the extension card in chrome://extensions/.

For more information on using Service Workers in Chrome, please refer to the Chrome Service [Worker API documentation.](https://developer.chrome.com/docs/extensions/reference/events/)

# Future Ideas
1. Refactor content.js
   1. Removal of jQuery dependencies
2. Add in support for openers on the UI.
3. Add in support for engine evaluation on the UI.
4. Add in UI animations to prevent the quick movement of the engines bestMove updates.
5. Create a CI/CD Pipeline.
6. Create unit tests with Jest & E2E tests with Cypress. 

# ChessSolver Class
```typescript

export default class ChessSolver {

    engine: any;
    isSolving: boolean;
    fenSolveQueue: string[] = [];
    lastFen: string;
    engineEvaluation: number;
    lastBestMove: string;

    /**
     * @constructor
     * @param {ChessSolverOptions} [options=defaultChessSolverOptions] - ChessSolver options
     * */
    constructor(protected options: ChessSolverOptions = defaultChessSolverOptions) {
        this.options = options;
        this.isSolving = false;
        this.fenSolveQueue = [];
        this.lastFen = '';
        this.engineEvaluation = 0;;
        this.lastBestMove = ''

        this.engine = STOCKFISH();
        this.engine.onmessage = (output: string) => this.engineHandler(output);

        this.populateSettings();
        this.registerEventListeners();
    }

    /**
     * Starts a new chess game by solving for the best position from the default FEN string.
     * Returns true to indicate that the game has started.
     * @public
     * @returns {boolean} True to indicate that the game has started.
     * @throws Will throw an error if there is an issue with the chess engine or solving process.
     */
    public startGame(): boolean {
        this.solveForBestPosition(this.options.defaultFen);
        return true;
    }

    /**
     * Gets the best position from the given FEN string using the chess engine.
     * If the solver is disabled, does nothing. This does not return a value
     * but instead invokes Stockfish to get the best position. Which will
     * then be handled by the callback.
     * 
     * @param currentFen {string} The current FEN string to solve.
     * @private
     * @returns {boolean} true
     */
    private solveForBestPosition(currentFen: string): boolean {
        if (!this.options.enabled) return false;

        // Store the current FEN string as the last FEN string.
        this.lastFen = currentFen;
        this.engineEvaluation = 0;

        // Set the isSolving flag and save it to local storage.
        this.isSolving = true;
        chrome.storage.local.set({ isSolving: true });

        // Send the position and go commands to the engine.
        const moveTime = this.options.maxSolveTime;
        const depth = this.options.maxDepth;
        this.engine.postMessage(`position fen ${currentFen} moves`);
        this.engine.postMessage(`go movetime ${moveTime} depth ${depth}`);
        return true;
    }

     /**
     * Extracts the best move from the UCI output of the Stockfish engine.
     * 
     * @param {string} uciOutput - The UCI output from the Stockfish engine.
     * @private
     * @returns {string} The best position FEN Code. 
     */
    private getBestMoveFromInfoCommand(uciOutput: string): string {
        // Split the UCI output into individual parts
        const parts = uciOutput.split(' ');

        // Find the index of the "pv" part
        const pvIndex = parts.indexOf('pv');

        // If the "pv" part was not found, return null
        if (pvIndex === -1) {
            return '';
        }

        // Extract the best move from the "pv" part
        const bestMove = parts.slice(pvIndex + 1).join(' ').split(' ');
        return bestMove[0];
    }

     /**
     * This method gets the best move from a "bestmove" UCI command string and 
     * also handles the queue of FEN positions to solve.
     * 
     * @private
     * @param {string} bestMove - The best move in UCI format.
     * @returns {string} The best move in UCI format.
     */
    private getBestMoveFromBestMoveCommand(bestMove: string): string {
        chrome.storage.local.set({ isSolving: false });
        this.isSolving = false;
        if (this.fenSolveQueue.length) {
            const nextFen = this.fenSolveQueue.shift();
            this.solveForBestPosition(nextFen as string);
        }
        return bestMove;
    }

    /**
     * Updates the UI with the result of the best move and engine evaluation.
     * @private
     * @param {string} bestMove - The best move determined by the chess engine.
     * @param {string} depth - The depth at which the engine found the best move.
     * @returns {void}
     */
    private updateUIforBestMove(bestMove: string, depth: string) : void {
        chrome.storage.local.set({
            solver_result: {
                best_move: bestMove,
                fen: this.lastFen,
                evaluation: this.engineEvaluation,
                depth: depth,
            },
        });
    }

    /**
     * This function is called every time the Stockfish engine outputs a message.
     * It handles the message by extracting relevant information from it and updating the UI.
     * @param {string} output - The output message from the Stockfish engine.
     * @returns {void}
     */
    private engineHandler(output: string): void {
        console.log('engineHandler: ', output);

        // UCI engine's have a horrible output.
        // We have to split it all up to get an understanding.
        let args: string[] = output.split(' ');
        let command = args[0];
        let bestMove = args[1];
        let depth = args[2];

        switch (command) {
            case 'bestmove':
                bestMove = this.getBestMoveFromBestMoveCommand(bestMove);
                break;
            case 'info':
                bestMove = this.getBestMoveFromInfoCommand(output);
            default:
                break;
        }

        if (!bestMove) bestMove = this.lastBestMove;
        this.lastBestMove = bestMove;
        this.updateUIforBestMove(bestMove, depth)
    }

    /**
     * Registers event listeners to handle changes to the Chrome storage.
     *
     * The function listens for changes to the 'enabled' and 'isSolving'
     * keys in the storage, and stops the engine if the 'enabled' value
     * changes to false. It also updates the 'isSolving' flag if it changes
     * in the storage. As well as an postMessages made from the content.js script. 
     * 
     * This is done so we can easily stop Stockfish from pointless plays. 
     * 
     * @private
     * @returns {void}
     */
    private registerEventListeners(): void {

        // Manage Changes to local storage.
        chrome.storage.onChanged.addListener((changes) => {

            const { enabled, isSolving } = changes;

            if (enabled && enabled.newValue === false) {
                this.engine.postMessage('stop');
            }

            if (isSolving) {
                this.isSolving = isSolving.newValue;
            }
        });

        // Manage changes from content.js
        // Basically, we're hooked into the native scripts
        // and so whenever it sends a message, we listen to it
        // for changes. So we can keep in sync with Chess.com. 
        chrome.runtime.onMessage.addListener(
            ({ type, fen_string }) => {
                switch (type) {

                    // Add to the solutions queue. 
                    case 'startSolve':
                        this.engine.postMessage('stop');
                        if (this.isSolving) {
                            this.fenSolveQueue.push(fen_string);
                            break;
                        }
                        this.solveForBestPosition(fen_string)
                        break;

                    // Halt all processes, start new game.
                    case 'newGame':
                        this.engine.postMessage('stop');
                        this.engine.postMessage('ucinewgame');
                        break;
                    case 'stopSolve':

                        // Halt all processes.
                        this.engine.postMessage('ucinewgame');
                        break;
                }
            },
        );
    }

    /**
     * Populates the settings by default. If the settings are not already
     * present in local storage, this function sets default values.
     * 
     * This will later enable us to allow the user to tinker with the UCI
     * in a easier way. 
     * 
     * @private
     * @returns {void}
     */
    private populateSettings(): void {

        // Set Default engine color if not provided
        chrome.storage.local.get('engineColor', (result) => {
            const engineColor = result?.engineColor ?? this.options.engineColor;
            chrome.storage.local.set({ engineColor: engineColor });
        });

        // Enable by default. 
        chrome.storage.local.get(['enabled'], (result) => {
            const enabled = result?.enabled ?? this.options.enabled;
            chrome.storage.local.set({ enabled });
        });

        // Max Depth for Stockfish to explore. 
        chrome.storage.local.get(['maxDepth'], (result) => {
            const maxDepth = result?.enabled ?? this.options.maxDepth;
            chrome.storage.local.set({ maxDepth });
        });

        // Max Time for Stockfish to explore. 
        chrome.storage.local.get(['maxSolveTime'], (result) => {
            const maxSolveTime = result?.enabled ?? this.options.maxSolveTime;
            chrome.storage.local.set({ maxSolveTime });
        });

        // Starting position for Stockfish. 
        chrome.storage.local.get(['defaultFen'], (result) => {
            const defaultFen = result?.enabled ?? this.options.defaultFen;
            chrome.storage.local.set({ defaultFen });
        });
    }

    /**
     * Populates default options if they are not provided in the constructor options.
     * Using object destructuring.
     * 
     * @private
     * @returns {ChessSolverOptions} - The ChessSolver options with any missing default options added.
     */
    private populateDefaults(): ChessSolverOptions {
        return { ...defaultChessSolverOptions, ...this.options };
    }

}

```

## Author
Samuel Hinchliffe
- [Author Website](https://samuel-hinchliffe.netlify.app/)
- [Author Github](https://github.com/Samuel-Hinchliffe)
- [Linkedin](https://www.linkedin.com/feed/)

