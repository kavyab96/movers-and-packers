import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router.jsx'
import './styles/App.css'
import { AreaProvider } from "./context/AreaContext.jsx";
import { Toaster } from 'sonner';

function App() {
    return (
        <>
        <AreaProvider>
            <RouterProvider router={router} />
        </AreaProvider>
         <Toaster richColors position="top-right" />
        </>
    )
}

export default App
