# Quick Testing Checklist

## Pre-Flight Checks

### Backend
- [ ] MongoDB Atlas connection is active
- [ ] `.env` file has correct MONGO_URI
- [ ] JWT_SECRET is set
- [ ] PORT is 5000

### Frontend
- [ ] `.env` has `VITE_API_URL=http://localhost:5000`
- [ ] All node_modules installed
- [ ] No TypeScript errors

## Startup Steps

### Terminal 1 - Start Backend
```bash
cd server
npm run dev
```
**Expected Output:**
```
Server is running on port 5000
MongoDb Connected Successfully
```

### Terminal 2 - Start Frontend
```bash
cd client
npm run dev
```
**Expected Output:**
```
VITE v8.0.1 running at:
  ➜  Local:   http://localhost:5173/
```

## Test Cases

### Test 1: Registration Workflow ✓
**Path:** http://localhost:5173/register
1. Fill all fields:
   - Company Name: "Test Corp"
   - Full Name: "John Test"
   - Email: "test@example.com"
   - Phone: "9876543210"
   - Password: "password123"
   - Address: "123 Main St"
2. Click "Sign Up"
3. **Expected:** Redirect to dashboard
4. **Verify:** Check MongoDB for new company and user

### Test 2: Login Workflow ✓
**Path:** http://localhost:5173/login
1. Enter email: "test@example.com"
2. Enter password: "password123"
3. Click "Sign In"
4. **Expected:** Redirect to dashboard
5. **Verify:** Auth token in localStorage

### Test 3: Products Page Load ✓
**Path:** http://localhost:5173/products
1. Wait for page to load
2. **Expected:** See product table with data
3. **Verify:** Shows "Showing X-X of Y products"

### Test 4: Add Product ✓
**Path:** http://localhost:5173/products/add
1. Fill form:
   - Product Name: "Oak Chair"
   - SKU: "SKU-2024-001"
   - Category: (Select from dropdown - verify dropdown populated)
   - Price: 299.99
   - Stock: 50
2. Click "Save Product"
3. **Expected:** Success message
4. **Verify:** Product appears in Products table
5. **Verify:** Data in MongoDB

### Test 5: Categories Page ✓
**Path:** http://localhost:5173/categories
1. Add new category: "Furniture"
2. **Expected:** Category appears in table
3. Go to Add Product again
4. **Expected:** New category in dropdown

### Test 6: Search Functionality ✓
**Path:** http://localhost:5173/products
1. Type in search box: "Oak"
2. **Expected:** Filter results to matching products
3. Clear search
4. **Expected:** Show all products again

### Test 7: Pagination ✓
**Path:** http://localhost:5173/products
1. Click "Next" button (if available)
2. **Expected:** Show next set of products
3. Click "Previous"
4. **Expected:** Show first set again

### Test 8: Error Handling ✓
**Test:**
1. Stop backend server
2. Try to load products
3. **Expected:** Error message "Failed to fetch products"
4. **Verify:** No crash, page still responsive

### Test 9: Token Persistence ✓
**Test:**
1. Login successfully
2. Open DevTools → Application → localStorage
3. **Verify:** See "authToken", "user", "company" keys
4. Refresh page
5. **Expected:** Still logged in, no redirect to login

### Test 10: Logout Test ✓
**Test:**
1. Click logout (if implemented)
2. **Expected:** Redirect to login
3. Check localStorage - should be empty
4. Try accessing /products
5. **Expected:** Redirect to login

## Browser Console Checks

Open DevTools (F12) and look for:
- ❌ No red errors
- ✓ Successful network requests to `/api/*` endpoints
- ✓ Status codes 200, 201 for success, 4xx/5xx for errors

## MongoDB Verification

### Check Created Data:
```javascript
// In MongoDB Atlas
// Collections to verify:
- users (check created user)
- companies (check created company)
- products (check added products)
- categories (check added categories)
```

## Network Tab Verification

Open DevTools → Network tab, then:

### Registration Request
```
POST http://localhost:5000/api/auth/register
Status: 201
Response: { success: true, user, token, company }
```

### Login Request
```
POST http://localhost:5000/api/auth/login
Status: 200
Response: { success: true, user, token, company }
```

### Get Products Request
```
GET http://localhost:5000/api/products?page=0&limit=10
Status: 200
Response: { success: true, products[], count }
Headers: Authorization: Bearer [token]
```

### Create Product Request
```
POST http://localhost:5000/api/products
Status: 201
Response: { success: true, data: product }
Headers: Authorization: Bearer [token]
```

## Common Issues During Testing

### Issue: "Failed to fetch products"
**Debug Steps:**
1. Check if backend is running
2. Check browser console for error details
3. Check Network tab response
4. Verify API_URL is correct

### Issue: "Category not found"
**Debug Steps:**
1. Create a category first
2. Verify category appears in MongoDB
3. Refresh page
4. Try adding product again

### Issue: Product doesn't appear after creation
**Debug Steps:**
1. Check Network tab for POST request
2. Verify 201 status code
3. Check MongoDB for product
4. Refresh products page

### Issue: Can't login after registration
**Debug Steps:**
1. Verify user created in MongoDB
2. Try password again (case-sensitive)
3. Use email instead of phone
4. Check password >= 6 characters

## Performance Notes

- Products load efficiently with pagination
- Category dropdown loads on component mount
- Search debounce recommended for large datasets
- Inventory value calculation done client-side

## Next Steps After Testing

1. ✓ Verify all endpoints respond correctly
2. Document any issues found
3. Implement Edit Product functionality
4. Add file upload for product images
5. Create Dashboard with real API data
6. Add error logging
7. Implement loading skeletons
8. Add form validation tooltips

## Quick Command Reference

```bash
# Start Backend
cd server && npm run dev

# Start Frontend
cd client && npm run dev

# Check MongoDB connection
# Test from MongoDB Atlas dashboard

# Clear Frontend Cache
# Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)

# View Server Logs
# Terminal where backend is running

# View Frontend Errors
# Browser DevTools Console
```

## Final Verification

Before declaring integration complete:
- [ ] User can register with all fields
- [ ] User can login with email or phone
- [ ] Products page shows real data
- [ ] Can create new product
- [ ] Can search products
- [ ] Pagination works
- [ ] Categories dropdown populated
- [ ] No console errors
- [ ] Token persists on refresh
- [ ] Error messages display properly

**Status:** Ready for Full Testing ✓

---

**Last Updated:** April 2, 2026
