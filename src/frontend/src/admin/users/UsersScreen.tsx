import { useState } from 'react';
import { Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useListUsers, useGetUserExamHistory } from './useUsersResults';
import { generateUserResultsCSV, downloadCSV } from './usersCsvExport';
import type { UserProfile } from '../../backend';
import { ADMIN_TEXT } from '../components/EnglishText';

export default function UsersScreen() {
  const { data: users = [], isLoading } = useListUsers();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { data: examHistory = [] } = useGetUserExamHistory(selectedUser?.userId);

  const handleExportResults = () => {
    if (!selectedUser || examHistory.length === 0) return;

    const csv = generateUserResultsCSV(selectedUser, examHistory);
    const filename = `${selectedUser.name.replace(/\s+/g, '_')}_results_${Date.now()}.csv`;
    downloadCSV(filename, csv);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Users & Results</h2>
        <p className="text-gray-400 mt-1">View user profiles and exam history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users List */}
        <div className="glass-card rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">{ADMIN_TEXT.USERS_LIST}</h3>
          </div>
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">{ADMIN_TEXT.LOADING}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400">No users found</p>
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-gray-900/50">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Course</TableHead>
                    <TableHead className="text-gray-400">Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(([principal, profile]) => (
                    <TableRow
                      key={principal.toString()}
                      onClick={() => setSelectedUser(profile)}
                      className={`border-gray-800 cursor-pointer ${
                        selectedUser?.userId === profile.userId
                          ? 'bg-orange-500/10'
                          : 'hover:bg-gray-900/50'
                      }`}
                    >
                      <TableCell className="text-white">{profile.name}</TableCell>
                      <TableCell className="text-gray-300">{profile.course}</TableCell>
                      <TableCell className="text-gray-300">{profile.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="space-y-4">
          {selectedUser ? (
            <>
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {ADMIN_TEXT.USER_DETAILS}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white ml-2">{selectedUser.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white ml-2">{selectedUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Course:</span>
                    <span className="text-white ml-2">{selectedUser.course}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">User ID:</span>
                    <span className="text-white ml-2">{selectedUser.userId.toString()}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="glass-card rounded-xl border border-gray-800">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{ADMIN_TEXT.EXAM_HISTORY}</h3>
                  {examHistory.length > 0 && (
                    <Button
                      onClick={handleExportResults}
                      size="sm"
                      variant="outline"
                      className="border-gray-700 hover:bg-gray-800"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {ADMIN_TEXT.EXPORT_RESULTS}
                    </Button>
                  )}
                </div>
                {examHistory.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-400">No exam history</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                    {examHistory.map((result) => (
                      <div
                        key={result.attemptId.toString()}
                        className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-semibold">{result.examType}</span>
                          <Badge
                            className={
                              result.passed
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }
                          >
                            {result.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Score:</span>
                            <span className="text-white ml-2">{result.score.toString()}%</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Questions:</span>
                            <span className="text-white ml-2">{result.answers.length}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="glass-card rounded-xl border border-gray-800 p-12 text-center">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a user to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
