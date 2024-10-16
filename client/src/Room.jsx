import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from './SocketProvider';
import ReactPlayer from 'react-player';

function Room() {

    const socket = useSocket();
    const { roomId } = useParams();
    const [remoteId, setRemoteId] = useState(null);
    const [localStream, setLocalStream] = useState(null); 
      
    const peerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: 'stun:stun.1.google.com:19302'
          },
        ],
      });

    const handleCall = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit("create-offer",{to:remoteId,offer:offer});  
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }, []);

    useEffect(() => {
        
        const handleUserJoined = ({ email, id }) => {
            console.log(`${email} joined the room`);
            setRemoteId(id);
        };

        socket.on("send-offer",async ({from,offer})=>{
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
            const Ans = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(Ans);
            socket.emit("create-Ans",{to:from,ans:Ans});  
        })

        socket.on("user-joined", handleUserJoined);

        return () => {
            socket.off("user-joined", handleUserJoined);
        };
    }, [socket]);

    return (
        <div className='container'>
            <div className='row mx-auto'>
                <h1>{remoteId ? 'Connected' : 'No one in room'}</h1>
                <div className='col-3'>
                    {remoteId && <button onClick={handleCall}>Call</button>}
                </div>
            </div>
            <div className='row'>
                <div className='col-6'>
                    {localStream && (
                        <ReactPlayer
                            url={localStream}
                            width="100px"
                            height="100px"
                            playing
                            controls
                            muted
                        />
                    )}
                </div>
                <div className='col-6'>

                </div>
            </div>
        </div>
    );
}

export default Room;
