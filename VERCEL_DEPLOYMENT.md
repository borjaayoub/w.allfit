# Step-by-Step Guide: Deploy Frontend to Vercel

This guide will walk you through deploying your React + Vite frontend to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
- Your frontend code ready in a Git repository (GitHub, GitLab, or Bitbucket)
- Your backend API URL (where your backend is deployed)

---

## Step 1: Prepare Your Frontend for Deployment

### 1.1 Ensure Build Script Works Locally

First, test that your build works locally:

```bash
cd frontend
npm install
npm run build
```

This should create a `dist` folder with your built files. If this fails, fix any errors before proceeding.

### 1.2 (Optional) Create a `.vercelignore` file

Create `frontend/.vercelignore` to exclude unnecessary files:

```
node_modules
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## Step 2: Push Your Code to Git

Make sure your code is committed and pushed to a Git repository:

```bash
# If not already initialized
git init
git add .
git commit -m "Prepare for Vercel deployment"

# Push to your repository (GitHub, GitLab, or Bitbucket)
git remote add origin <your-repository-url>
git push -u origin main
```

---

## Step 3: Deploy via Vercel Dashboard (Recommended for First Time)

### 3.1 Sign In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with GitHub, GitLab, or Bitbucket (recommended for easy integration)

### 3.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Import your Git repository
3. Select the repository containing your frontend code

### 3.3 Configure Project Settings

Vercel will auto-detect your framework. Configure these settings:

**Framework Preset:** `Vite` (should be auto-detected)

**Root Directory:** `frontend`
- Click **"Edit"** next to Root Directory
- Set it to `frontend` (since your frontend is in a subdirectory)

**Build Command:** `npm run build` (should be auto-detected)

**Output Directory:** `dist` (should be auto-detected)

**Install Command:** `npm install` (should be auto-detected)

### 3.4 Set Environment Variables

**IMPORTANT:** Set your backend API URL:

1. Expand **"Environment Variables"** section
2. Click **"Add"** and add:
   - **Name:** `VITE_API_URL`
   - **Value:** Your backend API URL (e.g., `https://your-backend.herokuapp.com` or `https://api.yourdomain.com`)
   - **Environments:** Select all (Production, Preview, Development)

**Note:** Replace `http://localhost:5000` with your actual deployed backend URL.

### 3.5 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-3 minutes)
3. Once deployed, you'll get a URL like `https://your-project.vercel.app`

---

## Step 4: Deploy via Vercel CLI (Alternative Method)

### 4.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 4.2 Login to Vercel

```bash
vercel login
```

### 4.3 Navigate to Frontend Directory

```bash
cd frontend
```

### 4.4 Deploy

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) or Yes (if redeploying)
- **Project name?** → Enter a name or press Enter for default
- **Directory?** → `./` (current directory)
- **Override settings?** → No (unless you need to change something)

### 4.5 Set Environment Variables via CLI

```bash
vercel env add VITE_API_URL
```

Enter your backend API URL when prompted, and select all environments.

### 4.6 Deploy to Production

```bash
vercel --prod
```

---

## Step 5: Configure Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Step 6: Verify Deployment

1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. Test key features:
   - Login/Register functionality
   - API calls to your backend
   - Navigation between pages
   - Check browser console for any errors

---

## Step 7: Set Up Automatic Deployments

Vercel automatically deploys when you push to your Git repository:

- **Production:** Deploys from your main/master branch
- **Preview:** Creates preview deployments for every push to other branches and pull requests

No additional configuration needed! 🎉

---

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify `npm run build` works locally

### API Calls Fail

- Verify `VITE_API_URL` environment variable is set correctly
- Check that your backend CORS settings allow requests from your Vercel domain
- Ensure backend is deployed and accessible

### 404 Errors on Page Refresh

If you're using React Router, add a `vercel.json` file in your `frontend` directory:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Environment Variables Not Working

- Make sure variable names start with `VITE_` (required for Vite)
- Redeploy after adding/changing environment variables
- Check that variables are set for the correct environment (Production/Preview)

---

## Quick Reference Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy (production)
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

---

## Next Steps

- Set up environment variables for different environments (staging, production)
- Configure preview deployments for pull requests
- Set up analytics and monitoring
- Configure CORS on your backend to allow your Vercel domain

---

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

