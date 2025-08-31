#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Deployment Readiness...\n');

// Check if build directory exists
const buildDir = path.join(__dirname, 'build');
if (fs.existsSync(buildDir)) {
  console.log('✅ Build directory exists');
} else {
  console.log('❌ Build directory missing - run: npm run build');
}

// Check if server dependencies are installed
const serverPackageLock = path.join(__dirname, 'server', 'package-lock.json');
if (fs.existsSync(serverPackageLock)) {
  console.log('✅ Server dependencies installed');
} else {
  console.log('❌ Server dependencies missing - run: cd server && npm install');
}

// Check environment files
const envFiles = [
  'env.local',
  'env.production',
  'server/env.local',
  'server/env.production'
];

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check database files
const dbFiles = [
  'server/database/postgres-connection.js',
  'server/database/postgres-init.js'
];

dbFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'deploy:prepare', 'deploy:test'];
requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ Script '${script}' exists`);
  } else {
    console.log(`❌ Script '${script}' missing`);
  }
});

// Check server package.json
const serverPackageJson = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));
if (serverPackageJson.dependencies.pg) {
  console.log('✅ PostgreSQL dependency added');
} else {
  console.log('❌ PostgreSQL dependency missing');
}

if (!serverPackageJson.dependencies.multer) {
  console.log('✅ File upload dependency removed');
} else {
  console.log('❌ File upload dependency still present');
}

console.log('\n🎯 Next Steps:');
console.log('1. Commit all changes to GitHub');
console.log('2. Deploy backend to Railway');
console.log('3. Deploy frontend to Vercel');
console.log('4. Test all functionalities');
console.log('\n📚 See deploy-backend.md and deploy-frontend.md for detailed steps');
