# Codacity

[Codacity](https://codacity.netlify.com) is a single page flashcard application that supports markdown notation and syntax highlighting. It's built with React on front
end and Node.js on back end. The React app sends HTTP request to the back-end API
service. The back-end sends JSON object back.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and hosted on [Netlify](https://www.netlify.com/).

## Getting Started

These instructions will get you a copy of the project up and running on your local
machine for development and testing purposes. See deployment for notes on how to
deploy the project on a live system.

### Prerequisites

Download the back end API for this project [here](https://github.com/ChloeLiang/codacity-api).

Install [Node.js](https://nodejs.org/en/) (version 8.10.0 or later).

Install MongoDB using Homebrew.

```bash
# Install Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Install MongoDB
brew install mongodb
```

Create a directory for MongoDB to store its data and make sure this directory has the right permission.

```bash
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db
```

### Installing

#### Back End

Start MongoDB:

```bash
mongod
```

Install all the dependencies:

```bash
cd codacity-api
npm install
```

Start the back end server at localhost:3900.

```bash
cd codacity-api
npm start
```

#### Front End

Install all the dependencies:

```bash
cd codacity
npm install
```

Run the React app in the development mode.

```bash
cd codacity
npm start
```

## Deployment

These instructions will get the back-end API up and running on Heroku and front-end
React app up and running on Netlify.

### Host Database on mLab

Create a new database.

- Sing up an [mLab account](https://mlab.com/) and sign in to your dashboard.
- Click **+ Create new** to create a new database.
- Choose any Cloud Provider and select the free **SANDBOX** for Plan Type.
- Choose a preferred region.
- Give your database a name. For example: codacity.
- Continue and submit order.

Create a user for this database.

- Inside the database you just created, click **Users** tab.
- Click **Add database user** and specify database username and password.

At the database page, there's a MongoDB URI available on the top. We'll set Heroku's
MONGODB_URI environment variable to this value later. It looks like:

```bash
mongodb://<dbuser>:<dbpassword>@ds123456.mlab.com:33212/codacity
```

### Setup Heroku

Make sure you have an account with [Heroku](https://www.heroku.com/) and have installed
the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli). Choose a region.

Login with Heroku credentials:

```bash
$ heroku login
Enter your Heroku credentials.
Email: adam@example.com
Password (typing will be hidden):
Authentication successful.
```

### Deploy Back End

Create a Heroku app via the command line:

```bash
cd codacity-api
heroku create
```

Set the MONGODB_URI variable to your mLab database URI. Replace `<dbuser>` and
`<dbpassword>` with your database's user and password. For exmaple:

```bash
heroku config:set MONGODB_URI=mongodb://<dbuser>:<dbpassword>@ds123456.mlab.com:33212/codacity
```

Add, and commit all your data to git. Then push it to Heroku:

```bash
git push heroku master
```

### Deploy Front End

Create another Heroku app for front end.

```bash
cd codacity
heroku create
```

Add, and commit all your data to git. Then push it to Heroku:

```bash
git push heroku master
```

Open your app in browser:

```bash
heroku open
```

## Contributing

When contributing to this repository, please first discuss the change you wish to
make via issue, email, or any other method with the owners of this repository
before making a change.
