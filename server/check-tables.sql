SELECT
  to_regclass('"ChunkEmbedding"') AS embedding_table,
  to_regclass('"Conversation"') AS conversation_table,
  to_regclass('"ChatMessage"') AS message_table,
  EXISTS (
    SELECT 1
    FROM pg_extension
    WHERE extname = 'vector'
  ) AS vector_extension_enabled;
