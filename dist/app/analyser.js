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
const fileLoadingPorts = __importStar(require("./file-loading-ports"));
const loggingPorts = __importStar(require("./util/logging-ports"));
const dependencies = __importStar(require("./util/dependencies"));
const reporter_1 = __importDefault(require("./reporter"));
const directory = process.cwd();
const Elm = require('./backend-elm');
function start(config, project) {
    const reporter = reporter_1.default.build(config.format);
    dependencies.getDependencies(function (registry) {
        const app = Elm.Elm.Analyser.init({
            flags: {
                server: false,
                registry: registry || [],
                project: project,
                logging: config.logging,
            },
        });
        app.ports.sendReportValue.subscribe(function (report) {
            reporter.report(report);
            const fail = report.messages.length > 0 ||
                report.unusedDependencies.length > 0;
            process.exit(fail ? 1 : 0);
        });
        loggingPorts.setup(app, config);
        fileLoadingPorts.setup(app, config, directory);
    });
}
exports.default = { start };
