/**
 * @author Samuel Hinchliffe <sam.hinchliffe.work@gmail.com>
 * @see    [Linkedin] {@link https://www.linkedin.com/in/samuel-hinchliffe-2bb5801a5/}
 *
 * @summary This is the entire service worker. From the class ChessSolver,
 * we will automatically starting reading in the board, running it through stockFish
 * and getting the best move which we will highlight on the screen. 
 *
 * Created at: 01/03/2023
*/

import ChessSolver from './classes/ChessSolver'
const chessSolver = new ChessSolver();
chessSolver.startGame();