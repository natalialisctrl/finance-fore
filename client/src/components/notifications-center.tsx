import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, AlertTriangle, Info, TrendingUp, Settings, X, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useLocationAlerts } from './geo-location-service';
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  title: string;
  message: string;
  notificationType: 'success' | 'warning' | 'info' | 'urgent';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const { locationAlerts, location } = useLocationAlerts();
  const { toast } = useToast();

  // Sample notifications for demonstration
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: 1,
        title: "Price Alert: Eggs",
        message: "Eggs have dropped to $2.49 - 15% below your target price. Consider buying now to save $0.40 per dozen.",
        notificationType: 'success',
        isRead: false,
        actionUrl: '/dashboard/shopping',
        createdAt: '2025-07-20T14:30:00Z'
      },
      {
        id: 2,
        title: "Goal Milestone Reached",
        message: "Congratulations! You've reached 50% of your Emergency Fund goal. You're on track to complete it by December.",
        notificationType: 'success',
        isRead: false,
        actionUrl: '/goals',
        createdAt: '2025-07-20T10:15:00Z'
      },
      {
        id: 3,
        title: "Budget Threshold Warning",
        message: "You've spent 85% of your Entertainment budget this month. Consider reducing discretionary spending.",
        notificationType: 'warning',
        isRead: true,
        actionUrl: '/budget',
        createdAt: '2025-07-19T16:45:00Z'
      },
      {
        id: 4,
        title: "Market Update",
        message: "Inflation rate decreased to 2.5% this month, potentially leading to lower grocery prices next quarter.",
        notificationType: 'info',
        isRead: false,
        createdAt: '2025-07-19T09:00:00Z'
      },
      {
        id: 5,
        title: "Debt Payoff Progress",
        message: "Your credit card balance is now under $2,000. You could be debt-free 6 months earlier with an extra $75/month.",
        notificationType: 'urgent',
        isRead: false,
        actionUrl: '/debt',
        createdAt: '2025-07-18T11:20:00Z'
      }
    ];

    // Add location-based notifications
    const locationNotifications: Notification[] = locationAlerts
      .filter(alert => alert.severity === 'high' || alert.daysOut <= 3)
      .map((alert, index) => ({
        id: 100 + index,
        title: `📍 ${location?.city} - ${alert.title}`,
        message: `${alert.message}. ${alert.prediction}. ${alert.actionSuggestion || ''}`,
        notificationType: alert.severity === 'high' ? 'urgent' as const : 'warning' as const,
        isRead: false,
        createdAt: new Date().toISOString()
      }));

    setNotifications([...locationNotifications, ...sampleNotifications]);
  }, [locationAlerts, location]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'urgent': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBadgeStyle = (type: string) => {
    const styles = {
      success: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
      warning: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
      urgent: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800",
      info: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
    };
    return styles[type] || styles.info;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'urgent') return notif.notificationType === 'urgent';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
              <Bell className="w-5 h-5 text-white" />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Notifications
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {unreadCount} unread notifications
            </p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="btn-premium">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Settings</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Push Notifications</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Alerts</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Price Alerts</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Budget Warnings</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Goal Milestones</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => {
                  // Close dialog without saving
                }}>Cancel</Button>
                <Button onClick={() => {
                  // Save notification preferences
                  toast({
                    title: "Notification Settings Saved",
                    description: "Your notification preferences have been updated successfully.",
                  });
                }}>Save Settings</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="btn-premium"
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
          className="btn-premium"
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'urgent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('urgent')}
          className="btn-premium"
        >
          Urgent ({notifications.filter(n => n.notificationType === 'urgent').length})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                You're all caught up! Check back later for updates.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`glass-card cursor-pointer transition-all duration-300 hover:scale-102 ${
                !notification.isRead ? 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10' : ''
              }`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.notificationType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-lg font-semibold ${!notification.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={`${getNotificationBadgeStyle(notification.notificationType)} text-xs`}>
                          {notification.notificationType.toUpperCase()}
                        </Badge>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 ${!notification.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-500">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {notification.actionUrl && (
                          <Button size="sm" variant="outline" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {unreadCount > 0 && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {unreadCount} unread notifications
              </span>
              <Button
                size="sm"
                onClick={() => setNotifications(prev => 
                  prev.map(notif => ({ ...notif, isRead: true }))
                )}
                className="btn-premium"
              >
                Mark All as Read
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}