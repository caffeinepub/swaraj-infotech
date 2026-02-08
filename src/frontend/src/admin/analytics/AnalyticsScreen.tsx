import { useState } from 'react';
import { useGetAnalyticsEvents, useGetAnalyticsMetrics } from './useAdminAnalytics';
import { ADMIN_TEXT } from '../components/EnglishText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Activity, MousePointer, TrendingUp, Calendar } from 'lucide-react';

export default function AnalyticsScreen() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [appliedStartDate, setAppliedStartDate] = useState<Date | undefined>();
  const [appliedEndDate, setAppliedEndDate] = useState<Date | undefined>();

  const { data: events = [], isLoading: eventsLoading } = useGetAnalyticsEvents();
  const { data: metrics, isLoading: metricsLoading } = useGetAnalyticsMetrics(appliedStartDate, appliedEndDate);

  const handleApplyFilter = () => {
    setAppliedStartDate(startDate ? new Date(startDate) : undefined);
    setAppliedEndDate(endDate ? new Date(endDate) : undefined);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setAppliedStartDate(undefined);
    setAppliedEndDate(undefined);
  };

  // Filter events for table display
  const displayEvents = appliedStartDate || appliedEndDate
    ? events.filter(event => {
        const eventDate = new Date(Number(event.timestamp) / 1000000);
        if (appliedStartDate && eventDate < appliedStartDate) return false;
        if (appliedEndDate && eventDate > appliedEndDate) return false;
        return true;
      })
    : events;

  const isLoading = eventsLoading || metricsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{ADMIN_TEXT.ANALYTICS_TITLE}</h1>
        <p className="text-gray-400">{ADMIN_TEXT.ANALYTICS_SUBTITLE}</p>
      </div>

      {/* Date Range Filter */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {ADMIN_TEXT.DATE_RANGE}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="start-date" className="text-gray-300">{ADMIN_TEXT.FROM_DATE}</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-date" className="text-gray-300">{ADMIN_TEXT.TO_DATE}</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={handleApplyFilter}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {ADMIN_TEXT.APPLY_FILTER}
              </Button>
              {(appliedStartDate || appliedEndDate) && (
                <Button
                  onClick={handleClearFilter}
                  variant="outline"
                  className="border-gray-700"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{ADMIN_TEXT.TOTAL_USERS}</p>
                    <p className="text-3xl font-bold text-white mt-2">{metrics.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{ADMIN_TEXT.ACTIVE_USERS}</p>
                    <p className="text-3xl font-bold text-white mt-2">{metrics.activeUsers}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{ADMIN_TEXT.APP_OPENS}</p>
                    <p className="text-3xl font-bold text-white mt-2">{metrics.appOpens}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <MousePointer className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{ADMIN_TEXT.RETENTION_RATE}</p>
                    <p className="text-3xl font-bold text-white mt-2">{metrics.retentionRate}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Table */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{ADMIN_TEXT.EVENTS_TABLE}</CardTitle>
            </CardHeader>
            <CardContent>
              {displayEvents.length === 0 ? (
                <p className="text-center text-gray-400 py-8">{ADMIN_TEXT.NO_DATA}</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">{ADMIN_TEXT.EVENT_TYPE}</TableHead>
                        <TableHead className="text-gray-300">{ADMIN_TEXT.USER_ID}</TableHead>
                        <TableHead className="text-gray-300">{ADMIN_TEXT.TIMESTAMP}</TableHead>
                        <TableHead className="text-gray-300">{ADMIN_TEXT.DETAILS}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayEvents.slice(0, 50).map((event, index) => (
                        <TableRow key={index} className="border-gray-800">
                          <TableCell className="text-white font-medium">{event.eventType}</TableCell>
                          <TableCell className="text-gray-300">
                            {event.userId !== undefined && event.userId !== null ? event.userId.toString() : 'N/A'}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(Number(event.timestamp) / 1000000).toLocaleString('en-US')}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">{event.details || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {displayEvents.length > 50 && (
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Showing 50 of {displayEvents.length} events
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
