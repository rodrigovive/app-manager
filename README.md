# App Manager 

App Manager is a web application for save your tasks (completed / or not).

# Demo
👉 Check it <a href="http://app-manager-node.herokuapp.com/">here</a>.
<br>


## Installation

### For developers
Clone the source locally:

```sh
$ git clone https://github.com/rodrigovive/app-manager
$ cd app-manager
```
Install project dependencies:

```sh
$ npm install
```

#### Config

1. Create a file called `dev.env` inside `/src/config`:

   ```
   PORT=
   SECRET_JWT=
   SENDGRID_API_KEY=
   MONGO_URI=
   ```


## Usage

Start the app:

```sh
$ npm start
```

Test the app:

```sh
$ npm test
```