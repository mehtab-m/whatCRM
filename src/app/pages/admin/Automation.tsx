import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Zap, Clock, MessageSquare, ShoppingCart, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const automationRules = [
  {
    id: 1,
    name: 'Welcome Message',
    trigger: 'New customer first message',
    action: 'Send welcome template',
    status: true,
    executions: 145,
  },
  {
    id: 2,
    name: 'Order Confirmation',
    trigger: 'Order created',
    action: 'Send confirmation message',
    status: true,
    executions: 89,
  },
  {
    id: 3,
    name: 'Follow-up Reminder',
    trigger: '24 hours after order',
    action: 'Send follow-up message',
    status: true,
    executions: 67,
  },
  {
    id: 4,
    name: 'Price Inquiry Response',
    trigger: 'Message contains "price"',
    action: 'Send product catalog',
    status: false,
    executions: 234,
  },
  {
    id: 5,
    name: 'Abandoned Cart',
    trigger: 'No response for 1 hour',
    action: 'Send reminder',
    status: true,
    executions: 45,
  },
];

const messageTemplates = [
  { id: 1, name: 'Welcome Message', content: 'Hello! Welcome to our store. How can I help you today?', category: 'Greeting' },
  { id: 2, name: 'Order Confirmation', content: 'Your order #{ORDER_ID} has been confirmed. Total: {AMOUNT}', category: 'Order' },
  { id: 3, name: 'Shipping Update', content: 'Your order is on the way! Track: {TRACKING_LINK}', category: 'Order' },
  { id: 4, name: 'Product Catalog', content: 'Here are our latest products: {PRODUCT_LIST}', category: 'Sales' },
];

export function AdminAutomation() {
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [view, setView] = useState<'rules' | 'templates'>('rules');

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setView('rules')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
              view === 'rules' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <span className="hidden sm:inline">Automation Rules</span>
            <span className="sm:hidden">Rules</span>
          </button>
          <button
            onClick={() => setView('templates')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
              view === 'templates' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <span className="hidden sm:inline">Message Templates</span>
            <span className="sm:hidden">Templates</span>
          </button>
        </div>
        <button
          onClick={() => setShowCreateRule(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <Plus className="w-4 h-4" />
          Create {view === 'rules' ? 'Rule' : 'Template'}
        </button>
      </div>

      {view === 'rules' ? (
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {automationRules.map((rule) => (
            <Card key={rule.id} className="p-4 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0">
                  <div className="p-2 md:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-base md:text-lg truncate">{rule.name}</h3>
                      <Switch checked={rule.status} className="self-start sm:self-auto" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                      <div className="flex items-start gap-1.5 md:gap-2">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-muted-foreground">Trigger</p>
                          <p className="break-words">{rule.trigger}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5 md:gap-2">
                        <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-muted-foreground">Action</p>
                          <p className="break-words">{rule.action}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1 md:pt-2">
                      <Badge variant="secondary" className="text-xs">
                        {rule.executions} executions
                      </Badge>
                      <Badge variant={rule.status ? 'default' : 'secondary'} className="text-xs">
                        {rule.status ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {messageTemplates.map((template) => (
            <Card key={template.id} className="p-4 md:p-6">
              <div className="space-y-2 md:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-base md:text-lg truncate">{template.name}</h3>
                  <Badge variant="secondary" className="text-xs self-start sm:self-auto">{template.category}</Badge>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground bg-muted p-2 md:p-3 rounded-lg break-words">
                  {template.content}
                </p>
                <div className="flex gap-2 pt-1 md:pt-2">
                  <button className="flex-1 px-3 py-2 bg-secondary rounded-lg hover:bg-accent text-sm md:text-base">
                    Edit
                  </button>
                  <button className="px-3 py-2 bg-secondary rounded-lg hover:bg-accent text-sm md:text-base">
                    Test
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showCreateRule && (
        <Dialog open={showCreateRule} onOpenChange={setShowCreateRule}>
          <DialogContent className="max-w-full sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Create Automation Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 md:space-y-4">
              <div>
                <Label className="text-sm md:text-base">Rule Name</Label>
                <Input placeholder="Enter rule name" className="mt-1 text-sm md:text-base" />
              </div>
              <div>
                <Label className="text-sm md:text-base">Trigger</Label>
                <select className="w-full mt-1 p-2 border rounded-lg bg-input-background text-sm md:text-base">
                  <option>New message received</option>
                  <option>Order created</option>
                  <option>Message contains keyword</option>
                  <option>Time-based trigger</option>
                </select>
              </div>
              <div>
                <Label className="text-sm md:text-base">Action</Label>
                <select className="w-full mt-1 p-2 border rounded-lg bg-input-background text-sm md:text-base">
                  <option>Send message template</option>
                  <option>Create order</option>
                  <option>Add tag to customer</option>
                  <option>Notify admin</option>
                </select>
              </div>
              <div>
                <Label className="text-sm md:text-base">Message Template</Label>
                <textarea
                  className="w-full mt-1 p-2 border rounded-lg bg-input-background min-h-[100px] text-sm md:text-base"
                  placeholder="Enter message template..."
                ></textarea>
              </div>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm md:text-base">
                Create Rule
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
