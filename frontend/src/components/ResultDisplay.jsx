function ResultDisplay({ data }) {
  if (!data) return null;

  return (
    <div className="card results-section">
      <h2>Meeting Summary: {data.title}</h2>
      
      <div className="summary-box">
        <p>{data.summary}</p>
      </div>

      <h3>Action Items</h3>
      {data.actionItems && data.actionItems.length > 0 ? (
        <ul className="action-items-list">
          {data.actionItems.map((item, index) => (
            <li key={index} className="action-item">
              <span className="task-desc">{item.task}</span>
              <div className="task-meta">
                <span className="badge badge-owner">{item.owner}</span>
                <span className={`badge badge-${item.priority}`}>{item.priority}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No action items identified.</p>
      )}
    </div>
  );
}

export default ResultDisplay;
