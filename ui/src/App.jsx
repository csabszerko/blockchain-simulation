// import './App.css'
import { useBlockchainContext } from '../context/BlockchainContext.jsx';

function App() {
  const bc = useBlockchainContext();
  return  (
    <>
      <div>blocks on the blockchain</div>
      <pre>{JSON.stringify(bc.blocks, null, 5)}</pre>
    </>
  )
}

export default App
