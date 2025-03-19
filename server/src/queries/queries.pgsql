   SELECT ROLE,
          COUNT(*) AS user_count
     FROM "Users"
 GROUP BY ROLE;



   UPDATE "Users"
      SET "balance" = "balance" + 10
    WHERE "id" IN (
             SELECT "id"
               FROM "Users"
              WHERE "role" = 'creator'
           ORDER BY "rating" DESC
              LIMIT 3
          );



   UPDATE "Users" u
      SET "balance" = u."balance" + COALESCE(cb.total_cashback, 0)
     FROM (
             SELECT c."userId",
                    SUM(c."prize") * 0.1 AS total_cashback
               FROM "Contests" c
              WHERE "createdAt" BETWEEN (DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '7 days') AND (
                    DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '14 days' - INTERVAL '1 second'
                    )
           GROUP BY c."userId"
          ) cb
    WHERE u."id" = cb."userId"
      AND u."role" = 'customer';