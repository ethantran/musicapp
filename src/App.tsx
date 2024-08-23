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
    </div>
  );
}

export default App