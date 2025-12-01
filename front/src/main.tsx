import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import "./assets/fonts/fonts.css";
import './index.css'
import { appRoutes } from './app/router/app-routes'
import store from './app/store/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRoutes} />
    </Provider>
  </StrictMode>,
)
