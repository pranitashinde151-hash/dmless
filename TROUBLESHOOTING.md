# 🔧 Troubleshooting Guide - Vite + Express Integration

## Common Issues & Solutions

### 1. **npm install fails with "jsonwebtoken not found"**

**Error**: `npm error notarget No matching version found for jsonwebtoken@^9.1.2`

**Solution**:
```bash
# The ^9.1.2 version doesn't exist. Use 9.0.0 instead
npm install jsonwebtoken@9.0.0
```
✅ This has already been fixed in package.json

---

### 2. **Backend server won't start**

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Reason**: MongoDB connection failed

**Solutions**:
1. **Check MongoDB URL** in `.env.local`
   ```bash
   cat .env.local | grep MONGO_URL
   ```
   
2. **For local MongoDB**:
   ```bash
   # Start MongoDB service (if not running)
   # On macOS: brew services start mongodb-community
   # On Ubuntu: sudo systemctl start mongod
   # On Windows: net start MongoDB
   ```

3. **For cloud MongoDB (Vercel)**:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dmless?retryWrites=true&w=majority
   ```

---

### 3. **Vite dev server fails to start**

**Error**: `Error: listen EADDRINUSE :::5173`

**Reason**: Port 5173 already in use

**Solutions**:
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 5174
```

---

### 4. **Backend server on port 5000 already in use**

**Error**: `Error: listen EADDRINUSE :::5000`

**Reason**: Port 5000 already in use

**Solutions**:
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port by setting environment variable
PORT=3000 npm run dev:backend

# Or in .env.local
PORT=3000
```

---

### 5. **API calls fail with 404 "Cannot POST /api/register"**

**Error**: `POST http://localhost:5173/api/register 404`

**Reason**: Backend not running or proxy not working

**Solutions**:
1. **Verify backend is running**:
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"OK","timestamp":"..."}
   ```

2. **Check Vite proxy config** in `vite.config.js`:
   ```javascript
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:5000',
         changeOrigin: true,
       }
     }
   }
   ```

3. **Restart both servers**:
   ```bash
   npm run dev
   ```

---

### 6. **"Cannot find module './api/register.js'"**

**Error**: `Error: Cannot find module './api/register.js'`

**Reason**: API files not in correct location

**Solution**:
```bash
# Verify files exist
ls -la server/api/

# Should show:
# _db.js, register.js, login.js, createJob.js, etc.
```

---

### 7. **CORS errors in browser console**

**Error**: `Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Reason**: Proxy not working or backend CORS not enabled

**Solutions**:
1. **Check Vite is running with proxy**:
   ```bash
   npm run dev:frontend
   # Should show: "VITE v5.4.21  ready in XXX ms"
   ```

2. **For direct backend requests, enable CORS**:
   ```bash
   # This should already be in server/server.js
   app.use(cors());
   ```

---

### 8. **"Module not found: Can't resolve '@'"**

**Error**: `Module not found: Can't resolve '@' in '../'`

**Reason**: Vite alias not working

**Solution**:
```javascript
// In vite.config.js, verify:
resolve: {
  alias: {
    '@': fileURLToPath(new URL('.', import.meta.url)),
  },
}
```

---

### 9. **HTML shows blank page**

**Error**: Page loads but nothing renders

**Reason**: JavaScript not loading or error in app.js

**Solutions**:
1. **Check browser console** (F12 → Console tab)
   - Look for red errors
   
2. **Verify app.js is loading**:
   ```bash
   curl http://localhost:5173/js/app.js | head -5
   ```

3. **Check script path** in `src/index.html`:
   ```html
   <script src="/js/app.js" type="module"></script>
   ```

---

### 10. **"Unexpected token 'export'"**

**Error**: `SyntaxError: Unexpected token 'export'`

**Reason**: Node.js trying to run ES modules without proper config

**Solution**:
1. **Check package.json** has:
   ```json
   "type": "module"
   ```

2. **Files should use .js extension**:
   ```javascript
   // ✅ Correct
   import handler from './api/register.js';
   
   // ❌ Wrong
   import handler from './api/register';
   ```

---

### 11. **"Cannot read property 'email' of undefined"**

**Error**: Runtime error when submitting form

**Reason**: API response structure mismatch

**Solutions**:
1. **Check API response format** in server logs:
   ```bash
   # Look at server output when request is made
   npm run dev:backend
   ```

2. **Verify database has collections**:
   ```javascript
   // In MongoDB:
   db.recruiters.find()
   db.jobs.find()
   db.candidates.find()
   ```

---

### 12. **JWT token not being saved**

**Error**: After login, localStorage doesn't have token

**Reason**: Store key mismatch or API not returning token

**Solution**:
1. **Check API response** in server logs
   
2. **Verify browser localStorage** (F12 → Application → Storage):
   - Should have: `auth_token`, `user_id`, `user_name`

3. **Check app.js code**:
   ```javascript
   localStorage.setItem('auth_token', data.token);  // ✅ Correct
   ```

---

### 13. **"Can't find 'dist' folder after running 'npm run build'"**

**Error**: `dist/` directory doesn't exist

**Reason**: Build didn't complete successfully

**Solutions**:
```bash
# Clear old builds
rm -rf dist/

# Rebuild with verbose output
npm run build -- --debug

# Check for build errors in console
```

---

### 14. **Port conflicts with Docker or VM**

**Error**: Can't access localhost:5173 or localhost:5000

**Solution**:
```bash
# Access from host machine via IP
# Find your IP:
hostname -I

# Then access:
# http://192.168.x.x:5173
# http://192.168.x.x:5000
```

---

### 15. **Vite reload keeps clearing localStorage**

**Issue**: Session lost on page refresh in dev

**Solution**: This is normal Vite behavior. To test persistence:
```bash
# Build production version
npm run build

# Serve production build
npm run preview

# Test at http://localhost:4173
```

---

## General Debugging Steps

### 1. **Check all ports are free**
```bash
lsof -i :5173
lsof -i :5000
lsof -i :27017  # MongoDB
```

### 2. **Verify all files exist**
```bash
ls -la src/index.html
ls -la server/server.js
ls -la server/api/register.js
ls -la .env.local
```

### 3. **Check Node.js version**
```bash
node --version  # Should be v14+ (we have v24.11.1)
```

### 4. **Verify npm dependencies**
```bash
npm ls  # Show dependency tree
npm audit  # Check for security issues
```

### 5. **Clear cache and reinstall**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 6. **Check environment variables**
```bash
cat .env.local
echo $MONGO_URL  # Should show your MongoDB URL
```

### 7. **Test backend API directly**
```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

### 8. **Monitor logs**
```bash
# Backend logs
npm run dev:backend

# Frontend logs (in browser F12 → Console)
npm run dev:frontend
```

---

## Getting Help

If issues persist:

1. **Check file paths** - Most issues are path-related
2. **Verify dependencies** - Run `npm install`
3. **Check ports** - Ensure 5173 and 5000 are free
4. **Verify .env.local** - MongoDB URL must be valid
5. **Review browser console** - F12 for JavaScript errors
6. **Check server logs** - Terminal output shows server errors

---

**Still stuck? Create a fresh terminal and run:**
```bash
cd /workspaces/dmless
npm install
npm run dev
```

Then check:
- http://localhost:5173 (Frontend)
- http://localhost:5000/api/health (Backend)
