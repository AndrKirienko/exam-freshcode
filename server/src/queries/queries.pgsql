   SELECT ROLE,
          COUNT(*) AS user_count
     FROM "Users"
 GROUP BY ROLE;