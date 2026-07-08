import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Megaphone, Users, Send, Calendar, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

const campaignsData = [
  { id: 1, name: 'Summer Sale 2026', audience: 856, sent: 856, opened: 645, clicked: 234, status: 'completed', date: '2026-04-20' },
  { id: 2, name: 'New Product Launch', audience: 1234, sent: 1234, opened: 892, clicked: 445, status: 'completed', date: '2026-04-18' },
  { id: 3, name: 'Weekend Special', audience: 456, sent: 0, opened: 0, clicked: 0, status: 'scheduled', date: '2026-04-27' },
  { id: 4, name: 'Flash Sale Alert', audience: 2145, sent: 0, opened: 0, clicked: 0, status: 'draft', date: null },
];

export function AdminCampaigns() {
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1">
          <button className="px-3 md:px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs md:text-base whitespace-nowrap">
            All Campaigns
          </button>
          <button className="px-3 md:px-4 py-2 bg-secondary rounded-lg text-xs md:text-base whitespace-nowrap">Completed</button>
          <button className="px-3 md:px-4 py-2 bg-secondary rounded-lg text-xs md:text-base whitespace-nowrap">Scheduled</button>
          <button className="px-3 md:px-4 py-2 bg-secondary rounded-lg text-xs md:text-base whitespace-nowrap">Drafts</button>
        </div>
        <button
          onClick={() => setShowCreateCampaign(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 text-sm md:text-base flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {campaignsData.map((campaign) => (
          <Card
            key={campaign.id}
            className="p-4 md:p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedCampaign(campaign)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0">
                <div className="p-2 md:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                  <Megaphone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-base md:text-lg truncate">{campaign.name}</h3>
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${getStatusColor(campaign.status)} self-start sm:self-auto whitespace-nowrap`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Audience</p>
                      <p className="flex items-center gap-1 mt-0.5 md:mt-1 text-sm md:text-base">
                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                        {campaign.audience.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Sent</p>
                      <p className="flex items-center gap-1 mt-0.5 md:mt-1 text-sm md:text-base">
                        <Send className="w-3 h-3 md:w-4 md:h-4" />
                        {campaign.sent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Open Rate</p>
                      <p className="mt-0.5 md:mt-1 text-sm md:text-base">
                        {campaign.sent > 0 ? `${((campaign.opened / campaign.sent) * 100).toFixed(1)}%` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Click Rate</p>
                      <p className="mt-0.5 md:mt-1 text-sm md:text-base">
                        {campaign.sent > 0 ? `${((campaign.clicked / campaign.sent) * 100).toFixed(1)}%` : '-'}
                      </p>
                    </div>
                  </div>

                  {campaign.date && (
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{campaign.date}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showCreateCampaign && (
        <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
          <DialogContent className="max-w-full sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 md:space-y-4">
              <div>
                <Label className="text-sm md:text-base">Campaign Name</Label>
                <Input placeholder="Enter campaign name" className="mt-1 text-sm md:text-base" />
              </div>

              <div>
                <Label className="text-sm md:text-base">Target Audience</Label>
                <select className="w-full mt-1 p-2 border rounded-lg bg-input-background text-sm md:text-base">
                  <option>All Customers</option>
                  <option>VIP Customers</option>
                  <option>Regular Customers</option>
                  <option>New Customers</option>
                  <option>Custom Segment</option>
                </select>
              </div>

              <div>
                <Label className="text-sm md:text-base">Message</Label>
                <textarea
                  className="w-full mt-1 p-2 md:p-3 border rounded-lg bg-input-background min-h-[120px] md:min-h-[150px] text-sm md:text-base"
                  placeholder="Enter your campaign message..."
                ></textarea>
                <p className="text-xs text-muted-foreground mt-1">
                  Use variables: {'{NAME}'}, {'{PRODUCT}'}, {'{DISCOUNT}'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label className="text-sm md:text-base">Schedule Type</Label>
                  <select className="w-full mt-1 p-2 border rounded-lg bg-input-background text-sm md:text-base">
                    <option>Send Now</option>
                    <option>Schedule for Later</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm md:text-base">Date & Time</Label>
                  <Input type="datetime-local" className="mt-1 text-sm md:text-base" />
                </div>
              </div>

              <div className="bg-muted p-3 md:p-4 rounded-lg">
                <p className="text-xs md:text-sm">Campaign Preview</p>
                <div className="mt-2 p-2 md:p-3 bg-background rounded border">
                  <p className="text-xs md:text-sm">Your message will appear here...</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button className="flex-1 px-4 py-2 bg-secondary rounded-lg text-sm md:text-base">
                  Save as Draft
                </button>
                <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm md:text-base">
                  Schedule Campaign
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-full sm:max-w-md md:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">{selectedCampaign.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                <Card className="p-3 md:p-4">
                  <p className="text-xs md:text-sm text-muted-foreground">Audience</p>
                  <p className="text-lg md:text-2xl mt-1">{selectedCampaign.audience.toLocaleString()}</p>
                </Card>
                <Card className="p-3 md:p-4">
                  <p className="text-xs md:text-sm text-muted-foreground">Sent</p>
                  <p className="text-lg md:text-2xl mt-1">{selectedCampaign.sent.toLocaleString()}</p>
                </Card>
                <Card className="p-3 md:p-4">
                  <p className="text-xs md:text-sm text-muted-foreground">Opened</p>
                  <p className="text-lg md:text-2xl mt-1">{selectedCampaign.opened.toLocaleString()}</p>
                </Card>
                <Card className="p-3 md:p-4">
                  <p className="text-xs md:text-sm text-muted-foreground">Clicked</p>
                  <p className="text-lg md:text-2xl mt-1">{selectedCampaign.clicked.toLocaleString()}</p>
                </Card>
              </div>

              <div>
                <h4 className="mb-2 text-sm md:text-base">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm">Open Rate</span>
                    <span className="text-sm md:text-base">
                      {selectedCampaign.sent > 0
                        ? `${((selectedCampaign.opened / selectedCampaign.sent) * 100).toFixed(1)}%`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm">Click-through Rate</span>
                    <span className="text-sm md:text-base">
                      {selectedCampaign.sent > 0
                        ? `${((selectedCampaign.clicked / selectedCampaign.sent) * 100).toFixed(1)}%`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm">Conversion Rate</span>
                    <span className="text-sm md:text-base">
                      {selectedCampaign.sent > 0
                        ? `${((selectedCampaign.clicked / selectedCampaign.sent) * 100 * 0.3).toFixed(1)}%`
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
