import { useState } from 'react';
import { motion, PanInfo } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useTheme } from './ThemeProvider';
import { 
  Heart, X, MessageSquare, Calendar, Settings, Sun, Moon, 
  MapPin, Clock, BookOpen, Star, Filter, Zap, LogOut
} from 'lucide-react';

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

  const currentBuddy = mockBuddies[currentBuddyIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentBuddyIndex < mockBuddies.length - 1) {
      setCurrentBuddyIndex(prev => prev + 1);
    } else {
      setCurrentBuddyIndex(0);
    }
  };

  const handleDrag = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    }
  };

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
            <h1 className="font-semibold">Hi {user?.name?.split(' ')[0] || 'User'}!</h1>
            <p className="text-sm text-muted-foreground">Find your study buddy</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSignOut}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
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

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-sm mx-auto h-full flex flex-col justify-center">
          {/* Study Buddy Card */}
          <motion.div
            key={currentBuddy.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDrag}
            whileDrag={{ rotate: 5, scale: 1.05 }}
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
                  {currentBuddy.badges.map((badge) => (
                    <Badge key={badge} className="bg-green-500 text-white text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Avatar and basic info */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                  <Avatar className="w-16 h-16 border-2 border-white">
                    <AvatarImage src={currentBuddy.avatar} />
                    <AvatarFallback>{currentBuddy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <h2 className="text-xl font-bold">{currentBuddy.name}, {currentBuddy.age}</h2>
                    <p className="text-sm opacity-90">{currentBuddy.major} • {currentBuddy.year}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Rating and location */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{currentBuddy.rating}</span>
                    <span className="text-sm text-muted-foreground">({currentBuddy.studySessions} sessions)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{currentBuddy.location}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentBuddy.bio}
                </p>

                {/* Subjects */}
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Study Subjects</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentBuddy.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Study Times */}
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Available Times</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentBuddy.studyTimes.map((time) => (
                      <Badge key={time} variant="outline" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-6">
            <Button
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full border-2 border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={() => handleSwipe('left')}
            >
              <X className="w-6 h-6 text-red-500" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-12 h-12 rounded-full border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => onNavigate('profile')}
            >
              <BookOpen className="w-5 h-5 text-blue-500" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full border-2 border-green-200 hover:bg-green-50 hover:border-green-300"
              onClick={() => handleSwipe('right')}
            >
              <Heart className="w-6 h-6 text-green-500" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Swipe right to connect • Swipe left to pass
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