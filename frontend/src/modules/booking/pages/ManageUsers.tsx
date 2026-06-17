import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { 
  User as UserIcon, Mail, Lock, Shield, Plus, Loader2, RefreshCcw, Hash, Trash2, X, Settings2, Check, 
  Users, UserCheck, ShieldCheck, Search, Phone
} from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchApi } from '../../../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId: string;
  phoneNumber?: string;
  isActive: boolean;
  canBookAuditorium: boolean;
  canBookClassroom: boolean;
  canBookTransport: boolean;
  canManageVehicles: boolean;
  canManageClassrooms: boolean;
  canManageMaintenance: boolean;
}

export default function ManageUsers() {
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const data = await fetchApi('/auth/users');
      console.log('Fetched users data:', data);
      setUsers(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Frontend: Attempting to delete user with ID:', id);
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setDeletingId(id);
    try {
      await fetchApi(`/auth/${id}`, { method: 'DELETE' });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const togglePermission = async (user: any, permissionField: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpdatingId(user.id);
    const updatedValue = !user[permissionField];
    
    try {
      await fetchApi(`/auth/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ [permissionField]: updatedValue }),
      });
      toast.success('Permissions updated');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update permissions');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleStatus = async (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpdatingId(user.id);
    try {
      await fetchApi(`/auth/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.employeeId && u.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.phoneNumber && u.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.isActive).length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 font-medium">Administration dashboard for system access and roles</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Accounts</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.total}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Admins</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.admins}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Users</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.active}</h3>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, email, phone or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-3">
               <button 
                onClick={fetchUsers}
                disabled={fetching}
                className="p-3 text-slate-500 hover:text-brand-600 rounded-2xl hover:bg-white hover:shadow-md transition-all active:scale-95 bg-slate-100/50"
              >
                <RefreshCcw className={`w-5 h-5 ${fetching ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Permissions Overview</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Account Status</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {fetching ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6"><div className="h-12 bg-slate-100 rounded-2xl w-48"></div></td>
                      <td className="px-8 py-6"><div className="h-8 bg-slate-100 rounded-xl w-64"></div></td>
                      <td className="px-8 py-6"><div className="h-8 bg-slate-100 rounded-full w-24"></div></td>
                      <td className="px-8 py-6 text-right"><div className="h-10 bg-slate-100 rounded-xl w-10 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-12 h-12 text-slate-200" />
                        <p className="text-slate-500 font-medium">No users match your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr 
                      key={u.id} 
                      onClick={() => openEditModal(u)}
                      className={`hover:bg-slate-50/80 transition-all cursor-pointer group ${!u.isActive ? 'opacity-60 grayscale-[0.5]' : ''}`}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-brand-700 font-black text-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                            u.isActive ? 'from-brand-50 to-brand-100' : 'from-slate-100 to-slate-200 text-slate-400'
                          }`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                              <span>{u.email}</span>
                              {u.phoneNumber && (
                                <span className="flex items-center gap-1 before:content-['•'] before:mr-1">
                                  <Phone className="w-3 h-3" />
                                  {u.phoneNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-brand-600 font-black uppercase mt-1 tracking-tighter bg-brand-50 inline-block px-1.5 rounded-md">ID: {u.employeeId || 'NOT SET'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { field: 'canBookAuditorium', label: 'Aud' },
                              { field: 'canBookClassroom', label: 'Cls' },
                              { field: 'canBookTransport', label: 'Trn' }
                            ].map(p => (
                              <button
                                key={p.field}
                                onClick={(e) => togglePermission(u, p.field, e)}
                                disabled={updatingId === u.id}
                                className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase transition-all border-2 ${
                                  (u as any)[p.field] 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-100' 
                                    : 'bg-slate-50 text-slate-300 border-slate-50'
                                }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { field: 'canManageVehicles', label: 'Veh' },
                              { field: 'canManageClassrooms', label: 'Room' },
                              { field: 'canManageMaintenance', label: 'Mnt' }
                            ].map(p => (
                              <button
                                key={p.field}
                                onClick={(e) => togglePermission(u, p.field, e)}
                                disabled={updatingId === u.id}
                                className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase transition-all border-2 ${
                                  (u as any)[p.field] 
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm shadow-indigo-100' 
                                    : 'bg-slate-50 text-slate-300 border-slate-50'
                                }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={(e) => toggleStatus(u, e)}
                            disabled={updatingId === u.id}
                            className={`w-fit inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all hover:scale-105 active:scale-95 ${
                              u.isActive 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : 'bg-red-50 text-red-600 border-red-100'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </button>
                          <span className={`w-fit inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 ${
                            u.role === 'admin' 
                              ? 'bg-amber-50 text-amber-700 border-amber-100' 
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {u.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          onClick={(e) => handleDelete(u.id, e)}
                          disabled={deletingId === u.id}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                          title="Delete User"
                        >
                          {deletingId === u.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <UserModal 
          mode="add"
          onClose={() => setIsAddModalOpen(false)}
          onRefresh={fetchUsers}
        />
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <UserModal 
          mode="edit"
          user={selectedUser}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onRefresh={fetchUsers}
        />
      )}
    </DashboardLayout>
  );
}

interface ModalProps {
  mode: 'add' | 'edit';
  user?: User;
  onClose: () => void;
  onRefresh: () => void;
}

function UserModal({ mode, user, onClose, onRefresh }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    employeeId: user?.employeeId || '',
    phoneNumber: user?.phoneNumber || '',
    isActive: user?.isActive !== undefined ? user.isActive : true,
    role: user?.role || 'user',
    canBookAuditorium: user?.canBookAuditorium || false,
    canBookClassroom: user?.canBookClassroom || false,
    canBookTransport: user?.canBookTransport || false,
    canManageVehicles: user?.canManageVehicles || false,
    canManageClassrooms: user?.canManageClassrooms || false,
    canManageMaintenance: user?.canManageMaintenance || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        await fetchApi('/auth/register', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        toast.success('User created successfully. Credentials sent to email.');
      } else {
        await fetchApi(`/auth/${user?.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        });
        toast.success('User updated successfully');
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${mode} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[1.5rem] bg-brand-600 flex items-center justify-center text-white shadow-2xl shadow-brand-500/40 rotate-3">
              {mode === 'add' ? <Plus className="w-8 h-8" /> : <UserIcon className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{mode === 'add' ? 'Create New User' : 'Edit User Profile'}</h2>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{mode === 'add' ? 'Set up a new system account' : 'Update account details and permissions'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all hover:rotate-90">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Primary Details */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Account Information</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 ml-1">Full Identity Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white rounded-[1.25rem] text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 ml-1">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white rounded-[1.25rem] text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all"
                    placeholder="example@mpma.lk"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white rounded-[1.25rem] text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all"
                    placeholder="+94 7X XXX XXXX"
                  />
                </div>
              </div>

              {mode === 'add' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 ml-1">Temporary Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white rounded-[1.25rem] text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all"
                      placeholder="Min 8 characters"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 ml-1">Employee ID</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white rounded-[1.25rem] text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all"
                      placeholder="EMP001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 ml-1">System Role</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-12 pr-8 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-500/20 focus:bg-white rounded-[1.25rem] text-sm font-bold focus:ring-4 focus:ring-brand-500/5 outline-none transition-all appearance-none"
                    >
                      <option value="user">Regular User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent hover:border-brand-500/10 cursor-pointer transition-all group shadow-inner">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800">Account Active</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{formData.isActive ? 'User can log in to the system' : 'User access is currently blocked'}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-6 h-6 rounded-lg border-slate-300 text-brand-600 focus:ring-brand-500/20 transition-all cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Permissions Panel */}
            <div className="bg-slate-50/50 rounded-[2rem] p-8 space-y-8 border border-slate-100">
              <div className="space-y-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-brand-600" />
                  Booking Permissions
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { field: 'canBookAuditorium', label: 'Auditorium Booking' },
                    { field: 'canBookClassroom', label: 'Classroom Booking' },
                    { field: 'canBookTransport', label: 'Transport Booking' }
                  ].map(p => (
                    <label key={p.field} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-brand-500 transition-all cursor-pointer group shadow-sm">
                      <span className="text-sm font-bold text-slate-700">{p.label}</span>
                      <input 
                        type="checkbox" 
                        name={p.field}
                        checked={(formData as any)[p.field]}
                        onChange={handleChange}
                        className="w-6 h-6 rounded-lg border-slate-300 text-brand-600 focus:ring-brand-500/20 transition-all cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-indigo-600" />
                  Management Permissions
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { field: 'canManageVehicles', label: 'Vehicle Management' },
                    { field: 'canManageClassrooms', label: 'Classroom Management' },
                    { field: 'canManageMaintenance', label: 'Maintenance Management' }
                  ].map(p => (
                    <label key={p.field} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 transition-all cursor-pointer group shadow-sm">
                      <span className="text-sm font-bold text-slate-700">{p.label}</span>
                      <input 
                        type="checkbox" 
                        name={p.field}
                        checked={(formData as any)[p.field]}
                        onChange={handleChange}
                        className="w-6 h-6 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500/20 transition-all cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 px-6 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl shadow-2xl shadow-brand-500/30 transition-all flex items-center justify-center gap-3 active:scale-95 hover:scale-[1.01]"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (mode === 'add' ? <Plus className="w-6 h-6" /> : <Check className="w-6 h-6" />)}
              {mode === 'add' ? 'Create Account' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
