import {getDataFromCountry, getDataFromWorld} from "../data-service";
import {Country} from "../models/Country";
import { replyCountryData, replyWorldData } from "./messages";

export const availableCommands = ['news', 'total', 'perMillion', 'complete'];

const DEFAULT_STATS_COUNTRY = 'Portugal';
const DEFAULT_COMMAND = 'complete';

const helpCommand = (msg) => {
    msg.reply.text(`Available commands are:
  ${availableCommands}
  
  Example command:
  /covid ${DEFAULT_COMMAND} ${DEFAULT_STATS_COUNTRY}`);
}


export const statsCommand = async (msg) => {
    let availableCountries: Country[] = []

    const validateStatsCommand = (command) => {
        const isValid = availableCommands.includes(command)
        if (!isValid) {
            throw `${command} it's not an available command.`;
        }
        return true;
    }
    const validateCountry = (queriedCountry) => {
        const isValid = availableCountries.some(availableCountry =>
            [
                availableCountry.country,
                availableCountry.countryInfo.iso2,
                availableCountry.countryInfo.iso3,
            ].includes(queriedCountry)
        )
        if (!isValid) {
            throw `${command} it's not an available country.`;
        }
        return true;
    }

    const message = msg.text;
    let command = message.split(' ')[1];
    let country = message.split(' ')[2];

    // default commands
    if (command == undefined) {
        command = DEFAULT_COMMAND;
        country = DEFAULT_STATS_COUNTRY
    }
    else {
        if (country === undefined) { // There is no command, command is country
            country = command
            command = DEFAULT_COMMAND
        }
    }

    if (command === 'world') {
        try {
            const data = await getDataFromWorld();
            replyWorldData(msg, data)
        }
        catch (e) {
            msg.reply.text(e);
        }
    }
    else {
        try {
            validateStatsCommand(command)
            // validateCountry(country)
            const data = await getDataFromCountry(country);
            replyCountryData(msg, data)
        }
        catch (e) {
            msg.reply.text(e);
        }
    }
}

export const commandList = [
    {types: ['/help'], command: helpCommand},
    {types: ['/covid'], command: statsCommand},
]
