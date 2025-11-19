import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApplicantSidebar } from "@/components/ApplicantSidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface MessagesProps {
  userRole?: "applicant" | "organization";
}

const Messages = ({ userRole = "applicant" }: MessagesProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: "1",
      participantName: "TechCorp Solutions",
      participantRole: "Organization",
      lastMessage: "Thanks for your application! We'd love to schedule an interview.",
      timestamp: "2 min ago",
      unread: 2,
    },
    {
      id: "2",
      participantName: "StartupHub Inc",
      participantRole: "Organization",
      lastMessage: "Could you share more details about your React experience?",
      timestamp: "1 hour ago",
      unread: 0,
    },
    {
      id: "3",
      participantName: "Digital Agency Co",
      participantRole: "Organization",
      lastMessage: "Great! Looking forward to meeting you.",
      timestamp: "Yesterday",
      unread: 0,
    },
  ];

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: "1",
      senderId: "org1",
      senderName: "TechCorp Solutions",
      content: "Hi! Thank you for applying to our Frontend Developer internship position.",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: "2",
      senderId: "user1",
      senderName: "You",
      content: "Thank you! I'm really excited about this opportunity.",
      timestamp: "10:35 AM",
      isOwn: true,
    },
    {
      id: "3",
      senderId: "org1",
      senderName: "TechCorp Solutions",
      content: "We've reviewed your resume and we're impressed with your projects. Would you be available for an interview next week?",
      timestamp: "11:00 AM",
      isOwn: false,
    },
    {
      id: "4",
      senderId: "user1",
      senderName: "You",
      content: "Yes, I'm available! What days work best for you?",
      timestamp: "11:05 AM",
      isOwn: true,
    },
    {
      id: "5",
      senderId: "org1",
      senderName: "TechCorp Solutions",
      content: "Thanks for your application! We'd love to schedule an interview.",
      timestamp: "Just now",
      isOwn: false,
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Send message via backend
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

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
                {filteredConversations.map((conversation) => (
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
                          {conversation.participantName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm text-foreground truncate">
                            {conversation.participantName}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <div className="mt-1">
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                              {conversation.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
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
                          {selectedConv.participantName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-foreground">
                          {selectedConv.participantName}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedConv.participantRole}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3",
                            message.isOwn && "flex-row-reverse"
                          )}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={cn(
                                message.isOwn
                                  ? "bg-secondary text-secondary-foreground"
                                  : "bg-primary text-primary-foreground"
                              )}
                            >
                              {message.senderName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              "flex flex-col gap-1 max-w-[70%]",
                              message.isOwn && "items-end"
                            )}
                          >
                            <div
                              className={cn(
                                "rounded-lg px-4 py-2",
                                message.isOwn
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground"
                              )}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
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
