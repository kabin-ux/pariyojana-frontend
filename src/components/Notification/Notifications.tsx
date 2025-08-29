import React, { useEffect, useState } from 'react';
import { Bell, FileText, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface Notification {
  id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  created_by: number | null;
}

interface NotificationsProps {
  limit?: number;
  showHeader?: boolean;
}

const Notifications: React.FC<NotificationsProps> = ({ limit = 10, showHeader = true }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        const response = await axios.get('http://43.205.255.142/api/notifications/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotifications(response.data.slice(0, limit));
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('सूचनाहरू लोड गर्न सकिएन');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [limit]);

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'अहिले';
    if (diffInMinutes < 60) return `${diffInMinutes} मिनेट अगाडि`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} घण्टा अगाडि`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} दिन अगाडि`;
    
    return notificationDate.toLocaleDateString('ne-NP');
  };

  const getNotificationIcon = (message: string) => {
    if (message.includes('थपिएको')) {
      return <FileText className="w-4 h-4 text-green-600" />;
    }
    if (message.includes('अपडेट')) {
      return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
    return <Bell className="w-4 h-4 text-gray-600" />;
  };

  const truncateMessage = (message: string, maxLength: number = 80): string => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {showHeader && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">भर्खरै काम गरिएका परियोजनाहरू</h3>
        )}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        {showHeader && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">भर्खरै काम गरिएका परियोजनाहरू</h3>
        )}
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {showHeader && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">भर्खरै काम गरिएका परियोजनाहरू</h3>
      )}
      
      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">कुनै सूचना छैन</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors duration-150 ${
              notification.is_read 
                ? 'hover:bg-gray-50' 
                : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              notification.is_read ? 'bg-gray-100' : 'bg-blue-100'
            }`}>
              {getNotificationIcon(notification.message)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                notification.is_read ? 'text-gray-700' : 'text-gray-900'
              }`}>
                {truncateMessage(notification.message)}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(notification.created_at)}
                </p>
                {!notification.is_read && (
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;