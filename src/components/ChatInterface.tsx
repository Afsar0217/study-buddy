import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Paperclip, Image, Calendar } from 'lucide-react';

interface ChatInterfaceProps {
  onBack: () => void;
}

const mockConversations = [
  {
    id: '1',
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Great! Let\'s meet at the library tomorrow at 2 PM',
    time: '2m ago',
    unread: 2,
    online: true
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Thanks for helping me with calculus!',
    time: '1h ago',
    unread: 0,
    online: false
  },
  {
    id: '3',
    name: 'Sofia Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Do you have notes from yesterday\'s lecture?',
    time: '3h ago',
    unread: 1,
    online: true
  }
];

const mockMessages = [
  {
    id: '1',
    sender: 'Emma Thompson',
    content: 'Hey! I saw we matched for Computer Science study sessions. Are you free this week?',
    time: '10:30 AM',
    isMe: false
  },
  {
    id: '2',
    sender: 'Me',
    content: 'Hi Emma! Yes, I\'d love to study together. I\'m struggling with the algorithms assignment.',
    time: '10:32 AM',
    isMe: true
  },
  {
    id: '3',
    sender: 'Emma Thompson',
    content: 'Perfect! I actually just finished that one. I can help you work through it.',
    time: '10:33 AM',
    isMe: false
  },
  {
    id: '4',
    sender: 'Me',
    content: 'That would be amazing! When works best for you?',
    time: '10:35 AM',
    isMe: true
  },
  {
    id: '5',
    sender: 'Emma Thompson',
    content: 'How about tomorrow at 2 PM? We could meet at the main library on the 3rd floor.',
    time: '10:37 AM',
    isMe: false
  },
  {
    id: '6',
    sender: 'Me',
    content: 'Great! Let\'s meet at the library tomorrow at 2 PM',
    time: '10:38 AM',
    isMe: true
  }
];

export function ChatInterface({ onBack }: ChatInterfaceProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      setNewMessage('');
    }
  };

  if (selectedChat) {
    const conversation = mockConversations.find(c => c.id === selectedChat);
    
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedChat(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={conversation?.avatar} />
                  <AvatarFallback>{conversation?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {conversation?.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <h2 className="font-semibold">{conversation?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {conversation?.online ? 'Online' : 'Last seen 2h ago'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isMe 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-muted text-foreground'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isMe ? 'text-blue-100' : 'text-muted-foreground'
                }`}>
                  {message.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 border-t bg-muted/30">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Schedule Session</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Paperclip className="w-4 h-4" />
              <span>Share Notes</span>
            </Button>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Image className="w-5 h-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
        
        <Badge variant="secondary">{mockConversations.length} active</Badge>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {mockConversations.map((conversation) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
            className="flex items-center space-x-3 p-4 border-b cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setSelectedChat(conversation.id)}
          >
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {conversation.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium truncate">{conversation.name}</h3>
                <span className="text-xs text-muted-foreground">{conversation.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {conversation.lastMessage}
              </p>
            </div>

            {conversation.unread > 0 && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">{conversation.unread}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {mockConversations.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">No conversations yet</h3>
          <p className="text-sm text-muted-foreground">
            Start swiping to find study buddies and begin chatting!
          </p>
        </div>
      )}
    </div>
  );
}