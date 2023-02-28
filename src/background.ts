import ChessSolver from './classes/ChessSolver'

const chessSolver = new ChessSolver();
chessSolver.startGame();

// 1 - Imports and initaites Stockfish.
// 2 - Defines the stockfish callback and runs it's correct function.
//   - bestmove, info, score etc. 
// 3- Adds listner to the run time, so that whenever a message is made it runs the right function. 

// Add in a depth counter to the UI.
// Auto start not on change. 

// const stockfish = STOCKFISH();
// let last_fen_string = '';
// let engine_evaluation = null;
// let max_solve_depth = 20;
// let best_move = '';
// let is_solving = false;
// const fen_solve_queue = [];

// stockfish.onmessage = function (line) {
//   // console.log(line);
//   tokens = line.split(' ');
//   if (tokens[0] == 'bestmove') {
//     chrome.storage.local.set({ isSolving: false });
//     is_solving = false;
//     if (fen_solve_queue.length > 0) {
//       startSolve(fen_solve_queue.shift());
//     }
//   } else if (
//     tokens[0] == 'info'
//         && tokens[1] == 'depth'
//         && (tokens[2] >= 15 || tokens[2] == max_solve_depth)
//   ) {
//     for (i = 0; i < tokens.length; i++) {
//       if (tokens[i] == 'score') {
//         const score_type = tokens[i + 1];
//         const score = tokens[i + 2];
//         if (score_type == 'cp') {
//           new_evaluation = score;
//         } else if (score_type == 'mate') {
//           new_evaluation = `M${Math.abs(score)}`;
//           if (score < 0) {
//             new_evaluation = `-${new_evaluation}`;
//           }
//         }
//       }
//       if (tokens[i] == 'pv') {
//         // Only update the best move if the evaluation is better than the previous one
//         if (
//           engine_evaluation == null
//                     || new_evaluation.includes('M')
//                     || new_evaluation - engine_evaluation >= 10
//         ) {
//           best_move = tokens[i + 1];
//         }
//         engine_evaluation = new_evaluation;

//         chrome.storage.local.get(['enabled'], (result) => {
//           if (result.enabled) {
//             chrome.storage.local.set({
//               solver_result: {
//                 best_move,
//                 fen: last_fen_string,
//                 evaluation: engine_evaluation,
//                 depth: tokens[2],
//               },
//             });
//           }
//         });
//         break;
//       }
//     }
//   }
// };

// function startSolve(fen_string) {
//   chrome.storage.local.get(['player_color', 'enabled', 'maxDepth', 'maxSolveTime'], (result) => {
//     if (result.enabled) {
//       last_fen_string = fen_string;
//       engine_evaluation = null;
//       max_solve_depth = result.maxDepth;
//       let maxSolveTime = result.maxSolveTime;

//       chrome.storage.local.set({ isSolving: true });
//       is_solving = true;
//       stockfish.postMessage(`position fen ${fen_string} moves`);
//       stockfish.postMessage(`go movetime ${maxSolveTime} depth ${result.max_depth}`);
//       console.log(`position fen ${fen_string} moves`);
//     }
//   });
// }

// chrome.runtime.onMessage.addListener(
//   (message, sender, sendResponse) => {
//     switch (message.type) {
//       case 'startSolve':
//         stockfish.postMessage('stop');
//         if (is_solving) {
//           fen_solve_queue.push(message.fen_string);
//         } else {
//           startSolve(message.fen_string);
//         }
//         break;
//       case 'newGame':
//         stockfish.postMessage('stop');
//         stockfish.postMessage('ucinewgame');
//         break;
//       case 'stopSolve':
//         stockfish.postMessage('stop');
//         break;
//       default:
//                 // Do nothing
//     }
//     console.log(message.type);
//   },
// );

// chrome.storage.onChanged.addListener((changes, namespace) => {
//   if ('enabled' in changes) {
//     if (changes.enabled.newValue == false) {
//       stockfish.postMessage('stop');
//     }
//   }
//   if ('isSolving' in changes) {
//     is_solving = changes.isSolving.newValue;
//   }
// });

// startSolve('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');