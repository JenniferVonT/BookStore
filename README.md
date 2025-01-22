# book_lending
A 3-tiered web application where a user can lend books (not connected to any booking system). Created using JS, NodeJS, EJS and express for the front- and back- end. MySQL for the DB.

This is an assignment in the course 1DV503 Database technology at the Linnaeus University in Sweden.

## Assignment description

This is a web application that is run on the backend, rendering the front-end from the backend through routing. It should be built using NodeJS and a frontend framework (I'm using EJS). The main focus on the assignment is not the frontend though, but the backend, in particular the database and working with SQL through a DBMS, my database will be built using a MySQL DB.

A user should be able to sign up, login/logout, browse books and subsequently "lend" the books onto their account.

| Tech | Use area |
|------|----------|
| JavaScript | Programming language |
| NodeJS | Main application framework |
| Express | Server base |
| EJS | Frontend framework |
| MySQL | DataBase |

## Tasks

- Create schemas for the DB according to the given relational model and populate the DB with the provided SQL file.

- Start building the base for the express server using routing.

- Implement basic reg, login and logout features (session cookies?)

- Implement browsing books by subject.

- Implement searching books by Author/Title

- Implement a check out system for the books.

- Implement a way to quit the application. (The code should not crash during wrong user input but should instead show a message or do nothing)