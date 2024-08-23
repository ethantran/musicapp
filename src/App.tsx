import NoteCircle from "./NoteCircle";
import NoteCircleWithOctaveControl from "./NoteCircleWithOctaveControl";
import NoteSpiral from "./NoteSpiral";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>The Note Circle</h1>
        <p>Click on a note to hear its sound. Moving clockwise ascends in pitch, counter-clockwise descends.</p>
      </header>
      <NoteCircle />
      <h2>Note Circle With Octave Control</h2>
      <NoteCircleWithOctaveControl />
      <h2>Note Spiral</h2>
      <NoteSpiral />
    </div>
  );
}

export default App