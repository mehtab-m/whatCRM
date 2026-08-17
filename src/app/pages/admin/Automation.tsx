import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Zap, MessageSquare, Sparkles, CheckCircle2, XCircle, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface AdminAutomationProps {
  onNavigateToSettings?: () => void;
}

export function AdminAutomation({ onNavigateToSettings }: AdminAutomationProps) {
  const { businessSettings, businessSettingsLoading } = useData();

  const whatsappConnected = Boolean(businessSettings?.whatsappPhoneNumberId && businessSettings?.whatsappAccessToken);
  const aiEnabled = businessSettings?.aiAutoReplyEnabled ?? false;

  if (businessSettingsLoading && !businessSettings) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading automation status...
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
              <h3 className="text-sm md:text-base">WhatsApp Connection</h3>
            </div>
            {whatsappConnected ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="w-3 h-3" /> Not connected
              </Badge>
            )}
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            {whatsappConnected
              ? 'Your WhatsApp Business number is linked. Test it any time from Settings.'
              : 'Add your WhatsApp Business API credentials in Settings to start receiving messages.'}
          </p>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              <h3 className="text-sm md:text-base">AI Auto-Reply</h3>
            </div>
            {aiEnabled ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                <CheckCircle2 className="w-3 h-3" /> Enabled
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="w-3 h-3" /> Disabled
              </Badge>
            )}
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            {aiEnabled
              ? 'The AI replies automatically to conversations set to "Auto" mode in Chats.'
              : 'Turn this on in Settings so the AI can reply to customers automatically.'}
          </p>
        </Card>
      </div>

      {businessSettings?.aiInstructions && (
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
            <h3 className="text-sm md:text-base">Current AI Instructions</h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground bg-muted p-3 rounded-lg whitespace-pre-line">
            {businessSettings.aiInstructions}
          </p>
        </Card>
      )}

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <SettingsIcon className="w-4 h-4 md:w-5 md:h-5" />
          <h3 className="text-sm md:text-base">How the WhatsApp AI agent works</h3>
        </div>
        <ol className="space-y-3 text-xs md:text-sm text-muted-foreground list-decimal list-inside">
          <li>
            A customer messages your WhatsApp Business number, from anywhere — no matter how they found it.
          </li>
          <li>
            The automation workflow looks up your business by that number, reads your live product catalog, and
            asks the AI (using your AI Instructions above) how to reply.
          </li>
          <li>
            The reply is sent back on WhatsApp and saved to that customer's conversation — visible in{' '}
            <span className="text-foreground">Chats</span> in real time.
          </li>
          <li>
            When the customer confirms an order, it's created automatically and shows up in{' '}
            <span className="text-foreground">Orders</span>.
          </li>
          <li>
            Switch any conversation to <span className="text-foreground">Manual</span> in Chats to take over and
            reply yourself — the AI stays silent until you switch it back to{' '}
            <span className="text-foreground">Auto</span>.
          </li>
        </ol>
      </Card>

      <Card className="p-4 md:p-6 bg-accent/30">
        <p className="text-xs md:text-sm text-muted-foreground">
          Connection status and AI behavior are configured in{' '}
          <button onClick={onNavigateToSettings} className="text-primary hover:underline">
            Settings
          </button>
          . The automation workflow itself is deployed once by your platform admin and serves every business
          automatically — you only need to fill in your WhatsApp credentials above.
        </p>
      </Card>
    </div>
  );
}
