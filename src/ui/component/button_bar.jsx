import React from 'react'
import { Box, IconButton, TextField} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SyncIcon from '@mui/icons-material/Sync';
import SendIcon from '@mui/icons-material/Send';



export default function Button_bar({field_control,setController}) {
  
  const ro = {
    transform:  'rotate(180deg)', 
    transition: 'transform 2s ease',
    animation: "transform 1.5s 2"// smooth transition
   }
  const style={display:"flex",p:1.2,justifyContent:"center",alignItems:"center",flex:.01,height:"100%",borderRadius:"50%",cursor:"pointer",bgcolor:"background",color:"icon","&:hover":{transform:`scale(1.1)`}}
  return (
    <Box sx={{ width:"100%",height:"100%" ,display:"flex",justifyContent:"space-evenly",alignItems:"center"}}>
     <Box sx={{display:"flex",justifyContent:"space-evenly",alignItems:"center",flexGrow:.5}}>
    
      <Box onClick={()=>{field_control.mic_handler(); setController({...field_control,mic:!(field_control.mic)})}}  sx={style}>
           {field_control.mic ?<MicIcon/>:<MicOffIcon/>}
        </Box>
        <Box onClick={()=> { field_control.refresh_handler(); setController({...field_control,refresh:!(field_control.refresh)}) }} sx={{...style}} >
        <SyncIcon  className={field_control.refresh?"rotateIcon":""} />
        </Box >
        <Box onClick={()=>{field_control.heart()}} sx={{...style,color:"red"}}>
        <FavoriteIcon/>
        </Box>
              
     </Box>

     <Box sx={{ display:{md:"flex",xs:"none"}, flexGrow:1}}>
           <TextField id="input" label="write what in your mind....."  size="small"
           
           inputProps={{ style:{borderRadius:".3rem",backgroundColor:"background",fontSize:".8rem",letterSpacing:".8px",paddingLeft:"8px",padding:"2px 8px",},}}  


            sx={{ "& fieldset": { border: 'none' },width:"100%",}} rows={1.3} multiline
             InputLabelProps={{style:{fontSize:".9rem",paddingLeft:".4rem"}}}
            />
            <IconButton onClick={()=>{ field_control.send()}}>
              <SendIcon sx={{color:"Background"}}/>
            </IconButton>
        </Box>
    </Box>
  )
}
