import fetch = require("node-fetch");


const BASE_API_URL = 'https://corona.lmao.ninja/v2/' 

export const setup_country_list = async () => {
  console.log("setingup country list")
  const response = await fetch(BASE_API_URL + 'countries')
  console.log("response", response)
  console.log("response.statusCode", response.statusCode)
  console.log("response.status", response.status)
  if (response.status == 200) {
    const jsonData = await response.json()
    console.log("response.data", jsonData)
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
    console.log("in get_data_from_country", country)
  const response = await fetch(BASE_API_URL + 'countries/' + country)
  if (response.status == 200) {
    const jsonData = await response.json()
    return jsonData
  }
  // TODO add error check
}

