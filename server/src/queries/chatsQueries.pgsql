   CREATE TABLE IF NOT EXISTS "Conversations" (
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );



   CREATE TABLE IF NOT EXISTS "Catalogs" (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER NULL REFERENCES "Users" (id) ON UPDATE CASCADE ON DELETE SET NULL,
          "catalogName" VARCHAR(50) NOT NULL
          );



   CREATE TABLE IF NOT EXISTS "CatalogConversation" (
          id SERIAL PRIMARY KEY,
          "catalogId" INTEGER NULL REFERENCES "Catalogs" (id) ON UPDATE CASCADE ON DELETE CASCADE,
          "conversationId" INTEGER NULL REFERENCES "Conversations" (id) ON UPDATE CASCADE ON DELETE CASCADE
          );



   CREATE TABLE IF NOT EXISTS "ConversationParticipants" (
          id SERIAL PRIMARY KEY,
          "conversationId" INTEGER NOT NULL REFERENCES "Conversations" (id) ON UPDATE CASCADE ON DELETE CASCADE,
          "userId" INTEGER NULL REFERENCES "Users" (id) ON UPDATE CASCADE ON DELETE SET NULL,
          "blackList" BOOLEAN DEFAULT FALSE,
          "favoriteList" BOOLEAN DEFAULT FALSE
          );



   CREATE TABLE IF NOT EXISTS "Messages" (
          id SERIAL PRIMARY KEY,
          "sender" INTEGER NULL REFERENCES "Users" (id) ON UPDATE CASCADE ON DELETE SET NULL,
          "conversationId" INTEGER NOT NULL REFERENCES "Conversations" (id) ON UPDATE CASCADE ON DELETE CASCADE,
          body TEXT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );