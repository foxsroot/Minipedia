import '../styles/main.css';
import '../styles/loading.css';

const Loading = () => {
  return (
    <div className="loading-bg">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default Loading;
