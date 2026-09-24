import React, { useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import { MenuItem, MenuCategoryType, PriceVariant } from '../../types';

interface ItemEditModalProps {
  item: MenuItem | null; // null if adding new item
  defaultCategory?: MenuCategoryType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => Promise<void>;
}

// Curated high quality food image presets with clean backgrounds
const PRESET_IMAGES = [
  { label: 'Chicken Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chicken Karahi', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tarka Daal', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Steamed Rice', url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80' },
  { label: 'Shahi Kheer', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Patient Khichdi / Soup', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Homemade Roti', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
  { label: 'Crispy Paratha', url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80' },
  { label: 'Seekh Kabab', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80' },
  { label: 'Shami Kabab', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80' },
  { label: 'Chicken White Karahi', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
  { label: 'Pulao', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80' },
  { label: 'Gulab Jamun', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80' },
  { label: 'Zeera Raita', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
];

export const ItemEditModal: React.FC<ItemEditModalProps> = ({
  item,
  defaultCategory = 'daily',
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(item?.name || '');
  const [nameUrdu, setNameUrdu] = useState(item?.nameUrdu || '');
  const [category, setCategory] = useState<MenuCategoryType>(item?.category || defaultCategory);
  const [subCategory, setSubCategory] = useState(item?.subCategory || '');
  const [description, setDescription] = useState(item?.description || '');
  const [descriptionUrdu, setDescriptionUrdu] = useState(item?.descriptionUrdu || '');
  const [price, setPrice] = useState<number>(item?.price || 0);
  const [image, setImage] = useState(item?.image || PRESET_IMAGES[0].url);
  const [isAvailable, setIsAvailable] = useState<boolean>(item?.isAvailable ?? true);
  const [isActive, setIsActive] = useState<boolean>(item?.isActive ?? true);
  const [isDailyMenu, setIsDailyMenu] = useState<boolean>(item?.isDailyMenu ?? (category === 'daily'));
  const [isPatientSpecial, setIsPatientSpecial] = useState<boolean>(item?.isPatientSpecial ?? (category === 'patient'));
  const [dailySlotIndex, setDailySlotIndex] = useState<number>(item?.dailySlotIndex || 1);
  const [patientSlotIndex, setPatientSlotIndex] = useState<number>(item?.patientSlotIndex || 1);

  // Variants management (e.g. 1 Pc / 6 Pcs, 1/2 KG / 1 KG)
  const [variants, setVariants] = useState<PriceVariant[]>(item?.variants || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddVariant = () => {
    setVariants([...variants, { label: 'Portion', price: price || 0 }]);
  };

  const handleUpdateVariant = (index: number, field: keyof PriceVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an item name');
      return;
    }

    setIsSaving(true);
    try {
      const updatedItem: MenuItem = {
        id: item?.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        nameUrdu: nameUrdu.trim(),
        description: description.trim(),
        descriptionUrdu: descriptionUrdu.trim(),
        price: Number(price) || (variants.length > 0 ? variants[0].price : 0),
        variants: variants.length > 0 ? variants : undefined,
        image: image.trim(),
        category,
        subCategory: subCategory.trim() || undefined,
        isAvailable,
        isActive,
        isDailyMenu,
        isPatientSpecial,
        dailySlotIndex: isDailyMenu ? Number(dailySlotIndex) : undefined,
        patientSlotIndex: isPatientSpecial ? Number(patientSlotIndex) : undefined,
      };

      await onSave(updatedItem);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save item. Check console.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 bg-zinc-950 text-white flex items-center justify-between border-b border-amber-500/20">
          <div>
            <h3 className="font-extrabold text-lg text-amber-400">
              {item ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <p className="text-xs text-zinc-400">
              Changes sync directly to customer website in real-time
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Item Name English & Urdu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Item Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chicken Biryani"
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Item Name (Urdu - اردو)
              </label>
              <input
                type="text"
                dir="rtl"
                value={nameUrdu}
                onChange={(e) => setNameUrdu(e.target.value)}
                placeholder="مثلاً چکن بریانی"
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 outline-none font-urdu"
              />
            </div>
          </div>

          {/* Category & SubCategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Primary Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MenuCategoryType)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 bg-white focus:border-amber-500 outline-none"
              >
                <option value="daily">TODAY'S MENU (Daily Slot)</option>
                <option value="patient">PATIENT SPECIAL</option>
                <option value="roti">ROTI (Homemade Roti)</option>
                <option value="roti_paratha">ROTI & PARATHA</option>
                <option value="sweets">SWEETS</option>
                <option value="sides">SIDES</option>
                <option value="on_order">ON ORDER</option>
                <option value="frozen">FROZEN</option>
                <option value="kabab">KABAB (Ready to eat)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Subcategory (for On Order grouping)
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 bg-white focus:border-amber-500 outline-none"
              >
                <option value="">None / General</option>
                <option value="BIRYANI & PULAO">BIRYANI & PULAO</option>
                <option value="CHICKEN KARAHI">CHICKEN KARAHI</option>
                <option value="BONELESS & KOFTA">BONELESS & KOFTA</option>
                <option value="HANDI">HANDI</option>
                <option value="CHICKEN QORMA">CHICKEN QORMA</option>
                <option value="CHICKEN QEEMA">CHICKEN QEEMA</option>
              </select>
            </div>
          </div>

          {/* Special Slot Configurations */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
            <span className="text-xs font-bold text-zinc-700 uppercase tracking-wide block">
              Menu Slot Placement
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                <input
                  type="checkbox"
                  checked={isDailyMenu}
                  onChange={(e) => setIsDailyMenu(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>Include in TODAY'S MENU section</span>
              </label>

              {isDailyMenu && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 font-semibold whitespace-nowrap">Daily Slot:</span>
                  <select
                    value={dailySlotIndex}
                    onChange={(e) => setDailySlotIndex(Number(e.target.value))}
                    className="px-2 py-1 text-xs rounded border border-zinc-300 bg-white"
                  >
                    <option value={1}>Slot 1 (e.g. Biryani)</option>
                    <option value={2}>Slot 2 (e.g. Karahi)</option>
                    <option value={3}>Slot 3 (e.g. Daal Chawal)</option>
                    <option value={4}>Slot 4 (e.g. Steamed Rice)</option>
                    <option value={5}>Slot 5 (e.g. Shahi Kheer)</option>
                    <option value={6}>Extra Daily Slot</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                <input
                  type="checkbox"
                  checked={isPatientSpecial}
                  onChange={(e) => setIsPatientSpecial(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>Include in PATIENT SPECIAL section</span>
              </label>

              {isPatientSpecial && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 font-semibold whitespace-nowrap">Patient Slot:</span>
                  <select
                    value={patientSlotIndex}
                    onChange={(e) => setPatientSlotIndex(Number(e.target.value))}
                    className="px-2 py-1 text-xs rounded border border-zinc-300 bg-white"
                  >
                    <option value={1}>Patient Slot 1</option>
                    <option value={2}>Patient Slot 2</option>
                    <option value={3}>Patient Slot 3</option>
                    <option value={4}>Patient Slot 4</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Description (English)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Delicious tender homemade dish..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Description (Urdu - اردو)
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={descriptionUrdu}
                onChange={(e) => setDescriptionUrdu(e.target.value)}
                placeholder="خالص گھریلو مصالحوں سے تیار کردہ..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 outline-none font-urdu"
              />
            </div>
          </div>

          {/* Pricing & Multiple Variants */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-zinc-800 uppercase tracking-wide block">
                  Pricing (Pakistani Rupees)
                </label>
                <p className="text-[11px] text-zinc-500">
                  Set flat price or add portion sizes (e.g. 1 Piece vs 6 Pieces, ½ KG vs 1 KG)
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-2.5 py-1 text-xs font-bold rounded-lg border border-amber-400 bg-amber-50 text-amber-900 flex items-center gap-1 hover:bg-amber-100 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Portion Size</span>
              </button>
            </div>

            {/* Base price (if no variants) */}
            {variants.length === 0 ? (
              <div className="max-w-xs">
                <label className="text-xs text-zinc-600 block mb-1">Base Price (Rs.) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="e.g. 350"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 outline-none font-bold"
                />
              </div>
            ) : (
              /* Variants list */
              <div className="space-y-2">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-zinc-200">
                    <input
                      type="text"
                      placeholder="e.g. ½ KG or 1 Piece"
                      value={v.label}
                      onChange={(e) => handleUpdateVariant(idx, 'label', e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs rounded border border-zinc-200"
                    />
                    <input
                      type="number"
                      placeholder="Price (Rs.)"
                      value={v.price}
                      onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                      className="w-28 px-2.5 py-1.5 text-xs rounded border border-zinc-200 font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Selector & Clean presets */}
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Food Image URL *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:border-amber-500 outline-none"
              />
              <img
                src={image}
                alt="Preview"
                className="w-10 h-10 rounded-lg object-cover border border-zinc-300 shrink-0 bg-zinc-100"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute('src', PRESET_IMAGES[0].url);
                }}
              />
            </div>

            {/* Quick preset selector */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-zinc-500">Quick Image Presets:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {PRESET_IMAGES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(p.url)}
                    className="px-2 py-1 rounded text-[11px] font-semibold bg-zinc-100 hover:bg-amber-100 text-zinc-700 whitespace-nowrap border border-zinc-200 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status Controls */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>In Stock / Available to Order</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>Published / Visible on Website</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl gold-button text-black font-extrabold text-sm flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save & Publish'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
