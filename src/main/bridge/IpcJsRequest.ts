import JsRequest from '@/JsRequest';

export default class IpcJsRequest extends JsRequest {

  private evt: any;

  constructor(evt: any, body: string) {
    super(body);
    this.evt = evt;
  }

  public callback = (ret: any) => {
    if (!this.id) {
      return
    }
    this.evt.sender.send(this.id, ret);
  }

}
