interface RunFile {
  name: string,
  seed: string,
}

export function CreateRunFile( name: string, seed: string )
{
  const runFile: RunFile = {
    name: name,
    seed: seed
  }

  SaveRunFile(runFile);
}

export function RetrieveRunFile()
{
  const retrievedRunFileJSONString = localStorage.getItem('runFile');
  if(retrievedRunFileJSONString == null){
    return false;
  }
  const runFile: RunFile = JSON.parse(retrievedRunFileJSONString);
  return runFile;
}

export function SaveRunFile( runFile: RunFile ) {
  const runFileJSONString = JSON.stringify(runFile);
  localStorage.setItem('runFile', runFileJSONString);
}

export function RegenerateRunFile()
{

}