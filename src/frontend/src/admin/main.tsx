import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from '../hooks/useInternetIdentity';
import AdminApp from './AdminApp';
import '../index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('admin-root')!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <AdminApp />
    </InternetIdentityProvider>
  </QueryClientProvider>
);
