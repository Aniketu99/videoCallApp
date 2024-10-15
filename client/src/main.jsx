import {createBrowserRouter,RouterProvider,useNavigate} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Room from './Room.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element:<App/>,
  },
  {
    path: "/room/:roomId",
    element:<Room/>,
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
