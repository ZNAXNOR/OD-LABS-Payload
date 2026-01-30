-- Drop problematic tables with long index names
-- Run this if you need to manually clean up the database

-- Drop version tables first (they have foreign key constraints)
DROP TABLE IF EXISTS "_pages_v_version_legal_config_notification_settings_recipients" CASCADE;
DROP TABLE IF EXISTS "_pages_v_version_legal_config_notification_settings" CASCADE;
DROP TABLE IF EXISTS "_pages_v" CASCADE;

-- Drop main tables
DROP TABLE IF EXISTS "pages_legal_config_notification_settings_recipients" CASCADE;
DROP TABLE IF EXISTS "pages_legal_config_notification_settings" CASCADE;
DROP TABLE IF EXISTS "pages" CASCADE;

-- Drop any remaining indexes that might cause issues
DROP INDEX IF EXISTS "_pages_v_version_legal_config_notification_settings_recipients_parent_id_idx";
DROP INDEX IF EXISTS "_pages_v_version_legal_config_notification_settings_recipients_order_idx";
DROP INDEX IF EXISTS "pages_legal_config_notification_settings_recipients_parent_id_idx";
DROP INDEX IF EXISTS "pages_legal_config_notification_settings_recipients_order_idx";

-- Note: After running this, restart your Payload application
-- and it will recreate the tables with the corrected schema