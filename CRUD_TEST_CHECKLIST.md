# CRUD Operations Test Checklist

## ✅ Authentication & Authorization

### Login/Logout
- [ ] **Login with valid credentials** - Should redirect to intended page
- [ ] **Login with invalid credentials** - Should show error message
- [ ] **Remember me functionality** - Should extend session to 30 days
- [ ] **Rate limiting** - Should block after 5 failed attempts
- [ ] **Logout** - Should destroy session and redirect to login

### Session Management
- [ ] **Protected routes** - Should redirect to login if not authenticated
- [ ] **Session persistence** - Should maintain login state across browser restarts (if remember me checked)
- [ ] **Session expiry** - Should logout after session expires

## 🏪 Shop Management

### Shop Selection
- [ ] **Select shop** - Should set session and show success message
- [ ] **Invalid shop selection** - Should show error message
- [ ] **Reset shop** - Should clear selection and redirect to shop selection
- [ ] **Shop info in modal** - Should display shop details correctly

## 📦 Product CRUD Operations

### Create Product
- [ ] **Add product form** - Should load with categories
- [ ] **Create valid product** - Should save and redirect with success message
- [ ] **Create with invalid data** - Should show validation errors
- [ ] **Upload image** - Should save image to Cloudinary
- [ ] **Manual vs auto pricing** - Should calculate prices correctly
- [ ] **Authorization check** - Only sellers should be able to add products

### Read Products
- [ ] **View all products** - Should display products for selected shop
- [ ] **View single product** - Should show product details
- [ ] **Search products** - Should filter by name, category, material, price
- [ ] **Category filtering** - Should show products by category
- [ ] **Pagination** - Should handle large product lists
- [ ] **Featured products** - Should highlight featured items

### Update Product
- [ ] **Edit product form** - Should load with existing data
- [ ] **Update valid product** - Should save changes and show success
- [ ] **Update with invalid data** - Should show validation errors
- [ ] **Update image** - Should replace existing image
- [ ] **Authorization check** - Only product owner should be able to edit

### Delete Product
- [ ] **Delete confirmation** - Should show confirmation dialog
- [ ] **Delete product** - Should remove and show success message
- [ ] **Authorization check** - Only product owner should be able to delete
- [ ] **Handle non-existent product** - Should show error for invalid IDs

## 🏷️ Category CRUD Operations

### Create Category
- [ ] **Add category form** - Should load correctly
- [ ] **Create valid category** - Should save and redirect with success
- [ ] **Duplicate category** - Should prevent duplicates and show error
- [ ] **Invalid category name** - Should validate minimum length
- [ ] **Input sanitization** - Should clean XSS attempts

### Read Categories
- [ ] **View all categories** - Should display in product forms
- [ ] **API endpoint** - Should return JSON list of categories
- [ ] **Category products** - Should show products in category

### Update Category
- [ ] **Edit category form** - Should load with existing data
- [ ] **Update valid category** - Should save changes and show success
- [ ] **Duplicate name check** - Should prevent duplicate names
- [ ] **Invalid data** - Should show validation errors

### Delete Category
- [ ] **Delete unused category** - Should remove successfully
- [ ] **Delete category in use** - Should prevent deletion and show error
- [ ] **Non-existent category** - Should handle gracefully

## 👤 User Profile Management

### View Profile
- [ ] **User info modal** - Should show user details
- [ ] **Guest user display** - Should show guest info for non-logged users
- [ ] **Shop owner info** - Should show shop details for sellers

### Update Profile
- [ ] **Edit profile form** - Should load with user data
- [ ] **Update valid profile** - Should save and show success
- [ ] **Email validation** - Should validate email format
- [ ] **Password update** - Should hash new password
- [ ] **Input sanitization** - Should clean all inputs

## 🔍 Search & Filter Operations

### Search Functionality
- [ ] **Text search** - Should find products by name
- [ ] **Category filter** - Should filter by selected category
- [ ] **Material filter** - Should filter by gold/silver
- [ ] **Price range filter** - Should handle various price formats
- [ ] **Combined filters** - Should work with multiple filters
- [ ] **No results** - Should handle empty search results
- [ ] **Search suggestions** - Should provide autocomplete

### Advanced Search
- [ ] **Advanced search page** - Should load with filter options
- [ ] **Complex queries** - Should handle multiple criteria
- [ ] **Search results page** - Should display filtered results

## 🛡️ Security & Validation

### Input Validation
- [ ] **XSS prevention** - Should sanitize HTML/script tags
- [ ] **SQL injection** - Should use parameterized queries
- [ ] **File upload security** - Should validate image types
- [ ] **Rate limiting** - Should prevent abuse

### Authorization
- [ ] **Role-based access** - Should restrict admin functions
- [ ] **Owner verification** - Should verify resource ownership
- [ ] **Session security** - Should use secure session settings

## 📱 User Interface

### Flash Messages
- [ ] **Success messages** - Should show green alerts with icons
- [ ] **Error messages** - Should show red alerts with icons
- [ ] **Auto-dismiss** - Should disappear after 5 seconds
- [ ] **Home page display** - Should show messages after login redirect

### Modal Functionality
- [ ] **User info modal** - Should open/close correctly
- [ ] **Product details modal** - Should display product info
- [ ] **Delete confirmation** - Should confirm before deletion

### Responsive Design
- [ ] **Mobile compatibility** - Should work on mobile devices
- [ ] **Tablet compatibility** - Should adapt to tablet screens
- [ ] **Desktop optimization** - Should utilize full screen space

## 🔄 Error Handling

### Server Errors
- [ ] **500 errors** - Should show custom error page
- [ ] **404 errors** - Should show not found page
- [ ] **Database errors** - Should handle connection issues
- [ ] **Validation errors** - Should show user-friendly messages

### Client Errors
- [ ] **Network errors** - Should handle offline scenarios
- [ ] **Form validation** - Should validate before submission
- [ ] **Image upload errors** - Should handle upload failures

## 📊 Performance & Optimization

### Database Operations
- [ ] **Query optimization** - Should use efficient queries
- [ ] **Indexing** - Should have proper database indexes
- [ ] **Connection pooling** - Should manage connections efficiently

### Caching
- [ ] **Static assets** - Should cache CSS/JS/images
- [ ] **Session storage** - Should use efficient session storage
- [ ] **Rate limiting storage** - Should clean up old entries

## 🧪 Testing Commands

### Manual Testing
```bash
# Start the server
npm run dev

# Test in browser
# 1. Go to http://localhost:3000/products
# 2. Test each functionality above
# 3. Check browser console for errors
# 4. Verify database changes
```

### Database Verification
```javascript
// Check in MongoDB
db.products.find().count()
db.categories.find().count()
db.users.find().count()
db.metalrates.find().count()
```

## 🐛 Common Issues to Check

1. **CSRF Protection** - Ensure forms have proper CSRF tokens
2. **File Permissions** - Check upload directory permissions
3. **Environment Variables** - Verify all required env vars are set
4. **Database Connections** - Ensure MongoDB is running and accessible
5. **Cloudinary Config** - Verify image upload configuration
6. **Session Store** - Check session storage configuration
7. **Rate Limiting** - Verify rate limiting doesn't block legitimate users
8. **Memory Leaks** - Monitor memory usage during testing

## ✅ Test Results

| Feature | Status | Notes |
|---------|--------|--------|
| Login/Logout | ⏳ | Pending test |
| Product CRUD | ⏳ | Pending test |
| Category CRUD | ⏳ | Pending test |
| User Profile | ⏳ | Pending test |
| Search/Filter | ⏳ | Pending test |
| Security | ⏳ | Pending test |
| UI/UX | ⏳ | Pending test |
| Error Handling | ⏳ | Pending test |

**Legend:**
- ✅ Passed
- ❌ Failed
- ⏳ Pending
- ⚠️ Partial/Issues found
