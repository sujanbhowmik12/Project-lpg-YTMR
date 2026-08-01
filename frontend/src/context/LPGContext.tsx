import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, Booking, Delivery, Employee, AgencySettings, BookingStatus } from '../types';
import { initialCustomers, initialBookings, initialDeliveries, initialEmployees, initialAgencySettings } from '../mockData/initialData';

interface LPGContextType {
  customers: Customer[];
  bookings: Booking[];
  deliveries: Delivery[];
  employees: Employee[];
  settings: AgencySettings;
  addCustomer: (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalBookings'>) => Customer;
  updateCustomer: (id: string, customerData: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addBooking: (customerId: string, quantity: number, paymentStatus: 'paid' | 'cod') => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, deliveryBoyId?: string) => void;
  assignDelivery: (bookingId: string, deliveryBoyId: string, notes?: string) => void;
  updateDeliveryStatus: (deliveryId: string, status: 'assigned' | 'out_for_delivery' | 'delivered' | 'failed') => void;
  addEmployee: (employeeData: Omit<Employee, 'id' | 'deliveriesCompleted'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  updateSettings: (newSettings: Partial<AgencySettings>) => void;
  checkRefillEligibility: (lastRefillDate: string) => { isEligible: boolean; daysRemaining: number; nextDate: string };
}

const LPGContext = createContext<LPGContextType | undefined>(undefined);

export const LPGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('lpg_customers_v4_all_photos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 50) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    localStorage.removeItem('lpg_customers_v3_photo');
    localStorage.setItem('lpg_customers_v4_all_photos', JSON.stringify(initialCustomers));
    return initialCustomers;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('lpg_bookings_v3_photo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    localStorage.removeItem('lpg_bookings');
    localStorage.setItem('lpg_bookings_v3_photo', JSON.stringify(initialBookings));
    return initialBookings;
  });

  const [deliveries, setDeliveries] = useState<Delivery[]>(() => {
    const saved = localStorage.getItem('lpg_deliveries_v3_photo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    localStorage.removeItem('lpg_deliveries');
    localStorage.setItem('lpg_deliveries_v3_photo', JSON.stringify(initialDeliveries));
    return initialDeliveries;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('lpg_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [settings, setSettings] = useState<AgencySettings>(() => {
    const saved = localStorage.getItem('lpg_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.agencyName && parsed.agencyName.includes('Sunrise')) {
        parsed.agencyName = "YTMR-LPG Gas Agency";
      }
      if (!parsed.minDaysBetweenRefills || parsed.minDaysBetweenRefills === 15) {
        parsed.minDaysBetweenRefills = 45;
      }
      return parsed;
    }
    return { ...initialAgencySettings, minDaysBetweenRefills: 45 };
  });

  useEffect(() => {
    localStorage.setItem('lpg_customers_v4_all_photos', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('lpg_bookings_v3_photo', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('lpg_deliveries_v3_photo', JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem('lpg_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('lpg_settings', JSON.stringify(settings));
  }, [settings]);

  // Helper to calculate eligibility
  const checkRefillEligibility = (lastRefillDate: string) => {
    if (!lastRefillDate) return { isEligible: true, daysRemaining: 0, nextDate: new Date().toISOString().split('T')[0] };
    
    const lastDate = new Date(lastRefillDate);
    const today = new Date();
    const minDays = settings.minDaysBetweenRefills || 45;
    
    const nextEligible = new Date(lastDate);
    nextEligible.setDate(lastDate.getDate() + minDays);
    
    const diffTime = nextEligible.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      isEligible: daysRemaining <= 0,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      nextDate: nextEligible.toISOString().split('T')[0]
    };
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalBookings'>): Customer => {
    const today = new Date().toISOString().split('T')[0];
    const lastRefill = customerData.lastRefillDate || today;
    const lastDate = new Date(lastRefill);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + (settings.minDaysBetweenRefills || 45));

    const newCustomer: Customer = {
      ...customerData,
      name: customerData.name.toUpperCase(),
      lastRefillDate: lastRefill,
      nextEligibleDate: nextDate.toISOString().split('T')[0],
      id: `cust-${Date.now()}`,
      totalBookings: 0,
      createdAt: today,
    };
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    const updatedData = { ...customerData };
    if (updatedData.name) {
      updatedData.name = updatedData.name.toUpperCase();
    }
    if (updatedData.lastRefillDate) {
      const lastDate = new Date(updatedData.lastRefillDate);
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + (settings.minDaysBetweenRefills || 45));
      updatedData.nextEligibleDate = nextDate.toISOString().split('T')[0];
    }
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addBooking = (customerId: string, quantity: number, paymentStatus: 'paid' | 'cod'): Booking => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) throw new Error("Customer not found");

    // Strict eligibility check: Block booking if minDaysBetweenRefills interval not completed
    const eligibility = checkRefillEligibility(customer.lastRefillDate);
    if (!eligibility.isEligible) {
      throw new Error(`Booking restricted! Consumer is not eligible yet. Mandatory ${settings.minDaysBetweenRefills || 45} days interval not completed (${eligibility.daysRemaining} days remaining, eligible on ${eligibility.nextDate}).`);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingNo = `LPG-2026-${randomNum}`;

    let pricePerCylinder = settings.refillPrice14kg;
    if (customer.cylinderType === '19kg') pricePerCylinder = settings.refillPrice19kg;
    if (customer.cylinderType === '5kg') pricePerCylinder = settings.refillPrice5kg;

    let amount = pricePerCylinder * quantity;
    if (customer.scheme === 'ujjwala') {
      amount = Math.max(0, amount - settings.subsidyAmount);
    }

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      bookingNo,
      customerId,
      consumerNo: customer.consumerNo,
      customerName: customer.name,
      phone: customer.phone,
      address: customer.address,
      scheme: customer.scheme,
      cylinderType: customer.cylinderType,
      quantity,
      bookingDate: todayStr,
      status: 'pending',
      paymentStatus,
      amount,
      cashMemoNo: `CM-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update customer last refill date and total bookings count
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + settings.minDaysBetweenRefills);
    const nextEligibleDateStr = nextDate.toISOString().split('T')[0];

    updateCustomer(customerId, {
      totalBookings: customer.totalBookings + 1,
      lastRefillDate: todayStr,
      nextEligibleDate: nextEligibleDateStr,
    });

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, deliveryBoyId?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const deliveryBoy = employees.find(e => e.id === deliveryBoyId);
        return {
          ...b,
          status,
          deliveryBoyId: deliveryBoyId || b.deliveryBoyId,
          deliveryBoyName: deliveryBoy ? deliveryBoy.name : b.deliveryBoyName,
          deliveredDate: status === 'delivered' ? new Date().toISOString().split('T')[0] : b.deliveredDate
        };
      }
      return b;
    }));
  };

  const assignDelivery = (bookingId: string, deliveryBoyId: string, notes?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    const deliveryBoy = employees.find(e => e.id === deliveryBoyId);
    if (!booking || !deliveryBoy) return;

    // Update booking status
    updateBookingStatus(bookingId, 'assigned', deliveryBoyId);

    // Create or update delivery record
    const existingIndex = deliveries.findIndex(d => d.bookingId === bookingId);
    const deliveryRecord: Delivery = {
      id: existingIndex >= 0 ? deliveries[existingIndex].id : `del-${Date.now()}`,
      bookingId,
      bookingNo: booking.bookingNo,
      customerName: booking.customerName,
      address: booking.address,
      area: customers.find(c => c.id === booking.customerId)?.careOf || 'Main Area',
      phone: booking.phone,
      deliveryBoyId,
      deliveryBoyName: deliveryBoy.name,
      status: 'assigned',
      assignedAt: new Date().toLocaleString(),
      notes
    };

    if (existingIndex >= 0) {
      setDeliveries(prev => prev.map((d, i) => i === existingIndex ? deliveryRecord : d));
    } else {
      setDeliveries(prev => [deliveryRecord, ...prev]);
    }
  };

  const updateDeliveryStatus = (deliveryId: string, status: 'assigned' | 'out_for_delivery' | 'delivered' | 'failed') => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        const deliveredAt = status === 'delivered' ? new Date().toLocaleString() : d.deliveredAt;
        
        // Sync back with booking status
        let bStatus: BookingStatus = 'assigned';
        if (status === 'out_for_delivery') bStatus = 'out_for_delivery';
        if (status === 'delivered') bStatus = 'delivered';
        if (status === 'failed') bStatus = 'pending';

        updateBookingStatus(d.bookingId, bStatus);

        // Update employee delivery count if delivered
        if (status === 'delivered') {
          setEmployees(empPrev => empPrev.map(e => e.id === d.deliveryBoyId ? { ...e, deliveriesCompleted: e.deliveriesCompleted + 1 } : e));
        }

        return { ...d, status, deliveredAt };
      }
      return d;
    }));
  };

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'deliveriesCompleted'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: `emp-${Date.now()}`,
      deliveriesCompleted: 0,
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  };

  const updateSettings = (newSettings: Partial<AgencySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <LPGContext.Provider value={{
      customers,
      bookings,
      deliveries,
      employees,
      settings,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addBooking,
      updateBookingStatus,
      assignDelivery,
      updateDeliveryStatus,
      addEmployee,
      updateEmployee,
      updateSettings,
      checkRefillEligibility
    }}>
      {children}
    </LPGContext.Provider>
  );
};

export const useLPG = () => {
  const context = useContext(LPGContext);
  if (!context) throw new Error('useLPG must be used within an LPGProvider');
  return context;
};
