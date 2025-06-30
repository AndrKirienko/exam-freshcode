# **SQUADHELP**


### Project Starting

Commands are run in the main project folder:
</br>

#### 1. Command for creating images and running containers:
```shell
$ docker compose -f docker-compose-dev.yaml up
```


#### 2. Command for running database migrations and seeds using Sequelize:

```shell
$ docker exec -it exam-freshcode-server-dev-1 sh -c "npx sequelize db:migrate && npx sequelize db:seed:all"
```
The client part of the application was launched at [http://localhost:5000](http://localhost:5000). </br> The server side was launched at [http://localhost:3000](http://localhost:3000).

To connect PostgresSQL databases in development mode, the necessary configurations are available in the file located at `server/src/config/postgresConfig.json`.

To connect MongoDB databases in development mode, the necessary configurations are available in the file located at `server/src/config/mongoConfig.json`.

All tasks should be checked in the main branch, except for the Db No-SQL task.
</br>

---
</br>

### User Authorization

|Role|Email Address|Password|
|-----|:----:|:----:|
|Customer|customer@gmail.com|Q!werty123456|
|Creator|creator@gmail.com|Q!werty123456|
|Moderator|moderator@gmail.com|Q!werty123456|

</br>

---
</br>

### Fixing Bugs


Library updates are displayed in the `update-libraries` branch.

Uninstalling of unused libraries is displayed in the `usinstall-unused-packeges` branch.

Refactoring and bug fixes are displayed in the `refactor-client` and `refactor-server` branches.

</br>

---
</br>

### Layout

The “How It Works” page is displayed at [http://localhost:5000/howItWorks](http://localhost:5000/howItWorks) or in the main menu under the Contests item. It is written in the component located at `client/scr/components/HowItWorks/HowItWorks.jsx`.

`page-how-it-works` branch

</br>

---
</br>

### React

#### 1. Events

Added dynamic branding that is displayed only for the customer role. Displayed at [http://localhost:5000/events](http://localhost:5000/events) or in the user menu. The registered component is located at `client/src/components/Events/Events.jsx`.

`page-events` branch

#### 2. Button Group

The ButtonGroup component located at [http://localhost:5000/startContest/nameContest](http://localhost:5000/startContest/nameContest) for the customer role. The component is written in `client/src/components/ContestForm/DomainOptions/DomainOptions.jsx`.

`btn-group-nameContest` branch

</br>

---
</br>

### Queries

#### 1. Db No-SQL

Queries are located at the `server/src/queries/queries.mongodb.js` path.

In order to check the functionality of requests, you need to switch to the `moderator-role` branch and run the following code in the console:

```shell
docker exec -it exam-freshcode-server-dev-1 npm install mongoose@7.6.5
```



#### 2. Db SQL

Queries are located at the `server/src/queries/queries.pgsql` path.


`queries` branch

</br>

---
</br>


### Node.js

Added error logging to the folder at `server/src/logs`.

In the file at `server/src/utils/logBackup.js'`, on line 63, you can change the schedule for the quick check. By default, errors are wrapped every day at 6 AM, but you can modify it to run every minute.

```
schedule.scheduleJob('* * * * *', () => {
  transformAndBackupFile();
});
```
Logged errors will be displayed in the file at `server/src/logs/backup`.


`logger` branch

</br>

---
</br>

### Fullstack

#### 1. Moderator Role

The moderator's confirmation of offers can be found at [http://localhost:5000/offers](http://localhost:5000/offers) or in the user menu.

The result of the mailing in development mode can be seen in the server console. After confirming or rejecting an offer, the console will display the "Preview URL:",  where you can see the message body.

`moderator-role` branch

#### 2. Chats

The database schema is located in the folder at `server/src/devDocs`.

To create a database for chats, you need to run all the queries in the file at `server/src/queries/chatsQueries.pgsql`.

`chats` branch





