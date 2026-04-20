# 🌍 Public Deployment Guide - One Health Surveillance

## Quick Start: ngrok (Instant Public URL)

### ⚡ **Option 1: Instant Public Access (5 minutes)**

#### Step 1: Download ngrok
```powershell
# Download from https://ngrok.com/download
# Or use Chocolatey
choco install ngrok
```

#### Step 2: Create Free Account
1. Go to https://ngrok.com
2. Sign up (free)
3. Copy your **Auth Token** from dashboard

#### Step 3: Configure ngrok
```powershell
# Set your auth token
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE

# Test it
ngrok version
```

#### Step 4: Expose Backend to Internet
```powershell
# In a new terminal, run:
ngrok http 8000
```

You'll see:
```
Forwarding  https://abcd-1234-5678.ngrok.io -> http://localhost:8000
```

Copy this URL ⬆️

#### Step 5: Configure Frontend
Edit `.env` file in frontend folder:
```
# Old
VITE_API_URL=http://localhost:8000

# New - Replace with your ngrok URL
VITE_API_URL=https://abcd-1234-5678.ngrok.io
```

#### Step 6: Restart Frontend
```powershell
cd frontend
npm run dev
```

#### Step 7: Share Your App!
```
Frontend: http://localhost:5173
Public URL: Will be available after npm run dev
```

✅ **Your app is now publicly accessible!**

---

## 🚀 **Option 2: Professional Hosting (Free)**

### **Frontend on Vercel + Backend on Render**

#### Frontend Deployment (Vercel)
```powershell
# 1. Install Vercel CLI
npm i -g vercel

# 2. Go to frontend
cd frontend

# 3. Deploy
vercel
```

**You'll get a URL like:** `https://your-app.vercel.app`

#### Backend Deployment (Render)
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub
4. Select your repository
5. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`
6. Deploy

**You'll get a URL like:** `https://your-backend.onrender.com`

#### Update Frontend Configuration
Edit `frontend/.env`:
```
VITE_API_URL=https://your-backend.onrender.com
```

Redeploy frontend on Vercel ✅

---

## 🐳 **Option 3: Docker + Cloud**

### **Deploy with Docker**

Already has Dockerfile! Just push:

```powershell
# 1. Build images
docker-compose build

# 2. Deploy to:
# - AWS ECS
# - Google Cloud Run
# - Azure Container Instances
# - DigitalOcean App Platform
# - Railway.app (recommended for free tier)
```

---

## 📋 **Deployment Comparison**

| Method | Setup Time | Cost | Best For | URL Format |
|--------|-----------|------|----------|-----------|
| **ngrok** | 5 min | Free | Testing, demos | `https://random.ngrok.io` |
| **Vercel+Render** | 15 min | Free | Production | `https://your-app.vercel.app` |
| **Railway** | 10 min | Free tier | Full stack | `https://your-project.up.railway.app` |
| **Docker + Cloud** | 30 min | Varies | Enterprise | Custom domain |

---

## 🔐 **Security Considerations**

### **Before Making Public:**

1. **Change Default Credentials**
   ```python
   # In seed_data.py - Change usernames/passwords
   ```

2. **Enable CORS Properly**
   ```python
   # In main.py - Set allowed origins
   allow_origins = ["https://your-app.vercel.app"]  # Don't use "*"
   ```

3. **Add Rate Limiting**
   ```python
   # Install: pip install slowapi
   # Prevents abuse
   ```

4. **Use HTTPS** (All platforms above use HTTPS by default)

5. **Add Environment Secrets**
   - Don't commit `.env` file
   - Use platform's secret management
   - Store API keys securely

---

## 📝 **Environment Variables Checklist**

### **Frontend (.env)**
```
VITE_API_URL=https://your-public-backend.com
```

### **Backend (.env)**
```
DATABASE_URL=sqlite:///./one_health_surveillance.db
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://your-frontend.com
```

---

## 🧪 **Testing Public Deployment**

### **Test Your Public URLs**

```bash
# Test backend
curl https://your-backend-url.com/health

# Test frontend
curl https://your-frontend-url.com

# Test API
curl https://your-backend-url.com/api/statistics/summary
```

### **Share & Get Feedback**
- Send links to team members
- Test on mobile devices
- Monitor for errors in browser console

---

## 🆘 **Troubleshooting**

### **Issue: "CORS error"**
- ✅ Update CORS in `main.py`
- ✅ Restart backend
- ✅ Hard refresh frontend (Ctrl+Shift+R)

### **Issue: "Cannot connect to API"**
- ✅ Check `.env` file has correct URL
- ✅ Verify backend is running/deployed
- ✅ Check firewall/network rules

### **Issue: "ngrok URL expired"**
- ✅ ngrok free URLs expire after 2 hours of inactivity
- ✅ Restart ngrok to get new URL
- ✅ Update `.env` with new URL

### **Issue: "Slow performance"**
- ✅ Database query optimization
- ✅ Use CDN for frontend assets
- ✅ Consider upgrading hosting tier

---

## 📞 **Support**

For deployment help:
1. Check platform documentation
2. Review browser console errors (F12)
3. Check backend logs
4. Verify environment variables

---

## 🎯 **Recommended Path**

**For Quick Demo:**
1. Use **ngrok** (5 minutes to public!)
2. Share link with stakeholders

**For Production:**
1. Deploy backend to **Render**
2. Deploy frontend to **Vercel**
3. Connect them via `.env`
4. Add custom domain (optional)

---

## ✅ **Deployment Checklist**

- [ ] Choose deployment method
- [ ] Set up platform account
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Update `.env` with public URLs
- [ ] Test all features
- [ ] Test on mobile
- [ ] Share with team
- [ ] Monitor for errors
- [ ] Celebrate! 🎉

---

**Status: Ready for Public Deployment!**

Your app is production-ready with:
- ✅ Advanced charts
- ✅ Real-time data
- ✅ Error handling
- ✅ Responsive design
- ✅ Mobile support

Go public! 🚀
