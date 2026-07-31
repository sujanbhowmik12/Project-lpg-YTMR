export type UserRole = 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
}

export type SchemeType = 'ujjwala' | 'general' | 'commercial';
export type CylinderType = '14.2kg' | '19kg' | '5kg';
export type CustomerStatus = 'active' | 'inactive' | 'blocked';

export interface Customer {
  id: string;
  consumerNo: string; // e.g. "IND-789012"
  svNumber: string; // Subscription Voucher No
  lpgId?: string; // 16-Digit LPG ID (Optional)
  name: string;
  phone: string;
  email?: string;
  address: string;
  careOf: string; // S/O or C/O Name (Son of / Wife of / Care of)
  scheme: SchemeType;
  cylinderType: CylinderType;
  oilCompany?: 'Indane Gas' | 'Bharat Gas' | 'HP Gas';
  connectionCount: number; // Single vs Double bottle connection (SBC/DBC)
  status: CustomerStatus;
  aadhaarLinked: boolean;
  bankAccountLinked: boolean;
  documentUploaded: boolean;
  totalBookings: number;
  lastRefillDate: string; // YYYY-MM-DD
  nextEligibleDate: string; // YYYY-MM-DD (e.g. +15 days)
  createdAt: string;
}

export type BookingStatus = 'pending' | 'assigned' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'cod';

export interface Booking {
  id: string;
  bookingNo: string; // e.g. "LPG-2026-8812"
  customerId: string;
  consumerNo: string;
  customerName: string;
  phone: string;
  address: string;
  scheme: SchemeType;
  cylinderType: CylinderType;
  quantity: number;
  bookingDate: string; // YYYY-MM-DD
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  deliveryBoyId?: string;
  deliveryBoyName?: string;
  deliveredDate?: string;
  cashMemoNo?: string;
}

export interface Delivery {
  id: string;
  bookingId: string;
  bookingNo: string;
  customerName: string;
  address: string;
  area: string;
  phone: string;
  deliveryBoyId: string;
  deliveryBoyName: string;
  status: 'assigned' | 'out_for_delivery' | 'delivered' | 'failed';
  assignedAt: string;
  deliveredAt?: string;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'delivery_boy';
  areaAssigned: string;
  status: 'active' | 'on_duty' | 'leave';
  joinDate: string;
  deliveriesCompleted: number;
  vehicleNumber?: string;
}

export interface AgencySettings {
  agencyName: string;
  distributorCode: string;
  oilCompany: 'Indane Gas' | 'Bharat Gas' | 'HP Gas';
  phone: string;
  email: string;
  address: string;
  refillPrice14kg: number;
  refillPrice19kg: number;
  refillPrice5kg: number;
  subsidyAmount: number;
  minDaysBetweenRefills: number;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
}

export interface ReportSummary {
  totalCustomers: number;
  totalUjjwala: number;
  totalGeneral: number;
  totalCommercial: number;
  todayBookings: number;
  pendingDeliveries: number;
  tomorrowEligibleCount: number;
  monthlyRevenue: number;
  deliveredCountThisMonth: number;
}
