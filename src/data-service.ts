import fetch = require("node-fetch");
import { Country } from "./models/Country";
import { World } from "./models/World";


const BASE_API_URL = 'https://corona.lmao.ninja/v2/'

export const setupCountryList = async () => {
  const response = await fetch(BASE_API_URL + 'countries')
  if (response.status == 200) {
    const jsonData: Country[] = await response.json()
    return jsonData
  }
  // TODO add error check
}


export const getDataFromWorld = async () => {
  const response = await fetch(BASE_API_URL + 'all')
  if (response.status == 200) {
    const jsonData: World = await response.json()
    return jsonData
  }
  // TODO add error check
}


export const getDataFromCountry = async (country: string) => {
  const response = await fetch(BASE_API_URL + 'countries/' + country)
  if (response.status == 200) {
    const jsonData: Country = await response.json()
    return jsonData
  }
  // TODO add error check
}

