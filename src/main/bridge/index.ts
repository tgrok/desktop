import {ipcMain} from 'electron';

import IpcJsRequest from './IpcJsRequest';
import JsService from "./JsService";
import ConfigService from "./service/ConfigService";
import PageService from "./service/PageService";
import tgrokService from "./service/TgrokService";

export default class Bridge {

  private services: { [id: string]: any } = {};

  private register = (name: string | JsService, service?: JsService) => {
    if (typeof name === 'object') {
      service = name
      name = service.constructor.name
    }
    this.services[name] = service;
  }

  public install = () => {
    this.registerService();

    ipcMain.on('call', (evt: any, body: string) => {
      const req = new IpcJsRequest(evt, body);
      const service = this.services[req.clsName];
      if (!service || typeof (service as any)[req.clsMethod] !== 'function') {
        // tslint:disable-next-line: no-console
        console.log(`Method ${req.clsMethod} in ${req.clsName} not found.`);
        return;
      }
      if (req.clsMethod.startsWith("_")) {
        // tslint:disable-next-line: no-console
        console.log(`Method ${req.clsMethod} in ${req.clsName} is illegal.`);
        return;
      }
      (service as any)[req.clsMethod](req);
    });
  }

  private registerService = () => {
    this.register('ConfigService', new ConfigService())
    this.register('PageService', new PageService())
    this.register('TgrokService', tgrokService)
  }

}
