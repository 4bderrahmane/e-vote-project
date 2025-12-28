"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * The same as individual imports but doesn't require to add new import line every time
 */
["maci", "poll"].forEach((folder) => {
    const tasksPath = path_1.default.resolve(__dirname, folder);
    if (fs_1.default.existsSync(tasksPath)) {
        fs_1.default.readdirSync(tasksPath)
            .filter((p) => (p.endsWith(".ts") && !p.endsWith("index.ts") && !p.endsWith("d.ts")) ||
            (p.endsWith(".js") && !p.endsWith("index.js")))
            .forEach((task) => {
            Promise.resolve(`${`${tasksPath}/${task}`}`).then(s => __importStar(require(s)));
        });
    }
});
//# sourceMappingURL=index.js.map