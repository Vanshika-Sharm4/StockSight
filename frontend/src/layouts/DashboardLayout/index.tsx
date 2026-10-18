import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import AIDrawer from '../../components/AIDrawer';
import { useAIQuery } from '../../hooks/useAIQuery';
import { useAuth } from '../../context/authContext';

function DashboardLayout() {
  const ai = useAIQuery();
  const { user, signOut } = useAuth();

  // ProtectedRoute guarantees a user, this just satisfies the type checker.
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} onAskAI={(prompt) => ai.runQuery(prompt)} onSignOut={signOut} />
        <main className="flex-1 px-6 pb-6">
          {/* Pages access `ai` via Outlet context so widgets like
              AIInsightsCard can trigger the same drawer. */}
          <Outlet context={{ ai }} />
        </main>
      </div>
      <AIDrawer
        open={ai.open}
        onClose={() => ai.setOpen(false)}
        query={ai.query}
        loading={ai.loading}
        error={ai.error}
        result={ai.result}
      />
    </div>
  );
}

export default DashboardLayout;
