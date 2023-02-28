/**
 * @author Samuel Hinchliffe <sam.hinchliffe.work@gmail.com>
 * @summary Interface for options to configure a chess solver.
 * Represents the result of a chess engine operation.
 * 
 * @default {
 *  bestMove: '',
    fen:'',
    evaluation: '',
    depth: 0,
 * }
 * 
 * @interface
 * @property {string} [bestMove] - The best move suggested by the engine.
 * @property {string} [fen] - The FEN notation of the current position.
 * @property {string} [maxDepth] - The maximum depth the engine was instructed to search.
 * @property {string} evaluation - The engine's evaluation of the current position.
 * @property {number} depth - The depth the engine searched to find the result.
 */

export default interface EngineResultOptions {
    bestMove?: string;
    fen?: string;
    maxDepth?: string;
    evaluation: string;
    depth: number;
}
