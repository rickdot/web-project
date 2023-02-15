# Project 2 documentation

## Application description
This is an application for users to ask and answer questions. It has following functionalities:

### Register and login
This app provides user register and login functionalities, only logined users can ask and answer questions. When registering, an email and password are required, and the password should be at least 4 characters. When logging in, enter the correct email and password, then the user will be redirected to path '/questions'.

### View and create questions
Users can create their own questions and set answer options for them. After creating a question, clicking the title will lead the user to the question specific page.
A question can have arbitrary number of correct and wrong answer options, even 0!
If the user want to delete a question, he should delete all answer options of that question first.

### Quiz (Answering questions)
Users can click "Answer questions" to do random quizs. Every time the user will be shown a random question, which could be created by any user. After the user choose an option, he will be shown the results.

### Statistics
The statistics functionality allow users to view the statistics of their own questions and answers, as well as a rank for top 5 users with most correct answers.

### API 
The app also provide API. GET request made to path **/api/questions/random** return a random question as JSON document. POST request made to path **/api/questions/** with a JSON document that contains the answer info will return a correctness value as a JSON document.

### Additional features
1. By clicking the "log out" button on the main page, a user will be logged out.
2. On "Statistics" page, the user can view all his history answers details by clicking the "See your answers" button

## Testing the application locally

 Create a database (ElephantSQL recommended).

Instructions for ElephantSQL could be found at https://www.elephantsql.com/docs/index.html

To create the database, execute following SQL commands 

~~~sql
CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(255) UNIQUE,
password CHAR(60)
);

CREATE TABLE questions (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
title VARCHAR(256) NOT NULL,
question_text TEXT NOT NULL
);

CREATE TABLE question_answer_options (
id SERIAL PRIMARY KEY,
question_id INTEGER REFERENCES questions(id),
option_text TEXT NOT NULL,
is_correct BOOLEAN DEFAULT false
);

CREATE TABLE question_answers (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
question_id INTEGER REFERENCES questions(id),
question_answer_option_id INTEGER REFERENCES question_answer_options(id),
correct BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX ON users((lower(email)));
~~~

Modify the database configurations in the ./database/database.js file.
   
If you use ElephantSQL, the database credentials could be found at 'Details' tab of the instance page, then use the credentials to replace the corresponding attributes of the connectionPool object in database.js file. The connectionPool object should be the following form:

~~~js
const connectionPool = new Pool({
hostname: "hostname-possibly-at-elephantsql.com",
database: "database-name",
user: "user-name-typically-same-as-database-name",
password: "password",
port: 5432,
}, CONCURRENT_CONNECTIONS);
~~~
where 
~~~
hostname -> Server (on Details page)
database -> User & Default database
user -> User & Default database
password -> Password
port -> 5432 by default
~~~

Execute the following command in the terminal, the current path should be the folder where the app.js is located. Then the application will be running.
   
~~~cmd
deno run --allow-all --unstable --watch run-locally.js
~~~
   
Access http://localhost:7777/ using browser to test the application.

## Automated test
The app_test.js file that located in the tests folder can be used for automated testing. It utilized SuperOak to run 10 meaningful tests.
To perform the automated test with this file, **you should create 4 empty tables** in the database, and then modify the database configurations in database.js file(Instructions could be found above). The test was designed based on starting with 4 empty tables.

Just execute following command in the terminal, you will see the result with 10 passed tests.

~~~cmd
deno test --allow-all --unstable .\test\app_test.js
~~~

## Online deployment for testing
The application has been deployed on Heroku platform, and it is available at the follwing address: **https://project2-996716.herokuapp.com/**. The deployment followed the instructions on https://wsd.cs.aalto.fi/7-working-with-databases/7-deployment/. The database used by this online deployment is ElephantSQL.


Any confusion, please contact rickzen9x@gmail.com.