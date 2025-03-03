
import { withAuth } from '@/utils/auth';
import AdminDashboardContent from './AdminDashboardContent';

const AdminDashboard = () => {
  return <AdminDashboardContent />;
};

// Wrap with auth HOC to protect this route
export default withAuth(AdminDashboard, ['admin']);
