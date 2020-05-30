import Telebot = require('telebot');
import covid = require('jhucsse.covid');
import https = require('https');
import emoji = require('node-emoji');
import dotenv = require("dotenv");

import fetch = require("node-fetch");

import { setup_country_list, get_data_from_world, get_data_from_country } from './data-service';

dotenv.config()

const botApiKey = process.env.COVID19_BOT_KEY;
const bot = new Telebot(botApiKey);
/*
TODO:
- Auto reply information on API value change

*/

var available_commands=['news', 'total', 'perMillion', 'complete'];
let available_countries = [];


async function get_data_from(msg, country, command) {
  if (country === 'world') {
   const data = await get_data_from_world()
   msg.reply.text(
    `Values for the globe:
    Current cases -> ${data.cases}
    Current deaths -> ${data.deaths}
    Recovered -> ${data.recovered}`
    );   
  }
  else {
    const data = await get_data_from_country(country)
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
          msg.reply.text(`Command not found, available commands are the following:
          -> news
          -> total
          -> perMillion
          -> complete`);    
          break;
      }
   }
}

function validate_command(command, err){
  if (!available_commands.includes(command)){
    err = command + " it's not an available command.";
    return false;
  }
  return true;
}

function validate_country(queried_country, err?){
  try {
    return available_countries.some(available_country =>  (available_country.country === queried_country || available_country.countryInfo.iso2 === queried_country || available_country.countryInfo.iso3 === queried_country))
  }
  catch {
    return false
  }
}

//execution
setup_country_list().then(data => available_countries = data);

bot.on(['/covid'], async (msg) => {
    var message = msg.text;
    var command = message.split(' ')[1];
    var country = message.split(' ')[2];
    var err;

    // default commands
    
    if (command == undefined) {
      command = 'complete';
    }

    if (country == undefined) {
      if (command === 'world' || validate_country(command)) {
        country = command;
        command = 'complete';
      }else{
      country = 'Portugal';
    }
    }


    if (validate_command(command, err) && (country == 'world' || validate_country(country, err))) {
      await get_data_from(msg, country, command);

    }else{
      msg.reply.text(err);
    }
})

bot.on(['/help'], (msg) => {
  msg.reply.text(`Available commands are:
  ${available_commands}
  
  Available countries are:
  ${available_countries}
  
  Example command:
  /covid complete Portugal `);
})

bot.start();
