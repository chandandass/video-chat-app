import React, { useContext, useEffect, useRef, useState } from 'react'
import { Box, CircularProgress, Typography } from "@mui/material"
import { appContext } from '../App';
import './style/style.css'
import Button_bar from './component/button_bar';
import { ori_handler ,debounce,Msgsender, heart_caller} from './component/handler';



export default function Home({ theme }) {
  let controller = useContext(appContext);
  let localStream = useRef();
  let remoteStream = useRef();
  // let stream = null;
  let connection = null;
  let connection_caller = debounce(connection_handler,500);
  const [orientation, setOrientation] = useState(false);
  const [field_control, setController] = useState({ mic: true,mic_handler:()=>{connection.muteMic();},refresh: false,refresh_handler:()=>{connection_caller(null)}, heart: ()=>{heart_caller(connection)},send: ()=>{Msgsender(connection,"msg")}})
  const [msgqueue,setMsgqueue] = useState([]);
  
 async function connection_handler(e)
 {
   await connection?.destroy();
   let stream  =  e==null?connection.getLocalStream():e;
   connection = controller.createConnection();
   connection.setLocalStream(stream);
   connection.remoteMedia(remoteStream);
   connection.connectUser(field_control,setController)
  //  connection.onDisconnect()
  
 
 }
 
 

  useEffect(() => {
    // store.initMedia(localStream);
    // store.remoteMedia(remoteStream);
    controller.initMedia(localStream).then((e)=>
    {
 
      connection_handler(e);
  
  
    }).catch((e)=>
    {
      console.log("init media error ",e);
    })
    // store.onDisconnect();
    // store.connectUser();
    // connection_caller()
   
    setOrientation(ori_handler(window.screen.orientation.angle) )
    window.screen.orientation.addEventListener("change", (e) => {

    setOrientation(ori_handler(e?.target.angle) )


    })



    window.onbeforeunload = () => {
    if(connection!=null){  connection.destroy()}
    }

    document.addEventListener("showMsg",(data)=>
    {

      setMsgqueue((e)=> [...e,data.detail]);
     
    })
  }, [])

  useEffect(() => {

  }, [msgqueue])

  return (

    <Box sx={{
      bgcolor: "border",
      display: "grid", gridTemplateRows: `${orientation ? "12vh 72vh 16vh" : "7vh 82vh 11vh"}`, gridTemplateColumns: "40vw 60vw", gridTemplateAreas: {
        md: `"header header "
                         "leftSide rightSide "
                         "leftSide footer"
                         `, xs: `"header header "
                         "leftSide leftSide"
                         "footer footer"
                         `}, alignItems: "stretch", justifyContent: "stretch"
    }}>

      <Box sx={{ gridArea: "header", backgroundColor: "primary.main", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography variant='heading' sx={{ color: "white", fontSize: "1.4rem", letterSpacing: ".2rem", fontWeight: "bold", fontFamily: 'sans-serif' }}>YOULONE</Typography>
      </Box>
      <Box sx={{ gridArea: "leftSide", backgroundColor: "background", display: "flex", flexDirection: orientation ? "row" : "column", justifyContent: "space-evenly", alignItems: "center" }}>
        {/* orientation?"40%": */}
        <Box sx={{ bgcolor: "border", width: orientation ? "40%" : "70%", minHeight: "36%", maxHeight: orientation ? "80%" : "40%", height: "auto", borderRadius: "1.2rem", overflow: "hidden", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", border: `.3rem solid rgba(175, 211, 226, .6)`, boxShadow: `0 0 30px rgba(175, 211, 226, 1)` }}>

          {field_control.refresh && <CircularProgress style={{ transform: 'scale(-1)' }} size={"9rem"} thickness={4} sx={{ color: "primary.main", opacity: .6, position: "absolute", zIndex: 200, }} />
          }
        
          <video ref={remoteStream}   style={{height:"auto",width: "100%",objectFit:"fill",objectFit:"2/2"}} autoPlay playsInline />
        

        </Box>
        <Box sx={{ bgcolor: "border", width: orientation ? "40%" : "70%", minHeight: "36%", maxHeight: orientation ? "80%" : "40%", height: "auto", borderRadius: "1.2rem", overflow: "hidden", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", border: `.3rem solid rgba(175, 211, 226, .6)`, boxShadow: `0 0 30px rgba(175, 211, 226, 1)` }}>

      
        
          <video ref={localStream}   style={{height:"auto",width: "100%",objectFit:"fill",aspectRatio:"2/2"}} autoPlay muted />
        

        </Box>
        {/* <Box sx={{ bgcolor: "border", width: orientation ? "40%" : "60%", minHeight: "35%", maxHeight: orientation ? "80%" : "34%", height: "auto", borderRadius: "1.2rem", overflow: "hidden", border: `.3rem solid rgba(175, 211, 226, .6)`, boxShadow: `0 0 30px rgba(175, 211, 226, 1)` }}>
          <video ref={localStream} style={{objectFit:"fill", height: "auto", width: "100%", maxWidth: "100%",aspectRatio:"1/1" }} />
        </Box> */}
      </Box>
      <Box sx={{ gridArea: "rightSide", position: "relative", overflow: "hidden" }}>


        <Box sx={{ maxHeight: "100%", width: "102.2%", backgroundColor: "border", display: "flex", flexDirection: "column", p: 2, pt: 3, overflowY: "scroll", scrollBehavior: "smooth", position: "absolute", right: "-2.2%" }}>
        {/* [{type:false,data:"hi guys..., how are you i am fine and you, i am also fine buddy what aboue you"},{type:true,data:"hello, how are you.hi guys..., how are you i am fine and you, i am also fine buddy what aboue you"}] */}
          {msgqueue.map((x, i) => {
            return x.type? <Box key={i} sx={{ mb: 2, bgcolor: "primary.main", borderRadius: ".5rem",width:"fit-content",maxWidth:"40%", p:1 }}>
                   <Typography variant='heading' sx={{ color: "background", letterSpacing: ".3px",  fontFamily: 'sans-serif' }}>{x.data}</Typography>
           
            </Box>:<Box key={i} sx={{ mb: 2, bgcolor: "background", maxWidth:"40%", borderRadius: ".5rem", alignSelf: "self-end", p:1}}>
            <Typography variant='heading' sx={{ color: "grey", letterSpacing: ".3px",  fontFamily: 'sans-serif' }}>{x.data}</Typography>
            </Box> 
          })



          }
        </Box>
      </Box>

      <Box key="6" sx={{ bgcolor: "primary.main", gridArea: "footer", px: ".5rem" }}>


        <Button_bar field_control={field_control}  setController={setController} />
      </Box>

     
    </Box>





  )
}



