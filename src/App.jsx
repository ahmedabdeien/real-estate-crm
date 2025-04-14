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

import OauthSuccess from './pages/OauthSuccess';
import Register from './pages/Register';
import Login from './pages/Login';


import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';








function App() {
  return (<>
    <Navbar/>
    <Routes>
    <Route path="*" element={<NotFound />} />
    <Route path="/" element={<Home />} />

    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/oauth-success" element={<OauthSuccess />} />

    <Route path="/dashboard" element={<PrivateRoute> <Dashboard /></PrivateRoute>}/>
    {/* <Route path="/dashboard" element={<Dashboard />} /> */}

    <Route path="/customers" element={<Customers />} />
    <Route path="/customers/new" element={<AddCustomer />} />
    <Route path="/customers/edit/:id" element={<EditCustomer />} />
    <Route path="/customers/:id" element={<CustomerDetails />} />
    <Route path="/contracts" element={<Contracts />} />
    <Route path="/contracts/:id" element={<ContractDetails />} />
    <Route path="/contracts/new" element={<AddContract />} />
    <Route path="/contracts/edit/:id" element={<EditContract/>} />

    <Route path="/invoices/contracts/:id" element={<InvoiceDetails />} />
    <Route path="/invoices" element={<Invoices />} />
    <Route path="/invoices/new" element={<AddInvoice />} />
    <Route path="/invoices/edit/:id" element={<EditInvoice />} />
    <Route path="/units" element={<Units />} />
    <Route path="/units/new" element={<AddUnit />} />
    <Route path="/units/edit/:id" element={<EditUnit />} />
    <Route path="/units/:id" element={<UnitDetails />} />
    <Route path="/properties" element={<Properties />} />
    <Route path="/properties/new" element={<AddProperty />} />
    <Route path="/properties/:id" element={<PropertyDetails />} />
    <Route path="/properties/edit/:id" element={<EditProperty />} />
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
