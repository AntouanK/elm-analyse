"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function report(report) {
    const output = JSON.stringify(report);
    console.log(output);
}
const reporter = { report };
exports.default = reporter;
