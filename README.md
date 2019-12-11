# Vue Forum App — Backend

A fullstack application built with Vue on the frontend and Node/Express on the backend.

### [Demo](https://vue-forum-app.herokuapp.com/)&nbsp;&nbsp;&nbsp;&nbsp;[Frontend](https://github.com/TahaSh/vue-forum-app)

This repo contains the backend server for serving the [svelte news app](https://github.com/TahaSh/vue-forum-app).

# Running it

1. Download this repo
2. Create `.env` in the root directory and add:
```
DATABASE=<your-mongodb-connection-string>
PORT=5000
SERVER_URL=http://localhost:5000
```
Set `SERVER_URL` to the base URL that this project runs on.

3. Run `npm install`
4. Run `npm run dev` (or `npm run start` for production mode)