import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from './SocketProvider';
import ReactPlayer from 'react-player';

function Room() {

    const socket = useSocket();
    const { roomId } = useParams();
    const [remoteId, setRemoteId] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const peerConnection = new RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.1.google.com:19302'
            },
        ],
    });

    const handleCall = useCallback(async () => {

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("sendOffer", { to: remoteId, offer });

    }, [socket, remoteId]);

    useEffect(() => {

        peerConnection.addEventListener("track", async (e) => {
            setRemoteStream(e.streams[0])
        });

    }, [])

    useEffect(() => {

        const handleUserJoined = ({ email, id }) => {
            console.log(`${email} joined the room`);
            setRemoteId(id);
        };

        const handelofferReceive = async ({ from, offer }) => {

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            console.log(from, offer);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const Ans = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(Ans);
            socket.emit("sendAns", { to: from, Ans: Ans });

        }

        const handelAnsReceive = async ({ from, Ans }) => {
            console.log("all done ")
            await peerConnection.setRemoteDescription(new RTCSessionDescription(Ans));
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }

        socket.on("user-joined", handleUserJoined);
        socket.on("receiveOffer", handelofferReceive);
        socket.on("receiveAns", handelAnsReceive);

        return () => {

            socket.off("user-joined", handleUserJoined);
            socket.off("receiveOffer", handelofferReceive);
            socket.off("receiveAns", handelAnsReceive);
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
                            width="100%"
                            height="300px"
                            playing
                            controls
                            muted
                        />
                    )}
                </div>
                <div className='col-6'>
                    {remoteStream && (
                        <ReactPlayer
                            url={remoteStream}
                            width="100%"
                            height="300px"
                            playing
                            controls
                            muted
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Room;
