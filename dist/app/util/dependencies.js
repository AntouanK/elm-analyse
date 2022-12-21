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
exports.getDependencies = void 0;
const request = __importStar(require("request"));
const cache = __importStar(require("./cache"));
const fetchDependencies = function (cb) {
    request.get('http://package.elm-lang.org/search.json', function (err, _, body) {
        if (err) {
            cb(null);
            return;
        }
        var cbValue;
        try {
            cbValue = JSON.parse(body);
        }
        catch (e) {
            cbValue = null;
        }
        cb(cbValue);
    });
};
const updatePackageDependencyInfo = function (cb, defaultValue) {
    fetchDependencies(function (result) {
        console.log('Fetched dependencies');
        if (result == null) {
            cb(defaultValue);
            return;
        }
        cache.storePackageDependencyInfo({
            timestamp: new Date().getTime(),
            data: result,
        });
        cb(result);
    });
};
const isOutdated = function (timestamp) {
    const barrier = new Date().getTime() - 1000 * 60 * 60;
    return timestamp < barrier;
};
const getDependencies = function (cb) {
    cache.readPackageDependencyInfo(function (err, cached) {
        if (err && err !== null) {
            console.log('Fetching package information from package.elm-lang.org.');
            updatePackageDependencyInfo(cb, null);
        }
        else {
            if (isOutdated(cached.timestamp)) {
                console.log('Cached package information invalidated. Fetching new data from package.elm-lang.org');
                updatePackageDependencyInfo(cb, cached.data);
            }
            else {
                cb(cached.data);
            }
        }
    });
};
exports.getDependencies = getDependencies;
