import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

export default function Dashboard({ user, setUser }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [courseCode, setCourseCode] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const loadFeedback = async () => {
    try {
      const data = await apiFetch('/api/v1/feedback');
      setFeedbackList(data.feedback || []);
    } catch (err) {
      if (err.status === 401) {
        setUser(null);
        navigate('/login');
      } else {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const created = await apiFetch('/api/v1/feedback', {
        method: 'POST',
        body: JSON.stringify({
          course_code: courseCode.trim().toUpperCase(),
          rating: Number(rating),
          feedback_text: feedbackText.trim(),
        }),
      });
      setFeedbackList((prev) => [created, ...prev]);
      setCourseCode('');
      setRating(5);
      setFeedbackText('');
      setSuccess('Feedback encrypted and submitted.');
    } catch (err) {
      if (err.status === 401) {
        setUser(null);
        navigate('/login');
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      await apiFetch(`/api/v1/feedback/${id}`, { method: 'DELETE' });
      setFeedbackList((prev) => prev.filter((item) => item.id !== id));
      setSuccess('Feedback entry deleted.');
    } catch (err) {
      if (err.status === 401) {
        setUser(null);
        navigate('/login');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="dashboard">
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <section className="card">
        <h2>Submit Course Feedback</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="row">
            <label>
              Course Code
              <input
                type="text"
                placeholder="e.g. CS301"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
              />
            </label>
            <label>
              Rating (1–5)
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Very Poor</option>
              </select>
            </label>
          </div>
          <label>
            Anonymous Feedback / Grievance (Encrypted at Rest)
            <textarea
              rows={3}
              placeholder="Share constructive course feedback..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Encrypting & Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Submitted Feedback ({feedbackList.length})</h2>
        {feedbackList.length === 0 ? (
          <p className="muted">No feedback entries submitted yet.</p>
        ) : (
          <div className="feedback-list">
            {feedbackList.map((item) => (
              <div key={item.id} className="feedback-item">
                <div className="item-header">
                  <div>
                    <span className="badge">{item.course_code}</span>
                    <span className="rating">Rating: {item.rating}/5</span>
                  </div>
                  {user?.role === 'admin' && (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="feedback-body">{item.feedback_text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
