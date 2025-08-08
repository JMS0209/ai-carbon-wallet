"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { currentRole } from "~~/services/rbac/roles";

export function WithRoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    currentRole().then(role => {
      if (!mounted) return;
      if (!role) router.push("/role");
      else setReady(true);
    });
    return () => { mounted = false; };
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}


