import Telebot = require('telebot');
import covid = require('jhucsse.covid');
import https = require('https');
import emoji = require('node-emoji');
import dotenv = require("dotenv");
dotenv.config()

const botApiKey = process.env.COVID19_BOT_KEY;
const bot = new Telebot(botApiKey);
/*
TODO:
- Auto reply information on API value change

*/

var global_data;
var global_;

var available_commands=['news', 'total', 'perMillion', 'complete'];
var available_countries=[];

// API Link
//https://corona.lmao.ninja/countries/PT

function setup_country_list() {

  https.get('https://corona.lmao.ninja/v2/countries', (resp) => {
    let data = '';
  
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(resp.statusCode);
      global_ = JSON.parse(data);
      global_data = (JSON.parse(data));
      //console.log(global_)

      global_.forEach(country => {
          available_countries.push({country_name: country.country, country_code_iso2: country.countryInfo.iso2, country_code_iso3: country.countryInfo.iso3})
          //console.log({country_name: country.country, country_code_iso2: country.countryInfo.iso2, country_code_iso3: country.countryInfo.iso3});
        });
        console.log("Sucessfully loaded countries")

    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });

}


function get_data_from(msg, country, command) {
if (country === 'world') {
  https.get('https://corona.lmao.ninja/v2/all', (resp) => {
    let data = '';
  
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        global_ = JSON.parse(data);
        global_data.push(JSON.parse(data));
        msg.reply.text(`Values for the globe:
        Current cases -> ${global_.cases}
        Current deaths -> ${global_.deaths}
        Recovered -> ${global_.recovered}`);    
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
    msg.reply.text( err.message ); 
  });
}
else{
  https.get('https://corona.lmao.ninja/v2/countries/'+country, (resp) => {
      let data = '';
    
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
          global_ = JSON.parse(data);
          global_data.push(JSON.parse(data));
          
          switch (command) {
            case 'news':
              msg.reply.text("Today values for "+global_.country+" are "+global_.todayCases+" new cases "+emoji.get('mask')+" and "+ global_.todayDeaths+" new deaths "+emoji.get('skull')+"." );    
              break;
            case 'total':
              msg.reply.text("Current values for "+global_.country+" are "+global_.cases+" cases "+emoji.get('mask')+" and "+ global_.deaths+" deaths "+emoji.get('skull')+"." );    
              break;
            case 'perMillion':
              msg.reply.text("Values for "+global_.country+" are:\n"+global_.casesPerOneMillion+" cases per Million of inhabitants.\n "+ global_.deathsPerOneMillion+" deaths per Million of inhabitants.\n" );    
              break;
            case 'complete':
              msg.reply.text(`Values for ${global_.country}:
              Current cases ${emoji.get('mask')} -> ${global_.cases}
              New cases ${emoji.get('mask')} -> ${global_.todayCases} ( +${((global_.todayCases/global_.cases)*100).toFixed(2)}% ${(global_.todayDeaths/global_.deaths == 0)?"Not updated yet":""})
              Current deaths ${emoji.get('skull')} -> ${global_.deaths}
              New deaths ${emoji.get('skull')} -> ${global_.todayDeaths} ( +${((global_.todayDeaths/global_.deaths)*100).toFixed(2)}% ${(global_.todayDeaths/global_.deaths == 0)?"Not updated yet":""})
              Recovered ${emoji.get('runner')} -> ${global_.recovered}
              Active ${emoji.get('zombie')} -> ${global_.active}
              Critical ${emoji.get('syringe')} -> ${global_.critical}
              Cases per one Million -> ${global_.casesPerOneMillion}
              Deaths per one Million -> ${global_.deathsPerOneMillion}`);    
              break;

            default:
              msg.reply.text(`Command not found, available commands are the following:
              -> news
              -> total
              -> perMillion
              -> complete`);    
              break;
          }
          
      });
    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
      msg.reply.text( err.message ); 
    });
  }
}

function validate_command(command, err){
  if (!available_commands.includes(command)){
    err = command + " it's not an available command.";
    return false;
  }
  //console.log("Available command.")
  return true;
}

function validate_country(queried_country, err?){
  var validattion = false;
  available_countries.forEach(available_country => {

  //console.log(queried_country + " // "+country.country_name + " " +country.country_code_iso2+ " " +country.country_code_iso3)

    if (available_country.country_name === queried_country 
      || available_country.country_code_iso2 === queried_country 
      || available_country.country_code_iso3 === queried_country) {
        //console.log("Available country.")
        validattion= true;
    }
  });
  return validattion;
}

//execution

setup_country_list();

bot.on(['/covid'], (msg) => {
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
      }else{
      country = 'Portugal';
    }
    }

    if (validate_command(command, err) && (validate_country(country, err) || country == 'world')) {
      get_data_from(msg, country, command);
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
