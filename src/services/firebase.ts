import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  Firestore
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  Auth 
} from 'firebase/auth';
import firebaseConfig from '../config/firebaseConfig';
import { MenuItem, WebsiteSettings, Order } from '../types';
import { initialMenuItems, initialSettings } from '../data/initialData';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with the provisioned named database ID
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth: Auth = getAuth(app);

// LocalStorage cache keys for zero-latency initial rendering
const CACHE_MENU_KEY = 'royal_kitchen_menu_cache';
const CACHE_SETTINGS_KEY = 'royal_kitchen_settings_cache';
const CACHE_ORDERS_KEY = 'royal_kitchen_orders_cache';

// Seeding state tracking to prevent repeated or looping seed attempts
let isSeedingInProgress = false;
let seedAttemptedThisSession = false;

export interface SeedResult {
  success: boolean;
  message: string;
  count?: number;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to get cached or default menu items
export const getCachedMenuItems = (): MenuItem[] => {
  try {
    const raw = localStorage.getItem(CACHE_MENU_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Error reading menu cache', err);
  }
  return initialMenuItems;
};

// Helper to get cached or default settings
export const getCachedSettings = (): WebsiteSettings => {
  try {
    const raw = localStorage.getItem(CACHE_SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading settings cache', err);
  }
  return initialSettings;
};

/**
 * Seed initial menu and settings to Firestore.
 * Requires an authenticated admin user.
 * Prevents continuous retries if an attempt fails.
 */
export const seedInitialData = async (force: boolean = false): Promise<SeedResult> => {
  // Check if admin is authenticated before writing to Firestore
  if (!auth.currentUser) {
    const msg = 'Admin authentication is required to seed menu items to Firestore. Please log in first.';
    console.warn(msg);
    return { success: false, message: msg };
  }

  if (isSeedingInProgress) {
    return { success: false, message: 'Seeding is already in progress.' };
  }

  if (seedAttemptedThisSession && !force) {
    return { success: false, message: 'Database was already seeded or verified during this session.' };
  }

  isSeedingInProgress = true;
  seedAttemptedThisSession = true;

  try {
    const menuCol = collection(db, 'menuItems');
    const existing = await getDocs(menuCol);

    if (existing.empty || force) {
      console.log(`Admin authenticated (${auth.currentUser.email}). Seeding initial menu items to Firestore...`);
      let seededCount = 0;

      for (const item of initialMenuItems) {
        // Strip any undefined keys so Firestore doesn't reject payload
        const cleanItem: Record<string, any> = { updatedAt: Date.now() };
        Object.entries(item).forEach(([k, v]) => {
          if (v !== undefined) cleanItem[k] = v;
        });

        await setDoc(doc(db, 'menuItems', item.id), cleanItem, { merge: true });
        seededCount++;
      }

      // Seed website settings
      const settingsDoc = doc(db, 'websiteSettings', 'general');
      const cleanSettings: Record<string, any> = { updatedAt: Date.now() };
      Object.entries(initialSettings).forEach(([k, v]) => {
        if (v !== undefined) cleanSettings[k] = v;
      });
      await setDoc(settingsDoc, cleanSettings, { merge: true });

      // Update local cache
      localStorage.setItem(CACHE_MENU_KEY, JSON.stringify(initialMenuItems));
      localStorage.setItem(CACHE_SETTINGS_KEY, JSON.stringify(initialSettings));

      const successMsg = `Successfully seeded ${seededCount} menu items and website settings to Firestore.`;
      console.log(successMsg);
      return { success: true, message: successMsg, count: seededCount };
    } else {
      const msg = `Firestore already contains ${existing.size} menu items. Database is active.`;
      console.log(msg);
      return { success: true, message: msg, count: existing.size };
    }
  } catch (err: any) {
    console.error('Failed to seed to Firestore:', err);
    return { 
      success: false, 
      message: err?.message || 'Failed to seed to Firestore: Missing or insufficient permissions.' 
    };
  } finally {
    isSeedingInProgress = false;
  }
};

/**
 * Check if the menuItems collection is empty and seed it if admin is authenticated.
 */
export const checkAndSeedIfEmpty = async (): Promise<SeedResult | null> => {
  if (!auth.currentUser || seedAttemptedThisSession) {
    return null;
  }

  try {
    const menuCol = collection(db, 'menuItems');
    const existing = await getDocs(menuCol);
    if (existing.empty) {
      console.log('Admin logged in and Firestore menu is empty. Auto-seeding initial menu items...');
      return await seedInitialData(false);
    } else {
      seedAttemptedThisSession = true;
      return { success: true, message: `Database already populated with ${existing.size} items.` };
    }
  } catch (err: any) {
    seedAttemptedThisSession = true;
    console.error('Auto-seed check failed:', err);
    return { success: false, message: err?.message || 'Auto-seed failed.' };
  }
};

/**
 * Subscribe to real-time Menu Items.
 * Customers have public read access.
 * Unauthenticated users will NEVER attempt to write or seed to Firestore.
 */
export const subscribeToMenuItems = (callback: (items: MenuItem[]) => void): (() => void) => {
  // First emit cached or default data immediately
  callback(getCachedMenuItems());

  try {
    const menuCol = collection(db, 'menuItems');
    const unsubscribe = onSnapshot(menuCol, (snapshot) => {
      if (!snapshot.empty) {
        const items: MenuItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...(docSnap.data() as Omit<MenuItem, 'id'>) });
        });
        localStorage.setItem(CACHE_MENU_KEY, JSON.stringify(items));
        callback(items);
      } else {
        // If Firestore is empty and an admin is authenticated, attempt seed once
        if (auth.currentUser && !seedAttemptedThisSession) {
          checkAndSeedIfEmpty().catch(console.warn);
        }
        // Customers view default menu without triggering any write attempt
        callback(initialMenuItems);
      }
    }, (error) => {
      console.warn('Firestore menu items snapshot error (fallback to local data):', error.message);
      callback(getCachedMenuItems());
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Firestore subscription failed, falling back to local data', err);
    callback(getCachedMenuItems());
    return () => {};
  }
};

/**
 * Subscribe to real-time Website Settings.
 * Customers have public read access.
 * Unauthenticated users will NEVER attempt to write to Firestore.
 */
export const subscribeToWebsiteSettings = (callback: (settings: WebsiteSettings) => void): (() => void) => {
  callback(getCachedSettings());

  try {
    const settingsRef = doc(db, 'websiteSettings', 'general');
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as WebsiteSettings;
        localStorage.setItem(CACHE_SETTINGS_KEY, JSON.stringify(data));
        callback(data);
      } else {
        if (auth.currentUser) {
          setDoc(settingsRef, initialSettings, { merge: true }).catch(console.warn);
        }
        callback(initialSettings);
      }
    }, (error) => {
      console.warn('Firestore settings error:', error.message);
      callback(getCachedSettings());
    });

    return unsubscribe;
  } catch (err) {
    callback(getCachedSettings());
    return () => {};
  }
};

/**
 * Subscribe to real-time Orders.
 * ONLY authenticated administrators have permission to read the orders collection.
 */
export const subscribeToOrders = (callback: (orders: Order[]) => void): (() => void) => {
  // If not logged in as admin, do NOT attempt Firestore read (which requires auth)
  if (!auth.currentUser) {
    const localRaw = localStorage.getItem(CACHE_ORDERS_KEY);
    callback(localRaw ? JSON.parse(localRaw) : []);
    return () => {};
  }

  try {
    const ordersCol = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersCol, (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        orders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
      });
      orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      localStorage.setItem(CACHE_ORDERS_KEY, JSON.stringify(orders));
      callback(orders);
    }, (error) => {
      console.warn('Firestore orders error (reading local orders):', error.message);
      const localOrders = localStorage.getItem(CACHE_ORDERS_KEY);
      callback(localOrders ? JSON.parse(localOrders) : []);
    });

    return unsubscribe;
  } catch (err) {
    const localOrders = localStorage.getItem(CACHE_ORDERS_KEY);
    callback(localOrders ? JSON.parse(localOrders) : []);
    return () => {};
  }
};

/**
 * Save or Update a Menu Item.
 * Requires admin authentication.
 */
export const saveMenuItem = async (item: MenuItem): Promise<{ success: boolean; message: string }> => {
  if (!auth.currentUser) {
    const errorMsg = 'Admin authentication is required to save menu items. Please sign in as an admin.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const cleanItem: Record<string, any> = { updatedAt: Date.now() };
  Object.entries(item).forEach(([k, v]) => {
    if (v !== undefined) cleanItem[k] = v;
  });

  // Update local cache for instant UI response
  const current = getCachedMenuItems();
  const index = current.findIndex(i => i.id === item.id);
  let updatedList: MenuItem[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = item;
  } else {
    updatedList = [item, ...current];
  }
  localStorage.setItem(CACHE_MENU_KEY, JSON.stringify(updatedList));

  // Sync to Firestore
  try {
    await setDoc(doc(db, 'menuItems', item.id), cleanItem, { merge: true });
    return { success: true, message: `Menu item "${item.name}" saved successfully.` };
  } catch (err: any) {
    handleFirestoreError(err, OperationType.WRITE, `menuItems/${item.id}`);
  }
};

/**
 * Delete a Menu Item.
 * Requires admin authentication.
 */
export const deleteMenuItem = async (itemId: string): Promise<{ success: boolean; message: string }> => {
  if (!auth.currentUser) {
    const errorMsg = 'Admin authentication is required to delete menu items. Please sign in as an admin.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Update local cache
  const current = getCachedMenuItems();
  const filtered = current.filter(i => i.id !== itemId);
  localStorage.setItem(CACHE_MENU_KEY, JSON.stringify(filtered));

  // Delete from Firestore
  try {
    await deleteDoc(doc(db, 'menuItems', itemId));
    return { success: true, message: 'Menu item deleted successfully.' };
  } catch (err: any) {
    handleFirestoreError(err, OperationType.DELETE, `menuItems/${itemId}`);
  }
};

/**
 * Save Website Settings.
 * Requires admin authentication.
 */
export const saveWebsiteSettings = async (settings: WebsiteSettings): Promise<{ success: boolean; message: string }> => {
  if (!auth.currentUser) {
    const errorMsg = 'Admin authentication is required to update settings. Please sign in as an admin.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  localStorage.setItem(CACHE_SETTINGS_KEY, JSON.stringify(settings));

  const cleanSettings: Record<string, any> = { updatedAt: Date.now() };
  Object.entries(settings).forEach(([k, v]) => {
    if (v !== undefined) cleanSettings[k] = v;
  });

  try {
    await setDoc(doc(db, 'websiteSettings', 'general'), cleanSettings, { merge: true });
    return { success: true, message: 'Website settings updated successfully.' };
  } catch (err: any) {
    handleFirestoreError(err, OperationType.WRITE, 'websiteSettings/general');
  }
};

/**
 * Submit an Order.
 * Publicly accessible to all customers (matches `allow create: if true` in firestore.rules).
 */
export const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> => {
  const orderNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newOrder: Order = {
    ...orderData,
    id: orderId,
    orderNumber,
    createdAt: Date.now()
  };

  // Save to local cache
  try {
    const raw = localStorage.getItem(CACHE_ORDERS_KEY);
    const existing: Order[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(CACHE_ORDERS_KEY, JSON.stringify([newOrder, ...existing]));
  } catch (e) {
    console.warn(e);
  }

  // Save to Firestore
  try {
    const cleanOrder: Record<string, any> = {};
    Object.entries(newOrder).forEach(([k, v]) => {
      if (v !== undefined) cleanOrder[k] = v;
    });
    await setDoc(doc(db, 'orders', orderId), cleanOrder);
  } catch (err) {
    console.warn('Could not write order directly to Firestore, stored in local cache', err);
  }

  return newOrder;
};

/**
 * Update Order Status.
 * Requires admin authentication.
 */
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<{ success: boolean; message: string }> => {
  if (!auth.currentUser) {
    const errorMsg = 'Admin authentication is required to update orders. Please sign in as an admin.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const raw = localStorage.getItem(CACHE_ORDERS_KEY);
    if (raw) {
      const orders: Order[] = JSON.parse(raw);
      const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem(CACHE_ORDERS_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.warn(e);
  }

  try {
    await updateDoc(doc(db, 'orders', orderId), { status });
    return { success: true, message: `Order status updated to ${status}.` };
  } catch (err: any) {
    handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
  }
};

/**
 * Admin Auth Helpers
 */
export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // Check and seed if database is empty upon admin authentication
      checkAndSeedIfEmpty().catch(console.warn);
    }
    callback(user);
  });
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return await signInWithPopup(auth, provider);
};

export const loginAdmin = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerAdmin = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = async () => {
  return await signOut(auth);
};
