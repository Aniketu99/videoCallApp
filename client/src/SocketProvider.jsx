import { createContext, useContext, useMemo } from "react"
import {io} from 'socket.io-client'
import React from 'react'

const socketcontext = createContext();

export const useSocket = ()=>{
    const socket = useContext(socketcontext);
    return socket;
}

export const SocketProvider = (props) => {

    const socket = useMemo(() => io("https://animated-space-happiness-x5rrqqpwxqpwh9r9-3000.app.github.dev", {
        transports: ['websocket']
      }));

    return (
        <socketcontext.Provider value={socket}>
            {props.children}
        </socketcontext.Provider>
    )
}

