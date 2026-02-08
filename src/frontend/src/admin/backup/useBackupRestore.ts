import { useMutation, useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { BackupData } from '../../backend';
import { toast } from 'sonner';
import { ADMIN_TEXT } from '../components/EnglishText';

export function useBackupData() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.backupData();
    },
    onSuccess: () => {
      toast.success(ADMIN_TEXT.BACKUP_SUCCESS);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to backup data');
    },
  });
}

export function useRestoreData() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (backup: BackupData) => {
      if (!actor) throw new Error('Actor not available');
      return actor.restoreData(backup);
    },
    onSuccess: () => {
      toast.success(ADMIN_TEXT.RESTORE_SUCCESS);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to restore data');
    },
  });
}
