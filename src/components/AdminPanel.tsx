import React, { useState } from 'react';
import { 
  Lock, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Settings as SettingsIcon, 
  ShoppingBag, 
  Calendar, 
  HeartHandshake, 
  Eye, 
  EyeOff, 
  Save, 
  ExternalLink,
  BookOpen,
  DollarSign,
  Phone,
  Flame,
  X
} from 'lucide-react';
import { MenuItem, MenuCategoryType, Order, WebsiteSettings, PriceVariant } from '../types';
import { ItemEditModal } from './admin/ItemEditModal';
import { 
  loginAdmin, 
  registerAdmin, 
  loginWithGoogle,
  logoutAdmin, 
  saveMenuItem, 
  deleteMenuItem, 
  saveWebsiteSettings, 
  updateOrderStatus, 
  seedInitialData 
} from '../services/firebase';
import { User } from 'firebase/auth';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  menuItems: MenuItem[];
  settings: WebsiteSettings;
  orders: Order[];
}

type AdminTab = 
  | 'dashboard'
  | 'today_menu'
  | 'patient'
  | 'roti'
  | 'sweets'
  | 'roti_paratha'
  | 'sides'
  | 'on_order'
  | 'frozen'
  | 'kabab'
  | 'orders'
  | 'settings'
  | 'guide';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  currentUser,
  menuItems,
  settings,
  orders,
}) => {
  if (!isOpen) return null;

  // Auth State
  const [email, setEmail] = useState('admin@theroyalkitchen.com');
  const [password, setPassword] = useState('RoyalKitchen2026!');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [seedSuccessMessage, setSeedSuccessMessage] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('today_menu');

  // Modal State
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultCategory, setModalDefaultCategory] = useState<MenuCategoryType>('daily');

  // Settings State Form
  const [editableSettings, setEditableSettings] = useState<WebsiteSettings>(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Quick Seed status
  const [isSeeding, setIsSeeding] = useState(false);

  // Handle Login or Register
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      if (authMode === 'login') {
        try {
          await loginAdmin(email.trim(), password.trim());
        } catch (err: any) {
          // If user doesn't exist yet, try creating it automatically for easy initial setup
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
            await registerAdmin(email.trim(), password.trim());
          } else {
            throw err;
          }
        }
      } else {
        await registerAdmin(email.trim(), password.trim());
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters long.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please click "Sign In" instead.';
      }
      setAuthError(msg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      // If popup closed or blocked, show informative message
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Google Sign In failed.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Quick Login
  const handleQuickLogin = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      try {
        await loginAdmin('admin@theroyalkitchen.com', 'RoyalKitchen2026!');
      } catch {
        await registerAdmin('admin@theroyalkitchen.com', 'RoyalKitchen2026!');
      }
    } catch (e: any) {
      setAuthError(e.message || 'Could not auto-login with default credentials.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Toggle Item Availability
  const handleToggleAvailability = async (item: MenuItem) => {
    if (!currentUser) {
      alert('Admin authentication is required to change item availability.');
      return;
    }
    try {
      await saveMenuItem({
        ...item,
        isAvailable: !item.isAvailable,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to update item availability.');
    }
  };

  // Toggle Item Active
  const handleToggleActive = async (item: MenuItem) => {
    if (!currentUser) {
      alert('Admin authentication is required to enable or disable menu items.');
      return;
    }
    try {
      await saveMenuItem({
        ...item,
        isActive: !item.isActive,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to update item status.');
    }
  };

  // Delete Item with confirmation
  const handleDeleteItem = async (itemId: string, name: string) => {
    if (!currentUser) {
      alert('Admin authentication is required to delete menu items.');
      return;
    }
    if (confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      try {
        await deleteMenuItem(itemId);
      } catch (err: any) {
        alert(err.message || 'Failed to delete item.');
      }
    }
  };

  // Open Edit Modal
  const openEditModal = (item: MenuItem) => {
    if (!currentUser) {
      alert('Admin authentication is required to edit menu items.');
      return;
    }
    setEditingItem(item);
    setModalDefaultCategory(item.category);
    setIsModalOpen(true);
  };

  // Open Add Modal
  const openAddModal = (cat: MenuCategoryType = 'daily') => {
    if (!currentUser) {
      alert('Admin authentication is required to add menu items.');
      return;
    }
    setEditingItem(null);
    setModalDefaultCategory(cat);
    setIsModalOpen(true);
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Admin authentication is required to modify website settings.');
      return;
    }
    try {
      await saveWebsiteSettings(editableSettings);
      setSettingsSavedMessage(true);
      setTimeout(() => setSettingsSavedMessage(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to save website settings.');
    }
  };

  // Seed Menu
  const handleSeedMenu = async () => {
    if (!currentUser) {
      alert('Admin authentication is required to seed menu items. Please sign in as an admin.');
      return;
    }
    setIsSeeding(true);
    setSeedSuccessMessage(null);
    try {
      const res = await seedInitialData(true);
      if (res.success) {
        setSeedSuccessMessage(res.message);
        setTimeout(() => setSeedSuccessMessage(null), 5000);
      } else {
        alert(`Seeding notice: ${res.message}`);
      }
    } catch (err: any) {
      alert(`Seeding failed: ${err.message || 'Could not seed Firestore.'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Daily menu items
  const dailyMenuItems = menuItems
    .filter((i) => i.isDailyMenu || i.category === 'daily')
    .sort((a, b) => (a.dailySlotIndex || 99) - (b.dailySlotIndex || 99));

  // Patient items
  const patientItems = menuItems
    .filter((i) => i.isPatientSpecial || i.category === 'patient')
    .sort((a, b) => (a.patientSlotIndex || 99) - (b.patientSlotIndex || 99));

  // Filter items by active category tab
  const getCategoryItems = (cat: MenuCategoryType) => {
    return menuItems.filter((i) => i.category === cat);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-hidden">
      
      {/* Container */}
      <div className="relative w-full max-w-7xl h-[92vh] bg-white rounded-2xl shadow-2xl border border-amber-500/40 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-zinc-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">
                  The Royal Kitchen — Admin Portal
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Firebase Live Sync
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Ghar Ka Khana Ghar Tak • Live Database Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="hidden md:inline text-xs text-zinc-300">
                Logged in as: <strong className="text-amber-400">{currentUser.email}</strong>
              </span>
            )}

            {currentUser ? (
              <button
                onClick={() => logoutAdmin()}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-red-950/60 hover:border-red-500/50 text-zinc-300 hover:text-red-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : null}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* If NOT logged in, show secure login box */}
        {!currentUser ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-zinc-100 overflow-y-auto">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-zinc-200 text-center space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-400">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-zinc-950">
                  {authMode === 'login' ? 'Owner & Admin Sign In' : 'Create Admin Account'}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Authenticate via Firebase to edit prices, daily menus & orders
                </p>
              </div>

              {/* Requirement notice */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs text-left">
                <strong className="block font-bold mb-0.5">Admin Security Policy:</strong>
                Customers can view the menu and place orders. Only authenticated administrators can add, edit, delete menu items or initialize the database.
              </div>

              {/* Google Sign In (Primary OAuth) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isAuthLoading}
                className="w-full py-3 px-4 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google (Owner: urwakha09@gmail.com)</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-200" />
                <span className="flex-shrink mx-3 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Or Use Password</span>
                <div className="flex-grow border-t border-zinc-200" />
              </div>

              {/* Auth Mode Toggle */}
              <div className="flex bg-zinc-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(null); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    authMode === 'login'
                      ? 'bg-white text-zinc-950 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(null); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    authMode === 'register'
                      ? 'bg-white text-zinc-950 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  Create Admin
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-3 rounded-xl gold-button text-black font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isAuthLoading 
                      ? 'Authenticating...' 
                      : authMode === 'login' 
                        ? 'Sign In to Dashboard' 
                        : 'Register Admin Account'}
                  </span>
                </button>
              </form>

              {/* Quick One-Click Access for Owner */}
              <div className="pt-4 border-t border-zinc-100 space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Quick Access for Restaurant Owner
                </span>
                <button
                  type="button"
                  onClick={handleQuickLogin}
                  disabled={isAuthLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>One-Click Owner Sign In (admin@theroyalkitchen.com)</span>
                </button>
              </div>

            </div>
          </div>
        ) : (
          /* Main Logged In Interface with Sidebar Navigation */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-zinc-950 text-zinc-300 p-3 sm:p-4 border-r border-zinc-800 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              
              <div className="hidden md:block pb-2 mb-2 border-b border-zinc-800">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 px-3">
                  Management Sections
                </span>
              </div>

              {/* Navigation Items */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('today_menu')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'today_menu'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Today's Menu (5 Slots)</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {dailyMenuItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('patient')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'patient'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-400" />
                  <span>Patient Special</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {patientItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('roti')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'roti'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>🫓</span>
                <span>Roti (Homemade)</span>
              </button>

              <button
                onClick={() => setActiveTab('roti_paratha')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'roti_paratha'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>🥞</span>
                <span>Roti & Paratha</span>
              </button>

              <button
                onClick={() => setActiveTab('sweets')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'sweets'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>🍨</span>
                <span>Sweets</span>
              </button>

              <button
                onClick={() => setActiveTab('sides')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'sides'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>🥗</span>
                <span>Sides</span>
              </button>

              <button
                onClick={() => setActiveTab('on_order')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'on_order'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>🥘</span>
                <span>On Order (All 6 Groups)</span>
              </button>

              <button
                onClick={() => setActiveTab('frozen')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'frozen'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>❄️</span>
                <span>Frozen</span>
              </button>

              <button
                onClick={() => setActiveTab('kabab')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'kabab'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>🍢</span>
                <span>Kabab</span>
              </button>

              <div className="hidden md:block my-2 border-t border-zinc-800" />

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Orders</span>
                </div>
                {orders.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-600 text-white font-black">
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Website Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'bg-amber-500 text-black shadow-md font-extrabold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Step-by-Step Guide (9 Steps)</span>
              </button>

              {/* Seed Button Helper */}
              <div className="hidden md:block pt-4 mt-auto">
                <button
                  onClick={handleSeedMenu}
                  disabled={isSeeding}
                  className="w-full py-2 px-3 text-[11px] font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg transition cursor-pointer"
                >
                  {isSeeding ? 'Seeding...' : '↻ Reset / Re-seed Menu'}
                </button>
              </div>

            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-zinc-50 overflow-y-auto p-4 sm:p-6 lg:p-8">
              
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-950">
                        Admin Overview Dashboard
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Monitor daily food slots, active customer orders, and store availability
                      </p>
                    </div>

                    <button
                      onClick={() => openAddModal('daily')}
                      className="px-4 py-2 rounded-xl gold-button text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Menu Item</span>
                    </button>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-1">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                        Today's Menu Items
                      </span>
                      <span className="text-3xl font-black text-zinc-950">
                        {dailyMenuItems.length}
                      </span>
                      <p className="text-[11px] text-amber-600 font-semibold">
                        Configured for customer view
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-1">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                        Total Menu Dishes
                      </span>
                      <span className="text-3xl font-black text-zinc-950">
                        {menuItems.length}
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        Across all categories
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-1">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                        Total Orders
                      </span>
                      <span className="text-3xl font-black text-zinc-950">
                        {orders.length}
                      </span>
                      <p className="text-[11px] text-emerald-600 font-semibold">
                        Logged in Firestore
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-1">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                        Online Payment Mode
                      </span>
                      <span className="text-lg font-black text-zinc-950 block">
                        JazzCash Only
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        0300 2934707 (No COD)
                      </p>
                    </div>
                  </div>

                  {/* Database & Firestore Status Banner */}
                  <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white rounded-2xl border border-amber-500/30 p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h4 className="font-extrabold text-sm text-white">
                          Firebase Firestore Status: Active & Synced
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Admin authenticated as <strong className="text-amber-400">{currentUser?.email}</strong>. {menuItems.length} menu items loaded.
                      </p>
                      {seedSuccessMessage && (
                        <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{seedSuccessMessage}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleSeedMenu}
                        disabled={isSeeding}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-md transition disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>{isSeeding ? 'Seeding to Firestore...' : 'Seed / Re-initialize Firestore Menu'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Daily Menu Quick Manager Highlight */}
                  <div className="bg-white rounded-2xl border border-amber-300 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-amber-500" />
                        <h4 className="font-extrabold text-base text-zinc-950">
                          Active Today's Menu (Slots 1 - 5)
                        </h4>
                      </div>
                      <button
                        onClick={() => setActiveTab('today_menu')}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                      >
                        Manage & Swap Daily Dishes →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {dailyMenuItems.slice(0, 5).map((item, idx) => (
                        <div key={item.id} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mb-1">
                              Slot {idx + 1}
                            </span>
                            <h5 className="font-extrabold text-xs text-zinc-900 line-clamp-1">{item.name}</h5>
                            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Rs. {item.price.toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => openEditModal(item)}
                            className="w-full py-1 text-[11px] font-bold text-zinc-700 hover:text-black bg-white rounded border border-zinc-200 hover:border-amber-400 cursor-pointer"
                          >
                            Edit Slot {idx + 1}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TODAY'S MENU (5 EDITABLE DAILY SLOTS) */}
              {activeTab === 'today_menu' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black text-zinc-950">
                          Today's Menu (Daily 5 Slots Manager)
                        </h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Priority Section
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 mt-1 max-w-2xl leading-relaxed">
                        Change Monday's, Tuesday's, or any day's menu here. Changes sync to the customer website instantly without editing any code.
                      </p>
                    </div>

                    <button
                      onClick={() => openAddModal('daily')}
                      className="px-4 py-2 rounded-xl gold-button text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Item to Daily Menu</span>
                    </button>
                  </div>

                  {/* Daily items list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dailyMenuItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 flex flex-col justify-between space-y-4 hover:border-amber-400 transition"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-xl object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block">
                              Slot {item.dailySlotIndex || idx + 1}
                            </span>
                            <h4 className="font-extrabold text-sm text-zinc-900 truncate mt-1">
                              {item.name}
                            </h4>
                            {item.nameUrdu && (
                              <p className="text-xs text-zinc-500 font-urdu" dir="rtl">
                                {item.nameUrdu}
                              </p>
                            )}
                            <p className="text-xs font-black text-amber-700 mt-1">
                              Rs. {item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleAvailability(item)}
                              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                                item.isAvailable
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-zinc-100 border-zinc-300 text-zinc-600'
                              }`}
                            >
                              {item.isAvailable ? 'In Stock' : 'Sold Out'}
                            </button>

                            <button
                              onClick={() => handleToggleActive(item)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                item.isActive
                                  ? 'text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                                  : 'text-zinc-400 bg-zinc-100 border-zinc-300'
                              }`}
                              title={item.isActive ? 'Visible on website' : 'Hidden from website'}
                            >
                              {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(item)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PATIENT SPECIAL (3 EDITABLE SLOTS) */}
              {activeTab === 'patient' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-950">
                        Patient Special (3 Initial Editable Slots)
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Special diet meals for recovery, mild stomach, low oil & low salt requirements.
                      </p>
                    </div>

                    <button
                      onClick={() => openAddModal('patient')}
                      className="px-4 py-2 rounded-xl gold-button text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Patient Dish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {patientItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col justify-between space-y-4 hover:border-amber-400 transition"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-xl object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                              Patient Slot {item.patientSlotIndex || idx + 1}
                            </span>
                            <h4 className="font-extrabold text-sm text-zinc-900 truncate mt-1">
                              {item.name}
                            </h4>
                            <p className="text-xs font-black text-amber-700 mt-1">
                              Rs. {item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                              item.isAvailable
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-zinc-100 border-zinc-300 text-zinc-600'
                            }`}
                          >
                            {item.isAvailable ? 'In Stock' : 'Sold Out'}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(item)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="p-1.5 text-zinc-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ROTI */}
              {activeTab === 'roti' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-950">Homemade Roti (Rs. 30)</h3>
                      <p className="text-xs text-zinc-500">Edit price, image, description and portions for Homemade Roti</p>
                    </div>
                    <button
                      onClick={() => openAddModal('roti')}
                      className="px-4 py-2 rounded-xl gold-button text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Roti Variant</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getCategoryItems('roti').map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4">
                        <div className="flex gap-4">
                          <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-extrabold text-base text-zinc-950">{item.name}</h4>
                            <p className="text-xs text-zinc-600 mt-1">{item.description}</p>
                            <p className="text-lg font-black text-amber-700 mt-2">Rs. {item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Item</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SWEETS */}
              {activeTab === 'sweets' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-950">Sweets & Desserts</h3>
                      <p className="text-xs text-zinc-500">Manage traditional sweets (Kheer, Gulab Jamun, Gajar Halwa, Zarda)</p>
                    </div>
                    <button
                      onClick={() => openAddModal('sweets')}
                      className="px-4 py-2 rounded-xl gold-button text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Sweet</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {getCategoryItems('sweets').map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3">
                        <img src={item.image} alt={item.name} className="w-full h-32 rounded-xl object-cover" />
                        <h4 className="font-extrabold text-sm text-zinc-950 truncate">{item.name}</h4>
                        <p className="text-xs font-black text-amber-700">Rs. {item.price.toLocaleString()}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-2 py-1 text-[10px] font-bold rounded ${item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'}`}
                          >
                            {item.isAvailable ? 'Available' : 'Sold Out'}
                          </button>
                          <div className="flex gap-1">
                            <button onClick={() => openEditModal(item)} className="p-1.5 text-zinc-600 hover:text-black">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteItem(item.id, item.name)} className="p-1.5 text-zinc-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: ROTI & PARATHA */}
              {activeTab === 'roti_paratha' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-950">Roti & Paratha Category</h3>
                      <p className="text-xs text-zinc-500">
                        Aloo Paratha, Daal Paratha, Besan Paratha, Besan Roti, Seekh Kabab
                      </p>
                    </div>
                    <button
                      onClick={() => openAddModal('roti_paratha')}
                      className="px-4 py-2 rounded-xl gold-button text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Paratha Item</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getCategoryItems('roti_paratha').map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3">
                        <div className="flex gap-3">
                          <img src={item.image} alt={item.name} className="w-18 h-18 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-sm text-zinc-950 truncate">{item.name}</h4>
                            <div className="mt-1 space-y-0.5">
                              {item.variants ? (
                                item.variants.map((v, i) => (
                                  <span key={i} className="text-[11px] text-zinc-600 block">
                                    • {v.label}: <strong>Rs. {v.price}</strong>
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs font-bold text-amber-700">Rs. {item.price}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Item</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SIDES */}
              {activeTab === 'sides' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-950">Sides Category</h3>
                      <p className="text-xs text-zinc-500">Zeera Raita, Kachumber Salad, Mint Chutney, Pickle</p>
                    </div>
                    <button
                      onClick={() => openAddModal('sides')}
                      className="px-4 py-2 rounded-xl gold-button text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Side Item</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {getCategoryItems('sides').map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3">
                        <img src={item.image} alt={item.name} className="w-full h-32 rounded-xl object-cover" />
                        <h4 className="font-extrabold text-sm text-zinc-950">{item.name}</h4>
                        <p className="text-xs font-bold text-amber-700">Rs. {item.price}</p>
                        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                          <button onClick={() => openEditModal(item)} className="px-3 py-1 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: ON ORDER */}
              {activeTab === 'on_order' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-950">On Order Specials (All 6 Groups)</h3>
                      <p className="text-xs text-zinc-500">
                        Biryani & Pulao, Chicken Karahi, Boneless & Kofta, Handi, Chicken Qorma, Chicken Qeema
                      </p>
                    </div>
                    <button
                      onClick={() => openAddModal('on_order')}
                      className="px-4 py-2 rounded-xl gold-button text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add On Order Dish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getCategoryItems('on_order').map((item) => (
                      <div key={item.id} className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3">
                        <div className="flex gap-3">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase text-amber-700 block">
                              {item.subCategory || 'On Order'}
                            </span>
                            <h4 className="font-extrabold text-sm text-zinc-950 truncate">{item.name}</h4>
                            <div className="mt-1">
                              {item.variants ? (
                                item.variants.map((v, i) => (
                                  <span key={i} className="text-[11px] text-zinc-600 block">
                                    {v.label}: <strong>Rs. {v.price.toLocaleString()}</strong>
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs font-black text-zinc-900">Rs. {item.price.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'}`}
                          >
                            {item.isAvailable ? 'In Stock' : 'Sold Out'}
                          </button>
                          <div className="flex gap-1">
                            <button onClick={() => openEditModal(item)} className="p-1.5 text-zinc-700 hover:text-black">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteItem(item.id, item.name)} className="p-1.5 text-zinc-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: FROZEN */}
              {activeTab === 'frozen' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-950">Frozen Items</h3>
                      <p className="text-xs text-zinc-500">Chicken Kofta, Chicken Shami, Beef Shami (12 Pieces packs)</p>
                    </div>
                    <button
                      onClick={() => openAddModal('frozen')}
                      className="px-4 py-2 rounded-xl gold-button text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Frozen Item</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {getCategoryItems('frozen').map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3">
                        <img src={item.image} alt={item.name} className="w-full h-32 rounded-xl object-cover" />
                        <h4 className="font-extrabold text-sm text-zinc-950">{item.name}</h4>
                        <p className="text-sm font-black text-amber-700">Rs. {item.price.toLocaleString()}</p>
                        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                          <button onClick={() => openEditModal(item)} className="px-3 py-1 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteItem(item.id, item.name)} className="p-1 text-zinc-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 10: KABAB */}
              {activeTab === 'kabab' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-950">Hot Kabab (Ready to Eat)</h3>
                      <p className="text-xs text-zinc-500">Chicken Shami, Beef Shami, Chapli Kabab, Aloo Kabab</p>
                    </div>
                    <button
                      onClick={() => openAddModal('kabab')}
                      className="px-4 py-2 rounded-xl gold-button text-black font-extrabold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Kabab Item</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {getCategoryItems('kabab').map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3">
                        <img src={item.image} alt={item.name} className="w-full h-28 rounded-xl object-cover" />
                        <h4 className="font-extrabold text-sm text-zinc-950 truncate">{item.name}</h4>
                        <p className="text-xs font-black text-amber-700">Rs. {item.price.toLocaleString()}</p>
                        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                          <button onClick={() => openEditModal(item)} className="px-3 py-1 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 11: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-6 max-w-6xl">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-2xl font-black text-zinc-950">Customer Orders</h3>
                      <p className="text-xs text-zinc-500">Real-time incoming orders from customer website</p>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-zinc-300 space-y-3">
                      <ShoppingBag className="w-10 h-10 text-zinc-300 mx-auto" />
                      <h4 className="font-bold text-zinc-700">No orders received yet</h4>
                      <p className="text-xs text-zinc-500">Orders submitted by customers via shopping cart appear here live.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((ord) => (
                        <div key={ord.id} className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  {ord.orderNumber}
                                </span>
                                <span className="text-xs text-zinc-400">
                                  {new Date(ord.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <h4 className="font-extrabold text-base text-zinc-950 mt-1">
                                {ord.customerName} • <span className="text-zinc-600 font-medium">{ord.phone}</span>
                              </h4>
                            </div>

                            {/* Order Status selector */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500 font-semibold">Status:</span>
                              <select
                                value={ord.status}
                                onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-zinc-300 bg-white"
                              >
                                <option value="pending">Pending Payment Verification</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cooking">Cooking in Kitchen</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <span className="font-bold text-zinc-700 uppercase tracking-wide block">Delivery Info</span>
                              <p className="text-zinc-600"><strong>Area:</strong> {ord.area}</p>
                              <p className="text-zinc-600"><strong>Address:</strong> {ord.address}</p>
                              {ord.specialInstructions && (
                                <p className="text-amber-800 bg-amber-50 p-2 rounded">
                                  <strong>Notes:</strong> {ord.specialInstructions}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <span className="font-bold text-zinc-700 uppercase tracking-wide block">Payment (Online Only)</span>
                              <p className="text-zinc-600"><strong>Method:</strong> JazzCash (0300 2934707)</p>
                              <p className="text-zinc-600"><strong>TID / Ref:</strong> {ord.jazzCashTxnId || 'Direct WhatsApp verification'}</p>
                              <p className="text-zinc-950 font-black text-sm pt-1">
                                Total: Rs. {ord.total.toLocaleString()} (Items: Rs. {ord.subtotal.toLocaleString()} + Del: Rs. {ord.deliveryCharges.toLocaleString()})
                              </p>
                            </div>
                          </div>

                          {/* Items summary */}
                          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                            <span className="text-[11px] font-bold text-zinc-500 block mb-1">Ordered Dishes:</span>
                            <div className="space-y-1">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between text-xs text-zinc-800 font-medium">
                                  <span>{it.name} {it.variant ? `(${it.variant})` : ''} x {it.quantity}</span>
                                  <span className="font-bold">Rs. {it.subtotal.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 12: WEBSITE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="pb-4 border-b border-zinc-200">
                    <h3 className="text-2xl font-black text-zinc-950">Website Settings</h3>
                    <p className="text-xs text-zinc-500">
                      Configure contact numbers, operating branch, banner notice & Karachi delivery fees
                    </p>
                  </div>

                  {settingsSavedMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Website settings updated and synchronized to Firestore!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">JazzCash Number</label>
                        <input
                          type="text"
                          value={editableSettings.jazzCashNumber}
                          onChange={(e) => setEditableSettings({ ...editableSettings, jazzCashNumber: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 font-bold"
                        />
                        <span className="text-[11px] text-zinc-500">ONLINE PAYMENT ONLY</span>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">WhatsApp Order Number</label>
                        <input
                          type="text"
                          value={editableSettings.whatsappNumber}
                          onChange={(e) => setEditableSettings({ ...editableSettings, whatsappNumber: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">Operating Location (English)</label>
                        <input
                          type="text"
                          value={editableSettings.operatingFrom}
                          onChange={(e) => setEditableSettings({ ...editableSettings, operatingFrom: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">Operating Location (Urdu)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={editableSettings.operatingFromUrdu}
                          onChange={(e) => setEditableSettings({ ...editableSettings, operatingFromUrdu: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 font-urdu"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">Top Announcement Notice (English)</label>
                      <input
                        type="text"
                        value={editableSettings.announcementText}
                        onChange={(e) => setEditableSettings({ ...editableSettings, announcementText: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">Top Announcement Notice (Urdu)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={editableSettings.announcementTextUrdu}
                        onChange={(e) => setEditableSettings({ ...editableSettings, announcementTextUrdu: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 font-urdu"
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl gold-button text-black font-extrabold text-sm flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Website Settings</span>
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* TAB 13: STEP-BY-STEP USER GUIDE (THE 9 STEPS) */}
              {activeTab === 'guide' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="pb-4 border-b border-zinc-200">
                    <h3 className="text-2xl font-black text-zinc-950">
                      Website Owner's Operational Guide (9 Steps)
                    </h3>
                    <p className="text-xs text-zinc-600 mt-1">
                      Complete instructions on how your Firebase project, Admin Panel, Daily Menu changes, and price updates work.
                    </p>
                  </div>

                  <div className="space-y-4">
                    
                    {/* Step 1 */}
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">1</span>
                        <span>Create the Firebase Project</span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed pl-8">
                        Your Firebase project has already been provisioned via Google Cloud (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">gen-lang-client-0017620134</code>) with Cloud Firestore database ID: <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">ai-studio-1400a777-043d-4e8e-a917-8c2c78bff32a</code>.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">2</span>
                        <span>Connect Firebase</span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed pl-8">
                        The web app is connected directly to Firestore with real-time snapshot listeners (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-900 font-mono">onSnapshot</code>) and secure security rules deployed.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">3</span>
                        <span>Create & Access the Admin Account</span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed pl-8">
                        Your default admin account is <strong className="text-zinc-900 font-mono">admin@theroyalkitchen.com</strong> with password <strong className="text-zinc-900 font-mono">RoyalKitchen2026!</strong>. You can also use the One-Click Sign In button on the login screen.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">4</span>
                        <span>Open the Admin Panel</span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed pl-8">
                        Click the <strong>Lock Icon (🔒)</strong> located in the top-right corner of the website header at any time to open this Admin Panel. Normal customers cannot edit dishes.
                      </p>
                    </div>

                    {/* Step 5 */}
                    <div className="bg-white p-5 rounded-2xl border border-amber-300 bg-amber-50/20 space-y-2">
                      <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs">5</span>
                        <span>Change Today's Menu Every Day</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed pl-8">
                        In the sidebar, click <strong>"Today's Menu (5 Slots)"</strong>. Click <strong>Edit</strong> on any slot (e.g. Slot 1, Slot 2, Slot 3, Slot 4, Slot 5) to change the food name (e.g. from Chicken Biryani to Chicken Pulao), image, description, or price. Click <strong>Save & Publish</strong> — the customer website updates immediately without page reload!
                      </p>
                    </div>

                    {/* Step 6 */}
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">6</span>
                        <span>Change Prices</span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed pl-8">
                        Click <strong>Edit</strong> on any item across any category (Daily, Parathas, On Order, Frozen, Kababs). You can change the base price or add portion sizes (such as 1 Piece vs 6 Pieces, or ½ KG vs 1 KG).
                      </p>
                    </div>

                    {/* Step 7 */}
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">7</span>
                        <span>Add New Items</span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed pl-8">
                        Click the <strong>"+ Add Menu Item"</strong> gold button in any section. Enter the dish name in English and Urdu, select its category, set pricing and image, then save.
                      </p>
                    </div>

                    {/* Step 8 */}
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">8</span>
                        <span>Delete Items</span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed pl-8">
                        Click the red <strong>Trash icon</strong> on any card to permanently delete that dish from Firestore.
                      </p>
                    </div>

                    {/* Step 9 */}
                    <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">9</span>
                        <span>Publish the Updated Website</span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed pl-8">
                        Because this website is backed by a live Firebase Firestore database, you do <strong>not</strong> need to deploy code or rebuild the website every time you change dishes or prices. Saving in the Admin Panel publishes the changes to all visitors across desktop and mobile devices immediately!
                      </p>
                    </div>

                  </div>
                </div>
              )}

            </main>

          </div>
        )}

      </div>

      {/* Item Add/Edit Modal */}
      <ItemEditModal
        item={editingItem}
        defaultCategory={modalDefaultCategory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (savedItem) => {
          if (!currentUser) {
            alert('Admin authentication is missing. Please log in as an administrator to save menu items.');
            return;
          }
          try {
            await saveMenuItem(savedItem);
            setIsModalOpen(false);
          } catch (err: any) {
            alert(err?.message || 'Failed to save menu item to Firestore.');
          }
        }}
      />

    </div>
  );
};
