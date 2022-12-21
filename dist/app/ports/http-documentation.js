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
const request = __importStar(require("request"));
function setup(app) {
    app.ports.loadHttpDocumentation.subscribe((pointer) => {
        const { name, version } = pointer;
        request.get(`http://package.elm-lang.org/packages/${name}/${version}/docs.json`, function (err, _response, body) {
            if (err) {
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: null
                });
                return;
            }
            try {
                const parsed = JSON.parse(body);
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: parsed
                });
            }
            catch (e) {
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: null
                });
            }
        });
    });
}
exports.setup = setup;
