import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Building2, Phone, Users as UsersIcon, Sparkles, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ApiError } from '../../lib/api';

export function AdminSettings() {
  const {
    businessSettings,
    businessSettingsLoading,
    updateBusinessSettings,
    testWhatsappConnection,
    teamMembers,
    teamMembersLoading,
    addTeamMember,
    removeTeamMember,
  } = useData();

  // ---- Business info form (mirrors businessSettings once it loads) --------
  const [businessName, setBusinessName] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoSaved, setInfoSaved] = useState(false);

  // ---- WhatsApp integration form ------------------------------------------
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState('');
  const [whatsappAccessToken, setWhatsappAccessToken] = useState('');
  const [whatsappBusinessAccountId, setWhatsappBusinessAccountId] = useState('');
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ connected: boolean; message: string } | null>(null);

  // ---- AI settings ----------------------------------------------------------
  const [aiAutoReplyEnabled, setAiAutoReplyEnabled] = useState(true);
  const [aiInstructions, setAiInstructions] = useState('');
  const [savingAi, setSavingAi] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  // Populate forms once real settings arrive.
  useEffect(() => {
    if (!businessSettings) return;
    setBusinessName(businessSettings.name);
    setNotifyEmail(businessSettings.notifyEmail ?? '');
    setWhatsappPhoneNumberId(businessSettings.whatsappPhoneNumberId ?? '');
    setWhatsappAccessToken(businessSettings.whatsappAccessToken ?? '');
    setWhatsappBusinessAccountId(businessSettings.whatsappBusinessAccountId ?? '');
    setAiAutoReplyEnabled(businessSettings.aiAutoReplyEnabled);
    setAiInstructions(businessSettings.aiInstructions ?? '');
  }, [businessSettings]);

  const handleSaveBusinessInfo = async () => {
    setFormError(null);
    setSavingInfo(true);
    setInfoSaved(false);
    try {
      await updateBusinessSettings({ name: businessName, notifyEmail });
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 2500);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to save business info');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleSaveWhatsapp = async () => {
    setFormError(null);
    setSavingWhatsapp(true);
    setTestResult(null);
    try {
      await updateBusinessSettings({
        whatsappPhoneNumberId,
        whatsappAccessToken,
        whatsappBusinessAccountId,
      });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to save WhatsApp settings');
    } finally {
      setSavingWhatsapp(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testWhatsappConnection();
      setTestResult({
        connected: result.connected,
        message: result.connected
          ? `Connected${result.verifiedName ? ` as ${result.verifiedName}` : ''}${
              result.displayPhoneNumber ? ` (${result.displayPhoneNumber})` : ''
            }`
          : result.error ?? 'Could not connect',
      });
    } catch (err) {
      setTestResult({ connected: false, message: err instanceof ApiError ? err.message : 'Test failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveAi = async (nextEnabled?: boolean) => {
    setFormError(null);
    setSavingAi(true);
    try {
      await updateBusinessSettings({
        aiAutoReplyEnabled: nextEnabled ?? aiAutoReplyEnabled,
        aiInstructions,
      });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to save AI settings');
    } finally {
      setSavingAi(false);
    }
  };

  const handleToggleAiAutoReply = (checked: boolean) => {
    setAiAutoReplyEnabled(checked);
    void handleSaveAi(checked);
  };

  // ---- Team members ---------------------------------------------------------
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);
    setAddingMember(true);
    try {
      await addTeamMember({
        fullName: newMemberName,
        email: newMemberEmail,
        password: newMemberPassword,
        phone: newMemberPhone || undefined,
      });
      setShowAddMember(false);
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberPassword('');
      setNewMemberPhone('');
    } catch (err) {
      setMemberError(err instanceof ApiError ? err.message : 'Failed to add team member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (id: string) => {
    setRemovingId(id);
    try {
      await removeTeamMember(id);
    } finally {
      setRemovingId(null);
    }
  };

  if (businessSettingsLoading && !businessSettings) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl">
      {formError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          {formError}
        </div>
      )}

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <Building2 className="w-4 h-4 md:w-5 md:h-5" />
          <h3 className="text-base md:text-lg">Business Information</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
          <div>
            <Label className="text-sm md:text-base">Business Name</Label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1 text-sm md:text-base"
            />
          </div>
          <div>
            <Label className="text-sm md:text-base">Notification Email</Label>
            <Input
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 text-sm md:text-base"
            />
            <p className="text-xs text-muted-foreground mt-1">
              New-order emails from the WhatsApp AI agent are sent here.
            </p>
          </div>
          <button
            onClick={handleSaveBusinessInfo}
            disabled={savingInfo}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base disabled:opacity-60 inline-flex items-center gap-2"
          >
            {savingInfo && <Loader2 className="w-4 h-4 animate-spin" />}
            {infoSaved ? 'Saved!' : 'Save Changes'}
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
            <Label className="text-sm md:text-base">WhatsApp Phone Number ID</Label>
            <Input
              value={whatsappPhoneNumberId}
              onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
              placeholder="From Meta App Dashboard → WhatsApp → API Setup"
              className="mt-1 text-sm md:text-base"
            />
          </div>
          <div>
            <Label className="text-sm md:text-base">WhatsApp Access Token</Label>
            <Input
              type="password"
              value={whatsappAccessToken}
              onChange={(e) => setWhatsappAccessToken(e.target.value)}
              placeholder="Permanent access token"
              className="mt-1 text-sm md:text-base"
            />
          </div>
          <div>
            <Label className="text-sm md:text-base">WhatsApp Business Account ID</Label>
            <Input
              value={whatsappBusinessAccountId}
              onChange={(e) => setWhatsappBusinessAccountId(e.target.value)}
              className="mt-1 text-sm md:text-base"
            />
          </div>

          {testResult && (
            <div
              className={`flex items-start gap-2 p-3 md:p-4 rounded-lg text-sm ${
                testResult.connected
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-destructive/10 border border-destructive/20 text-destructive'
              }`}
            >
              {testResult.connected ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSaveWhatsapp}
              disabled={savingWhatsapp}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {savingWhatsapp && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
            <button
              onClick={handleTestConnection}
              disabled={testing || !businessSettings?.whatsappPhoneNumberId}
              className="px-4 py-2 bg-secondary rounded-lg hover:bg-accent text-sm md:text-base disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {testing && <Loader2 className="w-4 h-4 animate-spin" />}
              Test Connection
            </button>
          </div>
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
              <p className="text-xs md:text-sm text-muted-foreground">
                When on, the AI replies automatically to conversations set to "Auto" mode.
              </p>
            </div>
            <Switch checked={aiAutoReplyEnabled} onCheckedChange={handleToggleAiAutoReply} className="flex-shrink-0" />
          </div>
          <div>
            <Label className="text-sm md:text-base">AI Instructions</Label>
            <textarea
              className="w-full mt-1 p-2 md:p-3 border rounded-lg bg-input-background min-h-[100px] text-sm md:text-base"
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              maxLength={4000}
              placeholder="e.g. Be polite and helpful. Only quote prices from the product catalog. Ask for delivery address before confirming an order."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Folded into the AI agent's system prompt for every WhatsApp conversation. {aiInstructions.length}/4000
            </p>
          </div>
          <button
            onClick={() => handleSaveAi()}
            disabled={savingAi}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base disabled:opacity-60 inline-flex items-center gap-2"
          >
            {savingAi && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </Card>

      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <UsersIcon className="w-4 h-4 md:w-5 md:h-5" />
          <h3 className="text-base md:text-lg">Team Members</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
          {teamMembersLoading ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading team...
            </div>
          ) : teamMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No employees added yet.</p>
          ) : (
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 p-3 md:p-4 bg-muted rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm md:text-base truncate">{member.fullName}</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-xs md:text-sm text-muted-foreground">Employee</span>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={removingId === member.id}
                      className="text-xs md:text-sm text-destructive disabled:opacity-60"
                    >
                      {removingId === member.id ? 'Removing…' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              {memberError && (
                <div className="p-2.5 bg-destructive/10 border border-destructive/20 rounded-lg text-xs md:text-sm text-destructive">
                  {memberError}
                </div>
              )}
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
                <Label className="text-sm md:text-base">Temporary Password</Label>
                <Input
                  type="password"
                  value={newMemberPassword}
                  onChange={(e) => setNewMemberPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="mt-1 text-sm md:text-base"
                  minLength={8}
                  required
                />
              </div>
              <div>
                <Label className="text-sm md:text-base">Phone (optional)</Label>
                <Input
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="mt-1 text-sm md:text-base"
                />
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
                  disabled={addingMember}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {addingMember && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add Member
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
