import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Server, Database, Mail, Shield, Code, Globe } from 'lucide-react';

export function SuperAdminSystem() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Server className="w-5 h-5" />
          <h3>Platform Configuration</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Platform Name</Label>
              <Input defaultValue="WhatsApp SaaS CRM" className="mt-1" />
            </div>
            <div>
              <Label>Platform URL</Label>
              <Input defaultValue="https://app.whatsappcrm.com" className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Support Email</Label>
            <Input defaultValue="support@whatsappcrm.com" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Max Businesses (Free Plan)</Label>
              <Input type="number" defaultValue="10000" className="mt-1" />
            </div>
            <div>
              <Label>Trial Period (Days)</Label>
              <Input type="number" defaultValue="14" className="mt-1" />
            </div>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            Save Configuration
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5" />
          <h3>Database Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Database Host</Label>
            <Input defaultValue="db.whatsappcrm.internal" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Connection Pool Size</Label>
              <Input type="number" defaultValue="100" className="mt-1" />
            </div>
            <div>
              <Label>Query Timeout (ms)</Label>
              <Input type="number" defaultValue="5000" className="mt-1" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p>Database Status</p>
              <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              Connected
            </span>
          </div>
          <button className="px-4 py-2 bg-secondary rounded-lg">
            Run Backup Now
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5" />
          <h3>Email & Notifications</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label>SMTP Host</Label>
            <Input defaultValue="smtp.sendgrid.net" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>SMTP Port</Label>
              <Input defaultValue="587" className="mt-1" />
            </div>
            <div>
              <Label>From Email</Label>
              <Input defaultValue="noreply@whatsappcrm.com" className="mt-1" />
            </div>
          </div>
          <div>
            <Label>SMTP Password</Label>
            <Input type="password" defaultValue="••••••••••••••••" className="mt-1" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p>Enable Email Notifications</p>
              <p className="text-sm text-muted-foreground">Send system notifications via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <button className="px-4 py-2 bg-secondary rounded-lg">
            Send Test Email
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5" />
          <h3>Security Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>Enforce 2FA for Super Admin</p>
              <p className="text-sm text-muted-foreground">Require two-factor authentication</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p>Session Timeout</p>
              <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
            </div>
            <select className="p-2 border rounded-lg bg-input-background">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
              <option>Never</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p>API Rate Limiting</p>
              <p className="text-sm text-muted-foreground">Limit API requests per minute</p>
            </div>
            <Input type="number" defaultValue="1000" className="w-32" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p>Enable IP Whitelist</p>
              <p className="text-sm text-muted-foreground">Restrict admin access to specific IPs</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-5 h-5" />
          <h3>API Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label>WhatsApp Business API Key</Label>
            <Input type="password" defaultValue="••••••••••••••••" className="mt-1" />
          </div>
          <div>
            <Label>OpenAI API Key (for AI features)</Label>
            <Input type="password" defaultValue="••••••••••••••••" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>API Version</Label>
              <Input defaultValue="v2.1.0" className="mt-1" disabled />
            </div>
            <div>
              <Label>Webhook URL</Label>
              <Input defaultValue="https://api.whatsappcrm.com/webhooks" className="mt-1" />
            </div>
          </div>
          <button className="px-4 py-2 bg-secondary rounded-lg">
            Regenerate API Keys
          </button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5" />
          <h3>Feature Flags</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>Enable AI Auto-Response (Global)</p>
              <p className="text-sm text-muted-foreground">Allow all businesses to use AI features</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p>Enable Campaigns Feature</p>
              <p className="text-sm text-muted-foreground">Allow businesses to send bulk campaigns</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p>Enable Advanced Analytics</p>
              <p className="text-sm text-muted-foreground">Provide detailed analytics to businesses</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p>Enable Beta Features</p>
              <p className="text-sm text-muted-foreground">Activate experimental features platform-wide</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p>Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Put platform in maintenance mode</p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>
    </div>
  );
}
