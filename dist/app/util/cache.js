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
exports.LocalCache = exports.storeDependencyJson = exports.storePackageDependencyInfo = exports.readPackageDependencyInfo = exports.readDependencyJson = void 0;
const fs = __importStar(require("fs"));
// const fs = require('fs');
const fsExtra = __importStar(require("fs-extra"));
// const fsExtra = require('fs-extra');
const osHomedir = require('os-homedir');
const path = __importStar(require("path"));
const version_1 = require("./version");
class LocalCache {
    constructor(projectPath) {
        this.cachePath = path.join(projectPath, 'elm-stuff', '.elm-analyse');
    }
    storeShaJson(sha1, content) {
        fs.writeFile(path.resolve(this.cachePath, '_shas', sha1 + '.json'), JSON.stringify(content), function () { });
    }
    elmCachePathForSha(sha) {
        return path.resolve(this.cachePath, '_shas', sha + '.elma');
    }
    astCachePathForSha(sha) {
        return path.resolve(this.cachePath, '_shas', sha + '.json');
    }
    setupShaFolder() {
        fsExtra.ensureDirSync(path.resolve(this.cachePath, '_shas'));
    }
    hasAstForSha(sha) {
        return fs.existsSync(this.astCachePathForSha(sha));
    }
    readAstForSha(sha) {
        return fs.readFileSync(this.astCachePathForSha(sha)).toString();
    }
}
exports.LocalCache = LocalCache;
var major;
if (version_1.ELM_ANALYSE_VERSION.split('.')[0] === '0') {
    major = '0.' + version_1.ELM_ANALYSE_VERSION.split('.')[1];
}
else {
    major = version_1.ELM_ANALYSE_VERSION.split('.')[0];
}
const globalCachePath = path.resolve(osHomedir(), '.elm-analyse', major);
function readPackageDependencyInfo(cb) {
    fs.readFile(path.resolve(globalCachePath, 'all-packages.json'), function (err, data) {
        if (err) {
            cb(err, undefined);
        }
        else {
            const s = data.toString();
            var parsed;
            try {
                parsed = JSON.parse(s);
            }
            catch (e) {
                cb(e, undefined);
                return;
            }
            cb(null, parsed);
        }
    });
}
exports.readPackageDependencyInfo = readPackageDependencyInfo;
function storePackageDependencyInfo(data) {
    fs.writeFile(path.resolve(globalCachePath, 'all-packages.json'), JSON.stringify(data), function () { });
}
exports.storePackageDependencyInfo = storePackageDependencyInfo;
function readDependencyJson(dependency, version, cb) {
    //TODO Error handling
    fs.readFile(path.resolve(globalCachePath, 'interfaces', dependency, version, 'dependency.json'), cb);
}
exports.readDependencyJson = readDependencyJson;
function storeDependencyJson(dependency, version, content) {
    const targetDir = path.resolve(globalCachePath, 'interfaces', dependency, version);
    const targetPath = path.resolve(targetDir, 'dependency.json');
    fsExtra.ensureDirSync(targetDir);
    //TODO Hanlding
    fs.writeFile(targetPath, content, function () { });
}
exports.storeDependencyJson = storeDependencyJson;
