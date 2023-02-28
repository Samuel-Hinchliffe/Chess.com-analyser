import ChessSolverOptions from "../interfaces/ChessSolverOptions";
import defaultChessSolverOptions from '../config/defaultChessSolverOptions';
import EngineResult from "./EngineResult";

importScripts('./stockfish.js');

export default class ChessSolver {

    engine: any;
    isSolving: boolean;
    fenSolveQueue: string[] = [];
    lastFen: string;
    engineEvaluation: number;
    lastBestMove: string;

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
     * @returns {void}
     */
    private solveForBestPosition(currentFen: string): boolean {
        if (!this.options.enabled) {
            return false;
        }

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

    private getBestMoveFromInfoCommand(uciOutput: string) : string {
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
        console.log('info best move');
        console.log(bestMove[0]);
        return bestMove[0];
    }

    private engineHandler(output: string): void {
        console.log('engineHandler', output);

        // UCI engine's have a horrible output.
        // We have to split it all up to get an understanding.
        let args = output.split(' ');
        let command = args[0];
        let bestMove : string = args[1];

        switch (command) {
            case 'bestmove':
                console.log('bestmove', args[1]);
                chrome.storage.local.set({ isSolving: false });
                this.isSolving = false;
                if (this.fenSolveQueue.length) {
                    const nextFen = this.fenSolveQueue.shift();
                    this.solveForBestPosition(nextFen as string);
                }
                bestMove = args[1];
                break;
            case 'info':
                bestMove = this.getBestMoveFromInfoCommand(output);
            default:
                break;
        }

        if (!bestMove) bestMove = this.lastBestMove;
        this.lastBestMove = bestMove;
        console.log('bestmove', bestMove);
        console.log('lastbestmove', this.lastBestMove);

        chrome.storage.local.set({
            solver_result: {
              best_move: bestMove,
              fen: this.lastFen,
              evaluation: this.engineEvaluation,
              depth: args[2],
            },
          });
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
