import defaultEngineResult from "../config/defaultEngineResult";
import EngineResultOptions from "../interfaces/EngineResultOptions";

export default class EngineResult {
    constructor(protected result: EngineResultOptions = defaultEngineResult){
        this.result = result;
    }
}
