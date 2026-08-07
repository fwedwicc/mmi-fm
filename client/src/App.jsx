import { AppRouter } from './shared/routes'
import { Toaster } from 'react-hot-toast'
// import { ChangeModeModal } from './shared/components/custom/landing'

const App = () => {
  return (
    <>
      <AppRouter />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        containerStyle={{
          zIndex: 1000000
        }}
      />
    </>
  )
}

export default App