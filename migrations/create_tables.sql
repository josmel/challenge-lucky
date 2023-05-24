-- Create User table with UUID primary key
CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Create Country table with UUID primary key
CREATE TABLE Country (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255)
);

-- Create City table with UUID primary key and foreign key reference
CREATE TABLE City (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  countryId UUID REFERENCES Country (id),
  name VARCHAR(255)
);

-- Insert initial data into the Country table with fixed UUIDs
INSERT INTO Country (id, name) VALUES
  ('7b562bc8-f852-11ed-b67e-0242ac120002', 'Peru'),
  ('4543f8da-f857-11ed-b67e-0242ac120002', 'Argentina'),
  ('49eace54-f857-11ed-b67e-0242ac120002', 'Egipto');

-- Insert initial data into the City table with fixed UUIDs
INSERT INTO City (id, name, countryId) VALUES
  ('528de154-f857-11ed-b67e-0242ac120002', 'Lima', '7b562bc8-f852-11ed-b67e-0242ac120002'),
  ('5719e70e-f857-11ed-b67e-0242ac120002', 'Buenos Aires', '4543f8da-f857-11ed-b67e-0242ac120002'),
  ('5c37592e-f857-11ed-b67e-0242ac120002', 'Cairo', '49eace54-f857-11ed-b67e-0242ac120002');

-- Create Address table with UUID primary key and foreign key reference
CREATE TABLE Address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cityId UUID REFERENCES City (id),
  street VARCHAR(255)
);

-- Create Profile table with UUID primary key and foreign key references
CREATE TABLE Profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES "User" (id),
  addressId UUID REFERENCES Address (id),
  name VARCHAR(255)
);
