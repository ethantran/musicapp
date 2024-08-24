import NoteCircle from "./NoteCircle";
import NoteCircleWithOctaveControl from "./NoteCircleWithOctaveControl";
import NoteSpiral from "./NoteSpiral";
import OctaveWaveDemo from "./OctaveWaveDemo";
import OvertoneDemo from "./OvertoneDemo";
import GuitarDemo from "./GuitarDemo";
import PitchStandardDemo from "./PitchStandardDemo";
import TwelveTETDemo from "./TwelveTet";
import TwelveTetCalc from "./TwelveTetCalc";
import FamilyTreeHarmonic from "./FamilyTreeHarmonic";
import JustIntonationChoir from "./JustIntonationChoir";
import TuningSystemsDemo from "./TuningSystemsDemo";
import { IntervalExplorer } from "./IntervalExplorer";
import { MusicBuildingBlocks } from "./MusicBuildingBlocks";
import ScaleDemo from "./ScaleDemo";

function App() {
  return (
    <div className="App">
      <NoteCircle />
      <NoteCircleWithOctaveControl />
      <NoteSpiral />
      <OctaveWaveDemo />
      <PitchStandardDemo />
      <TwelveTETDemo />
      <TwelveTetCalc />
      <OvertoneDemo />
      <GuitarDemo />
      <FamilyTreeHarmonic />
      <JustIntonationChoir />
      <TuningSystemsDemo />
      <IntervalExplorer />
      <MusicBuildingBlocks />
      <ScaleDemo />
    </div>
  );
}

export default App