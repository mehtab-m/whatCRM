import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

const supportTickets = [
  { id: 1, ticketId: '#SUP-1234', business: 'Tech Store Mumbai', subject: 'Unable to send WhatsApp messages', priority: 'high', status: 'open', created: '2026-04-25 10:30', replies: 3 },
  { id: 2, ticketId: '#SUP-1233', business: 'Fashion Boutique', subject: 'Billing question about Pro plan', priority: 'medium', status: 'in-progress', created: '2026-04-25 09:15', replies: 5 },
  { id: 3, ticketId: '#SUP-1232', business: 'Electronics Hub', subject: 'Feature request: Bulk product import', priority: 'low', status: 'open', created: '2026-04-24 16:45', replies: 1 },
  { id: 4, ticketId: '#SUP-1231', business: 'Home Decor Store', subject: 'How to set up automation rules', priority: 'medium', status: 'resolved', created: '2026-04-24 14:20', replies: 8 },
  { id: 5, ticketId: '#SUP-1230', business: 'Book Paradise', subject: 'Account upgrade not reflecting', priority: 'high', status: 'in-progress', created: '2026-04-24 11:30', replies: 6 },
];

const ticketConversation = [
  { id: 1, from: 'business', sender: 'Rajesh Kumar', message: 'We are unable to send WhatsApp messages to our customers. Getting error: "Connection failed"', time: '10:30 AM' },
  { id: 2, from: 'support', sender: 'Support Team', message: 'Thank you for reaching out. Can you please share your WhatsApp Business API key (last 4 digits only)?', time: '10:35 AM' },
  { id: 3, from: 'business', sender: 'Rajesh Kumar', message: 'The last 4 digits are: 4567', time: '10:38 AM' },
  { id: 4, from: 'support', sender: 'Support Team', message: 'I can see the issue. Your API quota was exceeded. I have increased it. Please try again now.', time: '10:42 AM' },
];

const supportStats = [
  { label: 'Open Tickets', value: '12', icon: MessageSquare, color: 'text-blue-600' },
  { label: 'In Progress', value: '8', icon: Clock, color: 'text-yellow-600' },
  { label: 'Resolved Today', value: '34', icon: CheckCircle, color: 'text-green-600' },
  { label: 'Avg Response Time', value: '12m', icon: Clock, color: 'text-purple-600' },
];

export function SuperAdminSupport() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {supportStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="mt-2">{stat.value}</h3>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tickets..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">All</button>
          <button className="px-4 py-2 bg-secondary rounded-lg">Open</button>
          <button className="px-4 py-2 bg-secondary rounded-lg">In Progress</button>
          <button className="px-4 py-2 bg-secondary rounded-lg">Resolved</button>
        </div>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-3 px-4">Ticket ID</th>
                <th className="text-left py-3 px-4">Business</th>
                <th className="text-left py-3 px-4">Subject</th>
                <th className="text-left py-3 px-4">Priority</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Replies</th>
                <th className="text-left py-3 px-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <td className="py-3 px-4">{ticket.ticketId}</td>
                  <td className="py-3 px-4">{ticket.business}</td>
                  <td className="py-3 px-4">{ticket.subject}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{ticket.replies} replies</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{ticket.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedTicket.ticketId} - {selectedTicket.subject}</span>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Business</p>
                <p>{selectedTicket.business}</p>
                <p className="text-xs text-muted-foreground mt-2">Created: {selectedTicket.created}</p>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {ticketConversation.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg ${
                      msg.from === 'support' ? 'bg-primary/10' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">{msg.sender}</p>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <textarea
                  className="w-full p-3 border rounded-lg bg-input-background min-h-[100px]"
                  placeholder="Type your reply..."
                ></textarea>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                    Send Reply
                  </button>
                  <select className="px-4 py-2 border rounded-lg bg-input-background">
                    <option>Mark as In Progress</option>
                    <option>Mark as Resolved</option>
                    <option>Mark as Open</option>
                  </select>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
