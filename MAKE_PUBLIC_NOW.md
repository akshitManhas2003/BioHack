# 🚀 Make Your App Public - Right Now (5 Minutes)

## **FASTEST WAY: Using ngrok**

### **What You'll Get:**
```
✅ Public URL (works worldwide)
✅ No code changes needed
✅ Free to use
✅ Takes 5 minutes
```

---

## **Step-by-Step Instructions**

### **Step 1: Install ngrok** (2 minutes)

**Option A: Download**
- Go to https://ngrok.com/download
- Download for Windows
- Extract the file

**Option B: Using Chocolatey** (easier)
```powershell
choco install ngrok
```

---

### **Step 2: Create ngrok Account** (1 minute)

1. Go to https://ngrok.com
2. Click "Sign Up" (free)
3. Create account with email
4. Verify email
5. Copy your **Auth Token**

---

### **Step 3: Configure ngrok** (1 minute)

Open **PowerShell** and run:

```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

Replace `YOUR_AUTH_TOKEN_HERE` with the token from ngrok dashboard.

---

### **Step 4: Make Backend Public** (1 minute)

Open a **new terminal** and run:

```powershell
cd C:\Desktop\Hackathon\one-health-surveillance
ngrok http 8000
```

**You'll see:**
```
Forwarding                    https://abcd-1234-5678.ngrok.io -> http://localhost:8000
```

✅ **Copy this URL:** `https://abcd-1234-5678.ngrok.io`

---

### **Step 5: Update Frontend Configuration**

Edit this file:
```
C:\Desktop\Hackathon\one-health-surveillance\frontend\.env
```

Change:
```
VITE_API_URL=http://localhost:8000
```

To:
```
VITE_API_URL=https://abcd-1234-5678.ngrok.io
```

(Replace with YOUR ngrok URL)

---

### **Step 6: Restart Frontend**

Stop frontend (Ctrl+C) and restart:

```powershell
cd C:\Desktop\Hackathon\one-health-surveillance\frontend
npm run dev
```

Wait for it to start on `http://localhost:5173`

---

## **✅ You're Done! Your App is Public!**

### **Share These Links:**

```
🌐 Frontend: http://localhost:5173
🌍 Public Backend: https://your-ngrok-url.ngrok.io
📊 API Docs: https://your-ngrok-url.ngrok.io/docs
```

---

## **Test It Works**

1. Open `http://localhost:5173` in browser
2. Go to Dashboard
3. See all charts loading with data ✅
4. Submit data or view alerts ✅

---

## **Share With Others**

You can share with team members:
```
1. Your backend is at: https://your-ngrok-url.ngrok.io
2. API docs at: https://your-ngrok-url.ngrok.io/docs
3. They can access from anywhere in the world!
```

---

## **Common Issues**

### **Issue: "Invocation Failed: Forward refused"**
- ✅ Make sure backend is running on port 8000
- ✅ Restart ngrok

### **Issue: "Auth token not accepted"**
- ✅ Double-check token from ngrok dashboard
- ✅ Try copying again
- ✅ Logout/login on ngrok website

### **Issue: "CORS error in frontend"**
- ✅ Check `.env` file has exact ngrok URL
- ✅ Hard refresh browser (Ctrl+Shift+R)
- ✅ Check backend logs

### **Issue: "Connection timeout"**
- ✅ ngrok URL expires after 2 hours idle
- ✅ Restart ngrok to get new URL
- ✅ Update `.env` with new URL

---

## **One-Command Setup**

Already installed ngrok? Just run:

```powershell
# Terminal 1: Backend public
ngrok http 8000

# Terminal 2: Frontend
cd frontend; npm run dev

# Copy ngrok URL and add to .env
```

---

## **Next Steps for Production**

After testing with ngrok:

1. **Deploy backend to Render** (free)
   - Go to render.com
   - Connect GitHub
   - Select repo and deploy

2. **Deploy frontend to Vercel** (free)
   - Go to vercel.com
   - Import GitHub repo
   - Deploy

3. **Update `.env`** with production URLs

4. **Get custom domain** (optional)

See `PUBLIC_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## **Summary**

| What | Where | Status |
|-----|-------|--------|
| Your Data | SQLite DB | ✅ Running locally |
| Backend | Port 8000 | ✅ Running |
| Frontend | Port 5173 | ✅ Running |
| Public URL | ngrok | ✅ PUBLIC NOW! |

---

**Your app is now publicly accessible! 🎉**

Go to http://localhost:5173 and start using it!

For feedback or to share: **Use your ngrok URL!**
