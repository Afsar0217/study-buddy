# Virtual Study Buddy Finder - Testing Guide

## 🧪 Comprehensive Testing Strategy

This guide will help you systematically test all functionalities of your Virtual Study Buddy Finder application to ensure everything works correctly.

## 📋 Pre-Testing Checklist

### 1. Environment Setup Verification
- [ ] Node.js 18+ is installed
- [ ] All dependencies are installed (`npm install`)
- [ ] Database is initialized (`npm run db:init`)
- [ ] Both frontend and backend servers can start without errors
- [ ] Environment variables are properly configured

### 2. Build Verification
- [ ] Frontend builds successfully (`npm run build`)
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] No console errors during development server startup

## 🚀 Functional Testing

### 1. Authentication System Testing

#### User Registration
- [ ] **Test Case**: Register a new user with valid data
  - Navigate to registration form
  - Fill in: name, email, password, university
  - Submit and verify successful registration
  - Check if redirected to profile setup
  - Verify user data is stored in database

- [ ] **Test Case**: Registration with invalid data
  - Try registering with existing email (should show error)
  - Try registering with weak password
  - Try registering with missing required fields
  - Verify appropriate error messages are displayed

#### User Login
- [ ] **Test Case**: Login with valid credentials
  - Use sample user: emma@example.com / password123
  - Verify successful login and token storage
  - Check if redirected to appropriate screen

- [ ] **Test Case**: Login with invalid credentials
  - Try wrong password
  - Try non-existent email
  - Verify error messages are displayed

#### Authentication Persistence
- [ ] **Test Case**: Token persistence
  - Login successfully
  - Refresh the page
  - Verify user remains logged in
  - Check if token is properly stored in localStorage

### 2. Profile Management Testing

#### Profile Setup (New Users)
- [ ] **Test Case**: Complete profile setup
  - Add subjects with proficiency levels
  - Set study times for different days
  - Upload profile picture
  - Verify profile completion and redirect to dashboard

#### Profile Updates
- [ ] **Test Case**: Update existing profile
  - Modify subjects
  - Change study times
  - Update bio and preferences
  - Verify changes are saved and reflected

### 3. Study Buddy Matching System

#### Potential Buddies Discovery
- [ ] **Test Case**: Load potential study buddies
  - Navigate to main dashboard
  - Verify potential buddies are loaded
  - Check if user cards display correctly with all information
  - Verify fallback to mock data if API fails

#### Swipe Functionality
- [ ] **Test Case**: Right swipe (like)
  - Swipe right on a potential buddy
  - Verify like action is sent to server
  - Check if match notification appears (if it's a match)
  - Verify next buddy is loaded

- [ ] **Test Case**: Left swipe (dislike)
  - Swipe left on a potential buddy
  - Verify dislike action is sent to server
  - Check if next buddy is loaded

#### Match Management
- [ ] **Test Case**: View matches
  - Navigate to matches section
  - Verify matched users are displayed
  - Check match status (pending/confirmed)

- [ ] **Test Case**: Respond to match requests
  - Accept a pending match
  - Reject a pending match
  - Verify appropriate actions are taken

### 4. Real-time Chat System

#### Chat Interface
- [ ] **Test Case**: Load conversations
  - Navigate to chat section
  - Verify conversations list loads
  - Check if unread message counts are displayed

- [ ] **Test Case**: Send and receive messages
  - Select a conversation
  - Send a text message
  - Verify message appears in chat
  - Test real-time message reception (use two browser windows)

#### Socket.IO Connection
- [ ] **Test Case**: Socket connection
  - Check browser console for connection status
  - Verify "Connected to chat server" message
  - Test connection stability

- [ ] **Test Case**: Message persistence
  - Send messages
  - Refresh the page
  - Verify messages are still there
  - Check message timestamps

### 5. Study Session Management

#### Session Creation
- [ ] **Test Case**: Create study session
  - Navigate to schedule section
  - Fill in session details (title, description, subject, time, location)
  - Submit and verify session is created
  - Check if session appears in user's sessions

#### Session Discovery
- [ ] **Test Case**: Browse available sessions
  - Navigate to discover sessions
  - Apply filters (subject, type, location)
  - Verify filtered results
  - Check session details are displayed correctly

#### Session Participation
- [ ] **Test Case**: Join session
  - Select an available session
  - Click join
  - Verify participation status changes
  - Check if session appears in "My Sessions"

- [ ] **Test Case**: Leave session
  - Leave a joined session
  - Verify participation status updates
  - Check if session is removed from "My Sessions"

### 6. Search and Filtering

#### User Search
- [ ] **Test Case**: Search by major
  - Use search filters
  - Search for specific major
  - Verify results are filtered correctly

- [ ] **Test Case**: Search by subject
  - Filter by study subject
  - Verify matching users are shown
  - Check if no results message appears when appropriate

#### Advanced Filters
- [ ] **Test Case**: Location-based filtering
  - Filter by location/distance
  - Verify nearby users are prioritized

- [ ] **Test Case**: Year and university filters
  - Filter by academic year
  - Filter by university
  - Verify combined filters work correctly

### 7. UI/UX Testing

#### Responsive Design
- [ ] **Test Case**: Mobile responsiveness
  - Test on different screen sizes
  - Verify touch gestures work (swipe, tap)
  - Check if UI elements are properly sized

#### Theme Switching
- [ ] **Test Case**: Dark/Light mode
  - Toggle between themes
  - Verify all components adapt correctly
  - Check if theme preference is saved

#### Navigation
- [ ] **Test Case**: Screen navigation
  - Test all navigation buttons
  - Verify proper screen transitions
  - Check if back buttons work correctly

### 8. Error Handling

#### Network Errors
- [ ] **Test Case**: API failure handling
  - Disconnect internet
  - Try to perform actions
  - Verify appropriate error messages
  - Check if app doesn't crash

#### Form Validation
- [ ] **Test Case**: Input validation
  - Try submitting forms with invalid data
  - Verify client-side validation works
  - Check if helpful error messages appear

## 🔧 Technical Testing

### 1. Performance Testing
- [ ] **Test Case**: Load time
  - Measure initial page load time
  - Check if images load properly
  - Verify smooth animations

- [ ] **Test Case**: Memory usage
  - Monitor memory usage during extended use
  - Check for memory leaks in chat
  - Verify proper cleanup of resources

### 2. Security Testing
- [ ] **Test Case**: Authentication security
  - Verify JWT tokens are properly handled
  - Check if expired tokens are rejected
  - Test unauthorized access attempts

- [ ] **Test Case**: Input sanitization
  - Try XSS attacks in chat messages
  - Test SQL injection in search fields
  - Verify malicious input is properly handled

### 3. Browser Compatibility
- [ ] **Test Case**: Cross-browser testing
  - Test on Chrome, Firefox, Safari, Edge
  - Verify consistent functionality
  - Check for browser-specific issues

## 📱 Mobile Testing

### 1. Touch Interactions
- [ ] **Test Case**: Swipe gestures
  - Test swipe left/right on buddy cards
  - Verify smooth animations
  - Check if gestures work on different devices

### 2. Mobile UI
- [ ] **Test Case**: Mobile layout
  - Test on mobile devices or browser dev tools
  - Verify all elements are accessible
  - Check if text is readable

## 🧪 Automated Testing Setup

### 1. Unit Tests
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

### 2. Integration Tests
```bash
# Test API endpoints
npm run test:api

# Test database operations
npm run test:db
```

## 📊 Testing Metrics

### Success Criteria
- [ ] All core features work without errors
- [ ] Real-time chat functions properly
- [ ] Matching system produces accurate results
- [ ] Study sessions can be created and managed
- [ ] Search and filtering work correctly
- [ ] UI is responsive and user-friendly
- [ ] No critical security vulnerabilities
- [ ] Performance is acceptable (<3s load time)

### Bug Reporting Template
```
**Bug Title**: [Brief description]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**Environment**:
- Browser: [Chrome/Firefox/Safari/Edge]
- OS: [Windows/Mac/Linux]
- Device: [Desktop/Mobile]

**Screenshots**: [If applicable]

**Console Errors**: [Any error messages]
```

## 🚀 Deployment Testing

### 1. Production Build
- [ ] **Test Case**: Production build
  - Run `npm run build`
  - Verify build completes successfully
  - Test built application locally

### 2. Environment Variables
- [ ] **Test Case**: Environment configuration
  - Verify all environment variables are set
  - Check if API endpoints are correct
  - Test database connections

## 📝 Testing Checklist Summary

### Quick Smoke Test (5 minutes)
1. Start both servers
2. Register a new user
3. Complete profile setup
4. Browse potential buddies
5. Send a test message
6. Create a study session

### Full Regression Test (30 minutes)
1. Complete all functional testing sections
2. Test error scenarios
3. Verify responsive design
4. Check performance metrics

### Production Readiness Test (15 minutes)
1. Build for production
2. Test all critical user flows
3. Verify security measures
4. Check deployment configuration

## 🆘 Troubleshooting Common Issues

### Server Won't Start
- Check if port 3001 is available
- Verify all dependencies are installed
- Check environment variables

### Database Issues
- Run `npm run db:init` to reset database
- Check database file permissions
- Verify SQLite is working

### Chat Not Working
- Check Socket.IO server is running
- Verify CORS settings
- Check browser console for errors

### Build Failures
- Clear node_modules and reinstall
- Check TypeScript configuration
- Verify all imports are correct

---

**Happy Testing! 🎯✨**

Remember to document any bugs found and their resolutions for future reference.
