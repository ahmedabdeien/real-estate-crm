// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';

import Contracts from './pages/Contracts';
import ContractDetails from './pages/ContractDetails'; // ← أو المسار الصحيح حسب مكان الملف
import EditContract from './pages/EditContract';
import AddContract from './pages/AddContract';

import AddInvoice from './pages/AddInvoice';
import Invoices from './pages/Invoices';
import InvoiceDetails from './pages/InvoiceDetails';

import Units from './pages/Units';
import AddUnit from './pages/AddUnit';
import UnitDetails from './pages/UnitDetails';
import EditUnit from './pages/EditUnit';
import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';
import PropertyDetails from './pages/PropertyDetails';
import EditProperty from './pages/EditProperty';


import Navbar from './components/Navbar';
import EditInvoice from './pages/EditInvoice';
import AddCustomer from './pages/AddCustomer';
import EditCustomer from './pages/EditCustomer';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Footer from './components/Footer';


import Register from './pages/Register';
import Login from './pages/Login';


import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import OAuthSuccess from './pages/OAuthSuccess';








function App() {
  return (<>
    <Navbar/>
    <Routes>
    <Route path="*" element={<NotFound />} />
    <Route path="/" element={<Home />} />

    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/oauth-success" element={<OAuthSuccess />} />

    <Route path="/dashboard" element={<PrivateRoute> <Dashboard /></PrivateRoute>}/>
    {/* <Route path="/dashboard" element={<Dashboard />} /> */}

    <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
    <Route path="/customers/new" element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
    <Route path="/customers/edit/:id" element={<PrivateRoute><EditCustomer /></PrivateRoute>} />
    <Route path="/customers/:id" element={<PrivateRoute><CustomerDetails /></PrivateRoute>} />
    <Route path="/contracts" element={<PrivateRoute><Contracts /></PrivateRoute>} />
    <Route path="/contracts/:id" element={<PrivateRoute><ContractDetails /></PrivateRoute>} />
    <Route path="/contracts/new" element={<PrivateRoute><AddContract /></PrivateRoute>} />
    <Route path="/contracts/edit/:id" element={<PrivateRoute><EditContract/></PrivateRoute>} />

    <Route path="/invoices/contracts/:id" element={<PrivateRoute><InvoiceDetails /></PrivateRoute>} />
    <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
    <Route path="/invoices/new" element={<PrivateRoute><AddInvoice /></PrivateRoute>} />
    <Route path="/invoices/edit/:id" element={<PrivateRoute><EditInvoice /></PrivateRoute>} />
    <Route path="/units" element={<PrivateRoute><Units /></PrivateRoute>} />
    <Route path="/units/new" element={<PrivateRoute><AddUnit /></PrivateRoute>} />
    <Route path="/units/edit/:id" element={<PrivateRoute><EditUnit /></PrivateRoute>} />
    <Route path="/units/:id" element={<PrivateRoute><UnitDetails /></PrivateRoute>} />
    <Route path="/properties" element={<PrivateRoute><Properties /></PrivateRoute>} />
    <Route path="/properties/new" element={<PrivateRoute><AddProperty /></PrivateRoute>} />
    <Route path="/properties/:id" element={<PrivateRoute><PropertyDetails /></PrivateRoute>} />
    <Route path="/properties/edit/:id" element={<PrivateRoute><EditProperty /></PrivateRoute>} />
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
