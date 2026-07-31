import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Truck, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';
import { useLPG } from '../context/LPGContext';
import { Employee, UserRole } from '../types';

export const Employees: React.FC = () => {
  const { employees, addEmployee, updateEmployee } = useLPG();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'delivery_boy' as 'admin' | 'staff' | 'delivery_boy',
    areaAssigned: 'Sector 5 & Main Market',
    status: 'on_duty' as 'active' | 'on_duty' | 'leave',
    joinDate: new Date().toISOString().split('T')[0],
    vehicleNumber: 'UP-16-BZ-1020',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please fill in staff name and mobile number.");
      return;
    }
    addEmployee(formData);
    setIsAddOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-brand-500" /> Agency Staff & Rider Roster
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage counter staff, delivery riders, vehicles, & operational duty statuses</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Staff / Rider
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {employees.map(emp => (
          <div key={emp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg shadow-md ${
                  emp.role === 'admin' ? 'bg-gradient-to-br from-brand-500 to-orange-600' :
                  emp.role === 'delivery_boy' ? 'bg-gradient-to-br from-sky-500 to-blue-600' :
                  'bg-gradient-to-br from-purple-500 to-indigo-600'
                }`}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{emp.name}</h3>
                  <p className="text-[11px] text-brand-400 font-semibold capitalize">{emp.role.replace('_', ' ')}</p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                emp.status === 'on_duty' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                emp.status === 'active' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {emp.status.replace('_', ' ')}
              </span>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-slate-200">+91 {emp.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-200 font-medium">Area: {emp.areaAssigned}</span>
              </div>
              {emp.vehicleNumber && (
                <div className="flex items-center gap-2 text-sky-400 font-semibold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Vehicle: {emp.vehicleNumber}</span>
                </div>
              )}
            </div>

            {emp.role === 'delivery_boy' && (
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Deliveries Completed:</span>
                <strong className="text-emerald-400 text-sm font-bold">{emp.deliveriesCompleted}</strong>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <h2 className="text-base font-bold mb-4">Register New Staff / Delivery Boy</h2>
            
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="delivery_boy">Delivery Agent (Rider)</option>
                    <option value="staff">Counter Staff</option>
                    <option value="admin">Agency Manager / Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assigned Delivery Area / Desk</label>
                <input
                  type="text"
                  value={formData.areaAssigned}
                  onChange={e => setFormData({ ...formData, areaAssigned: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              {formData.role === 'delivery_boy' && (
                <div>
                  <label className="block text-slate-400 mb-1">Vehicle Registration No.</label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-500 text-white font-bold rounded-lg"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
