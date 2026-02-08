import { useState } from 'react';
import { Download, Upload, AlertTriangle, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useBackupData, useRestoreData } from './useBackupRestore';
import { validateBackupData } from './backupValidation';
import type { BackupData } from '../../backend';
import { ADMIN_TEXT } from '../components/EnglishText';
import { Loader2 } from 'lucide-react';

export default function BackupRestoreScreen() {
  const backupMutation = useBackupData();
  const restoreMutation = useRestoreData();
  const [restoreData, setRestoreData] = useState<BackupData | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const handleBackup = async () => {
    const data = await backupMutation.mutateAsync();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const validation = validateBackupData(json);

        if (!validation.valid) {
          setValidationErrors(validation.errors);
          setRestoreData(null);
        } else {
          setValidationErrors([]);
          setRestoreData(json as BackupData);
          setShowRestoreConfirm(true);
        }
      } catch (error) {
        setValidationErrors(['Invalid JSON format']);
        setRestoreData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = async () => {
    if (!restoreData) return;
    await restoreMutation.mutateAsync(restoreData);
    setRestoreData(null);
    setShowRestoreConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-white">Backup & Restore</h2>
        <p className="text-gray-400 mt-1">Manage system data backups</p>
      </div>

      <Alert className="bg-yellow-500/10 border-yellow-500/30">
        <AlertTriangle className="w-4 h-4 text-yellow-400" />
        <AlertTitle className="text-yellow-400">Admin Only</AlertTitle>
        <AlertDescription className="text-yellow-300">
          Backup and restore operations are restricted to administrators only.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="w-5 h-5" />
              {ADMIN_TEXT.BACKUP_DATA}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400 text-sm">{ADMIN_TEXT.BACKUP_WARNING}</p>
            <Button
              onClick={handleBackup}
              disabled={backupMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {backupMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Backup
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Restore */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {ADMIN_TEXT.RESTORE_DATA}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <AlertDescription className="text-red-300 text-sm">
                {ADMIN_TEXT.RESTORE_WARNING}
              </AlertDescription>
            </Alert>

            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              id="restore-upload"
            />
            <label htmlFor="restore-upload">
              <Button
                asChild
                disabled={restoreMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 cursor-pointer"
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Backup File
                </span>
              </Button>
            </label>

            {validationErrors.length > 0 && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <AlertTitle className="text-red-400">Validation Errors</AlertTitle>
                <AlertDescription className="text-red-300 text-sm space-y-1">
                  {validationErrors.map((error, i) => (
                    <div key={i}>• {error}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Confirm Restore
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {ADMIN_TEXT.RESTORE_CONFIRM}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={restoreMutation.isPending}
              className="border-gray-700 hover:bg-gray-800"
            >
              {ADMIN_TEXT.CANCEL}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              disabled={restoreMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {restoreMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                'Restore Data'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
