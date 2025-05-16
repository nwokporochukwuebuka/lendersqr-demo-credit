# LENDSQR TASK

Demo Credit is a mobile lending app that requires wallet functionality. This is needed as borrowers need a wallet to receive the loans they have been granted and also send the money for repayments.

You are required to build an MVP (Minimum viable product) wallet service where:

- A user can create an account
- A user can fund their account
- A user can transfer funds to another user’s account
- A user can withdraw funds from their account.
- A user with records in the Lendsqr Adjutor Karma blacklist should never be onboarded

---

### DEMO CREDIT API

[Live URL](https://nwokporo-chukwuebuka-lendsqr-be-test.onrender.com)

Here is the Entity Relationship Diagram - ERD for the demo credit task
![ERD](https://github.com/nwokporochukwuebuka/lendersqr-demo-credit/blob/main/erd.png?raw=true)

---

Here is the link to the [POSTMAN Docs](https://documenter.getpostman.com/view/20124288/2sB2jAa85T)

---

Here is the link to the [Explanation docs](https://docs.google.com/document/d/1Maacb4XwB1f5gwyt7zPJfLs7V5B7vJv9Jxy403LnzUs/edit?usp=sharing)

## Assessment Set Up Instructions

Before setting up this assessment, make sure you have the following installed on your system:

- Node.js(LTS)
- npm
- MySQL

**Setting up this assessment locally can be done by following the steps below:**

1. Navigate to the directory where you want to clone the repo 1️⃣
   ```bash
   cd /path/to/your/directory
   ```
2. Clone the repo 2️⃣
   ```bash
   git clone https://github.com/nwokporochukwuebuka/lendersqr-demo-credit.git
   ```
3. Navigate into the project directory 3️⃣
   ```bash
   cd lendersqr-demo-credit
   ```
4. Install all the dependencies 4️⃣
   ```bash
   npm install
   ```
5. Set up the database 5️⃣
   There are 2 ways you can go about this locally, you can either use docker or use the MySQL Server.

   - If you are using docker here is a command to start a MySQl instance

   ```bash
   docker run --name db-name \
   -e MYSQL_ROOT_PASSWORD=mysql-root-password \
   -e MYSQL_USER=db-username \
   -e MYSQL_PASSWORD=db-password \
   -e MYSQL_DATABASE=db-name \
   -p 3306:3306 \
   -d mysql:latest
   ```

   - Or login to your MySQL server and run the following command to create a user and database and assignn the database privileges to the user.
     Login to the MySQL server using this command

   ```bash
   sudo mysql -u root -p
   ```

   Enter the password and then run the following SQL commands :

   ```sql
   -- Create a new database
    CREATE DATABASE demo_credit_db;

   -- Create a user
   CREATE USER 'db_user'@'localhost' IDENTIFIED BY '<password>';

   --- Grant all privileges on the database to the user
   GRANT ALL PRIVILEGES ON demo_credit_db.* TO 'db_user'@'localhost';

   --- Apply the privilege changes
   FLUSH PRIVILEGES;

   exit;
   ```

6. Create the `.env` file: Since we have a `.env.example, let's copy it and make the backend 6️⃣

   ```bash
    cp .env.example .env
   ```

7. Run DB migrations 7️⃣

   ```bash
   npm run migrate:up
   ```

8. To start the app for in `development` environment, use this command 8️⃣

   ```bash
   npm  run  dev
   ```

9. If you want to seed the database with initial data, run the following command: 9️⃣

   ```bash
   npm run seed
   ```

10. To run test, use the command: 🔟
    ```bash
    npm run test
    ```

Congrats 🎉
