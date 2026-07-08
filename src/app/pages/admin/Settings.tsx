import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Building2, Phone, Users as UsersIcon, Sparkles, X } from 'lucide-react';

export function AdminSettings() {
  const [businessName, setBusinessName] = useState('My Business');
  const [businessEmail, setBusinessEmail] = useState('business@example.com');
  const [address, setAddress] = useState('123 Main Street, Mumbai, India');
  const [city, setCity] = useState('Mumbai');
  const [postalCode, setPostalCode] = useState('400001');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98765 43210');

  const [aiAutoResponse, setAiAutoResponse] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoCreateOrders, setAutoCreateOrders] = useState(false);
  const [aiTone, setAiTone] = useState('Professional');
  const [aiBehavior, setAiBehavior] = useState('Always be polite and helpful. Provide product information when asked. Suggest related products when appropriate.');

  const [notifyNewOrders, setNotifyNewOrders] = useState(true);
  const [notifyNewMessages, setNotifyNewMessages] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Agent');

  const handleSaveBusinessInfo = () => {
    alert('Business information saved successfully!');
  };

  const handleTestConnection = () => {
    alert('Testing WhatsApp connection...\n\n✅ Connection successful!');
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Team member ${newMemberName} added successfully!`);
    setShowAddMember(false);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRole('Agent');
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl">
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Building2 className="w-4 h-4 md:w-5 md:h-5" />
          <h3 className="text-base md:text-lg">Business Information</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <Label className="text-sm md:text-base">Business Name</Label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-1 text-sm md:text-base"
              />
            </div>
            <div>
              <Label className="text-sm md:text-base">Business Email</Label>
              <Input
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="mt-1 text-sm md:text-base"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm md:text-base">Business Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 text-sm md:text-base"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <Label className="text-sm md:text-base">City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 text-sm md:text-base"
              />
            </div>
            <div>
              <Label className="text-sm md:text-base">Postal Code</Label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="mt-1 text-sm md:text-base"
              />
            </div>
          </div>
          <button
            onClick={handleSaveBusinessInfo}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base"
          >
            Save Changes
          </button>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Phone className="w-4 h-4 md:w-5 md:h-5" />
          <h3 className="text-base md:text-lg">WhatsApp Integration</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
          <div>
            <Label className="text-sm md:text-base">WhatsApp Business Number</Label>
            <Input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="mt-1 text-sm md:text-base"
            />
          </div>
          <div>
            <Label className="text-sm md:text-base">WhatsApp Business API Key</Label>
            <Input type="password" defaultValue="••••••••••••••••" className="mt-1 text-sm md:text-base" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 md:p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm md:text-base">Connection Status</p>
              <p className="text-xs md:text-sm text-muted-foreground">Last synced: 2 minutes ago</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs md:text-sm whitespace-nowrap self-start sm:self-auto">
              Connected
            </span>
          </div>
          <button
            onClick={handleTestConnection}
            className="px-4 py-2 bg-secondary rounded-lg hover:bg-accent text-sm md:text-base"
          >
            Test Connection
          </button>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
          <h3 className="text-base md:text-lg">AI Settings</h3>
        </div>
        <div className="space-y-4 md:space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base">Enable AI Auto-Response</p>
              <p className="text-xs md:text-sm text-muted-foreground">AI will automatically respond to customer messages</p>
            </div>
            <Switch
              checked={aiAutoResponse}
              onCheckedChange={setAiAutoResponse}
              className="flex-shrink-0"
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base">AI Suggestions</p>
              <p className="text-xs md:text-sm text-muted-foreground">Show AI-powered response suggestions</p>
            </div>
            <Switch
              checked={aiSuggestions}
              onCheckedChange={setAiSuggestions}
              className="flex-shrink-0"
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base">Auto-Create Orders</p>
              <p className="text-xs md:text-sm text-muted-foreground">Let AI create orders from conversations</p>
            </div>
            <Switch
              checked={autoCreateOrders}
              onCheckedChange={setAutoCreateOrders}
              className="flex-shrink-0"
            />
          </div>
          <div>
            <Label className="text-sm md:text-base">AI Response Tone</Label>
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg bg-input-background text-sm md:text-base"
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Casual</option>
              <option>Formal</option>
            </select>
          </div>
          <div>
            <Label className="text-sm md:text-base">AI Behavior Instructions</Label>
            <textarea
              className="w-full mt-1 p-2 md:p-3 border rounded-lg bg-input-background min-h-[100px] text-sm md:text-base"
              value={aiBehavior}
              onChange={(e) => setAiBehavior(e.target.value)}
            ></textarea>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <UsersIcon className="w-4 h-4 md:w-5 md:h-5" />
          <h3 className="text-base md:text-lg">Team Members</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
          <div className="space-y-2">
            {[
              { name: 'Admin User', email: 'admin@business.com', role: 'Owner' },
              { name: 'Support Agent 1', email: 'support1@business.com', role: 'Agent' },
              { name: 'Support Agent 2', email: 'support2@business.com', role: 'Agent' },
            ].map((member, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 md:p-4 bg-muted rounded-lg">
                <div className="min-w-0 flex-1">
                  <p className="text-sm md:text-base truncate">{member.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{member.email}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xs md:text-sm text-muted-foreground">{member.role}</span>
                  {i > 0 && (
                    <button className="text-xs md:text-sm text-destructive">Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAddMember(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base"
          >
            + Add Team Member
          </button>
        </div>
      </Card>

      {showAddMember && (
        <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
          <DialogContent className="max-w-full sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Add Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTeamMember} className="space-y-3 md:space-y-4">
              <div>
                <Label className="text-sm md:text-base">Full Name</Label>
                <Input
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Email Address</Label>
                <Input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="mt-1 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Role</Label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg bg-input-background text-sm md:text-base"
                >
                  <option>Agent</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 px-4 py-2 bg-secondary rounded-lg hover:bg-accent text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base"
                >
                  Add Member
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <Card className="p-4 md:p-6">
        <div className="mb-4 md:mb-6">
          <h3 className="text-base md:text-lg">Notifications</h3>
        </div>
        <div className="space-y-4 md:space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base">New Order Notifications</p>
              <p className="text-xs md:text-sm text-muted-foreground">Get notified when new orders are created</p>
            </div>
            <Switch
              checked={notifyNewOrders}
              onCheckedChange={setNotifyNewOrders}
              className="flex-shrink-0"
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base">New Message Notifications</p>
              <p className="text-xs md:text-sm text-muted-foreground">Get notified for new customer messages</p>
            </div>
            <Switch
              checked={notifyNewMessages}
              onCheckedChange={setNotifyNewMessages}
              className="flex-shrink-0"
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base">Daily Summary Email</p>
              <p className="text-xs md:text-sm text-muted-foreground">Receive daily summary of activity</p>
            </div>
            <Switch
              checked={dailySummary}
              onCheckedChange={setDailySummary}
              className="flex-shrink-0"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
