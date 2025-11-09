DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'catalog_db') THEN
      CREATE DATABASE catalog_db;
   END IF;

   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'order_db') THEN
      CREATE DATABASE order_db;
   END IF;

   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'notify_db') THEN
      CREATE DATABASE notify_db;
   END IF;

   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'chat_db') THEN
      CREATE DATABASE chat_db;
   END IF;

   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce1') THEN
      CREATE DATABASE ecommerce1;
   END IF;
END;
$$
LANGUAGE plpgsql;
