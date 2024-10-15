import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from './SocketProvider';

function Room() {
    const socket = useSocket();
    const { roomId } = useParams(); 

    useEffect(() => {

        const handleUserJoined = ({ email }) => {
            console.log(email);
        };

        socket.on("user-joined", handleUserJoined);

        return () => {
            socket.off("user-joined", handleUserJoined);
        };

    }, [socket]); 

    return (
        <div>
            <h1>Room ID: {roomId}</h1>  
        </div>
    );
}

export default Room;
