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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const fs = __importStar(require("fs"));
const fileGatherer = __importStar(require("../util/file-gatherer"));
const path = __importStar(require("path"));
function setup(app, directory) {
    app.ports.loadContext.subscribe(() => {
        const input = fileGatherer.gather(directory);
        var configuration;
        try {
            configuration = fs.readFileSync(path.join(directory, 'elm-analyse.json')).toString();
        }
        catch (e) {
            configuration = '';
        }
        const data = {
            sourceFiles: input.sourceFiles,
            interfaceFiles: input.interfaceFiles,
            configuration: configuration
        };
        setTimeout(function () {
            app.ports.onLoadedContext.send(data);
        }, 5);
    });
}
exports.setup = setup;
