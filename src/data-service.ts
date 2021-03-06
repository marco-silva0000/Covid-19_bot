import fetch = require("node-fetch");


const BASE_API_URL = 'https://corona.lmao.ninja/v2/' 

export const setup_country_list = async () => {
  const response = await fetch(BASE_API_URL + 'countries')
  if (response.status == 200) {
    const jsonData = await response.json()
    return jsonData
  }
  // TODO add error check
}

export const get_data_from_world = async () => {
  const response = await fetch(BASE_API_URL + 'all')
  if (response.status == 200) {
    const jsonData = await response.json()
    return jsonData
  }
  // TODO add error check
}


export const get_data_from_country = async (country: string) => {
  const response = await fetch(BASE_API_URL + 'countries/' + country)
  if (response.status == 200) {
    const jsonData = await response.json()
    return jsonData
  }
  // TODO add error check
}

