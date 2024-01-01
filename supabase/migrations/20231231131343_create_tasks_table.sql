CREATE TABLE tasks (
    id VARCHAR(26) PRIMARY KEY,
    company_id VARCHAR(26) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    reason_code VARCHAR(255),
    created_user VARCHAR(26) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
