import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useTheme } from './ThemeProvider';
import { 
  Heart, X, MessageSquare, Calendar, Settings, Sun, Moon, 
  MapPin, Clock, BookOpen, Star, Filter, Zap, LogOut, RefreshCw,
  UserPlus, UserMinus, MessageCircle
} from 'lucide-react';
import { matchesAPI } from '../services/api';

interface MainDashboardProps {
  onNavigate: (screen: 'dashboard' | 'chat' | 'profile' | 'schedule' | 'settings') => void;
  onSignOut: () => void;
  user: any;
}

const mockBuddies = [
  {
    id: '1',
    name: 'Emma Thompson',
    age: 20,
    major: 'Computer Science',
    year: 'Junior',
    university: 'UC Berkeley',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate about algorithms and machine learning. Looking for study buddies for advanced CS courses!',
    subjects: ['Data Structures', 'Machine Learning', 'Algorithms'],
    studyTimes: ['Evening (5-8 PM)', 'Night (8-11 PM)'],
    location: '2.1 miles away',
    rating: 4.8,
    studySessions: 24,
    badges: ['Top Rated', 'Quick Responder']
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    age: 21,
    major: 'Mathematics',
    year: 'Senior',
    university: 'UC Berkeley',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Math enthusiast who loves helping others understand complex concepts. Great at breaking down difficult problems.',
    subjects: ['Calculus', 'Linear Algebra', 'Statistics'],
    studyTimes: ['Morning (9-12 PM)', 'Afternoon (12-5 PM)'],
    location: '1.3 miles away',
    rating: 4.9,
    studySessions: 31,
    badges: ['Math Expert', 'Patient Teacher']
  },
  {
    id: '3',
    name: 'Sofia Rodriguez',
    age: 19,
    major: 'Biology',
    year: 'Sophomore',
    university: 'UC Berkeley',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Pre-med student with a love for life sciences. Always excited to discuss biology and chemistry concepts!',
    subjects: ['Biology', 'Chemistry', 'Physics'],
    studyTimes: ['Morning (9-12 PM)', 'Evening (5-8 PM)'],
    location: '0.8 miles away',
    rating: 4.7,
    studySessions: 18,
    badges: ['Science Star', 'Dedicated']
  }
];

export function MainDashboard({ onNavigate, onSignOut, user }: MainDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [currentBuddyIndex, setCurrentBuddyIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [potentialBuddies, setPotentialBuddies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    major: '',
    year: '',
    subject: '',
    location: ''
  });
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [pendingMatches, setPendingMatches] = useState<any[]>([]);
  const [pendingMatchesCount, setPendingMatchesCount] = useState(0);

  // Load potential study buddies
  useEffect(() => {
    loadPotentialBuddies();
    loadPendingMatches();
  }, [filters]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return; // Don't trigger shortcuts when typing in input fields
      }
      
      switch (event.key.toLowerCase()) {
        case 'a':
        case 'arrowleft':
          handleSwipe('left');
          break;
        case 'd':
        case 'arrowright':
          handleSwipe('right');
          break;
        case 'escape':
          if (showMatchNotification) {
            setShowMatchNotification(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showMatchNotification]);

  const loadPotentialBuddies = async () => {
    setIsLoading(true);
    try {
      const response = await matchesAPI.getPotentialBuddies(filters);
      setPotentialBuddies(response.potentialBuddies || []);
      setCurrentBuddyIndex(0);
    } catch (error) {
      console.error('Error loading potential buddies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingMatches = async () => {
    try {
      const response = await matchesAPI.getPendingMatches();
      setPendingMatches(response.pendingMatches || []);
      setPendingMatchesCount(response.pendingMatches?.length || 0);
    } catch (error) {
      console.error('Error loading pending matches:', error);
    }
  };

  const currentBuddy = potentialBuddies[currentBuddyIndex] || mockBuddies[currentBuddyIndex] || mockBuddies[0] || {
    id: 'default',
    name: 'Study Buddy',
    age: 20,
    major: 'General Studies',
    year: 'Undergraduate',
    university: 'University',
    avatar: '',
    bio: 'Looking for study partners to collaborate and learn together!',
    subjects: ['General Studies'],
    studyTimes: [{ day: 'Any', time: 'Flexible' }],
    location: 'Nearby',
    rating: 4.5,
    studySessions: 0,
    badges: ['New']
  };

  // Debug: Log the current buddy data structure
  console.log('Current buddy data:', currentBuddy);
  console.log('Study times:', currentBuddy.studyTimes);
  console.log('Subjects:', currentBuddy.subjects);
  console.log('Badges:', currentBuddy.badges);

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentBuddy && potentialBuddies.length > 0) {
      try {
        if (direction === 'right') {
          // Like the user
          const response = await matchesAPI.swipe(currentBuddy.id, 'like');
          console.log('Swipe response:', response);
          
          if (response.isMatch) {
            // It's a match! Show notification
            setMatchedUser(currentBuddy);
            setShowMatchNotification(true);
            // Auto-hide after 5 seconds
            setTimeout(() => setShowMatchNotification(false), 5000);
          }
        }
        
        // Move to next buddy
        if (currentBuddyIndex < potentialBuddies.length - 1) {
          setCurrentBuddyIndex(prev => prev + 1);
        } else {
          // No more buddies, reload
          await loadPotentialBuddies();
        }
      } catch (error) {
        console.error('Error processing swipe:', error);
      }
    } else {
      // Fallback to mock data
      if (currentBuddyIndex < mockBuddies.length - 1) {
        setCurrentBuddyIndex(prev => prev + 1);
      } else {
        setCurrentBuddyIndex(0);
      }
    }
  };

  // Remove drag functionality - no longer needed
  // const handleDrag = (event: any, info: PanInfo) => {
  //   if (info.offset.x > 100) {
  //     handleSwipe('right');
  //   } else if (info.offset.x < -100) {
  //     handleSwipe('left');
  //   }
  // };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">Find Study Buddies</h1>
            <p className="text-sm text-muted-foreground">
              {potentialBuddies.length > 0 ? `${potentialBuddies.length} potential matches` : 'No matches found'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Pending Matches Indicator */}
          {pendingMatchesCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('chat')}
              className="relative bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Pending Matches
              <Badge className="ml-2 bg-orange-500 text-white text-xs">
                {pendingMatchesCount}
              </Badge>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={loadPotentialBuddies}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters (if shown) */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-4 border-b bg-muted/30"
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="cursor-pointer">Same Major</Badge>
            <Badge variant="secondary" className="cursor-pointer">Same Year</Badge>
            <Badge variant="secondary" className="cursor-pointer">Nearby</Badge>
            <Badge variant="secondary" className="cursor-pointer">Available Now</Badge>
          </div>
        </motion.div>
      )}

      {/* Match Notification Modal */}
      {showMatchNotification && matchedUser && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowMatchNotification(false)}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Celebration Animation */}
            <div className="text-6xl mb-4">🎉</div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              It's a Match!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You and <span className="font-semibold text-blue-600">{matchedUser.name}</span> are now connected!
            </p>
            
            {/* User Info */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Avatar className="w-16 h-16 border-2 border-green-400">
                <AvatarImage src={matchedUser.avatar} />
                <AvatarFallback>{matchedUser.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">{matchedUser.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{matchedUser.major} • {matchedUser.year}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Button
                onClick={() => {
                  setShowMatchNotification(false);
                  onNavigate('chat');
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chatting
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowMatchNotification(false)}
                className="w-full"
              >
                Continue Browsing
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-sm mx-auto h-full flex flex-col justify-center">
          {/* Study Buddy Card */}
          <motion.div
            key={currentBuddy.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative mb-6"
          >
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1722912010170-704c382ca530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBzdHVkeWluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc1NjUzNzUyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Study session"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                  {currentBuddy.badges?.map((badgeItem: any, index: number) => {
                    const badgeText = typeof badgeItem === 'string' 
                      ? badgeItem 
                      : badgeItem?.name || badgeItem?.title || 'New';
                    return (
                      <Badge key={index} className="bg-green-500 text-white text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        {badgeText}
                      </Badge>
                    );
                  }) || (
                    <Badge className="bg-green-500 text-white text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      New
                    </Badge>
                  )}
                </div>

                {/* Avatar and basic info */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                  <Avatar className="w-16 h-16 border-2 border-white">
                    <AvatarImage src={currentBuddy.avatar} />
                    <AvatarFallback>{currentBuddy.name?.charAt(0) || 'S'}</AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{currentBuddy.name || 'Study Buddy'}{currentBuddy.age ? `, ${currentBuddy.age}` : ''}</h2>
                    <p className="text-sm opacity-90">{currentBuddy.major || 'Student'} • {currentBuddy.year || 'Undergraduate'}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Rating and location */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{currentBuddy.rating || '4.5'}</span>
                    <span className="text-sm text-muted-foreground">({currentBuddy.studySessions || 0} sessions)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{currentBuddy.location || 'Nearby'}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentBuddy.bio || 'Looking for study partners to collaborate and learn together!'}
                </p>

                {/* Subjects */}
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Study Subjects</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentBuddy.subjects?.map((subjectItem: any, index: number) => {
                      const subjectText = typeof subjectItem === 'string' 
                        ? subjectItem 
                        : subjectItem?.subject || subjectItem?.name || 'General Studies';
                      return (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subjectText}
                        </Badge>
                      );
                    }) || (
                      <Badge variant="secondary" className="text-xs">
                        General Studies
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Study Times */}
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Available Times</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentBuddy.studyTimes?.map((timeItem: any, index: number) => {
                      const timeText = typeof timeItem === 'string' 
                        ? timeItem 
                        : timeItem?.time || timeItem?.day || 'Flexible';
                      return (
                        <Badge key={index} variant="outline" className="text-xs">
                          {timeText}
                        </Badge>
                      );
                    }) || (
                      <Badge variant="outline" className="text-xs">
                        Flexible
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons - Updated with clear labels and better UX */}
          <div className="flex flex-col space-y-4">
            {/* Main Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                onClick={() => handleSwipe('left')}
              >
                <UserMinus className="w-5 h-5 mr-2 text-red-500" />
                Pass
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                onClick={() => handleSwipe('right')}
              >
                <UserPlus className="w-5 h-5 mr-2 text-green-500" />
                Connect
              </Button>
            </div>

            {/* Secondary Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50"
                onClick={() => onNavigate('profile')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Profile
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="px-4 py-2 text-purple-600 hover:bg-purple-50"
                onClick={() => onNavigate('chat')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                My Chats
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Click "Connect" to start chatting • Click "Pass" to skip
            <br />
            <span className="text-xs">Keyboard shortcuts: A (Pass) • D (Connect) • ESC (Close)</span>
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center p-4 border-t bg-background">
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-1"
          onClick={() => onNavigate('dashboard')}
        >
          <Heart className="w-5 h-5 text-blue-500" />
          <span className="text-xs text-blue-500">Discover</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-1"
          onClick={() => onNavigate('chat')}
        >
          <MessageSquare className="w-5 h-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Chats</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-1"
          onClick={() => onNavigate('schedule')}
        >
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Schedule</span>
        </Button>
      </div>
    </div>
  );
}