import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, MapPin, Star, Calendar, MessageSquare, Heart, BookOpen, Clock, 
  Award, Edit, Save, X, Plus, Trash2, User, Settings, Activity, Trophy
} from 'lucide-react';
import api, { usersAPI, authAPI, scheduleAPI } from '../services/api';

interface MyProfileProps {
  onBack: () => void;
  user: any;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  university?: string;
  major?: string;
  year?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  study_preferences?: string;
  created_at: string;
  updated_at: string;
  subjects: Array<{
    id: number;
    subject: string;
    proficiency_level: string;
  }>;
  studyTimes: Array<{
    id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
  }>;
  preferences: Record<string, string>;
}

interface UserStats {
  totalSessions: number;
  averageRating: string;
  totalMatches: number;
  totalConversations: number;
  totalLikes: number;
}

export function MyProfile({ onBack, user }: MyProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data
  useEffect(() => {
    loadProfile();
    loadStats();
    loadSessions();
  }, []);

  // Debug: Add some test data if no subjects/study times exist
  useEffect(() => {
    if (profile && (!profile.subjects || profile.subjects.length === 0)) {
      console.log('No subjects found, profile data:', profile);
    }
    if (profile && (!profile.studyTimes || profile.studyTimes.length === 0)) {
      console.log('No study times found, profile data:', profile);
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getProfile();
      console.log('Profile data received:', response.user);
      console.log('User ID from response:', response.user.id);
      
      // Ensure subjects and studyTimes are arrays
      const userData = {
        ...response.user,
        subjects: response.user.subjects || [],
        studyTimes: response.user.studyTimes || []
      };
      
      console.log('Processed user data:', userData);
      setProfile(userData);
      setEditData(userData);
      

    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await usersAPI.getStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await scheduleAPI.getSessions();
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };



  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Update basic profile info
      await authAPI.updateProfile({
        name: editData.name,
        university: editData.university,
        major: editData.major,
        year: editData.year,
        bio: editData.bio,
        location: editData.location
      });

      // Update subjects if changed
      if (editData.subjects) {
        await usersAPI.updateSubjects(editData.subjects);
      }



      // Reload profile data
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile || {});
    setIsEditing(false);
  };

  const addSubject = () => {
    const newSubject = {
      id: Date.now(), // Temporary ID
      subject: '',
      proficiency_level: 'beginner'
    };
    setEditData(prev => ({
      ...prev,
      subjects: [...(prev.subjects || []), newSubject]
    }));
  };

  const removeSubject = (index: number) => {
    setEditData(prev => ({
      ...prev,
      subjects: prev.subjects?.filter((_, i) => i !== index)
    }));
  };

  const updateSubject = (index: number, field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      subjects: prev.subjects?.map((subject, i) => 
        i === index ? { ...subject, [field]: value } : subject
      )
    }));
  };



  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">My Profile</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">My Profile</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load profile</p>
            <Button onClick={loadProfile} className="mt-2">Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">My Profile</h1>
        <Button
          variant={isEditing ? "outline" : "ghost"}
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profile.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                                 <div className="flex-1">
                   {isEditing ? (
                     <div className="space-y-2">
                       <Input
                         value={editData.name || ''}
                         onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                         placeholder="Your name"
                       />
                       <Input
                         value={editData.university || ''}
                         onChange={(e) => setEditData(prev => ({ ...prev, university: e.target.value }))}
                         placeholder="University"
                       />
                     </div>
                   ) : (
                     <div>
                       <h2 className="text-2xl font-bold">{profile.name}</h2>
                       <p className="text-muted-foreground">{profile.university}</p>
                       <div className="flex items-center mt-2 space-x-4">
                         <div className="flex items-center space-x-2 text-muted-foreground">
                           <Heart className="w-4 h-4" />
                           <span className="text-sm">{stats?.totalLikes || 0} {(stats?.totalLikes || 0) === 1 ? 'like' : 'likes'}</span>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-semibold">{stats.averageRating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Average Rating</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-semibold">{stats.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Study Sessions</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-semibold">{stats.totalMatches}</p>
                  <p className="text-xs text-muted-foreground">Total Matches</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="font-semibold">{stats.totalConversations}</p>
                  <p className="text-xs text-muted-foreground">Conversations</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="major">Major</Label>
                      {isEditing ? (
                        <Input
                          id="major"
                          value={editData.major || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, major: e.target.value }))}
                          placeholder="Your major"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{profile.major || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      {isEditing ? (
                        <Select
                          value={editData.year || ''}
                          onValueChange={(value) => setEditData(prev => ({ ...prev, year: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Freshman">Freshman</SelectItem>
                            <SelectItem value="Sophomore">Sophomore</SelectItem>
                            <SelectItem value="Junior">Junior</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                            <SelectItem value="Graduate">Graduate</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{profile.year || 'Not specified'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editData.location || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Your location"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{profile.location || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={editData.bio || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">{profile.bio || 'No bio yet'}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Study Subjects</CardTitle>
                    {isEditing && (
                      <Button size="sm" onClick={addSubject}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Subject
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-3">
                      {editData.subjects?.map((subject, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={subject.subject}
                            onChange={(e) => updateSubject(index, 'subject', e.target.value)}
                            placeholder="Subject name"
                            className="flex-1"
                          />
                          <Select
                            value={subject.proficiency_level}
                            onValueChange={(value) => updateSubject(index, 'proficiency_level', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSubject(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {console.log('Profile subjects:', profile.subjects)}
                      {console.log('Profile subjects type:', typeof profile.subjects)}
                      {console.log('Profile subjects length:', profile.subjects?.length)}
                      {profile.subjects?.map((subject) => (
                        <Badge key={subject.id} variant="secondary">
                          {subject.subject} ({subject.proficiency_level})
                        </Badge>
                      ))}
                      {(!profile.subjects || profile.subjects.length === 0) && (
                        <p className="text-muted-foreground">No subjects added yet</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

                         <TabsContent value="schedule" className="space-y-4">
               <Card>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <CardTitle>My Study Sessions</CardTitle>
                     <Button size="sm" onClick={() => window.location.href = '/schedule'}>
                       <Plus className="w-4 h-4 mr-1" />
                       Create Session
                     </Button>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     {sessions.length > 0 ? (
                       sessions.map((session) => (
                         <div key={session.id} className="p-3 rounded-lg border bg-card">
                           <div className="flex items-start justify-between">
                             <div className="flex-1">
                               <h4 className="font-semibold text-sm">{session.title}</h4>
                               <p className="text-xs text-muted-foreground mt-1">
                                 {session.subject && `${session.subject} • `}
                                 {session.session_type === 'in-person' ? 'In-Person' : 'Virtual'}
                               </p>
                               <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                 <Calendar className="w-3 h-3 mr-1" />
                                 {new Date(session.start_time).toLocaleDateString()} at{' '}
                                 {new Date(session.start_time).toLocaleTimeString([], { 
                                   hour: '2-digit', 
                                   minute: '2-digit' 
                                 })}
                               </div>
                               {session.location && (
                                 <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                   <MapPin className="w-3 h-3 mr-1" />
                                   {session.location}
                                 </div>
                               )}
                             </div>
                             <Badge 
                               variant={
                                 session.status === 'scheduled' ? 'default' :
                                 session.status === 'in-progress' ? 'secondary' :
                                 session.status === 'completed' ? 'outline' : 'destructive'
                               }
                               className="text-xs"
                             >
                               {session.status}
                             </Badge>
                           </div>
                         </div>
                       ))
                     ) : (
                       <div className="text-center py-8">
                         <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                         <p className="text-muted-foreground text-sm">No study sessions yet</p>
                         <p className="text-muted-foreground text-xs mt-1">
                           Create your first study session to get started
                         </p>
                       </div>
                     )}
                   </div>
                 </CardContent>
               </Card>
             </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="p-4 border-t bg-background">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
