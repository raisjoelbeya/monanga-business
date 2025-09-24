SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name = 'auth_user' OR table_name = 'user_session' OR table_name = 'users' OR table_name = 'Session');
