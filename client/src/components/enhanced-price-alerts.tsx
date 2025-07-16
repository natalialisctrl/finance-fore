import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Plus, Trash2, TrendingDown, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriceAlert {
  id: string;
  itemName: string;
  targetPrice: number;
  currentPrice: number;
  alertType: "below" | "above" | "percentage";
  percentageChange?: number;
  isActive: boolean;
  createdAt: Date;
}

interface EnhancedPriceAlertsProps {
  priceData?: any[];
}

export function EnhancedPriceAlerts({ priceData = [] }: EnhancedPriceAlertsProps) {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: "1",
      itemName: "Eggs",
      targetPrice: 2.50,
      currentPrice: 2.89,
      alertType: "below",
      isActive: true,
      createdAt: new Date()
    },
    {
      id: "2", 
      itemName: "Ground Beef",
      targetPrice: 5.00,
      currentPrice: 6.99,
      alertType: "percentage",
      percentageChange: 10,
      isActive: true,
      createdAt: new Date()
    }
  ]);
  
  const [newAlert, setNewAlert] = useState({
    itemName: "",
    targetPrice: "",
    alertType: "below" as const,
    percentageChange: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateAlert = () => {
    if (!newAlert.itemName || !newAlert.targetPrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const currentItem = priceData.find(item => 
      item.itemName.toLowerCase().includes(newAlert.itemName.toLowerCase())
    );

    const alert: PriceAlert = {
      id: Date.now().toString(),
      itemName: newAlert.itemName,
      targetPrice: parseFloat(newAlert.targetPrice),
      currentPrice: currentItem?.currentPrice || 0,
      alertType: newAlert.alertType,
      percentageChange: newAlert.percentageChange ? parseFloat(newAlert.percentageChange) : undefined,
      isActive: true,
      createdAt: new Date()
    };

    setAlerts(prev => [...prev, alert]);
    setNewAlert({ itemName: "", targetPrice: "", alertType: "below", percentageChange: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Alert Created",
      description: `Price alert set for ${alert.itemName}`,
    });
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Alert Deleted",
      description: "Price alert has been removed",
    });
  };

  const getAlertStatus = (alert: PriceAlert) => {
    if (alert.alertType === "below") {
      return alert.currentPrice <= alert.targetPrice ? "triggered" : "waiting";
    } else if (alert.alertType === "above") {
      return alert.currentPrice >= alert.targetPrice ? "triggered" : "waiting";
    } else if (alert.alertType === "percentage" && alert.percentageChange) {
      const change = ((alert.currentPrice - alert.targetPrice) / alert.targetPrice) * 100;
      return Math.abs(change) >= alert.percentageChange ? "triggered" : "waiting";
    }
    return "waiting";
  };

  const getStatusColor = (status: string) => {
    return status === "triggered" 
      ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200"
      : "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200";
  };

  return (
    <Card className="glass-card mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center pulse-orange">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Price Alerts
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Custom notifications for price targets
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Item Name</label>
                  <Input
                    value={newAlert.itemName}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, itemName: e.target.value }))}
                    placeholder="e.g., Eggs, Ground Beef"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Alert Type</label>
                  <Select 
                    value={newAlert.alertType} 
                    onValueChange={(value: "below" | "above" | "percentage") => 
                      setNewAlert(prev => ({ ...prev, alertType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below">Price drops below</SelectItem>
                      <SelectItem value="above">Price rises above</SelectItem>
                      <SelectItem value="percentage">Percentage change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newAlert.alertType !== "percentage" ? (
                  <div>
                    <label className="text-sm font-medium">Target Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newAlert.targetPrice}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium">Base Price ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newAlert.targetPrice}
                        onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Percentage Change (%)</label>
                      <Input
                        type="number"
                        step="1"
                        value={newAlert.percentageChange}
                        onChange={(e) => setNewAlert(prev => ({ ...prev, percentageChange: e.target.value }))}
                        placeholder="10"
                      />
                    </div>
                  </>
                )}
                
                <Button onClick={handleCreateAlert} className="w-full">
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No price alerts set. Create your first alert to get notified when prices hit your targets.
            </div>
          ) : (
            alerts.map((alert) => {
              const status = getAlertStatus(alert);
              return (
                <div key={alert.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      {alert.alertType === "below" ? (
                        <TrendingDown className="w-4 h-4 text-emerald-600" />
                      ) : alert.alertType === "above" ? (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {alert.itemName}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {alert.alertType === "below" && `Alert when below $${alert.targetPrice}`}
                        {alert.alertType === "above" && `Alert when above $${alert.targetPrice}`}
                        {alert.alertType === "percentage" && `Alert on ${alert.percentageChange}% change from $${alert.targetPrice}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(status)}>
                      {status === "triggered" ? "Triggered" : "Waiting"}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        ${alert.currentPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Current
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}