import * as fs from "fs";
import * as path from "path";

// tslint:disable-next-line:no-var-requires
const low = require('lowdb')
// tslint:disable-next-line:no-var-requires
const FileSync = require('lowdb/adapters/FileSync')

const PATH_HOME = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME']
const PATH_CONFIG = path.join(PATH_HOME, '.tgrok')

class Config {

  private db: any

  constructor() {
    const adapter = new FileSync(PATH_CONFIG)
    this.db = low(adapter)
    this.db.defaults({
      server: {
        host: "t.iganxi.net",
        port: 4443,
      },
      tunnels: [],
    }).write()
  }

  public exists = () => {
    return fs.existsSync(PATH_CONFIG)
  }

  public load = () => {
    return this.db.getState()
  }

  public set = (key: string, value: any) => {
    this.db.set(key, value).write()
  }

  public get = (key: string) => {
    return this.db.get(key).value()
  }

  public flush = (state: any) => {
    this.db.setState(state).write()
  }

}

export default new Config()
