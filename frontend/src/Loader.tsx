type LoaderProps = {
  message?: string;
};

export const Loader = ({ message }: LoaderProps) => {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-content">
        <div className="loading-spinner" aria-hidden="true" />
        {message && <p className="loading-message">{message}</p>}
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
