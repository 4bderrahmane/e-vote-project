"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptSensitiveValue = void 0;
const prompt_1 = require("prompt");
/**
 * Ask for a sensitive value
 * @param name The name of the param
 * @returns the user input
 */
const promptSensitiveValue = async (name) => {
    (0, prompt_1.start)();
    const input = await (0, prompt_1.get)([{ name, hidden: true }]);
    return input[name];
};
exports.promptSensitiveValue = promptSensitiveValue;
//# sourceMappingURL=prompts.js.map