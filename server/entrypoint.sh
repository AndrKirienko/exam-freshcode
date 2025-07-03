#!/bin/sh

# Ждем, пока база данных будет доступна
echo "Waiting for Postgres..."
until npx sequelize db:migrate && npx sequelize db:seed:all; do
  echo "Waiting for DB to be ready..."
  sleep 2
done

# Запускаем сервер
npm start