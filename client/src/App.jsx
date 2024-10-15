import Lobby from './Lobby'
import {SocketProvider} from './SocketProvider'
import './App.css'

function App() {

  return (
    <>
       <SocketProvider>
          <Lobby/>
       </SocketProvider>
    </>
  )
}

export default App
