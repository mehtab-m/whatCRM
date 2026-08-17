import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Send, Sparkles, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { useData, type Chat, type ChatMessage } from '../../context/DataContext';

type ChatFilter = 'all' | 'active' | 'pending';

const FILTERS: { key: ChatFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
];

interface AdminChatsProps {
  initialCustomerId?: string | null;
  onConsumeInitialCustomer?: () => void;
}

export function AdminChats({ initialCustomerId, onConsumeInitialCustomer }: AdminChatsProps) {
  const { chats, chatsLoading, fetchMessages, sendChatMessage, markChatRead, updateChatMode, getOrCreateChat } =
    useData();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [changingMode, setChangingMode] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ChatFilter>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    return chats.filter((chat) => {
      const matchesFilter = filter === 'all' || chat.status === filter;
      const matchesSearch =
        !query ||
        chat.name.toLowerCase().includes(query) ||
        chat.lastMessage.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [chats, filter, search]);

  const selectedChat: Chat | null = useMemo(
    () => chats.find((c) => c.id === selectedChatId) ?? null,
    [chats, selectedChatId],
  );

  // If we navigated here from an order, open (or create) that customer's chat.
  useEffect(() => {
    if (!initialCustomerId) return;
    let cancelled = false;
    void (async () => {
      try {
        const chat = await getOrCreateChat(initialCustomerId);
        if (!cancelled) setSelectedChatId(chat.id);
      } finally {
        onConsumeInitialCustomer?.();
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCustomerId]);

  // Auto-select the first chat once the list loads (desktop convenience).
  useEffect(() => {
    if (!selectedChatId && !initialCustomerId && filteredChats.length > 0) {
      setSelectedChatId(filteredChats[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredChats.length]);

  // Load messages + clear the unread badge whenever a chat is opened.
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    setMessagesLoading(true);
    void (async () => {
      try {
        const msgs = await fetchMessages(selectedChatId);
        if (!cancelled) setMessages(msgs);
      } finally {
        if (!cancelled) setMessagesLoading(false);
      }
    })();
    void markChatRead(selectedChatId);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const chatMode = selectedChat?.mode ?? 'auto';

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChatId || chatMode === 'auto' || sending) return;
    const content = message.trim();
    setSending(true);
    try {
      const sent = await sendChatMessage(selectedChatId, content);
      setMessages((prev) => [...prev, sent]);
      setMessage('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleChangeMode = async (mode: 'auto' | 'manual' | 'assist') => {
    if (!selectedChatId || mode === chatMode || changingMode) return;
    setChangingMode(true);
    try {
      await updateChatMode(selectedChatId, mode);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to change mode');
    } finally {
      setChangingMode(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-0 h-full min-h-0 flex-1">
      <Card className={`col-span-12 lg:col-span-4 p-0 gap-0 flex flex-col h-full min-h-0 overflow-hidden lg:rounded-r-none ${selectedChat ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-3 md:p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-8 md:pl-9 text-sm md:text-base h-9 md:h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-1.5 md:gap-2 mt-3 md:mt-4">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-2.5 md:px-3 py-1.5 rounded-lg text-xs md:text-sm transition-colors ${
                  filter === f.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {chatsLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading chats...
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm px-4">No chats found</div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full p-3 md:p-4 border-b hover:bg-accent transition-colors text-left ${
                  selectedChat?.id === chat.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <Avatar className="w-9 h-9 md:w-10 md:h-10">
                    <AvatarFallback className="text-xs md:text-sm">
                      {chat.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm md:text-base">{chat.name}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground truncate mt-0.5 md:mt-1">{chat.lastMessage}</p>
                    <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                      <Badge variant={chat.status === 'active' ? 'default' : 'secondary'} className="text-xs capitalize">
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
            ))
          )}
        </div>
      </Card>

      <Card className={`col-span-12 lg:col-span-8 p-0 gap-0 flex flex-col h-full min-h-0 overflow-hidden lg:rounded-l-none lg:border-l-0 ${selectedChat ? 'flex' : 'hidden lg:flex'}`}>
        {selectedChat ? (
          <>
            <div className="p-3 md:p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => setSelectedChatId(null)}
                    className="lg:hidden p-2 hover:bg-accent rounded-lg flex-shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                    <AvatarFallback className="text-xs md:text-sm">
                      {selectedChat.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm md:text-base truncate">{selectedChat.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{selectedChat.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleChangeMode('auto')}
                    disabled={changingMode}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm flex items-center gap-1 disabled:opacity-60 ${
                      chatMode === 'auto' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Auto</span>
                  </button>
                  <button
                    onClick={() => handleChangeMode('assist')}
                    disabled={changingMode}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm disabled:opacity-60 ${
                      chatMode === 'assist' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'
                    }`}
                  >
                    <span className="hidden sm:inline">Assist</span>
                    <span className="sm:hidden">A</span>
                  </button>
                  <button
                    onClick={() => handleChangeMode('manual')}
                    disabled={changingMode}
                    className={`px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm disabled:opacity-60 ${
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
              {messagesLoading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">No messages yet. Say hello!</div>
              ) : (
                messages.map((msg) => {
                  const isOutgoing = msg.from === 'agent';
                  const isAi = msg.from === 'ai';
                  return (
                    <div key={msg.id} className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[70%] ${isOutgoing ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg p-2.5 md:p-3 ${
                            isOutgoing
                              ? 'bg-primary text-primary-foreground'
                              : isAi
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-muted'
                          }`}
                        >
                          {isAi && (
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                              <span className="text-xs font-medium text-green-700">AI Assistant</span>
                            </div>
                          )}
                          <p className={`whitespace-pre-line text-sm md:text-base ${isAi ? 'text-green-900' : ''}`}>
                            {msg.text}
                          </p>
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1 px-1 ${isOutgoing ? 'text-right' : ''}`}>{msg.time}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {chatMode === 'auto' && (
              <div className="p-2 md:p-3 bg-accent/50 border-t flex-shrink-0">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary mt-0.5 md:mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm">AI is handling this conversation automatically</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Switch to Manual to reply to this customer yourself.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 md:p-4 border-t flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder={chatMode === 'auto' ? 'Switch to Manual to reply...' : 'Type a message...'}
                  className="flex-1 text-sm md:text-base"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={chatMode === 'auto' || sending}
                />
                <button
                  type="submit"
                  disabled={chatMode === 'auto' || sending || !message.trim()}
                  className={`px-3 md:px-4 py-2 rounded-lg ${
                    chatMode === 'auto' || sending || !message.trim()
                      ? 'bg-secondary text-secondary-foreground opacity-50 cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {sending ? <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" /> : <Send className="w-3 h-3 md:w-4 md:h-4" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm gap-2">
            <ShoppingCart className="w-4 h-4 opacity-50" />
            Select a chat to start messaging
          </div>
        )}
      </Card>
    </div>
  );
}
