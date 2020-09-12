import {Tgrok} from "tgrok";
import config from "./config";

const tgrok = new Tgrok();

tgrok.context = {
  family: 4, // you can speed up your local network connection
  rejectUnauthorized: false, // required if your server is using a self-signed certificate
}

tgrok.host = config.get("server.host");
tgrok.port = config.get("server.port");

export default tgrok;
