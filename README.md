# blueurl
Just another URL Shortner

## Examples

| Redirects | Shorturl | urlCode |
| --------- | -------- | -------- |
| Codeforces Ratings System | https://blueurl.vercel.app/cf-ratings | `cf-ratings` |
| Interstellar (Main Theme) - Spotify | https://blueurl.vercel.app/interstellar | `interstellar` |
| My Github Profile | https://blueurl.vercel.app/adi.me | `adi.me` |
| This repo | https://blueurl.vercel.app/blu | `blu` |

- ℹ️ For stats about the shortened url add `/api/stats/` before the urlCode.

## Live API
- Visit : [`https://blueurl.vercel.app/`](https://blueurl.vercel.app/)
- [View Docs](https://blueurl.vercel.app/api-docs)


## Screenshots
![Image 1](screenshots/image.png)


## Running the Locally

Follow these steps to set up and run the project:

### 1. Clone the Repository

```bash
git clone https://github.com/AdityaBavadekar/blueurl
```

### 2. Navigate to the Backend Directory

```bash
cd blueurl/backend
```

### 3. Install Dependencies

```bash
npm i
```

### 4. Set Up Environment Variables

A `.env.sample` file is provided as a template. Create a `.env` file in the backend directory by copying that sample file, and add Mongo DB connection string.

### 5. Start the Server

Run the following command to start the server:

```bash
npm run dev
```

View the Application: http://localhost:5080