"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Telebot = require("telebot");
var https = require("https");
var emoji = require("node-emoji");
var dotenv = require("dotenv");
dotenv.config();
var botApiKey = process.env.COVID19_BOT_KEY;
var bot = new Telebot(botApiKey);
/*
TODO:
- Auto reply information on API value change

*/
var global_data;
var global_;
var available_commands = ['news', 'total', 'perMillion', 'complete'];
var available_countries = [];
// API Link
//https://corona.lmao.ninja/countries/PT
function setup_country_list() {
    https.get('https://corona.lmao.ninja/v2/countries', function (resp) {
        var data = '';
        // A chunk of data has been recieved.
        resp.on('data', function (chunk) {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', function () {
            console.log(resp.statusCode);
            global_ = JSON.parse(data);
            global_data = (JSON.parse(data));
            //console.log(global_)
            global_.forEach(function (country) {
                available_countries.push({ country_name: country.country, country_code_iso2: country.countryInfo.iso2, country_code_iso3: country.countryInfo.iso3 });
                //console.log({country_name: country.country, country_code_iso2: country.countryInfo.iso2, country_code_iso3: country.countryInfo.iso3});
            });
            console.log("Sucessfully loaded countries");
        });
    }).on("error", function (err) {
        console.log("Error: " + err.message);
    });
}
function get_data_from(msg, country, command) {
    if (country === 'world') {
        https.get('https://corona.lmao.ninja/v2/all', function (resp) {
            var data = '';
            // A chunk of data has been recieved.
            resp.on('data', function (chunk) {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', function () {
                global_ = JSON.parse(data);
                global_data.push(JSON.parse(data));
                msg.reply.text("Values for the globe:\n        Current cases -> " + global_.cases + "\n        Current deaths -> " + global_.deaths + "\n        Recovered -> " + global_.recovered);
            });
        }).on("error", function (err) {
            console.log("Error: " + err.message);
            msg.reply.text(err.message);
        });
    }
    else {
        https.get('https://corona.lmao.ninja/v2/countries/' + country, function (resp) {
            var data = '';
            // A chunk of data has been recieved.
            resp.on('data', function (chunk) {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', function () {
                global_ = JSON.parse(data);
                global_data.push(JSON.parse(data));
                switch (command) {
                    case 'news':
                        msg.reply.text("Today values for " + global_.country + " are " + global_.todayCases + " new cases " + emoji.get('mask') + " and " + global_.todayDeaths + " new deaths " + emoji.get('skull') + ".");
                        break;
                    case 'total':
                        msg.reply.text("Current values for " + global_.country + " are " + global_.cases + " cases " + emoji.get('mask') + " and " + global_.deaths + " deaths " + emoji.get('skull') + ".");
                        break;
                    case 'perMillion':
                        msg.reply.text("Values for " + global_.country + " are:\n" + global_.casesPerOneMillion + " cases per Million of inhabitants.\n " + global_.deathsPerOneMillion + " deaths per Million of inhabitants.\n");
                        break;
                    case 'complete':
                        msg.reply.text("Values for " + global_.country + ":\n              Current cases " + emoji.get('mask') + " -> " + global_.cases + "\n              New cases " + emoji.get('mask') + " -> " + global_.todayCases + " ( +" + ((global_.todayCases / global_.cases) * 100).toFixed(2) + "% " + ((global_.todayDeaths / global_.deaths == 0) ? "Not updated yet" : "") + ")\n              Current deaths " + emoji.get('skull') + " -> " + global_.deaths + "\n              New deaths " + emoji.get('skull') + " -> " + global_.todayDeaths + " ( +" + ((global_.todayDeaths / global_.deaths) * 100).toFixed(2) + "% " + ((global_.todayDeaths / global_.deaths == 0) ? "Not updated yet" : "") + ")\n              Recovered " + emoji.get('runner') + " -> " + global_.recovered + "\n              Active " + emoji.get('zombie') + " -> " + global_.active + "\n              Critical " + emoji.get('syringe') + " -> " + global_.critical + "\n              Cases per one Million -> " + global_.casesPerOneMillion + "\n              Deaths per one Million -> " + global_.deathsPerOneMillion);
                        break;
                    default:
                        msg.reply.text("Command not found, available commands are the following:\n              -> news\n              -> total\n              -> perMillion\n              -> complete");
                        break;
                }
            });
        }).on("error", function (err) {
            console.log("Error: " + err.message);
            msg.reply.text(err.message);
        });
    }
}
function validate_command(command, err) {
    if (!available_commands.includes(command)) {
        err = command + " it's not an available command.";
        return false;
    }
    //console.log("Available command.")
    return true;
}
function validate_country(queried_country, err) {
    var validattion = false;
    available_countries.forEach(function (available_country) {
        //console.log(queried_country + " // "+country.country_name + " " +country.country_code_iso2+ " " +country.country_code_iso3)
        if (available_country.country_name === queried_country
            || available_country.country_code_iso2 === queried_country
            || available_country.country_code_iso3 === queried_country) {
            //console.log("Available country.")
            validattion = true;
        }
    });
    return validattion;
}
//execution
setup_country_list();
bot.on(['/covid'], function (msg) {
    var message = msg.text;
    var command = message.split(' ')[1];
    var country = message.split(' ')[2];
    var err;
    //default commands
    if (command == undefined) {
        command = 'complete';
    }
    if (country == undefined) {
        if (validate_country(command) || country === 'world') {
            country = command;
            command = 'complete';
        }
        else {
            country = 'Portugal';
        }
    }
    if (validate_command(command, err) && (validate_country(country, err) || country == 'world')) {
        get_data_from(msg, country, command);
    }
    else {
        msg.reply.text(err);
    }
});
bot.on(['/help'], function (msg) {
    msg.reply.text("Available commands are:\n  " + available_commands + "\n  \n  Available countries are:\n  " + available_countries + "\n  \n  Example command:\n  /covid complete Portugal ");
});
bot.start();
