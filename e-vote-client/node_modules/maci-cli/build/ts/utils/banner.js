"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banner = void 0;
const theme_1 = require("./theme");
/**
 * Print a nice MACI banner
 * @param quiet - whether to print the text or not
 */
const banner = (quiet) => {
    (0, theme_1.logRed)(quiet, `

    ███▄ ▄███▓ ▄▄▄       ▄████▄   ██▓
    ▓██▒▀█▀ ██▒▒████▄    ▒██▀ ▀█  ▓██▒
    ▓██    ▓██░▒██  ▀█▄  ▒▓█    ▄ ▒██▒
    ▒██    ▒██ ░██▄▄▄▄██ ▒▓▓▄ ▄██▒░██░
    ▒██▒   ░██▒ ▓█   ▓██▒▒ ▓███▀ ░░██░
    ░ ▒░   ░  ░ ▒▒   ▓▒█░░ ░▒ ▒  ░░▓  
    ░  ░      ░  ▒   ▒▒ ░  ░  ▒    ▒ ░
    ░      ░     ░   ▒   ░         ▒ ░
           ░         ░  ░░ ░       ░  
                         ░            
    
    `);
    (0, theme_1.logYellow)(quiet, "Welcome to MACI - Minimal Anti Collusion Infrastructure\n\n");
};
exports.banner = banner;
//# sourceMappingURL=banner.js.map