INSERT INTO users (
    first_name,
    last_name,
    email,
    password_hash,
    role_id,
    enabled,
    created_at,
    updated_at
)
SELECT
    'John',
    'Customer',
    'john.customer@example.com',
    'AUTHENTICATION_SETUP_PENDING',
    r.id,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM roles r
WHERE r.name = 'CUSTOMER'
  AND NOT EXISTS (
    SELECT 1
    FROM users u
    WHERE u.email = 'john.customer@example.com'
);

INSERT INTO users (
    first_name,
    last_name,
    email,
    password_hash,
    role_id,
    enabled,
    created_at,
    updated_at
)
SELECT
    'Alice',
    'Agent',
    'alice.agent@example.com',
    'AUTHENTICATION_SETUP_PENDING',
    r.id,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM roles r
WHERE r.name = 'AGENT'
  AND NOT EXISTS (
    SELECT 1
    FROM users u
    WHERE u.email = 'alice.agent@example.com'
);

INSERT INTO users (
    first_name,
    last_name,
    email,
    password_hash,
    role_id,
    enabled,
    created_at,
    updated_at
)
SELECT
    'Adam',
    'Administrator',
    'admin@example.com',
    'AUTHENTICATION_SETUP_PENDING',
    r.id,
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM roles r
WHERE r.name = 'ADMIN'
  AND NOT EXISTS (
    SELECT 1
    FROM users u
    WHERE u.email = 'admin@example.com'
);