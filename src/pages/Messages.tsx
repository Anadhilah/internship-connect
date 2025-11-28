import { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApplicantSidebar } from "@/components/ApplicantSidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ConversationData {
  id: string;
  participant1_id: string;
  participant2_id: string;
  updated_at: string;
}

interface ParticipantProfile {
  name: string;
  role: string;
}

interface MessagesProps {
  userRole?: "applicant" | "organization";
}

const Messages = ({ userRole = "applicant" }: MessagesProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<(ConversationData & { participant: ParticipantProfile; lastMessage?: string })[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch conversations
  useEffect(() => {
    if (!currentUserId) return;

    const fetchConversations = async () => {
      try {
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .or(`participant1_id.eq.${currentUserId},participant2_id.eq.${currentUserId}`)
          .order('updated_at', { ascending: false });

        if (convError) throw convError;

        if (convData) {
          // Fetch participant details
          const conversationsWithDetails = await Promise.all(
            convData.map(async (conv) => {
              const otherUserId = conv.participant1_id === currentUserId 
                ? conv.participant2_id 
                : conv.participant1_id;

              // Get user role
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', otherUserId)
                .single();

              let name = 'Unknown User';
              let role = 'User';

              if (roleData) {
                // Fetch profile based on role
                if (roleData.role === 'intern') {
                  const { data: profile } = await supabase
                    .from('intern_profiles')
                    .select('full_name')
                    .eq('user_id', otherUserId)
                    .single();
                  name = profile?.full_name || 'Applicant';
                  role = 'Applicant';
                } else if (roleData.role === 'organization') {
                  const { data: profile } = await supabase
                    .from('organization_profiles')
                    .select('company_name')
                    .eq('user_id', otherUserId)
                    .single();
                  name = profile?.company_name || 'Organization';
                  role = 'Organization';
                }
              }

              // Get last message
              const { data: lastMsg } = await supabase
                .from('messages')
                .select('content')
                .eq('conversation_id', conv.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

              return {
                ...conv,
                participant: { name, role },
                lastMessage: lastMsg?.content || 'No messages yet'
              };
            })
          );

          setConversations(conversationsWithDetails);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId, toast]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', selectedConversation)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);

        // Scroll to bottom
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${selectedConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !currentUserId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: currentUserId,
          content: messageInput.trim()
        });

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedConversation);

      setMessageInput("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          {userRole === "applicant" ? <ApplicantSidebar /> : <OrganizationSidebar />}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const Sidebar = userRole === "applicant" ? ApplicantSidebar : OrganizationSidebar;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Chat with {userRole === "applicant" ? "organizations" : "applicants"}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Conversations List */}
            <div className="w-80 border-r border-border bg-card flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <ScrollArea className="flex-1">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No conversations yet
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={cn(
                        "w-full p-4 border-b border-border text-left hover:bg-accent transition-colors",
                        selectedConversation === conversation.id && "bg-accent"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {conversation.participant.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm text-foreground truncate">
                              {conversation.participant.name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(conversation.updated_at), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-background">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="border-b border-border bg-card px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {selectedConv.participant.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-foreground">
                          {selectedConv.participant.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedConv.participant.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          No messages yet. Start the conversation!
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isOwn = message.sender_id === currentUserId;
                          return (
                            <div
                              key={message.id}
                              className={cn(
                                "flex gap-3",
                                isOwn && "flex-row-reverse"
                              )}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback
                                  className={cn(
                                    isOwn
                                      ? "bg-secondary text-secondary-foreground"
                                      : "bg-primary text-primary-foreground"
                                  )}
                                >
                                  {isOwn ? 'ME' : selectedConv.participant.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={cn(
                                  "flex flex-col gap-1 max-w-[70%]",
                                  isOwn && "items-end"
                                )}
                              >
                                <div
                                  className={cn(
                                    "rounded-lg px-4 py-2",
                                    isOwn
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-foreground"
                                  )}
                                >
                                  <p className="text-sm">{message.content}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(message.created_at), 'h:mm a')}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t border-border bg-card p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Messages;
