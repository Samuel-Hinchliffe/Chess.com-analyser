/**
 * Default options for the ChessSolver.
 *
 * @type {import("./ChessSolverOptions").default}
 */
const defaultChessSolverOptions = {
    enabled: true,
    engineColor: "#699642",
    maxDepth: 25,
    maxSolveTime: 8000,
    defaultFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
};

export default defaultChessSolverOptions;