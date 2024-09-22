import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Route , RouterProvider} from 'react-router'
import {createBrowserRouter ,createRoutesFromElements} from 'react-router-dom'
import Register from './pages/auth/Register.jsx'
import {Provider} from 'react-redux'
import store from './redux/store.js'
import Login from './pages/auth/Login.jsx'
import ChatApp from './pages/chat/Chatapp.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'  element={<App/>}>
      <Route path='/signup' element={<Register/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/' index={true} element={<ChatApp/>}/>
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  
)
