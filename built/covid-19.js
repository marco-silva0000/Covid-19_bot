"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var Telebot = require("telebot");
var emoji = require("node-emoji");
var dotenv = require("dotenv");
var data_service_1 = require("./data-service");
var commands_1 = require("./bot/commands");
dotenv.config();
var botApiKey = process.env.COVID19_BOT_KEY;
var bot = new Telebot(botApiKey);
var availableCommands = ['news', 'total', 'perMillion', 'complete'];
var available_countries = [];
function get_data_from(msg, country, command) {
    return __awaiter(this, void 0, void 0, function () {
        var data, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(country === 'world')) return [3 /*break*/, 2];
                    return [4 /*yield*/, data_service_1.getDataFromWorld()];
                case 1:
                    data = _a.sent();
                    msg.reply.text("Values for the globe:\n    Current cases -> " + data.cases + "\n    Current deaths -> " + data.deaths + "\n    Recovered -> " + data.recovered);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, data_service_1.getDataFromCountry(country)];
                case 3:
                    data = _a.sent();
                    switch (command) {
                        case 'news':
                            msg.reply.text("Today values for " + data.country + " are " + data.todayCases + " new cases " + emoji.get('mask') + " and " + data.todayDeaths + " new deaths " + emoji.get('skull') + ".");
                            break;
                        case 'total':
                            msg.reply.text("Current values for " + data.country + " are " + data.cases + " cases " + emoji.get('mask') + " and " + data.deaths + " deaths " + emoji.get('skull') + ".");
                            break;
                        case 'perMillion':
                            msg.reply.text("Values for " + data.country + " are:\n" + data.casesPerOneMillion + " cases per Million of inhabitants.\n " + data.deathsPerOneMillion + " deaths per Million of inhabitants.\n");
                            break;
                        case 'complete':
                            msg.reply.text("Values for " + data.country + ":\n          Current cases " + emoji.get('mask') + " -> " + data.cases + "\n          New cases " + emoji.get('mask') + " -> " + data.todayCases + " ( +" + ((data.todayCases / data.cases) * 100).toFixed(2) + "% " + ((data.todayDeaths / data.deaths == 0) ? "Not updated yet" : "") + ")\n          Current deaths " + emoji.get('skull') + " -> " + data.deaths + "\n          New deaths " + emoji.get('skull') + " -> " + data.todayDeaths + " ( +" + ((data.todayDeaths / data.deaths) * 100).toFixed(2) + "% " + ((data.todayDeaths / data.deaths == 0) ? "Not updated yet" : "") + ")\n          Recovered " + emoji.get('runner') + " -> " + data.recovered + "\n          Active " + emoji.get('zombie') + " -> " + data.active + "\n          Critical " + emoji.get('syringe') + " -> " + data.critical + "\n          Cases per one Million -> " + data.casesPerOneMillion + "\n          Deaths per one Million -> " + data.deathsPerOneMillion);
                            break;
                        default:
                            msg.reply.text("Command not found, available commands are the following:\n->" + availableCommands.join('->'));
                            break;
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
//execution
data_service_1.setupCountryList().then(function (data) { return available_countries = data; });
commands_1.commandList.map(function (_a) {
    var types = _a.types, command = _a.command;
    return bot.on(types, command);
});
bot.start();
