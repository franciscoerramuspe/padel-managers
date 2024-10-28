'use client';

import { useEffect, useState } from 'react';

interface ClientSideWrapperProps {
  children: React.ReactNode;
}

export function ClientSideWrapper({ children }: ClientSideWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
