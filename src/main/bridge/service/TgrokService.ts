import JsService from "../JsService";
import JsRequest from "@/JsRequest";
import {Tunnel} from "tgrok";
import config from "@/main/config";
import tgrok from "@/main/tgrok";

class TgrokService extends JsService {

  constructor() {
    super();
  }

  public reconnect = (req: JsRequest) => {
    tgrok.reconnect(true);
    req.callback(true);
  }

  public open = (req: JsRequest) => {
    const id = req.strParam("id")
    for (const tunnel of config.get("tunnels")) {
      if (tunnel.id === id) {
        tgrok.openTunnel(this.newTunnel(tunnel))
        req.callback(true)
        return
      }
    }
    req.callback(false);
  }

  private newTunnel = (conf: any) => {
    return new Tunnel({
      id: conf.id,
      protocol: conf.protocol,
      hostname: "",
      subdomain: conf.subdomain,
      rport: 0,
      lhost: conf.localHost,
      lport: conf.localPort,
    })
  }

  public close = (req: JsRequest) => {
    tgrok.closeTunnel(req.strParam("id"))
    req.callback(true)
  }

  public remove = (req: JsRequest) => {
    tgrok.removeTunnel(req.strParam("id"))
    req.callback(true);
  }

  public status = (req: JsRequest) => {
    req.callback(tgrok.status());
  }

}

export default new TgrokService()
