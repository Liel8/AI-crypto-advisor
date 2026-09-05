import 'dotenv/config'
import configDev from './dev.js'
import configProd from './prod.js'

export const config = process.env.NODE_ENV === 'production' ? configProd : configDev
