import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div className="not-found-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Go to Home
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/properties')}
            >
              Browse Properties
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
