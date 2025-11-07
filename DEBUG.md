# Debug Guide for SPA

## To Test the SPA:

### 1. Open the simple version
Open `app-simple.html` in your browser

### 2. Check Browser Console
- Press F12 to open Developer Tools
- Go to Console tab
- You should see:
  - 📚 App.js loaded!
  - 🚀 App initialized!
  - 📍 Initial hash: (empty or #/)
  - 🔄 Calling initial router...
  - 🔄 Navigating to: /
  - 📍 Route function: renderHome
  - 📦 Main content element: [object HTMLElement]
  - ✅ Route rendered successfully

### 3. Expected Behavior:
- Home page content should load immediately
- When you click any navigation link, content should change
- Hash in URL should update (e.g., #/about, #/news)

### 4. If Still Not Working:
Check console for errors and look for:
- ❌ main-content element not found! → HTML structure issue
- ❌ Error rendering route: → JavaScript error in render function
- No logs at all → app.js not loading

### 5. Quick Test in Console:
Type these commands in browser console:
```javascript
// Check if routes exist
console.log(routes);

// Check if main-content exists
console.log(document.getElementById('main-content'));

// Manually trigger home page
renderHome();

// Check content
console.log(document.getElementById('main-content').innerHTML.length);
```

## Files:
- **app-simple.html** - Lightweight test version
- **app.html** - Full version with all features
- **app.js** - Application logic (same for both)
- **app.css** - Styles

## Common Issues:
1. **No content showing** - Check console for errors
2. **Links not working** - Hash navigation may be blocked
3. **Images not showing** - Check image paths are correct
