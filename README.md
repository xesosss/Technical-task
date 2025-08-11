# Instruction for install Technical task project on Windows

## Download necessary Programs

If you do not have Node.js and MySQL, download and install theim here:

- Node.js: https://nodejs.org/en/download
- MySQL: https://dev.mysql.com/downloads/installer

Make sure that Node.js and MySQL are added to your system PATH environment variable so that the commands node and mysql can be run from the command line.

---

## Unzip project

- Open `Technical-task.zip` and unzip the folder into your `Downloads` directory

---

## Install dependencies

1. Open CMD and go to the project folder:

```bash
cd %USERPROFILE%/Downloads/Technical-task
```

2. Install the required packages:

```bash
npm install bcrypt cookie-parser csurf ejs express express-session mysql2
```

## Configure MySQL Database

1. Open CMD amd login to MySQL:

```bash
mysql -u admin -p
```

- Mysql username: admin
- Mysql password: admin

2. Create the database

```sql
CREATE DATABASE users;
EXIT;
```

3. Import the backup database

```bash
cd %USERPROFILE%/Downloads/Technical-task
mysql -u admin -p users < users_backup.sql
```

## Start Server

Run the project:

```bash
node index.js
```

Open browser and enter http://localhost:3000/ in url

## Account for authorization on Web-panel:

- username: admin1 password: password123
- username: admin2 password: securePass456
