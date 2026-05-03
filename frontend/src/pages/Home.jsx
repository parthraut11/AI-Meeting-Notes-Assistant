import { useState } from 'react';
import MeetingForm from '../components/MeetingForm';
import ResultDisplay from '../components/ResultDisplay';

function Home() {
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateSummary = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResultData(null);

    try {
      const response = await fetch('http://localhost:3001/summarize', {
        method: 'POST',
        body: formData, // FormData sends correct multipart/form-data headers automatically
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const data = await response.json();
      setResultData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        Upload your meeting notes or an audio recording to generate a concise summary and extract action items.
      </p>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <MeetingForm onSubmit={handleGenerateSummary} isLoading={isLoading} />
      
      <ResultDisplay data={resultData} />
    </div>
  );
}

export default Home;
