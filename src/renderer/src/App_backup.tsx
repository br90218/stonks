import BasicButton from './components/BasicButton'
import Versions from './components/Versions'

function App_backup(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      {/*<img alt="logo" className="logo" src={electronLogo} />*/}
      <div className="creator">The house always wins...</div>
      <div className="text">
        WALL STREET BETS{/*<span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>*/}
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        {/*<div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>*/}
        <div className = "action">
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App_backup