import Telebot = require('telebot');
import emoji = require('node-emoji');
import dotenv = require("dotenv");

import fetch = require("node-fetch");

import {getDataFromCountry, getDataFromWorld, setupCountryList} from './data-service';
import {Country} from "./models/Country";
import {commandList} from "./bot/commands";

dotenv.config()

const botApiKey = process.env.COVID19_BOT_KEY;
const bot = new Telebot(botApiKey);

const availableCommands = ['news', 'total', 'perMillion', 'complete'];
let available_countries: Country[] = [];


async function get_data_from(msg, country, command) {
  if (country === 'world') {
   const data = await getDataFromWorld()
   msg.reply.text(
    `Values for the globe:
    Current cases -> ${data.cases}
    Current deaths -> ${data.deaths}
    Recovered -> ${data.recovered}`
    );   
  }
  else {
    const data = await getDataFromCountry(country)
      switch (command) {
        case 'news':
          msg.reply.text("Today values for "+data.country+" are "+data.todayCases+" new cases "+emoji.get('mask')+" and "+ data.todayDeaths+" new deaths "+emoji.get('skull')+"." );    
          break;
        case 'total':
          msg.reply.text("Current values for "+data.country+" are "+data.cases+" cases "+emoji.get('mask')+" and "+ data.deaths+" deaths "+emoji.get('skull')+"." );    
          break;
        case 'perMillion':
          msg.reply.text("Values for "+data.country+" are:\n"+data.casesPerOneMillion+" cases per Million of inhabitants.\n "+ data.deathsPerOneMillion+" deaths per Million of inhabitants.\n" );    
          break;
        case 'complete':
          msg.reply.text(`Values for ${data.country}:
          Current cases ${emoji.get('mask')} -> ${data.cases}
          New cases ${emoji.get('mask')} -> ${data.todayCases} ( +${((data.todayCases/data.cases)*100).toFixed(2)}% ${(data.todayDeaths/data.deaths == 0)?"Not updated yet":""})
          Current deaths ${emoji.get('skull')} -> ${data.deaths}
          New deaths ${emoji.get('skull')} -> ${data.todayDeaths} ( +${((data.todayDeaths/data.deaths)*100).toFixed(2)}% ${(data.todayDeaths/data.deaths == 0)?"Not updated yet":""})
          Recovered ${emoji.get('runner')} -> ${data.recovered}
          Active ${emoji.get('zombie')} -> ${data.active}
          Critical ${emoji.get('syringe')} -> ${data.critical}
          Cases per one Million -> ${data.casesPerOneMillion}
          Deaths per one Million -> ${data.deathsPerOneMillion}`);    
          break;

        default:
          msg.reply.text(`Command not found, available commands are the following:\n->${availableCommands.join('->')}`);
          break;
      }
   }
}



//execution
setupCountryList().then(data => available_countries = data);


commandList.map(({types, command}) => bot.on(types, command))

bot.start();
