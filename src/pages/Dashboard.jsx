// src/pages/Dashboard.jsx
const Dashboard = () => {
    const name = localStorage.getItem('name');
  
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">مرحبًا {name} 👋</h1>
        <p className="mt-2">تم تسجيل الدخول بنجاح</p>
      </div>
    );
  };
  
  export default Dashboard;
  