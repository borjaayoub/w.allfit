# Complete Deployment Guide: Frontend (Vercel) + Backend & Database (Railway)

This is a quick reference guide for deploying your full-stack application.

## Quick Start

1. **Deploy Database & Backend on Railway** → See `RAILWAY_DEPLOYMENT.md`
2. **Deploy Frontend on Vercel** → See `VERCEL_DEPLOYMENT.md`
3. **Connect them together** → Follow steps below

---

## Deployment Order

### Step 1: Deploy PostgreSQL Database on Railway
- Create Railway project
- Add PostgreSQL service
- Copy `DATABASE_URL`

### Step 2: Deploy Backend on Railway
- Add backend service from GitHub
- Set Root Directory: `backend`
- Set environment variables:
  - `DATABASE_URL` (from PostgreSQL service)
  - `JWT_SECRET` (generate a strong secret)
  - `FRONTEND_URL` (your Vercel URL - set after frontend is deployed)
- Generate public domain
- Run database migrations

### Step 3: Deploy Frontend on Vercel
- Import GitHub repository
- Set Root Directory: `frontend`
- Set environment variable:
  - `VITE_API_URL` (your Railway backend URL)
- Deploy

### Step 4: Connect Frontend to Backend
- Update Railway backend `FRONTEND_URL` with your Vercel domain
- Redeploy backend (or it will auto-update)
- Test the connection

---

## Environment Variables Summary

### Railway Backend Service
```
DATABASE_URL=<from-postgresql-service>
JWT_SECRET=<generate-strong-secret>
FRONTEND_URL=https://your-frontend.vercel.app
PORT=<auto-set-by-railway>
```

### Vercel Frontend Service
```
VITE_API_URL=https://your-backend.up.railway.app
```

---

## Testing Your Deployment

1. **Test Backend Health:**
   ```
   https://your-backend.up.railway.app/api/health
   ```

2. **Test Frontend:**
   ```
   https://your-frontend.vercel.app
   ```

3. **Test Connection:**
   - Open frontend in browser
   - Open DevTools → Console
   - Try logging in
   - Check Network tab for API calls

---

## Common Issues & Solutions

### Issue: CORS Errors
**Solution:** 
- Ensure `FRONTEND_URL` is set in Railway backend
- Verify it matches your Vercel domain exactly
- Check backend logs for CORS errors

### Issue: Database Connection Fails
**Solution:**
- Verify `DATABASE_URL` is correctly set in Railway backend
- Check PostgreSQL service is running
- Review backend deployment logs

### Issue: API Calls Return 404
**Solution:**
- Verify `VITE_API_URL` is set correctly in Vercel
- Ensure backend URL doesn't have trailing slash
- Check backend routes are correct

### Issue: Migrations Run on Every Deploy
**Solution:**
- Make migrations idempotent (use `IF NOT EXISTS`)
- Or use a migration tracking system
- Or only run setup on first deploy

---

## Cost Estimate

**Railway:**
- PostgreSQL: ~$5/month
- Backend Service: ~$5/month
- Free tier: $5 credit/month
- **Total after free credit: ~$5/month**

**Vercel:**
- Free tier: Unlimited for personal projects
- **Total: $0/month**

**Grand Total: ~$5/month** (after Railway free credit)

---

## Useful Links

- [Railway Dashboard](https://railway.app)
- [Vercel Dashboard](https://vercel.com)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)

---

## Next Steps After Deployment

- [ ] Set up custom domains
- [ ] Configure SSL certificates (automatic on both platforms)
- [ ] Set up monitoring and error tracking
- [ ] Configure database backups
- [ ] Set up staging environment
- [ ] Add CI/CD workflows
- [ ] Set up analytics

