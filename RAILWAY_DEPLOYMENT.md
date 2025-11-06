# Step-by-Step Guide: Deploy Backend & Database on Railway

This guide will walk you through deploying your Express.js backend and PostgreSQL database on Railway, then connecting it with your Vercel frontend.

## Prerequisites

- A Railway account (sign up at [railway.app](https://railway.app) if you don't have one)
- Your backend code ready in a Git repository (GitHub, GitLab, or Bitbucket)
- A credit card (Railway offers $5 free credit, then pay-as-you-go)

---

## Part 1: Deploy PostgreSQL Database on Railway

### Step 1.1: Create a New Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Empty Project"** or **"Deploy from GitHub repo"** (if you want to link your repo)

### Step 1.2: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically provision a PostgreSQL database
4. Wait for the database to be provisioned (usually 1-2 minutes)

### Step 1.3: Get Database Connection String

1. Click on the PostgreSQL service you just created
2. Go to the **"Variables"** tab
3. You'll see `DATABASE_URL` automatically created
4. **Copy this value** - you'll need it for your backend service

**Note:** The `DATABASE_URL` format is: `postgresql://postgres:PASSWORD@HOST:PORT/railway`

---

## Part 2: Deploy Backend on Railway

### Step 2.1: Add Backend Service

1. In your Railway project dashboard, click **"+ New"**
2. Select **"GitHub Repo"** (recommended) or **"Empty Service"**
3. If using GitHub:
   - Select your repository
   - Railway will auto-detect it's a Node.js project
4. If using Empty Service:
   - You'll need to connect your repo later or upload files

### Step 2.2: Configure Service Settings

1. Click on your backend service
2. Go to **"Settings"** tab
3. Configure the following:

**Root Directory:** `backend`
- Set this if your backend is in a subdirectory

**Start Command:** `npm start`
- Should be auto-detected from your `package.json`

**Build Command:** (leave empty or `npm install`)
- Railway runs `npm install` automatically

### Step 2.3: Set Environment Variables

Go to the **"Variables"** tab and add:

1. **`DATABASE_URL`**
   - Click **"New Variable"**
   - Name: `DATABASE_URL`
   - Value: Copy from your PostgreSQL service's `DATABASE_URL` variable
   - Click **"Add"**

2. **`JWT_SECRET`**
   - Click **"New Variable"**
   - Name: `JWT_SECRET`
   - Value: Generate a strong secret (e.g., use `openssl rand -base64 32` or a password generator)
   - Click **"Add"**

3. **`PORT`** (Optional)
   - Railway automatically sets `PORT`, but you can set it explicitly if needed
   - Railway will provide this automatically, so you usually don't need to set it manually

### Step 2.4: Link Database to Backend Service

**Option A: Using Railway's Service Reference (Recommended)**

1. In your backend service's **"Variables"** tab
2. Click **"New Variable"**
3. Click **"Reference"** tab
4. Select your PostgreSQL service
5. Select `DATABASE_URL` from the dropdown
6. Railway will automatically create a reference variable

**Option B: Manual Copy**

1. Copy the `DATABASE_URL` from PostgreSQL service
2. Paste it as `DATABASE_URL` in your backend service variables

### Step 2.5: Run Database Migrations

Railway needs to run your database setup script on the first deployment. You have several options:

**Option A: Run Setup Manually (Recommended for First Deploy)**

1. Deploy your backend first (without running migrations)
2. Once deployed, you have two options to run migrations:

   **Option A1: Using Railway Web Terminal (Easiest)**
   
   1. Go to your backend service in Railway dashboard
   2. Click on the **"Deployments"** tab
   3. Click on your latest deployment
   4. Look for a **"View Logs"** or **"Shell"** button/tab
   5. OR go to your backend service → Click **"Settings"** → Look for **"Shell"** or **"Terminal"** tab
   6. OR click the **"⚡"** (lightning bolt) icon or **"Shell"** button in the top right of your service
   7. A terminal will open - run:
      ```bash
      npm run db:setup
      ```

   **Option A2: Using Railway CLI (For Advanced Users)**
   
   1. Install Railway CLI on your local machine:
      ```bash
      npm install -g @railway/cli
      ```
   2. Login to Railway:
      ```bash
      railway login
      ```
   3. Navigate to your project directory:
      ```bash
      cd backend
      ```
   4. Link to your Railway project:
      ```bash
      railway link
      ```
      (Select your project and service when prompted)
   5. Run the setup command:
      ```bash
      railway run npm run db:setup
      ```

**Option B: Add Setup to Deploy Command (Runs on Every Deploy)**

⚠️ **Warning:** This runs migrations on every deployment. Make sure your migrations are idempotent (use `IF NOT EXISTS`).

1. Go to your backend service **"Settings"** → **"Deploy"**
2. Add a **"Deploy Command"**:
   ```bash
   npm run db:setup && npm start
   ```

**Option C: Create a Deploy Script**

Add to `package.json`:
```json
"scripts": {
  "db:setup": "node ./src/db/setup.js",
  "start": "node src/server.js",
  "deploy": "npm run db:setup && npm start"
}
```
Then set Deploy Command in Railway to: `npm run deploy`

### Step 2.6: Create Railway Configuration (Optional but Recommended)

Create `backend/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run db:setup && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Note:** Railway will run the deploy command on every deployment, which will re-run migrations. You may want to make migrations idempotent or use a different approach for production.

### Step 2.7: Deploy

1. Railway will automatically deploy when you:
   - Push changes to your connected GitHub repository
   - Or manually trigger a deployment from the dashboard
2. Go to **"Deployments"** tab to watch the build logs
3. Wait for deployment to complete (usually 2-5 minutes)

### Step 2.8: Get Your Backend URL

1. Once deployed, go to your backend service
2. Click on **"Settings"** → **"Networking"**
3. Click **"Generate Domain"** to get a public URL
4. Your backend URL will be something like: `https://your-backend.up.railway.app`
5. **Copy this URL** - you'll need it for your Vercel frontend

---

## Part 3: Configure CORS for Vercel Frontend

Your backend needs to allow requests from your Vercel domain. Update `backend/src/app.js`:

```javascript
import express from "express";
import cors from "cors";
// ... other imports

const app = express();

// Configure CORS to allow your Vercel domain
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Use '*' for development, specific URL for production
  credentials: true,
};

app.use(cors(corsOptions));
// ... rest of your code
```

**For Production:**
1. Add `FRONTEND_URL` environment variable in Railway
2. Set it to your Vercel domain: `https://your-frontend.vercel.app`
3. Update CORS configuration to use this variable

**Quick Fix (Current Code Works):**
Your current `app.use(cors())` allows all origins, which works but is less secure. For production, consider restricting to your Vercel domain.

---

## Part 4: Connect Vercel Frontend to Railway Backend

### Step 4.1: Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **"Settings"** → **"Environment Variables"**
3. Update or add `VITE_API_URL`:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Railway backend URL (e.g., `https://your-backend.up.railway.app`)
   - **Environments:** Select all (Production, Preview, Development)
4. Click **"Save"**

### Step 4.2: Redeploy Frontend

1. Go to **"Deployments"** tab in Vercel
2. Click the **"⋯"** menu on your latest deployment
3. Click **"Redeploy"**
4. Or simply push a new commit to trigger automatic deployment

---

## Part 5: Verify Everything Works

### Test Database Connection

1. Check Railway backend logs:
   - Go to your backend service → **"Deployments"** → Click latest deployment → **"View Logs"**
   - Look for: `✓ Database connection successful`

### Test Backend API

1. Visit your Railway backend URL: `https://your-backend.up.railway.app/api/health`
2. You should see a health check response

### Test Frontend Connection

1. Visit your Vercel frontend URL
2. Open browser DevTools → Console
3. Try logging in or making an API call
4. Check Network tab to verify API calls are going to Railway backend

---

## Troubleshooting

### Database Connection Fails

**Symptoms:** `Database connection failed!` in logs

**Solutions:**
- Verify `DATABASE_URL` is set correctly in backend service variables
- Check that PostgreSQL service is running
- Ensure the database URL format is correct
- Try regenerating the database connection string

### Migrations Fail on Every Deploy

**Problem:** Railway runs `db:setup` on every deploy, causing migration errors

**Solutions:**
- Make migrations idempotent (use `IF NOT EXISTS` in SQL)
- Use a migration tool that tracks applied migrations
- Only run setup script on first deploy (use a flag or check if tables exist)

### CORS Errors in Browser

**Symptoms:** `Access-Control-Allow-Origin` errors

**Solutions:**
- Verify `FRONTEND_URL` is set correctly in Railway
- Check that CORS middleware is configured properly
- Ensure your Vercel domain is in the allowed origins list
- Temporarily use `cors()` without options to test (not recommended for production)

### Backend Not Accessible

**Symptoms:** Cannot reach backend URL

**Solutions:**
- Ensure you've generated a public domain in Railway
- Check that the service is deployed and running
- Verify the PORT environment variable is set (Railway sets this automatically)
- Check deployment logs for errors

### Environment Variables Not Working

**Solutions:**
- Ensure variables are set in the correct service
- Redeploy after adding/changing variables
- Check variable names match exactly (case-sensitive)
- Verify variable values don't have extra spaces

---

## Railway Pricing & Limits

- **Free Tier:** $5 credit per month
- **PostgreSQL:** ~$5/month for starter plan
- **Backend Service:** ~$5/month for starter plan
- **Total:** ~$10/month after free credit

**Note:** Railway charges based on usage. Monitor your usage in the dashboard.

---

## Quick Reference: Railway Commands

Railway CLI (optional, for advanced users):

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs

# Open in browser
railway open
```

---

## Production Checklist

- [ ] Database migrations are idempotent
- [ ] CORS is configured for your Vercel domain only
- [ ] `JWT_SECRET` is a strong, random value
- [ ] `DATABASE_URL` is properly set
- [ ] Backend has a public domain
- [ ] Vercel `VITE_API_URL` points to Railway backend
- [ ] Health check endpoint works
- [ ] Test login/register functionality
- [ ] Monitor Railway usage and costs
- [ ] Set up Railway notifications for deployments

---

## Next Steps

1. Set up custom domains for both Railway and Vercel
2. Configure Railway auto-deploy from GitHub
3. Set up monitoring and error tracking
4. Configure database backups
5. Set up staging environment

---

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Status: [status.railway.app](https://status.railway.app)

