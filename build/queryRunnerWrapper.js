"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var release;
var wrap = function (originalQueryRunner) {
    release = originalQueryRunner.release;
    originalQueryRunner.release = function () {
        return Promise.resolve();
    };
    originalQueryRunner.releaseQueryRunner = function () {
        originalQueryRunner.release = release;
        return originalQueryRunner.release();
    };
    return originalQueryRunner;
};
exports.wrap = wrap;
