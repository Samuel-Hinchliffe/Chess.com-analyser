// Mock the web worker
const workerMock = jest.fn();
global.Worker = jest.fn(() => workerMock);

global.importScripts = jest.fn();


test('myServiceWorker should import', () => {
  const myServiceWorker = new Worker('../../src/classes/ChessSolver.ts');
});