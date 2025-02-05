import { RetrieveRunFile } from "@renderer/services/SaveFile";
import { Link } from "react-router-dom";

export function MainMenu() {

  function ShowContinueRun()
  {
    var div = document.getElementById('continue-run')!;
    div.style.display = RetrieveRunFile() == false ? "none" : "block";
  }

  window.onload = ShowContinueRun;

  return(
      <>
          <h1>Wall Street Bets</h1>
          The house always wins..
          <Link to="/runsettings"><button>New Run</button></Link>
          <div id="continue-run">A save file is detected</div>
          <Link to="/settings"><button>Settings</button></Link>
      </>
  )
}