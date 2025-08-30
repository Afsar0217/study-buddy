import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingCarousel } from './components/OnboardingCarousel';
import { AuthScreen } from './components/AuthScreen';
import { ProfileSetup } from './components/ProfileSetup';
import { MainDashboard } from './components/MainDashboard';
import { ChatInterface } from './components/ChatInterface';
import { ProfileView } from './components/ProfileView';
import { ScheduleSystem } from './components/ScheduleSystem';
import { SettingsScreen } from './components/SettingsScreen';
import { ThemeProvider } from './components/ThemeProvider';
import { authAPI } from './services/api';

type Screen = 
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'profile-setup'
  | 'dashboard'
  | 'chat'
  | 'profile'
  | 'schedule'
  | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate splash screen loading
    const timer = setTimeout(() => {
      setCurrentScreen('onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAuth = (userData: any) => {
    setUser(userData);
    setCurrentScreen('profile-setup');
  };

  const handleProfileComplete = () => {
    setCurrentScreen('dashboard');
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleSignOut = async () => {
    try {
      // Call backend logout API
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user data and authentication regardless of API call result
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setCurrentScreen('auth');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingCarousel onComplete={() => setCurrentScreen('auth')} />;
      case 'auth':
        return <AuthScreen onAuth={handleAuth} />;
      case 'profile-setup':
        return <ProfileSetup onComplete={handleProfileComplete} />;
      case 'dashboard':
        return <MainDashboard onNavigate={navigateTo} onSignOut={handleSignOut} user={user} />;
      case 'chat':
        return <ChatInterface onBack={() => navigateTo('dashboard')} />;
      case 'profile':
        return <ProfileView onBack={() => navigateTo('dashboard')} />;
      case 'schedule':
        return <ScheduleSystem onBack={() => navigateTo('dashboard')} />;
      case 'settings':
        return <SettingsScreen onBack={() => navigateTo('dashboard')} onSignOut={handleSignOut} />;
      default:
        return <MainDashboard onNavigate={navigateTo} user={user} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-screen"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}