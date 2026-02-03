import { memo } from "react";
import type { ErrorMessageProps } from "./graphql";

export const ErrorMessage = memo(
  ({ message, className = "", title }: ErrorMessageProps) => {
    if (!message || (Array.isArray(message) && message.length === 0)) {
      return null;
    }

    const messages = Array.isArray(message) ? message : [message];

    if (messages.length === 1) {
      return (
        <p
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className={`error-message ${className}`.trim()}
        >
          {title && <strong>{title}: </strong>}
          {messages[0]}
        </p>
      );
    }

    return (
      <div role="alert" aria-live="assertive" aria-atomic="true">
        {title && (
          <p className="error-message">
            <strong>{title}:</strong>
          </p>
        )}
        <ul className={`error-message-list ${className}`.trim()}>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    );
  },
);

ErrorMessage.displayName = "ErrorMessage";
