import React, { createContext, useContext, useState } from 'react';
import type { TenantInfo } from '../types';
import { apiClient } from '../api/client';

interface TenantContextType {
  tenant: TenantInfo;
  setTenant: (tenant: TenantInfo) => void;
  setTenantId: (tenantId: string) => void;
}

const defaultTenant: TenantInfo = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Apex Institute of Technology',
  slug: 'apex-institute',
  subdomain: 'apex.nexora.internal',
  is_active: true,
  min_attendance_pct: 75.0,
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenantState] = useState<TenantInfo>(defaultTenant);

  const setTenant = (newTenant: TenantInfo) => {
    setTenantState(newTenant);
    apiClient.setTenantId(newTenant.id);
  };

  const setTenantId = (id: string) => {
    setTenantState((prev) => ({ ...prev, id }));
    apiClient.setTenantId(id);
  };

  return (
    <TenantContext.Provider value={{ tenant, setTenant, setTenantId }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
