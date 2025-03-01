import React, { PropsWithChildren } from "react";
import { isAdmin } from "../features/auth/utils";
import { getAuthenticatedUser } from "../features/auth/utils";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const user = await getAuthenticatedUser();

  if (!isAdmin(user)) {
    return <div>No tienes permisos para acceder a esta página</div>;
  }

  return children;
}
