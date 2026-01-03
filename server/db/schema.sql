-- Service & Warranty Tracker Schema

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('user', 'admin')) NOT NULL DEFAULT 'user'
);

-- APPLIANCES TABLE
CREATE TABLE IF NOT EXISTS appliances (
  appliance_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  brand VARCHAR(100),
  purchase_date DATE NOT NULL,
  warranty_end_date DATE NOT NULL,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

-- SERVICE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS service_requests (
  request_id SERIAL PRIMARY KEY,
  appliance_id INT NOT NULL,
  issue_description TEXT NOT NULL,
  status VARCHAR(20)
    CHECK (status IN ('Open', 'In Progress', 'Resolved'))
    DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appliance
    FOREIGN KEY (appliance_id)
    REFERENCES appliances(appliance_id)
    ON DELETE CASCADE
);

-- SERVICE LOGS TABLE (optional but good)
CREATE TABLE IF NOT EXISTS service_logs (
  log_id SERIAL PRIMARY KEY,
  request_id INT NOT NULL,
  remark TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_request
    FOREIGN KEY (request_id)
    REFERENCES service_requests(request_id)
    ON DELETE CASCADE
);
