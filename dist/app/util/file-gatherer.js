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
exports.includedInFileSet = exports.getDependencyFiles = exports.gather = void 0;
const fs = __importStar(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const find = __importStar(require("find"));
const _path = __importStar(require("path"));
function isRealElmPaths(sourceDir, filePath) {
    const modulePath = filePath.replace(_path.normalize(sourceDir + '/'), '');
    const moduleParts = modulePath.split('/');
    return lodash_1.default.every(moduleParts, m => m.match('^[A-Z].*'));
}
function includedInFileSet(path) {
    if (!path.match(/\.elm$/)) {
        return false;
    }
    return path.indexOf('elm-stuff') === -1 && path.indexOf('node_modules') === -1;
}
exports.includedInFileSet = includedInFileSet;
function targetFilesForPathAndPackage(directory, path, pack) {
    const packTargetDirs = pack['source-directories'] || ['src'];
    const targetFiles = lodash_1.default.uniq(lodash_1.default.flatten(packTargetDirs.map(x => {
        const sourceDir = _path.normalize(path + '/' + x);
        const exists = fs.existsSync(sourceDir);
        if (!exists) {
            return [];
        }
        const dirFiles = find.fileSync(/\.elm$/, sourceDir).filter(x => {
            const resolvedX = _path.resolve(x);
            const resolvedPath = _path.resolve(path);
            const relativePath = resolvedX.replace(resolvedPath, '');
            return includedInFileSet(relativePath) && x.length > 0;
        });
        return dirFiles.filter(x => isRealElmPaths(sourceDir, x));
    }))).map(function (s) {
        const sParts = s.split(_path.sep);
        const dirParts = directory.split(_path.sep);
        while (sParts.length > 0 && dirParts.length > 0) {
            if (sParts[0] == dirParts[0]) {
                sParts.shift();
                dirParts.shift();
            }
            else {
                break;
            }
        }
        const result = dirParts.map(() => '../').join('') + sParts.join('/');
        return _path.normalize(result);
    });
    return targetFiles;
}
function getDependencyFiles(directory, dep) {
    const depPath = `${directory}/elm-stuff/packages/${dep.name}/${dep.version}`;
    const depPackageFile = require(depPath + '/elm.json');
    const unfilteredTargetFiles = targetFilesForPathAndPackage(directory, depPath, depPackageFile);
    const exposedModules = depPackageFile['exposed-modules'].map(x => _path.normalize('/' + x.replace(new RegExp('\\.', 'g'), '/') + '.elm'));
    return unfilteredTargetFiles.filter(function (x) {
        return exposedModules.filter(e => lodash_1.default.endsWith(x, e))[0];
    });
}
exports.getDependencyFiles = getDependencyFiles;
function gather(directory) {
    const packageFile = require(directory + '/elm.json');
    const input = {
        interfaceFiles: [],
        sourceFiles: targetFilesForPathAndPackage(directory, directory, packageFile)
    };
    return input;
}
exports.gather = gather;
