-- clear_data.sql

DO $$
BEGIN
    RAISE NOTICE 'Deleting chat messages...';
END$$;

DELETE FROM chat_messages;

DO $$
BEGIN
    RAISE NOTICE 'Deleting survey responses...';
END$$;

DELETE FROM survey_responses;

DO $$
BEGIN
    RAISE NOTICE 'Resetting ID sequences...';
END$$;

ALTER SEQUENCE chat_messages_id_seq RESTART WITH 1;
ALTER SEQUENCE survey_responses_id_seq RESTART WITH 1;

DO $$
BEGIN
    RAISE NOTICE 'All tables cleared and IDs reset.';
END$$;

select * from chat_messages;

select * from survey_responses;
