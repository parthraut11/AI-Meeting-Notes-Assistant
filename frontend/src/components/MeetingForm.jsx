import { useState } from 'react';

function MeetingForm({ onSubmit, isLoading }) {
  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState('');
  const [rawNotes, setRawNotes] = useState('');
  const [audioFile, setAudioFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create form data to handle file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('participants', participants);
    formData.append('raw_notes', rawNotes);
    if (audioFile) {
      formData.append('audio', audioFile);
    }

    onSubmit(formData);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Meeting Title</label>
          <input 
            type="text" 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekly Sync"
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="participants">Participants (comma-separated)</label>
          <input 
            type="text" 
            id="participants" 
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="e.g. Alice, Bob, Charlie"
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="rawNotes">Raw Notes</label>
          <textarea 
            id="rawNotes" 
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Type your notes here..."
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="audioFile">Optional Audio Upload (.mp3, .wav)</label>
          <input 
            type="file" 
            id="audioFile" 
            accept="audio/mp3, audio/wav"
            onChange={(e) => setAudioFile(e.target.files[0])}
          />
        </div>

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Generating Summary...' : 'Generate Summary'}
        </button>
      </form>
    </div>
  );
}

export default MeetingForm;
