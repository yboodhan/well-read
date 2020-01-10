# Express Auth - With OAuth

This is some boilerplate code for projects. This is a bare bones node/express app with local user authentication, Facebook OAuth, and Google OAuth. It exists so that *I don't have to start from scratch on my projects*.

## What it includes

* OAuth for Facebook and Google
* Passport and passport-local for authentication
* Sequelize user model / migration
* Settings for PostgreSQL
* Sessions to keep user logged in between pages
* Flash messages for errors and successes
* Passwords that are hashed with BCrypt
* EJS Templating and EJS Layouts

### User Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |
| firstname | String | Must be provided |
| lastname | String | - |
| username | String | - |
| email | String | Must be unique / used for login |
| password | String | Stored as a hash |
| photoUrl | String | Profile Picture |
| admin | Boolean | Defaults to false |
| bio | Text | - |
| birthday | Date | - |
| facebookId | String | - |
| facebookToken | String | - |
| googleId | String | - |
| googleToken | String | - |

### Default Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | / | index.js | Home page |
| GET | * | index.js | Render error/404 page |
| GET | /auth/login | auth.js | Login form |
| GET | /auth/signup | auth.js | Signup form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates User |
| GET | /auth/logout | auth.js | Removes session info |
| GET | /profile | profile.js | Regular User Profile |
| GET | /profile/admin | profile.js | Admin User Profile |
| GET | /profile/repos | profile.js | Grabs user's GH repos |

## Steps To Use

#### 1. Clone this repo, but with a different name

```
git clone <repo_link> <new_name>
```

#### 2. Install node modules from the package.json

```
npm install
```

(Or just `npm i` for short)

#### 3. Customize with new project name

Remove defaulty type stuff. Some areas to consider are:

* Title in `layout.ejs`
* Logo in NavBar
* Description/Repo Link in `package.json`
* Remove boilerplate's README content and replace with new project's readme

#### 4. Create a new database for the new project

```
createdb <new_db_name>
```

#### 5. Update `config.json`

* Change the database name
* Other settings are likely okay, but check username, password, and dialect

#### 6. Check the models and migrations for relevance to your project's needs

For example, if your project doesn't require a birthdate field, then don't keep that in there. 

> Delete from both the model and the migration.

#### 7. Run the migrations

```
sequelize db:migrate
```

#### 8. Add a `.env` file with the following fields:

* SESSION_SECRET: Can be any random string; usually a hash in production
* BASE_URL
* FACEBOOK_CLIENT_ID
* FACEBOOK_SECRET
* GOOGLE_CLIENT_ID
* GOOGLE_SECRET

> Note: Create NEW apps on Facebook and Google for new projects

> Note: If NOT using OAuth for Facebook and/or Google, switch to the directions on the `master` branch for local auth ONLY.

#### 9. Run server; make sure it works

```
nodemon
```

or

```
node index.js
```

#### 10. Create a NEW repository on Github for the new project to live

* Create a new repository on your personal Github account (via the GUI)
* Delete the old remote to origin (`git remote remove origin`)
* Add the new repo link as a remote location you can push to (`git remote add origin <new_link>`)
* Add, Commit, and Push
    * `git add -A`
    * `git commit -m "Initial commit"`
    * `git push origin master`



> Note: Don't make commits from the new project to your auth boilerplate. Keep it PRISTINE for other future projects!



