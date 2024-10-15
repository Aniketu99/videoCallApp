import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import './App.css';

function Lobby() {
  const [email, setEmail] = useState('');
  const [roomId, setRoomId] = useState('');
  const socket = useSocket();

  const joinHandler = () => {
    if (email && roomId) {
      socket.emit("join-room", { email, roomId });
    } else {
      alert("Email and Room ID are required!");
    }
  };

  useEffect(() => {
   

    return () => {
 
    };
    
  }, [socket]);

  return (
    <div className='container'>
      <div className='d-flex justify-content-center align-items-center'>
        <div className='col-lg-6 col-md-12 col-12 p-5'>
          <div className='text-center'>
            <h2>LOBBY</h2>
          </div>
          <div className='mt-lg-5'>
            <div>
              <label htmlFor="emailInput" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="roomIdInput" className="form-label">Room Id</label>
              <input
                type="text"
                className="form-control"
                id="roomIdInput"
                placeholder="Room Id"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
          </div>
          <div className='mt-3'>
            <button type="button" className="btn btn-primary submitbtn" onClick={joinHandler}>
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
