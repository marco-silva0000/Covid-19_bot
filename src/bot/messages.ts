import { World } from "../models/World";
import { Country } from "../models/Country";
import emoji = require('node-emoji');

export const replyWorldData = (msg, data: World) => {
    msg.reply.text(
        `Values for the globe:
    Current cases -> ${data.cases}
    Current deaths -> ${data.deaths}
    Recovered -> ${data.recovered}`
    );
}

export const replyCountryData = (msg, data: Country, command?: string) => {
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
        default:
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
    }

}
