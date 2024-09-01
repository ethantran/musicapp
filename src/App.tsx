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
import MinorPentatonicModes from "./MinorPentatonicModes";
import MajorScaleGenerator from "./MajorScaleGenerator";
import { ScaleExplorer } from "./ScaleExplorer/ScaleExplorer";
import HarmonicMinorScaleExplorer from "./HarmonicMinorScaleExplorer/HarmonicMinorScaleExplorer";
import MelodicMinorScaleExplorer from "./MelodicMinorScaleExplorer/MelodicMinorScaleExplorer";
import KeySignatureExplorer from "./KeySignatureExplorer/KeySignatureExplorer";
import CircleOfFifthsExplorer from "./CircleOfFifthsExplorer/CircleOfFifthsExplorer";

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
      <MinorPentatonicModes />
      <MajorScaleGenerator />
      <ScaleExplorer />
      <HarmonicMinorScaleExplorer />
      <MelodicMinorScaleExplorer />
      <KeySignatureExplorer />
      <CircleOfFifthsExplorer />
    </div>
  );
}

export default App