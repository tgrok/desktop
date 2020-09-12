import JsService from "../JsService";
import JsRequest from "@/JsRequest";
import { shell } from "electron";

export default class PageService extends JsService {

  public external = (req: JsRequest) => {
    shell.openExternal(req.strParam("url"));
    req.callback(true);
  }

}
