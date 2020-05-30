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
    console.log('in get data from')
    console.log('msg', msg)
    console.log('country', country)
    console.log('command', command)
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
    console.log('in else')
    const data = await get_data_from_country(country)
    console.log('got data from country', data)
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
    console.log('in validate_command', command)
    console.log('in validate_command', err)
  if (!available_commands.includes(command)){
    err = command + " it's not an available command.";
    return false;
  }
  console.log("Available command.")
  return true;
}

function validate_country(queried_country, err?){
    return true // TODO FIX
    console.log("in validate_country", queried_country)
  var validattion = false;
  available_countries.forEach(available_country => {

  console.log(available_country)
  console.log(queried_country + " // "+available_country.country_name + " " +available_country.country_code_iso2+ " " + available_country.country_code_iso3)

    if (available_country.country_name === queried_country 
      || available_country.country_code_iso2 === queried_country 
      || available_country.country_code_iso3 === queried_country) {
        //console.log("Available country.")
        validattion= true;
    }
  });
    console.log("will return", validattion)
  return validattion;
}

//execution

setup_country_list().then(data => available_countries = data);
console.log(available_countries)

bot.on(['/covid'], async (msg) => {
    var message = msg.text;
    var command = message.split(' ')[1];
    var country = message.split(' ')[2];
    console.log(command)
    console.log(country)
    var err;

    //default commands
    if (command == undefined) {
      command = 'complete';
    }
    console.log(command)
    console.log(country)

    if (country == undefined) {
    console.log(command)
    console.log(country)
      if (validate_country(command) || country === 'world') {
    console.log(command)
    console.log(country)
        country = command;
        command = 'complete';
      }else{
      country = 'Portugal';
    }
    }
    console.log('here')
      country = 'Portugal';

    if (validate_command(command, err) && (validate_country(country, err) || country == 'world')) {
    console.log('will get data from', country)
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
