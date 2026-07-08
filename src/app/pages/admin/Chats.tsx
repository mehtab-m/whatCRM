import { useState } from 'react';
import { Search, Send, Sparkles, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { useData } from '../../context/DataContext';

const messages = [
  { id: 1, from: 'customer', text: 'Hi, do you have this product in stock?', time: '10:30 AM' },
  { id: 2, from: 'ai', text: 'Yes! We have it available. Would you like to place an order? I can help you with that! 😊', time: '10:31 AM' },
  { id: 3, from: 'customer', text: 'What is the price?', time: '10:33 AM' },
  { id: 4, from: 'ai', text: 'I can share the latest price from our catalog. Which variant are you interested in?', time: '10:34 AM' },
  { id: 5, from: 'customer', text: 'Yes please, I want to order', time: '10:35 AM' },
  { id: 6, from: 'ai', text: 'Great choice! 🎉\n\nTo complete your order, I need:\n1. Your full name\n2. Delivery address\n3. Phone number', time: '10:35 AM' },
  { id: 7, from: 'customer', text: 'Rahul Kumar\nHouse 123, Block A, Karachi\n+92 300 1234567', time: '10:36 AM' },
  { id: 8, from: 'ai', text: '✅ Perfect! Order confirmed!\n\nYour order has been created successfully! 🎊\nOur team will contact you shortly for delivery confirmation.', time: '10:37 AM', isOrderConfirmation: true },
];

export function AdminChats() {
  const { chats } = useData();
  const [selectedChat, setSelectedChat] = useState(chats[0] ?? null);
  const [chatMode, setChatMode] = useState<'auto' | 'manual' | 'assist'>('auto');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-0 h-full min-h-0 flex-1">
      <Card className={`col-span-12 lg:col-span-4 p-0 gap-0 flex flex-col h-full min-h-0 overflow-hidden lg:rounded-r-none ${selectedChat ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-3 md:p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-8 md:pl-9 text-sm md:text-base h-9 md:h-10" />
          </div>

          <div className="flex gap-1.5 md:gap-2 mt-3 md:mt-4">
            <button className="px-2.5 md:px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs md:text-sm">
              All
            </button>
            <button className="px-2.5 md:px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-xs md:text-sm hover:bg-accent">
              Active
            </button>
            <button className="px-2.5 md:px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-xs md:text-sm hover:bg-accent">
              Pending
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-3 md:p-4 border-b hover:bg-accent transition-colors text-left ${
                selectedChat?.id === chat.id ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-start gap-2 md:gap-3">
                <Avatar className="w-9 h-9 md:w-10 md:h-10">
                  <AvatarFallback className="text-xs md:text-sm">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm md:text-base">{chat.name}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground truncate mt-0.5 md:mt-1">{chat.lastMessage}</p>
                  <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                    <Badge variant={chat.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {chat.status}
                    </Badge>
                    {chat.unread > 0 && (
                      <span className="px-1.5 md:px-2 py-0.5 bg-destructive text-destructive-foreground rounded-full text-xs">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className={`col-span-12 lg:col-span-8 p-0 gap-0 flex flex-col h-full min-h-0 overflow-hidden lg:rounded-l-none lg:border-l-0 ${selectedChat ? 'flex' : 'hidden lg:flex'}`}>
        {selectedChat ? (
          <>
            <div className="p-3 md:p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="lg:hidden p-2 hover:bg-accent rounded-lg flex-shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                    <AvatarFallback className="text-xs md:text-sm">
                      {selectedChat.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm md:text-base truncate">{selectedChat.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Online</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <button
                    onClick={() => setChatMode('auto')}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm flex items-center gap-1 ${
                      chatMode === 'auto' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Auto</span>
                  </button>
                  <button
                    onClick={() => setChatMode('assist')}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm ${
                      chatMode === 'assist' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'
                    }`}
                  >
                    <span className="hidden sm:inline">Assist</span>
                    <span className="sm:hidden">A</span>
                  </button>
                  <button
                    onClick={() => setChatMode('manual')}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm ${
                      chatMode === 'manual' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'
                    }`}
                  >
                    <span className="hidden sm:inline">Manual</span>
                    <span className="sm:hidden">M</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 md:p-4 space-y-3 md:space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[70%] ${msg.from === 'admin' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-lg p-2.5 md:p-3 ${
                        msg.from === 'admin'
                          ? 'bg-primary text-primary-foreground'
                          : msg.from === 'ai'
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.from === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                          <span className="text-xs font-medium text-green-700">AI Assistant</span>
                        </div>
                      )}
                      <p className={`whitespace-pre-line text-sm md:text-base ${msg.from === 'ai' ? 'text-green-900' : ''}`}>
                        {msg.text}
                      </p>
                      {msg.isOrderConfirmation && (
                        <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-green-300">
                          <div className="flex items-start gap-2 text-green-700 bg-green-100 px-2 md:px-3 py-2 rounded">
                            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 mt-0.5" />
                            <p className="text-xs">
                              ✅ Order automatically created in Orders page
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {chatMode === 'auto' && (
              <div className="p-2 md:p-3 bg-accent/50 border-t flex-shrink-0">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary mt-0.5 md:mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm">AI is handling this conversation automatically</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Orders are created automatically when customer confirms. Check Orders page to review.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 md:p-4 border-t flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder={chatMode === 'auto' ? 'AI is handling this chat...' : 'Type a message...'}
                  className="flex-1 text-sm md:text-base"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={chatMode === 'auto'}
                />
                <button
                  type="submit"
                  disabled={chatMode === 'auto'}
                  className={`px-3 md:px-4 py-2 rounded-lg ${
                    chatMode === 'auto'
                      ? 'bg-secondary text-secondary-foreground opacity-50 cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  <Send className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a chat to start messaging
          </div>
        )}
      </Card>
    </div>
  );
}
