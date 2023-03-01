/**
 * @author Samuel Hinchliffe <sam.hinchliffe.work@gmail.com>
 * @summary Interface for options to configure a chess solver.
 *
 * @interface
 * @default {
 * enabled               : true,
 * num_all_time_solves   : 0,
 * engine_highlight_color: '#1BACB0',
 * max_depth             : 25
 * }
 *
 * @property {boolean} [enabled=true] - Whether the chess solver is enabled.
 * @property {string} [engineColor="#1BACB0"] - The color used to highlight the engine's suggested moves.
 * @property {number} [max_depth=25] - The maximum depth to search for a move.
 */

export default interface ChessSolverOptions {
    enabled?    : boolean;
    engineColor?: string;
    maxDepth?   : number;
    maxSolveTime: number;
    defaultFen  : string;
}

