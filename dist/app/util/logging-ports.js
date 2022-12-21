"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
function setup(app, config) {
    // if the --logging flag is set, log all messages to the console
    if (config.logging && config.format === 'human') {
        app.ports.log.subscribe((data) => {
            console.log(data.level + ':', data.message);
        });
    }
}
exports.setup = setup;
