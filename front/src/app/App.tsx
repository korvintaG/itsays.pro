import { Outlet, useNavigation } from 'react-router-dom'
import './App.css'
import { AppHeader } from './header/app-header'
import { Preloader } from '../shared/ui/preloader'

function App() {
 // let navigation = useNavigation();
  
  return (
    <div className="App">
      <AppHeader />
        <main className='main-container'>
          <Outlet />
        </main>
        {/*<p>dsdsd**</p>*/}
 
    </div>
  )
}

export default App
