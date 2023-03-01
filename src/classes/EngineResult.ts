import defaultEngineResult from "../config/defaultEngineResult";
import EngineResultOptions from "../interfaces/EngineResultOptions";

/**
 * A class to represent the default engine's results. 
 * @deprecated
 */
export default class EngineResult {
    constructor(protected result: EngineResultOptions = defaultEngineResult){
        this.result = result;
    }
}
