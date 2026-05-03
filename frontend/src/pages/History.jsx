import { useState, useEffect } from 'react';

function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:3001/history');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) return <p>Loading history...</p>;
  if (error) return <p style={{ color: '#991b1b' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Past Meeting Summaries</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        Review your previously generated meeting notes and action items.
      </p>

      {history.length === 0 ? (
        <p>No meeting history found.</p>
      ) : (
        history.map((item) => (
          <div key={item.id} className="card history-item">
            <div className="history-header">
              <span className="history-title">{item.title}</span>
              <span className="history-date">
                {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="summary-box" style={{ marginTop: '1rem' }}>
              <p><strong>Summary:</strong> {item.summary}</p>
            </div>

            {item.action_items && item.action_items.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Action Items:</strong></p>
                <ul className="action-items-list" style={{ marginTop: '0.5rem' }}>
                  {item.action_items.map((action, idx) => (
                    <li key={idx} className="action-item" style={{ padding: '0.5rem 1rem' }}>
                      <span className="task-desc">{action.task}</span>
                      <div className="task-meta">
                        <span className="badge badge-owner">{action.owner}</span>
                        <span className={`badge badge-${action.priority}`}>{action.priority}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default History;
