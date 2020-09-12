import {ipcRenderer} from 'electron';

import JsRequest from "../JsRequest";

export default class JsBridge {

  constructor() {
    // bridge tgrok event
    ipcRenderer.on("tgrok", (_, message) => {
      (window as any).Drmer.events.emit("tgrok", message);
    });
  }

  public postMessage(body: string) {
    const req = new JsRequest(body);

    if (req.id) {
      ipcRenderer.once(req.id, (evt: any, args: any) => {
        req.callback(args);
      });
    }
    ipcRenderer.send('call', body);
  }

}
