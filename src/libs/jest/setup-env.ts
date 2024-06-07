import dotenv from 'dotenv'

export default () => {
  dotenv.config()
}

global.__dirname = __dirname
