import { CreateRunFile } from "@renderer/services/SaveFile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RunSettings()
{
    const [name, setName] = useState("Warren Buffet");
    const [seed, setSeed] = useState("12345678");
    const navigate = useNavigate();
    function handleNameChange( event ) {
        setName(event.target.value);
    }

    function onIsSeededRunChange( event ) {
        var seededOptions = document.getElementById("is-seeded-options")!;
        seededOptions.style.display = event.target.checked ? "block" : "none";
    }

    function onSeedChange( event ){
        setSeed(event.target.value);
    }

    function startRun()
    {
        CreateRunFile(name, seed);
        navigate("/gameview");
    }

    return(
        <>
        <h1>Run Settings</h1>
        <div>
            Name your run: <input type="text" defaultValue={name} onChange={handleNameChange}></input>
        </div>
        <div>
            <div>Seeded run? <input type="checkbox" onChange={onIsSeededRunChange}></input></div>
            <div id="is-seeded-options" style={{display:"none"}}>
                Seed: <input type="text" maxLength={8} onChange={onSeedChange}></input><br/>
                (Warning: this will deactivate achievements, if there ever is any.)
            </div>
        </div>
        <div>
            <button onClick={startRun}>Open Account</button>
        </div>

        </>
    )
}