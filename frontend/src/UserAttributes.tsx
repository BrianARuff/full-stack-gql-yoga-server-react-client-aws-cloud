import { memo, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { ErrorMessage } from "./ErrorMessage";
import type { UserAttribute } from "./graphql";

export const UserAttributes = memo(() => {
  const { user } = useAuth();

  const [userAttributes, setUserAttributes] = useState<UserAttribute[]>([]);
  const [attributesError, setAttributesError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setUserAttributes([]);
      return;
    }

    user.getUserAttributes((err, attributes) => {
      if (err) {
        console.error("Failed to get user attributes:", err);
        setAttributesError("Failed to load user attributes");
        return;
      }
      setUserAttributes(attributes ?? []);
    });
  }, [user]);

  return (
    <section aria-labelledby="user-attributes-heading">
      <h2 id="user-attributes-heading" className="subtitle-text">
        User Attributes:
      </h2>
      <div className="user-attributes-container">
        {attributesError ? (
          <ErrorMessage message={attributesError} />
        ) : userAttributes.length === 0 ? (
          <p className="info-message">No attributes found.</p>
        ) : (
          <dl className="attributes-list">
            {userAttributes.map(({ Name: name, Value: value }) => (
              <div key={name} className="attribute-row">
                <dt className="subtitle-text attribute-name">{name}:</dt>
                <dd className="subtitle-text attribute-value">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
});

UserAttributes.displayName = "UserAttributes";
