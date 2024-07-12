import { Signaling } from "./signaling";
import { ReceiveMSG } from "../ui/component/handler";

export class Controller {

  #rtcpeerConnection;
  #signal
  #localstream;
  #dataChannel;
  
  static #mediaConstraints = {
    audio: true, video: {

      width: 720,
      height: 720,


    }
  };
  #remoteref
  // { iceServers: [], iceTransportPolicy: all, bundlePolicy: max-bundle, rtcpMuxPolicy: require, iceCandidatePoolSize: 0 }
  constructor() {
    // 'stun:stun.l.google.com:19302',

    this.#rtcpeerConnection = new RTCPeerConnection({

      iceCandidatePoolSize: 0,
      bundlePolicy: 'max-bundle',
      sdpSemantics: 'unified-plan',
      peerIdentity: null,
      certificates: [],
      videoMaxBitrate: 1000,
    });
    // this.#rtcpeerConnection = new RTCPeerConnection();
    this.#signal = new Signaling();




  }
  static createConnection(stream) {
    return new Controller(stream);
  }
  getLocalStream() {
    return this.#localstream;
  }
  setLocalStream(e) {
    this.#localstream = e;
  }
  muteMic() {
    this.#localstream.getTracks().forEach((t) => {

      if (t.kind === 'audio') t.enabled = !t.enabled;
    });
  }
  remoteMedia(ref) {
    this.#remoteref = ref;
    this.#rtcpeerConnection.ontrack = (event) => {

      // let constraint = { width: { ideal: 1280 }, height: { ideal: 720 } };
      // s.getVideoTracks()[0]?.applyConstraints(constraint);
      ref.current.srcObject = event?.streams[0];

      // ref.current.onloadedmetadata = function (e) {
      //   ref.current.play();
      // }
    }


  }

  getDatachannel()
  {
    return this.#dataChannel;
  }


  async connectUser(field_control, setController) {
    // console.log("field control",field_control)
    // if(field_control.refresh)
    // {
  
    //   setController({ ...field_control, refresh: false })
    //   return ;
    // }
    let dataChannel = this.#rtcpeerConnection.createDataChannel("mychannel", {});
    this.#localstream.getTracks().forEach((track) => {
      this.#rtcpeerConnection.addTrack(track, this.#localstream)

    })
    setController({ ...field_control, refresh: true })

    this.#rtcpeerConnection.onconnectionstatechange = (e) => {
      if (e?.currentTarget.connectionState == "connected") {
        setController({ ...field_control, refresh: false })
      }
    }
    let result = await this.#signal.checkOffer()

    if (result) {
      let offer = JSON.parse(result);

      this.#rtcpeerConnection?.setRemoteDescription(offer);


      this.#signal.setAnswer2(this.#rtcpeerConnection);

      this.#rtcpeerConnection.ondatachannel = (e) => {
        console.log(e);
        e.channel.onopen = () => {
        this.#dataChannel = e.channel;
        this.#signal.deleteAnswer();
    

        }
        e.channel.onmessage = (e) => {
          ReceiveMSG(e);
        }
        e.channel.onclose = (e) => {
       
          this.#remoteref.current.srcObject = null;
          this.#dataChannel = null;
        }
      }
    }

    else {

      this.#signal.setOffer2(this.#rtcpeerConnection);
      dataChannel.onopen = (e)=>
      {
        this.#signal.deleteOffer();
        this.#dataChannel = dataChannel;

      }
      dataChannel.onmessage = (e)=>
      {
        ReceiveMSG(e);
      }
      dataChannel.onclose = (e) => {
        this.#remoteref.current.srcObject = null;
        this.#dataChannel = null;
      }

    }
  }


  static async initMedia(ref) {


    let media = await navigator.mediaDevices.getUserMedia(this.#mediaConstraints);

    ref.current.srcObject = media;
    ref.current.onloadedmetadata = function (e) {
      ref.current.play();

    }
    return media;


  }
  async destroy() {

    this.#remoteref.current.srcObject = null;
    await this.#rtcpeerConnection?.close();
    this.#signal.delete()
  }


}