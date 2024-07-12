
export let heart_throttle = throttle(heart_handler,1500);
export let Msgsender = throttle(sendMSG,500);

export function heart_handler(type)
{
  console.log(window.orientation)
  let body = document.getElementsByTagName("body")?.[0]
  let div = document.createElement("div");
  let orientation = ori_handler(window.orientation);

  let bu_class = "bubble_"
  let fa_class = "fa_"
  if(type)
  {
    switch(orientation)
    {
      case true:
      bu_class += "ltr"
      fa_class += "ltr"
      break;
      case false:
      bu_class +="ttb"
      fa_class +="ttb"
      break;
    }
  }
  else
  {
    switch(orientation)
    {
      case true:
        bu_class += "rtl"
        fa_class += "rtl"
      break;
      case false:
        bu_class += "btt"
        fa_class += "btt"
      break;
    }
  }
  body.appendChild(div);
 
  div.innerHTML = `<div  class="bubbling_heart" >
  <div class="${bu_class}"><svg class="fa fa-heart fa-5x ${fa_class}" height="3em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg></div>
  <div class="${bu_class}"
  ><svg class="fa fa-heart fa-5x ${fa_class}" height="3em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg></div>
  <div class="${bu_class}"
  ><svg class="fa fa-heart fa-5x ${fa_class}" height="3em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg></div>
  <div class="${bu_class}"
  ><svg class="fa fa-heart fa-5x ${fa_class}" height="3em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" /></svg></div>




</div>`



  let bu = document.getElementsByClassName(bu_class);
  console.log(bu);
  bu[bu.length-1].addEventListener("animationend",()=>
  {
    try{
    body.removeChild(div);
    }catch(e)
    {
      console.log(e);
    }
  })



}
export function heart_caller(con)
{
  if(sendMSG(con,"heart"))
  {
  heart_throttle(false);

  }
  
  
}
export function ori_handler(angle)
{
  if(angle == 90 || angle == 270)
  {
    return true;
  }
  else
  {
    return false;
  }
}


export function debounce(func,delay)
{
  let id=null;
  return (...args)=>
  {
    clearTimeout(id);
    id = setTimeout(()=>{func(...args);console.log("debounce called")},delay);
  }
}
function throttle(func,delay)
{
  let prev = 0;

  return (...args)=>
  {
    let now = new Date().getTime();
    if(now-prev > delay)
    {
      prev = now ;
      func(...args);
   
    }
  }
}


export function sendMSG(con,type)
{ 

//  showMsg(1,3)
 let dataChannel = con.getDatachannel();
 if(dataChannel)
 {
  let obj;
  switch(type)
  {
    case "msg":
    let input = document.getElementById("input"); 
    let msg = input.value?.trim()
    if(msg === "") return ;
    obj = {type:"msg",data:msg}
    let event = new CustomEvent("showMsg",{detail:{type:false,data:msg}});
    dataChannel?.send(JSON.stringify(obj));
    input.value = ""
    document.dispatchEvent(event);
    return true;

    case "heart":
    obj={type:"heart"}
    dataChannel.send(JSON.stringify(obj));
    return true;
    
  }

 }
 else
 {
  return false;
 }
}
export function ReceiveMSG(e)
{ 
  console.log(e);
  let obj = JSON.parse(e.data); 
  switch(obj?.type)
  {
    case "msg":

          
      let event = new CustomEvent("showMsg",{detail:{type:true,data:obj.data}});
      
      document.dispatchEvent(event);
     break;

    case "heart":
      heart_throttle(true);
      break;
  }

}



// 0-> sender & 1->receiver
function showMsg(type,e)
{
  let container = document.getElementById("msg_container");
  console.log(container);
  let div = document.createElement("div");
  container.innerHTML = `<div style='margin-bottom: 2, background-color: white, width: 200px, min-height: 40px, border-radius: 1.2rem'>
  </div>`
  // container.appendChild(div)
  // container.appendChild(`<div  sx={{ mb: 2, bgcolor: "white", width: "200px", minHeight: "40px", borderRadius: "1.2rem" }}>
  // </div>`)

}
