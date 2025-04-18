// src/hooks/useDashboardData.js
const useDashboardData = () => {
    return {
      stats: {
        customers: 120,
        properties: 40,
        units: 160,
        contracts: 70,
        invoices: 45,
        totalSales: 1800000,
      },
      contractTypes: [
        { name: 'بيع', value: 45 },
        { name: 'إيجار', value: 25 },
      ],
      barData: [
        { name: 'العملاء', value: 120 },
        { name: 'العقارات', value: 40 },
        { name: 'الوحدات', value: 160 },
        { name: 'العقود', value: 70 },
      ],
    };
  };
  
  export default useDashboardData;
  