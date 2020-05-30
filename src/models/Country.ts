export interface Country {
    updated: number
    country:	string
    countryInfo: {
        _id: 4
        iso2: string
        iso3: string
        lat: number
        long: number
        flag: string
    }
    cases:	number
    todayCases:	number
    deaths:	number
    todayDeaths: number
    recovered: number
    active:	number
    critical: number
    casesPerOneMillion:	number
    deathsPerOneMillion: number
    tests?: number
    testsPerOneMillion:	number
    population:	number
    continent: string
    activePerOneMillion: number
    recoveredPerOneMillion:	number
    criticalPerOneMillion:	number
}
