import { Property } from 'df-shared-next/src/models/Property'

const areaDpeMatching = [
  {
    area: 8,
    cep_a: 146,
    eges_a: 11,
    cep_b: 186,
    eges_b: 16,
    cep_c: 386,
    eges_c: 44,
    cep_d: 505,
    eges_d: 68,
    cep_e: 622,
    eges_e: 90,
    cep_f: 739,
    eges_f: 122
  },
  {
    area: 9,
    cep_a: 134,
    eges_a: 11,
    cep_b: 174,
    eges_b: 16,
    cep_c: 355,
    eges_c: 42,
    cep_d: 464,
    eges_d: 65,
    cep_e: 574,
    eges_e: 87,
    cep_f: 685,
    eges_f: 118
  },
  {
    area: 10,
    cep_a: 124,
    eges_a: 10,
    cep_b: 164,
    eges_b: 15,
    cep_c: 329,
    eges_c: 40,
    cep_d: 428,
    eges_d: 62,
    cep_e: 533,
    eges_e: 84,
    cep_f: 640,
    eges_f: 115
  },
  {
    area: 11,
    cep_a: 117,
    eges_a: 10,
    cep_b: 157,
    eges_b: 15,
    cep_c: 311,
    eges_c: 39,
    cep_d: 403,
    eges_d: 61,
    cep_e: 503,
    eges_e: 82,
    cep_f: 607,
    eges_f: 113
  },
  {
    area: 12,
    cep_a: 112,
    eges_a: 9,
    cep_b: 152,
    eges_b: 14,
    cep_c: 296,
    eges_c: 38,
    cep_d: 381,
    eges_d: 59,
    cep_e: 478,
    eges_e: 81,
    cep_f: 578,
    eges_f: 111
  },
  {
    area: 13,
    cep_a: 108,
    eges_a: 9,
    cep_b: 148,
    eges_b: 14,
    cep_c: 283,
    eges_c: 37,
    cep_d: 363,
    eges_d: 58,
    cep_e: 456,
    eges_e: 79,
    cep_f: 554,
    eges_f: 110
  },
  {
    area: 14,
    cep_a: 104,
    eges_a: 9,
    cep_b: 144,
    eges_b: 14,
    cep_c: 273,
    eges_c: 37,
    cep_d: 348,
    eges_d: 58,
    cep_e: 437,
    eges_e: 78,
    cep_f: 532,
    eges_f: 108
  },
  {
    area: 15,
    cep_a: 100,
    eges_a: 8,
    cep_b: 140,
    eges_b: 13,
    cep_c: 263,
    eges_c: 36,
    cep_d: 333,
    eges_d: 56,
    cep_e: 421,
    eges_e: 76,
    cep_f: 514,
    eges_f: 107
  },
  {
    area: 16,
    cep_a: 97,
    eges_a: 8,
    cep_b: 137,
    eges_b: 13,
    cep_c: 255,
    eges_c: 35,
    cep_d: 325,
    eges_d: 55,
    cep_e: 412,
    eges_e: 76,
    cep_f: 504,
    eges_f: 106
  },
  {
    area: 17,
    cep_a: 95,
    eges_a: 8,
    cep_b: 135,
    eges_b: 13,
    cep_c: 248,
    eges_c: 35,
    cep_d: 318,
    eges_d: 55,
    cep_e: 404,
    eges_e: 75,
    cep_f: 496,
    eges_f: 105
  },
  {
    area: 18,
    cep_a: 92,
    eges_a: 8,
    cep_b: 132,
    eges_b: 13,
    cep_c: 241,
    eges_c: 34,
    cep_d: 311,
    eges_d: 54,
    cep_e: 397,
    eges_e: 75,
    cep_f: 489,
    eges_f: 105
  },
  {
    area: 19,
    cep_a: 90,
    eges_a: 8,
    cep_b: 130,
    eges_b: 13,
    cep_c: 235,
    eges_c: 34,
    cep_d: 305,
    eges_d: 54,
    cep_e: 390,
    eges_e: 74,
    cep_f: 482,
    eges_f: 105
  },
  {
    area: 20,
    cep_a: 88,
    eges_a: 8,
    cep_b: 128,
    eges_b: 13,
    cep_c: 230,
    eges_c: 34,
    cep_d: 300,
    eges_d: 54,
    cep_e: 385,
    eges_e: 74,
    cep_f: 476,
    eges_f: 104
  },
  {
    area: 21,
    cep_a: 87,
    eges_a: 8,
    cep_b: 127,
    eges_b: 13,
    cep_c: 225,
    eges_c: 33,
    cep_d: 295,
    eges_d: 53,
    cep_e: 380,
    eges_e: 74,
    cep_f: 471,
    eges_f: 104
  },
  {
    area: 22,
    cep_a: 85,
    eges_a: 7,
    cep_b: 125,
    eges_b: 12,
    cep_c: 221,
    eges_c: 33,
    cep_d: 291,
    eges_d: 53,
    cep_e: 375,
    eges_e: 73,
    cep_f: 466,
    eges_f: 103
  },
  {
    area: 23,
    cep_a: 84,
    eges_a: 7,
    cep_b: 124,
    eges_b: 12,
    cep_c: 217,
    eges_c: 33,
    cep_d: 287,
    eges_d: 53,
    cep_e: 371,
    eges_e: 73,
    cep_f: 462,
    eges_f: 103
  },
  {
    area: 24,
    cep_a: 82,
    eges_a: 7,
    cep_b: 122,
    eges_b: 12,
    cep_c: 214,
    eges_c: 33,
    cep_d: 284,
    eges_d: 53,
    cep_e: 367,
    eges_e: 73,
    cep_f: 458,
    eges_f: 103
  },
  {
    area: 25,
    cep_a: 81,
    eges_a: 7,
    cep_b: 121,
    eges_b: 12,
    cep_c: 210,
    eges_c: 32,
    cep_d: 280,
    eges_d: 52,
    cep_e: 363,
    eges_e: 73,
    cep_f: 454,
    eges_f: 103
  },
  {
    area: 26,
    cep_a: 80,
    eges_a: 7,
    cep_b: 120,
    eges_b: 12,
    cep_c: 207,
    eges_c: 32,
    cep_d: 277,
    eges_d: 52,
    cep_e: 360,
    eges_e: 72,
    cep_f: 451,
    eges_f: 103
  },
  {
    area: 27,
    cep_a: 79,
    eges_a: 7,
    cep_b: 119,
    eges_b: 12,
    cep_c: 204,
    eges_c: 32,
    cep_d: 274,
    eges_d: 52,
    cep_e: 357,
    eges_e: 72,
    cep_f: 447,
    eges_f: 102
  },
  {
    area: 28,
    cep_a: 78,
    eges_a: 7,
    cep_b: 118,
    eges_b: 12,
    cep_c: 202,
    eges_c: 32,
    cep_d: 272,
    eges_d: 52,
    cep_e: 354,
    eges_e: 72,
    cep_f: 444,
    eges_f: 102
  },
  {
    area: 29,
    cep_a: 77,
    eges_a: 7,
    cep_b: 117,
    eges_b: 12,
    cep_c: 199,
    eges_c: 32,
    cep_d: 269,
    eges_d: 52,
    cep_e: 351,
    eges_e: 72,
    cep_f: 442,
    eges_f: 102
  },
  {
    area: 30,
    cep_a: 76,
    eges_a: 7,
    cep_b: 116,
    eges_b: 12,
    cep_c: 197,
    eges_c: 32,
    cep_d: 267,
    eges_d: 52,
    cep_e: 349,
    eges_e: 72,
    cep_f: 439,
    eges_f: 102
  },
  {
    area: 31,
    cep_a: 76,
    eges_a: 7,
    cep_b: 116,
    eges_b: 12,
    cep_c: 195,
    eges_c: 31,
    cep_d: 265,
    eges_d: 51,
    cep_e: 346,
    eges_e: 72,
    cep_f: 437,
    eges_f: 102
  },
  {
    area: 32,
    cep_a: 75,
    eges_a: 7,
    cep_b: 115,
    eges_b: 12,
    cep_c: 193,
    eges_c: 31,
    cep_d: 263,
    eges_d: 51,
    cep_e: 344,
    eges_e: 71,
    cep_f: 434,
    eges_f: 101
  },
  {
    area: 33,
    cep_a: 74,
    eges_a: 7,
    cep_b: 114,
    eges_b: 12,
    cep_c: 191,
    eges_c: 31,
    cep_d: 261,
    eges_d: 51,
    cep_e: 342,
    eges_e: 71,
    cep_f: 432,
    eges_f: 101
  },
  {
    area: 34,
    cep_a: 74,
    eges_a: 7,
    cep_b: 114,
    eges_b: 12,
    cep_c: 189,
    eges_c: 31,
    cep_d: 259,
    eges_d: 51,
    cep_e: 340,
    eges_e: 71,
    cep_f: 430,
    eges_f: 101
  },
  {
    area: 35,
    cep_a: 73,
    eges_a: 7,
    cep_b: 113,
    eges_b: 12,
    cep_c: 188,
    eges_c: 31,
    cep_d: 258,
    eges_d: 51,
    cep_e: 338,
    eges_e: 71,
    cep_f: 428,
    eges_f: 101
  },
  {
    area: 36,
    cep_a: 72,
    eges_a: 7,
    cep_b: 112,
    eges_b: 12,
    cep_c: 186,
    eges_c: 31,
    cep_d: 256,
    eges_d: 51,
    cep_e: 337,
    eges_e: 71,
    cep_f: 427,
    eges_f: 101
  },
  {
    area: 37,
    cep_a: 72,
    eges_a: 7,
    cep_b: 112,
    eges_b: 12,
    cep_c: 185,
    eges_c: 31,
    cep_d: 255,
    eges_d: 51,
    cep_e: 335,
    eges_e: 71,
    cep_f: 425,
    eges_f: 101
  },
  {
    area: 38,
    cep_a: 71,
    eges_a: 7,
    cep_b: 111,
    eges_b: 12,
    cep_c: 183,
    eges_c: 31,
    cep_d: 253,
    eges_d: 51,
    cep_e: 333,
    eges_e: 71,
    cep_f: 423,
    eges_f: 101
  },
  {
    area: 39,
    cep_a: 71,
    eges_a: 7,
    cep_b: 111,
    eges_b: 12,
    cep_c: 182,
    eges_c: 31,
    cep_d: 252,
    eges_d: 51,
    cep_e: 332,
    eges_e: 71,
    cep_f: 422,
    eges_f: 101
  },
  {
    area: 40,
    cep_a: 70,
    eges_a: 6,
    cep_b: 110,
    eges_b: 11,
    cep_c: 180,
    eges_c: 30,
    cep_d: 250,
    eges_d: 50,
    cep_e: 330,
    eges_e: 70,
    cep_f: 420,
    eges_f: 100
  }
]

const DpeService = {
  getEnergyConsumptionLetterSmallArea(energyConsumption: number, area: number) {
    if (area <= 8) {
      area = 8
    }
    const dpeValues = areaDpeMatching.find((r) => r.area === Math.floor(area))
    if (energyConsumption <= 0) {
      return 'G'
    }
    if (dpeValues === undefined) {
      return 'G'
    }
    if (energyConsumption <= dpeValues.cep_a) {
      return 'A'
    }
    if (energyConsumption <= dpeValues.cep_b) {
      return 'B'
    }
    if (energyConsumption <= dpeValues.cep_c) {
      return 'C'
    }
    if (energyConsumption <= dpeValues.cep_d) {
      return 'D'
    }
    if (energyConsumption <= dpeValues.cep_e) {
      return 'E'
    }
    if (energyConsumption <= dpeValues.cep_f) {
      return 'F'
    }
    return 'G'
  },
  getEnergyConsumptionLetter(energyConsumption: number | undefined, area: number | null) {
    if (energyConsumption === undefined || energyConsumption <= 0) {
      return '-'
    }
    if (area && area <= 40) {
      return this.getEnergyConsumptionLetterSmallArea(energyConsumption, area)
    }

    // Check house size
    if (energyConsumption <= 70) {
      return 'A'
    }
    if (energyConsumption <= 110) {
      return 'B'
    }
    if (energyConsumption <= 180) {
      return 'C'
    }
    if (energyConsumption <= 250) {
      return 'D'
    }
    if (energyConsumption <= 330) {
      return 'E'
    }
    if (energyConsumption <= 420) {
      return 'F'
    }
    if (energyConsumption <= 1000000) {
      return 'G'
    }
    return '-'
  },
  getCO2EmissionLetterSmallArea(co2Emission: number, area: number) {
    if (area <= 8) {
      area = 8
    }
    const dpeValues = areaDpeMatching.find((r) => r.area === Math.floor(area))
    if (co2Emission <= 0) {
      return 'G'
    }
    if (dpeValues === undefined) {
      return 'G'
    }
    if (co2Emission <= dpeValues.eges_a) {
      return 'A'
    }
    if (co2Emission <= dpeValues.eges_b) {
      return 'B'
    }
    if (co2Emission <= dpeValues.eges_c) {
      return 'C'
    }
    if (co2Emission <= dpeValues.eges_d) {
      return 'D'
    }
    if (co2Emission <= dpeValues.eges_e) {
      return 'E'
    }
    if (co2Emission <= dpeValues.eges_f) {
      return 'F'
    }
    return 'G'
  },
  getCO2EmissionLetter(co2Emission: number | undefined, property: Property | null) {
    if (property?.ademeApiResult?.etiquetteEmission) {
      return property.ademeApiResult.etiquetteEmission
    }

    if (co2Emission === undefined) {
      return '-'
    }

    if (property && property.livingSpace <= 40) {
      return this.getCO2EmissionLetterSmallArea(co2Emission, property.livingSpace)
    }

    if (co2Emission <= 6) {
      return 'A'
    }
    if (co2Emission <= 11) {
      return 'B'
    }
    if (co2Emission <= 30) {
      return 'C'
    }
    if (co2Emission <= 50) {
      return 'D'
    }
    if (co2Emission <= 70) {
      return 'E'
    }
    if (co2Emission <= 100) {
      return 'F'
    }
    if (co2Emission <= 1000000) {
      return 'G'
    }
    return '-'
  },
  getGlobalLetter(energyLetter: string, co2Letter: string, property: Property) {
    if (property?.ademeApiResult?.etiquetteBilan) {
      return property.ademeApiResult.etiquetteBilan
    }
    if (energyLetter === 'G' || co2Letter === 'G') {
      return 'G'
    }
    if (energyLetter === 'F' || co2Letter === 'F') {
      return 'F'
    }
    if (energyLetter === 'E' || co2Letter === 'E') {
      return 'E'
    }
    if (energyLetter === 'D' || co2Letter === 'D') {
      return 'D'
    }
    if (energyLetter === 'C' || co2Letter === 'C') {
      return 'C'
    }
    if (energyLetter === 'B' || co2Letter === 'B') {
      return 'B'
    }
    if (energyLetter === 'A' || co2Letter === 'A') {
      return 'A'
    }
    return 'X'
  }
}

export default DpeService
