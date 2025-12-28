"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
/**
 * Stop the current thread for n milliseconds
 * @param ms the number of milliseconds to sleep for
 * @returns a promise that resolves after the specified number of milliseconds
 */
const delay = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});
exports.delay = delay;
//# sourceMappingURL=time.js.map