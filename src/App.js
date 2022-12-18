import './App.css';
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import Game from './components/game';
 
const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})
function App() {
  return (
    <div className="App">
      <Game/>
    </div>
  );
}

export default App;
