"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
function report(report) {
    const messages = report.messages;
    const unusedDependencies = report.unusedDependencies;
    console.log('Found ' + report.messages.length + ' message(s)');
    if (messages.length > 0) {
        const index = lodash_1.default.groupBy(messages, 'file');
        console.log();
        console.log('Messages:');
        Object.keys(index).forEach(file => {
            console.log('- ' + file);
            index[file].forEach((x) => {
                console.log('  > ' + x.data.description);
            });
        });
    }
    if (unusedDependencies.length > 0) {
        console.log();
        console.log('Unused dependencies:');
        unusedDependencies.forEach(dep => console.log('- ' + dep));
    }
}
const reporter = { report };
exports.default = reporter;
