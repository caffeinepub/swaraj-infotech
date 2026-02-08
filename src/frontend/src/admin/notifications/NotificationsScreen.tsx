import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bell, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useListNotifications, useCreateNotification } from './useAdminNotifications';
import { ADMIN_TEXT } from '../components/EnglishText';
import { Loader2 } from 'lucide-react';

interface NotificationFormData {
  title: string;
  message: string;
  targetSegment: string;
}

export default function NotificationsScreen() {
  const { data: notifications = [], isLoading } = useListNotifications();
  const createMutation = useCreateNotification();
  const { register, handleSubmit, reset, setValue, watch } = useForm<NotificationFormData>({
    defaultValues: {
      title: '',
      message: '',
      targetSegment: 'all',
    },
  });

  const onSubmit = async (data: NotificationFormData) => {
    await createMutation.mutateAsync(data);
    reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Notifications</h2>
        <p className="text-gray-400 mt-1">Create and manage in-app notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composer */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Send className="w-5 h-5" />
              {ADMIN_TEXT.CREATE_NOTIFICATION}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">{ADMIN_TEXT.NOTIFICATION_TITLE}</Label>
                <Input
                  {...register('title', { required: true })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter notification title..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">{ADMIN_TEXT.NOTIFICATION_MESSAGE}</Label>
                <Textarea
                  {...register('message', { required: true })}
                  className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                  placeholder="Enter notification message..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">{ADMIN_TEXT.TARGET_SEGMENT}</Label>
                <Select
                  value={watch('targetSegment')}
                  onValueChange={(value) => setValue('targetSegment', value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="MSCIT">MSCIT Students</SelectItem>
                    <SelectItem value="GCC-TBC">GCC-TBC Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Notification
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="glass-card rounded-xl border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">Recent Notifications</h3>
          </div>
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">{ADMIN_TEXT.LOADING}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id.toString()}
                  className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-semibold">{notification.title}</h4>
                    <span className="text-xs text-gray-400">
                      {new Date(Number(notification.createdAt) / 1000000).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {notification.targetSegment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
