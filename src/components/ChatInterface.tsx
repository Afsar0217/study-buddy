import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Send, Paperclip, Smile, MessageSquare, Clock } from 'lucide-react';
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

export function ChatInterface({ onBack, conversationId, otherUser, currentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [pendingMatches, setPendingMatches] = useState<any[]>([]);
  const [loadingPendingMatches, setLoadingPendingMatches] = useState(false);
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
    setMessages([]);
    // Reload conversations and pending matches
    loadConversations();
    loadPendingMatches();
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket && isConnected && conversationId) {
      socket.emit('send_message', {
        conversationId: conversationId,
        content: newMessage
      });
      setNewMessage('');
    } else if (!isConnected) {
      console.warn('Socket not connected, cannot send message.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // If no conversation is selected, show conversation list
  if (!conversationId) {
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
            <div className="space-y-4">
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
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={otherUser?.avatar} />
            <AvatarFallback>{otherUser?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{otherUser?.name || 'Study Buddy'}</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-muted-foreground">
                {isConnected ? 'Online' : 'Offline'}
              </span>
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
              className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender_id === currentUser?.id
                  ? 'bg-blue-500 text-white' 
                  : 'bg-muted text-foreground'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender_id === currentUser?.id ? 'text-blue-100' : 'text-muted-foreground'
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
            placeholder="Type a message..."
            disabled={!isConnected}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || !isConnected}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2 text-center">
            Connecting to chat server...
          </p>
        )}
      </div>
    </div>
  );
}