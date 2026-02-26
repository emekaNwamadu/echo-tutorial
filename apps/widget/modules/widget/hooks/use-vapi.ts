import Vapi from "@vapi-ai/web";
import { useState,useEffect } from "react";

interface TranscriptMessage{
    role:"user"|"assistant";
    text:string;

}

export const useVapi = () => {
    const [vapi,setVapi] = useState<Vapi | null >(null);
    const [isConnected,setIsConnected] = useState(false);
    const [isConnecting,setIsConnecting] = useState(false);
    const [isSpeaking,setIsSpeaking] = useState(false);
    const [transcript,setTranscript] = useState<TranscriptMessage[]>([]);

    useEffect(() => {
        //Public api key
        const vapiInstance = new Vapi("79d5536a-5037-4f69-9f27-913818e54d4c");
        setVapi(vapiInstance);

        vapiInstance.on("call-start" , () => {
            setIsConnected(true);
            setIsConnecting(false);
            setTranscript([]);
        } )

        vapiInstance.on("call-end" , () => {
            setIsConnected(false);
            setIsConnecting(false);
            setIsSpeaking(false);
        } )


         vapiInstance.on("speech-start" , () => {
            
            setIsSpeaking(true);
        } )


         vapiInstance.on("speech-end" , () => {
           
            setIsSpeaking(false);
        } )


         vapiInstance.on("error" , (error) => {
            console.log(error,"VAPI_ERROR");
            setIsConnecting(false);
            
        } )

         vapiInstance.on("message" , (message) => {
            if (message.type === "transcript" && message.transcriptType ==="final") {
                setTranscript((prev) =>[
                    ...prev,
                    {
                        role:message.role ==="user" ? "user":"assistant",
                        text:message.transcript,
                    }
                  
                ])
                
            }
            
        } )

        return () => {
            vapiInstance?.stop();
        }

    },[]);

    const startCall = () => {
        setIsConnecting(true);   
        
        if (vapi){
            //Assistant ID
            vapi.start("aabab963-7d75-4442-99ff-bff8f900fc0f");
        }
    
    }

     const endCall = () => {
        
        if (vapi){
            vapi.stop();
        }
    
    }

    return{
        isSpeaking,
        isConnecting,
        isConnected,
        transcript,
        startCall,
        endCall
    }

};

