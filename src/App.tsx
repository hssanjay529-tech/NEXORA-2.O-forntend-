import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import { AppLayout } from './components/layout/AppLayout';

export default function App() {
  return (
    <TenantProvider>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </TenantProvider>
  );
}
