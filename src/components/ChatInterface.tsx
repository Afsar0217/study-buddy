import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Send, Paperclip, Smile, MessageSquare, Clock, Users, BookOpen, Lightbulb } from 'lucide-react';
import { chatAPI, matchesAPI } from '../services/api';
import { io, Socket } from 'socket.io-client';

interface ChatInterfaceProps {
  onBack: () => void;
  conversationId?: string;
  otherUser?: {
    id: string;
    name: string;
    avatar: string;
  };
  currentUser?: any; // Add current user prop
}

// Static chat data that all users can see
const STATIC_CHATS = [
  {
    id: 'static-study-tips',
    name: 'Study Tips & Tricks',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    major: 'General',
    year: 'All Levels',
    university: 'Study Buddy Community',
    description: 'Share and discover effective study strategies',
    isStatic: true,
    messages: [
      {
        id: '1',
        content: 'Welcome to Study Tips & Tricks! 🎓 Share your best study strategies here.',
        sender_id: 'system',
        sender_name: 'Study Buddy Bot',
        sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        message_type: 'text',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read_at: null,
        isMe: false
      },
      {
        id: '2',
        content: 'Pro tip: Use the Pomodoro Technique - 25 minutes of focused study followed by a 5-minute break! ⏰',
        sender_id: 'system',
        sender_name: 'Study Buddy Bot',
        sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        message_type: 'text',
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        read_at: null,
        isMe: false
      },
      {
        id: '3',
        content: 'Active recall is more effective than passive reading. Try explaining concepts to yourself or others! 🧠',
        sender_id: 'system',
        sender_name: 'Study Buddy Bot',
        sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        message_type: 'text',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read_at: null,
        isMe: false
      }
    ]
  },
  {
    id: 'static-homework-help',
    name: 'Homework Help Desk',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    major: 'General',
    year: 'All Levels',
    university: 'Study Buddy Community',
    description: 'Get help with homework and assignments',
    isStatic: true,
    messages: [
      {
        id: '1',
        content: 'Welcome to Homework Help Desk! 📚 Need help with an assignment? Post your question here.',
        sender_id: 'system',
        sender_name: 'Study Buddy Bot',
        sender_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        message_type: 'text',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read_at: null,
        isMe: false
      },
      {
        id: '2',
        content: 'Remember: Show your work and explain your thought process when asking for help! ✍️',
        sender_id: 'system',
        sender_name: 'Study Buddy Bot',
        sender_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        message_type: 'text',
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        read_at: null,
        isMe: false
      },
      {
        id: '3',
        content: 'Don\'t forget to check the resources section for helpful study materials! 📖',
        sender_id: 'system',
        sender_name: 'Study Buddy Bot',
        sender_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        message_type: 'text',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read_at: null,
        isMe: false
      }
    ]
  },
  {
    id: 'static-exam-prep',
    name: 'Exam Preparation Hub',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face',
    major: 'General',
    year: 'All Levels',
    university: 'Study Buddy Community',
    description: 'Prepare for exams together with study groups',
    isStatic: true,
    messages: [
      {
        id: '1',
        content: 'Welcome to Exam Preparation Hub! 📝 Let\'s ace those exams together!',
        sender_id: 'system',
        sender_name: 'Study Buddy Bot',
        sender_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face',
        message_type: 'text',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read_at: null,
        isMe: false
      },
      {
        id: '2',
        content: 'Create study groups, share resources, and quiz each other! 🎯',
        sender_id: 'system',
        sender_name: 'Study Buddy Bot',
        sender_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face',
        message_type: 'text',
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        read_at: null,
        isMe: false
      },
      {
        id: '3',
        content: 'Pro tip: Start studying early and review regularly instead of cramming the night before! ⚡',
        sender_id: 'system',
        sender_name: 'Study Buddy Bot',
        sender_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face',
        message_type: 'text',
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read_at: null,
        isMe: false
      }
    ]
  }
];

export function ChatInterface({ onBack, conversationId: initialConversationId, otherUser: initialOtherUser, currentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [pendingMatches, setPendingMatches] = useState<any[]>([]);
  const [loadingPendingMatches, setLoadingPendingMatches] = useState(false);
  const [currentStaticChat, setCurrentStaticChat] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [otherUser, setOtherUser] = useState<any>(initialOtherUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const newSocket = io('http://localhost:3001', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });

    newSocket.on('receive_message', (message) => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Load existing messages
  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  // Load conversations when component mounts
  useEffect(() => {
    if (!conversationId) {
      loadConversations();
      loadPendingMatches();
    }
  }, [conversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    try {
      const response = await chatAPI.getMessages(conversationId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const response = await chatAPI.getConversations();
      console.log('Loaded conversations:', response);
      setConversations(response.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadPendingMatches = async () => {
    setLoadingPendingMatches(true);
    try {
      const response = await matchesAPI.getPendingMatches();
      console.log('Loaded pending matches:', response);
      setPendingMatches(response.pendingMatches || []);
    } catch (error) {
      console.error('Error loading pending matches:', error);
    } finally {
      setLoadingPendingMatches(false);
    }
  };

  const handleAcceptMatch = async (matchId: string) => {
    try {
      const response = await matchesAPI.respondToMatch(matchId, 'accept');
      console.log('Match accepted:', response);
      
      // Refresh both lists
      await Promise.all([loadConversations(), loadPendingMatches()]);
      
      // Show success message
      alert('Match accepted! You can now start chatting.');
    } catch (error) {
      console.error('Error accepting match:', error);
      alert('Failed to accept match. Please try again.');
    }
  };

  const handleRejectMatch = async (matchId: string) => {
    try {
      const response = await matchesAPI.respondToMatch(matchId, 'reject');
      console.log('Match rejected:', response);
      
      // Refresh pending matches
      await loadPendingMatches();
    } catch (error) {
      console.error('Error rejecting match:', error);
      alert('Failed to reject match. Please try again.');
    }
  };

  const openConversation = (conversation: any) => {
    console.log('🎯 Clicked on conversation:', conversation);
    console.log('📝 Conversation ID:', conversation.id);
    console.log('👤 Other user ID:', conversation.other_user_id);
    
    // Set the conversation ID and other user info to open the chat
    // This will trigger the useEffect that loads messages
    setConversationId(conversation.id);
    setOtherUser({
      id: conversation.other_user_id,
      name: conversation.name,
      avatar: conversation.avatar
    });
    
    console.log('✅ Set conversationId to:', conversation.id);
    console.log('✅ Set otherUser to:', {
      id: conversation.other_user_id,
      name: conversation.name,
      avatar: conversation.avatar
    });
    
    // Clear the conversation list view
    setConversations([]);
    setPendingMatches([]);
  };

  const goBackToConversationList = () => {
    setConversationId(undefined);
    setOtherUser(undefined);
    setCurrentStaticChat(undefined);
    setMessages([]);
    // Reload conversations and pending matches
    loadConversations();
    loadPendingMatches();
  };

  const openStaticChat = (staticChat: any) => {
    console.log('🎯 Opening static chat:', staticChat.name);
    setCurrentStaticChat(staticChat);
    setMessages(staticChat.messages);
    setConversationId(undefined);
    setOtherUser(undefined);
    // Clear the conversation list view
    setConversations([]);
    setPendingMatches([]);
  };

  const sendMessageToStaticChat = () => {
    if (newMessage.trim() && currentStaticChat) {
      const newMsg = {
        id: Date.now().toString(),
        content: newMessage,
        sender_id: currentUser?.id || 'anonymous',
        sender_name: currentUser?.name || 'Anonymous User',
        sender_avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face',
        message_type: 'text',
        created_at: new Date().toISOString(),
        read_at: null,
        isMe: true
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Simulate bot response after a short delay
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          content: `Thanks for your message! This is a community chat where everyone can participate. Keep the conversation going! 💬`,
          sender_id: 'system',
          sender_name: 'Study Buddy Bot',
          sender_avatar: currentStaticChat.avatar,
          message_type: 'text',
          created_at: new Date().toISOString(),
          read_at: null,
          isMe: false
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      if (currentStaticChat) {
        // Handle static chat message
        sendMessageToStaticChat();
      } else if (socket && isConnected && conversationId) {
        // Handle regular conversation message
        socket.emit('send_message', {
          conversationId: conversationId,
          content: newMessage
        });
        setNewMessage('');
      } else if (!isConnected) {
        console.warn('Socket not connected, cannot send message.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // If no conversation is selected, show conversation list
  if (!conversationId && !currentStaticChat) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-lg font-semibold">Chats</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              loadConversations();
              loadPendingMatches();
            }}
            disabled={loadingConversations || loadingPendingMatches}
          >
            <Clock className="w-4 h-4" />
          </Button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loadingConversations || loadingPendingMatches ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : conversations.length === 0 && pendingMatches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No conversations yet</p>
              <p className="text-sm text-gray-500">
                Start matching with study buddies to begin chatting!
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={onBack}
              >
                Go to Discover
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Static Chats Section */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Community Chats ({STATIC_CHATS.length})
                </h3>
                <div className="space-y-2">
                  {STATIC_CHATS.map((staticChat) => (
                    <motion.div
                      key={staticChat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => openStaticChat(staticChat)}
                    >
                      <Card className="hover:shadow-md transition-shadow border-2 border-blue-100 bg-blue-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12 border-2 border-blue-200">
                              <AvatarImage src={staticChat.avatar} />
                              <AvatarFallback>
                                {staticChat.name?.charAt(0) || 'C'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium truncate text-blue-800">{staticChat.name}</h3>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                  Community
                                </span>
                              </div>
                              <p className="text-sm text-blue-600 truncate mt-1">
                                {staticChat.description}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-blue-500">
                                  {staticChat.major} • {staticChat.year}
                                </span>
                                <span className="text-xs text-blue-400">
                                  {staticChat.messages.length} messages
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center space-y-1">
                              <Lightbulb className="w-5 h-5 text-blue-500" />
                              <span className="text-xs text-blue-500">Join</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pending Matches Section */}
              {pendingMatches.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                    Pending Matches ({pendingMatches.length})
                  </h3>
                  <div className="space-y-2">
                    {pendingMatches.map((match) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={match.avatar} />
                            <AvatarFallback>
                              {match.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{match.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {match.major} • {match.year}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptMatch(match.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600"
                          >
                            Accept Match
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectMatch(match.id)}
                            className="flex-1"
                          >
                            Decline
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Conversations Section */}
              {conversations.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                    Your Conversations ({conversations.length})
                  </h3>
                  <div className="space-y-2">
                    {conversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                        onClick={() => openConversation(conversation)}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={conversation.avatar} />
                                <AvatarFallback>
                                  {conversation.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium truncate">{conversation.name}</h3>
                                  <span className="text-xs text-muted-foreground">
                                    {conversation.last_message_at ? 
                                      new Date(conversation.last_message_at).toLocaleDateString() : 
                                      'New'
                                    }
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.lastMessage?.content || 'Start a conversation!'}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {conversation.major} • {conversation.year}
                                  </span>
                                  {conversation.unreadCount > 0 && (
                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                      {conversation.unreadCount} new
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="sm" onClick={goBackToConversationList}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentStaticChat ? currentStaticChat.avatar : otherUser?.avatar} />
            <AvatarFallback>
              {currentStaticChat ? currentStaticChat.name?.charAt(0) : otherUser?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">
              {currentStaticChat ? currentStaticChat.name : otherUser?.name || 'Study Buddy'}
            </h3>
            <div className="flex items-center space-x-2">
              {currentStaticChat ? (
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Community Chat
                </span>
              ) : (
                <>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-muted-foreground">
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Smile className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.isMe || message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isMe || message.sender_id === currentUser?.id
                  ? 'bg-blue-500 text-white' 
                  : message.sender_id === 'system' 
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-muted text-foreground'
              }`}>
                {message.sender_id === 'system' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <Avatar className="w-4 h-4">
                      <AvatarImage src={message.sender_avatar} />
                      <AvatarFallback>{message.sender_name?.charAt(0) || 'B'}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{message.sender_name}</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isMe || message.sender_id === currentUser?.id 
                    ? 'text-blue-100' 
                    : message.sender_id === 'system'
                      ? 'text-green-600'
                      : 'text-muted-foreground'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentStaticChat ? "Share your thoughts with the community..." : "Type a message..."}
            disabled={currentStaticChat ? false : !isConnected}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || (currentStaticChat ? false : !isConnected)}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {currentStaticChat ? (
          <p className="text-xs text-blue-600 mt-2 text-center">
            💬 This is a community chat. Your messages will be visible to everyone.
          </p>
        ) : !isConnected && (
          <p className="text-xs text-red-500 mt-2 text-center">
            Connecting to chat server...
          </p>
        )}
      </div>
    </div>
  );
}