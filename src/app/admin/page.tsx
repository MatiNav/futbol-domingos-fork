import { getAuthenticatedUser, isAdmin } from "../features/auth/utils";
import AdminContent from "../components/Admin";

export default async function AdminPage() {
  const user = await getAuthenticatedUser();

  if (!isAdmin(user)) {
    return <div>No tienes permisos para acceder a esta página</div>;
  }
  return (
    <div>
      <AdminContent />
    </div>
  );
}
