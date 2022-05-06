# Bank Management Portal
A website for managing banks, bank accounts, customers, and employees.

## About
This portal servers as a front-end for managing an underlying database of corporations, banks, accounts, and users.

Here are a few of the features:

### Login Page
![Admin Login](/assets/admin_login.png)

### Admin Menu
![Admin Menu](/assets/admin_menu.png)

### View Bank Stats
![Admin Login](/assets/bank_stats.png)

### Create Fee
![Create Fee](/assets/create_fee.png)

### Customer Menu
![Create Fee](/assets/customer_menu.png)

## Technology Stack
* Node.js w/express.js - For server backend and SQL integration
* MySQL - For database service/handler
* Bootstrap - For CSS and HTML

## Install Instructions
* You must have the correct "Create Database" and "Shell Procedure" SQL files in order for the site to function properly.
* Install Node.js from [here](https://nodejs.org/en/download/)
* Run `npm install`
* Update the SQL database information accordingly in `server.js`

```javascript
connection = mysql.createConnection({
  host: "localhost",
  user: "<YOUR_USERNAME_HERE>",
  password: "<YOUR_PASSWORD_HERE>",
  database: "bank_management",
});
```

* Run `node server.js`
* Navigate to `localhost:3000` in a web browser