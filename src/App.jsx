import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useSidebarStore from './store/sidebarStore';

import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthSuccess from './pages/OAuthSuccess';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import EditCustomer from './pages/EditCustomer';
import CustomerDetails from './pages/CustomerDetails';

import Contracts from './pages/Contracts';
import AddContract from './pages/AddContract';
import EditContract from './pages/EditContract';
import ContractDetails from './pages/ContractDetails';

import Invoices from './pages/Invoices';
import AddInvoice from './pages/AddInvoice';
import EditInvoice from './pages/EditInvoice';
import InvoiceDetails from './pages/InvoiceDetails';

import Units from './pages/Units';
import AddUnit from './pages/AddUnit';
import EditUnit from './pages/EditUnit';
import UnitDetails from './pages/UnitDetails';

import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import PropertyDetails from './pages/PropertyDetails';

import ProtectedRoute from './utils/ProtectedRoute';
import Settings from './pages/Settings';
import ThemeSettings from './pages/ThemeSettings';
import Notifications from './pages/Notifications';
import NotificationSettings from './pages/NotificationSettings';

import AIChatWidget from './components/AIChatWidget';
import VerifyCode from './pages/VerifyCode';
import ResendCode from './pages/ResendCode';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import ChatWithAI from './pages/ChatWithAI';
import ChatHistory from './pages/ChatHistory';

import '../src/pages/NotificationAnimation.css';


function App() {
  const { collapsed } = useSidebarStore();

  return (
    <div className="flex w-full ">
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'xl:mr-16' : 'xl:mr-64'} `}
      style={{ overflowX: 'hidden' }}>
        <div className="max-w-full overflow-x-hidden">
        <Routes>
          {/* صفحات عامة */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/resend-code" element={<ResendCode />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />

          {/* صفحات للمستخدمين المسجلين */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "sales", "viewer", "accountant", "lawyer", "user"]} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} /> 
            <Route path="/settings" element={<Settings />} /> 
            <Route path="/settings/theme" element={<ThemeSettings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/chat-with-ai" element={<ChatWithAI />} />
            <Route path="/notification-settings" element={<NotificationSettings />} />
            <Route path="/chat-history" element={<ChatHistory />} />
          </Route>

          {/* Admin فقط */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
          </Route>

          {/* Admin, Sales, Viewer */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "sales", "viewer"]} />}>
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<AddCustomer />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/new" element={<AddProperty />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/units" element={<Units />} />
            <Route path="/units/new" element={<AddUnit />} />
            <Route path="/units/:id" element={<UnitDetails />} />
          </Route>

          {/* Admin, Sales فقط */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "sales"]} />}>
            <Route path="/customers/edit/:id" element={<EditCustomer />} />
            <Route path="/units/edit/:id" element={<EditUnit />} />
            <Route path="/properties/edit/:id" element={<EditProperty />} />
          </Route>

          {/* Admin, Lawyer, Viewer */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "lawyer", "viewer"]} />}>
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/contracts/:id" element={<ContractDetails />} />
          </Route>

          {/* Admin, Lawyer فقط */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "lawyer"]} />}>
            <Route path="/contracts/new" element={<AddContract />} />
            <Route path="/contracts/edit/:id" element={<EditContract />} />
          </Route>

          {/* Admin, Accountant, Viewer */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "accountant", "viewer"]} />}>
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/contracts/:id" element={<InvoiceDetails />} />
          </Route>

          {/* Admin, Accountant فقط */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "accountant"]} />}>
            <Route path="/invoices/new" element={<AddInvoice />} />
            <Route path="/invoices/edit/:id" element={<EditInvoice />} />
          </Route>
        </Routes>
        <AIChatWidget /> 
        <Footer />
        <MobileNav />

        </div>
      </div>
    </div>
  );
}

export default App;