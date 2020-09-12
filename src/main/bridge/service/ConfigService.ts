import JsService from "../JsService";
import config from "@/main/config";
import JsRequest from "@/JsRequest";

export default class ConfigService extends JsService {

  public load = (req: JsRequest) => {
    req.callback(config.load())
  }

  public get = (req: JsRequest) => {
    req.callback(config.get(req.strParam("key")))
  }

  public set = (req: JsRequest) => {
    config.set(req.strParam("key"), req.params.value)
  }

  public flush = (req: JsRequest) => {
    config.flush(req.params)
  }

}
