
import ChatboxContainer from './components/ChatboxContainer'
import { HaloStateProvider } from '../src/context/HaloStateContext';

function App() {

  return (
    <HaloStateProvider>
      <ChatboxContainer isFullscreen={false} isFolded={false} />
    </HaloStateProvider>
  )
}

export default App
