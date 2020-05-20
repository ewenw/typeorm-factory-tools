"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var lodash_1 = require("lodash");
/**
 * Loosely inspired by the factory-bot npm package. Customized to add support for persisting objects
 * to TypeOrm, adding entity relationships, factory variations, and contexts.
 *
 * @export
 * @class Factory
 */
var Factory = /** @class */ (function () {
    function Factory() {
        this.factories = new Map();
    }
    Factory.prototype.setManager = function (manager) {
        this.manager = manager;
    };
    Factory.prototype.has = function (name) {
        return this.factories[name] !== undefined;
    };
    Factory.prototype.clear = function () {
        this.factories = new Map();
    };
    Factory.prototype.factoryWithVariantName = function (name, variant) {
        return name + "." + variant;
    };
    Factory.prototype.define = function (Entity, props, variant) {
        if (props === void 0) { props = {}; }
        if (variant === void 0) { variant = null; }
        var name = variant === null ? Entity.name : this.factoryWithVariantName(Entity.name, variant);
        this.factories[name] = { props: props, Entity: Entity };
    };
    Factory.prototype.evaluate = function (props, context) {
        return __awaiter(this, void 0, void 0, function () {
            var results, values;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = {};
                        return [4 /*yield*/, Promise.all(Object.keys(props).map(function (prop) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, this.parse(props[prop], context)];
                            }); }); }))];
                    case 1:
                        values = _a.sent();
                        Object.keys(props).forEach(function (prop, idx) {
                            results[prop] = values[idx];
                        });
                        return [2 /*return*/, results];
                }
            });
        });
    };
    Factory.prototype.make = function (entityOrName, props, variant, managerOverride) {
        if (props === void 0) { props = {}; }
        if (variant === void 0) { variant = null; }
        return __awaiter(this, void 0, void 0, function () {
            var defaultManager, name, factory, finalProps, context, afterSave, instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultManager = this.manager;
                        this.manager = managerOverride || this.manager;
                        if (typeof entityOrName !== 'string') {
                            name = entityOrName.name;
                        }
                        else {
                            name = entityOrName;
                        }
                        if (variant !== null) {
                            name = this.factoryWithVariantName(name, variant);
                        }
                        factory = this.factories[name];
                        if (factory === undefined) {
                            throw "Factory \"" + name + "\" does not exist. Please define() it first.";
                        }
                        finalProps = __assign(__assign({}, factory.props), props);
                        context = {};
                        if (!('context' in finalProps)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.evaluate(finalProps.context, {})];
                    case 1:
                        context = _a.sent();
                        delete finalProps.context;
                        _a.label = 2;
                    case 2:
                        if ('afterSave' in finalProps) {
                            afterSave = finalProps.afterSave;
                            delete finalProps.afterSave;
                        }
                        return [4 /*yield*/, this.evaluate(finalProps, context)];
                    case 3:
                        instance = _a.sent();
                        if (!(!('save' in finalProps) || finalProps.save !== false)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.manager.insert(factory.Entity, instance)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!(afterSave !== undefined)) return [3 /*break*/, 7];
                        return [4 /*yield*/, afterSave(instance)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        this.manager = defaultManager;
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    Factory.prototype.parse = function (val, context) {
        return __awaiter(this, void 0, void 0, function () {
            var value, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!lodash_1.isFunction(val)) return [3 /*break*/, 2];
                        return [4 /*yield*/, val(context)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = val;
                        _b.label = 3;
                    case 3:
                        value = _a;
                        return [2 /*return*/, value];
                }
            });
        });
    };
    Factory.prototype.relate = function (Entity, relationName, instance, relative) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.manager
                            .createQueryBuilder()
                            .relation(Entity, relationName)
                            .of(instance)
                            .add(relative)];
                    case 1:
                        _a.sent();
                        if (relationName in instance) {
                            instance[relationName].push(relative);
                        }
                        else {
                            // eslint-disable-next-line no-param-reassign
                            instance[relationName] = [relative];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Factory;
}());
exports.Factory = Factory;
exports.factory = new Factory();
