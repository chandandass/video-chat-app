import {initializeApp} from "firebase/app";
import {onDisconnect,get,push,ref,onValue,child,set,query,getDatabase, limitToLast,remove} from "firebase/database";


const config = {
    apiKey: "AIzaSyAadOTFqo3S0VHOVHzOxSywR8pbjsZHWF8",
    appId: "1:3868891330:android:fef5e310508ddc6ed0035b",
    databaseURL: "https://learn-479dd-default-rtdb.firebaseio.com",
    messagingSenderId: "3868891330",
    projectId: "learn-479dd",
  };
  

export class Signaling
{
    #db;
    // #id;
    #uid;
    constructor()
    {   
        this.db=null;
        try{
        const app = initializeApp(config);
         this.#db= getDatabase(app);
        // console.log(this.#db);
    }
    catch(e)
    {
        if(this.#db == null)
        {
            throw "database connection issue";
        }
    }
    // console.log(this.connection);
    }

    async checkOffer()
    {
        let data = await  get(query(ref(this.#db,"offer"),limitToLast(1)))
        if(data.val() != null)
        {
            let r = data._node.children_.root_.key;
            this.#uid = r;
            return data.val()[r];

        }
        else
        {
            return false;
        }


    }

      
     async setOffer2(connection)
    {
   

        connection.onicecandidate = async (e)=>
        {
           
            if(!(e.candidate))
            {
                    let d =  push(ref(this.#db,"offer"),JSON.stringify(connection.localDescription));
                    this.#uid = d.key;
                    
                    onValue(ref(this.#db,`answer/${this.#uid}`),(value)=>
                    {
                        if(value.val()==null) return ;

                        let answer = JSON.parse(value.val());
                        if(!(connection.currentRemoteDescription))
                        connection.setRemoteDescription(answer);
                })
                     
            }
        }
        if(connection.signalingState === "closed")
        {
            return 0;
        }
        let offer = await connection.createOffer();


        await connection.setLocalDescription(offer);

        // set(ref(this.#db,`answer/${this.#uid}`),{temp:''})
        // console.log(d.key);
        

    }
  
    async setAnswer2(connection)
    {
        
        connection.onicecandidate = (e)=>
        {
            if(!(e.candidate))
            {
                set(ref(this.#db,`answer/${this.#uid}`),JSON.stringify(connection.localDescription));
            }
        }
        let answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
    




    }
    async deleteOffer()
    {
        remove(ref(this.#db,`offer/${this.#uid}`))
    }
    async deleteAnswer()
    {
        remove(ref(this.#db,`answer/${this.#uid}`))
    }

    async getData()
    {
        // onValue(ref(this.#db,"first"),(value)=>
        // {
        //     console.log(value.val());
        // })

        // get(child(ref(this.#db),"first")).then
        // ((snapshot)=>
        // {   
        //     // if(!snapshot.exists()) return ;
        //     console.log(snapshot);

        // })

        let data = await  get(query(ref(this.#db,"first"),limitToLast(1)))
        if(data.val()==null)
        {
            
            console.log("offer doesn't exist")
            return 0;
        }
        let r = data._node.children_.root_.key;
        console.log(data._node.children_.root_.key,"offer")
        console.log(data.val()[r].name,"offer")
        console.log(data.val(),"offer")
         
        // child(ref(this.#db),`first/${r}`).remove();
        // remove(ref(this.#db,`first/${r}`))
        
      
    }
    delete()
    {
        // onDisconnect(ref(this.#db,"offer/"+this.#uid))
        // onDisconnect(ref(this.#db,"offer/"+this.#uid))
        remove(ref(this.#db,"offer/"+this.#uid));
        // remove(ref(this.#db,"icecandidate/"+this.#uid));
        remove(ref(this.#db,"answer/"+this.#uid));
    }
  

    





}

export let store={name:"hello world"};
