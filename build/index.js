"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var transactionalTestContext_1 = require("./transactionalTestContext");
var factory_1 = require("./factory");
var connection;
var contextFunction;
var defaultsFunction;
/**
 * Sets the default artifacts to create for every test case that uses transact() or start().
 *
 * @returns void
 */
function setDefaults(func) {
    defaultsFunction = func;
}
exports.setDefaults = setDefaults;
/**
 * Execute the function in a transaction and roll back afterwards.
 *
 * @export
 * @param {() => Promise<void>} func
 * @returns {() => Promise<void>}
 */
function transact(func) {
    var _this = this;
    return function (done) { return __awaiter(_this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, start()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, func()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    done(e_1);
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, finish()];
                case 5:
                    _a.sent();
                    done();
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.transact = transact;
/**
 * Connect to the PG database and provide connection object to factories and the transaction context.
 *
 * @export
 * @returns {Promise<Connection>}
 */
function setConnection(conn) {
    connection = conn;
    factory_1.factory.setManager(conn.manager);
    transactionalTestContext_1.testContext.setConnection(conn);
    return conn;
}
exports.setConnection = setConnection;
/**
 * Disconnect from PG.
 *
 * @export
 * @returns {Promise<void>}
 */
function disconnect() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.close()];
                case 1:
                    _a.sent();
                    contextFunction = undefined;
                    return [2 /*return*/];
            }
        });
    });
}
exports.disconnect = disconnect;
/**
 * Start a transaction.
 *
 * @export
 * @returns {Promise<void>}
 */
function start() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transactionalTestContext_1.testContext.start()];
                case 1:
                    _a.sent();
                    if (!(defaultsFunction !== undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, defaultsFunction()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(contextFunction !== undefined)) return [3 /*break*/, 5];
                    return [4 /*yield*/, contextFunction()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.start = start;
/**
 * Rollback the current test transaction.
 *
 * @export
 * @returns {Promise<void>}
 */
function finish() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transactionalTestContext_1.testContext.finish()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.finish = finish;
/**
 * Define a factory with default properties.
 *
 * In addition to the props that are assigned to the artifact, there are
 * a couple of special props:
 * - context: special values that the entity needs to be created properly
 * - save: should the artifact be saved?
 * - afterSave: function to be executed after saving the object, which gets passed in
 * See examples in entityFactories.ts
 * @export
 * @template T
 * @param {{ new (): T }} Entity the BaseEntity subclass to be created
 * @param {FactoryProps} [props={}]
 * @param {string} [variant=null] the variation of the entity to define
 */
function define(Entity, props, variant) {
    if (props === void 0) { props = {}; }
    if (variant === void 0) { variant = null; }
    factory_1.factory.define(Entity, props, variant);
}
exports.define = define;
/**
 * Makes an artifact from the given factory.
 *
 * @export
 * @template T
 * @param {({ new (): T } | string)} entityOrName the name or class of the entity to make
 * @param {FactoryProps} [props={}]
 * @param {string} [variant=null] the variation of the entity to make
 * @param managerOverride {EntityManager} use this connection manager instead of the default
 * @returns {Promise<T>}
 */
function make(entityOrName, props, variant, managerOverride) {
    if (props === void 0) { props = {}; }
    if (variant === void 0) { variant = null; }
    return __awaiter(this, void 0, void 0, function () {
        var artifact;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, factory_1.factory.make(entityOrName, props, variant, managerOverride)];
                case 1:
                    artifact = _a.sent();
                    return [2 /*return*/, artifact];
            }
        });
    });
}
exports.make = make;
/**
 * Make N number of artifacts from the given factory.
 *
 * @export
 * @template T
 * @param {({ new (): T } | string)} entityOrName
 * @param {number} n
 * @param {FactoryProps} [props={}]
 * @param {string} [variant=null]
 * @returns {Promise<T[]>}
 */
function makeMany(entityOrName, n, props, variant) {
    if (props === void 0) { props = {}; }
    if (variant === void 0) { variant = null; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Promise.all(Array(n)
                    .fill(n)
                    .map(function () { return make(entityOrName, props, variant); }))];
        });
    });
}
exports.makeMany = makeMany;
/**
 * Context to be executed inside each transact() call. Useful for defining artifacts that needs to be created
 * before each test case and rolled back after each case.
 *
 * @export
 * @param {() => void} func the function to execute in the transaction
 */
function context(func) {
    contextFunction = func;
}
exports.context = context;
/**
 * Adds a relationship between instance and relative. Relative could be multiple instances.
 * @param Entity
 * @param relationName
 * @param instance
 * @param relative
 */
function relate(Entity, relationName, instance, relative) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!Array.isArray(relative)) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all(relative.map(function (r) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, factory_1.factory.relate(Entity, relationName, instance, r)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, factory_1.factory.relate(Entity, relationName, instance, relative)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.relate = relate;
