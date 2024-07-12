import React,{createContext, useContext} from "react";
import {Signaling, store} from "./service/signaling"
import {Controller} from "./service/controller"
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { colors } from "@mui/material";
import {theme} from "./ui/theme"
export const appContext = createContext(null);


function App(props) {

  let obj = new Signaling();
  
  const provide_theme =  createTheme(theme)

  return (
    <appContext.Provider  value={Controller}>
      <ThemeProvider theme={provide_theme}  >
    {props.children}
    </ThemeProvider>
    </appContext.Provider>
  );
}
export default App;
