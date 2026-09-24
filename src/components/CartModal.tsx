import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { WebsiteSettings, DeliveryArea } from '../types';
import { createOrder } from '../services/firebase';

interface CartModalProps {
  settings: WebsiteSettings;
}

export const CartModal: React.FC<CartModalProps> = ({ settings }) => {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { isUrdu, t } = useLanguage();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedArea, setSelectedArea] = useState<DeliveryArea>(settings.deliveryAreas[0] || { name: 'Gulshan-e-Iqbal', nameUrdu: 'گلشن اقبال', fee: 150 });
  const [jazzCashTxn, setJazzCashTxn] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const deliveryFee = items.length > 0 ? selectedArea.fee : 0;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill in your name, contact phone, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        area: selectedArea.name,
        deliveryCharges: deliveryFee,
        items: items.map((i) => ({
          id: i.item.id,
          name: i.item.name,
          variant: i.selectedVariant?.label,
          price: i.unitPrice,
          quantity: i.quantity,
          subtotal: i.unitPrice * i.quantity,
        })),
        subtotal,
        total,
        paymentMethod: 'JazzCash' as const,
        jazzCashTxnId: jazzCashTxn.trim() || 'Pending verification',
        specialInstructions: notes.trim(),
        status: 'pending' as const,
      };

      const created = await createOrder(orderPayload);
      setCompletedOrderNumber(created.orderNumber);

      // Prepare WhatsApp message
      const itemsListText = items
        .map(
          (i, idx) =>
            `${idx + 1}. ${i.item.name} (${i.selectedVariant ? i.selectedVariant.label : 'Standard'}) x ${i.quantity} = Rs. ${(i.unitPrice * i.quantity).toLocaleString()}`
        )
        .join('\n');

      const waMessage = 
`👑 *THE ROYAL KITCHEN — NEW ORDER* 👑
*Order ID:* ${created.orderNumber}

*Customer Details:*
• Name: ${customerName}
• Phone: ${phone}
• Delivery Area: ${selectedArea.name}
• Address: ${address}
${notes ? `• Special Notes: ${notes}\n` : ''}
*Order Items:*
${itemsListText}

*Subtotal:* Rs. ${subtotal.toLocaleString()}
*Delivery Charges (${selectedArea.name}):* Rs. ${deliveryFee.toLocaleString()}
*Total Amount:* Rs. ${total.toLocaleString()}

*Payment Details:*
• Method: JazzCash (ONLINE PAYMENT ONLY)
• JazzCash Number: 0300 2934707
• TID / Sender: ${jazzCashTxn || 'Sharing receipt screenshot'}

Please confirm receipt and commence preparation. Thank you!`;

      const cleanWaNum = settings.whatsappNumber.replace(/[^0-9]/g, '');
      const fullWaUrl = `https://wa.me/92${cleanWaNum.slice(-10)}?text=${encodeURIComponent(waMessage)}`;

      // Clear cart
      clearCart();

      // Open WhatsApp automatically
      window.open(fullWaUrl, '_blank');
    } catch (err) {
      console.error(err);
      alert('There was an issue submitting your order. Please contact us on WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCompletedOrderNumber(null);
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={handleResetAndClose} />

      {/* Cart Drawer Container */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-zinc-950 text-white flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-extrabold text-lg tracking-tight">
                {t('cart')}
              </h2>
              <p className="text-xs text-zinc-400">
                The Royal Kitchen • Ghar Ka Khana Ghar Tak
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Successful Order State */}
        {completedOrderNumber ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Order Received
              </span>
              <h3 className="text-2xl font-black text-zinc-950">
                {t('orderSuccessTitle')}
              </h3>
              <p className="text-sm font-bold text-zinc-700">
                Order ID: <span className="text-amber-600 font-mono">{completedOrderNumber}</span>
              </p>
              <p className="text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                {t('orderSuccessDesc')}
              </p>
            </div>

            {/* JazzCash Reminder Card */}
            <div className="w-full bg-amber-50 border border-amber-300 rounded-xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>ONLINE PAYMENT REQUIRED</span>
              </div>
              <p className="text-xs text-amber-950 font-medium">
                Send payment to JazzCash: <strong className="text-base text-zinc-950">0300 2934707</strong>
              </p>
              <p className="text-[11px] text-zinc-600">
                Share payment screenshot or TID to our WhatsApp to begin immediate cooking.
              </p>
            </div>

            <a
              href={`https://wa.me/92${settings.whatsappNumber.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Assalam-o-Alaikum, here is the payment screenshot for Order ${completedOrderNumber}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Receipt on WhatsApp ({settings.whatsappNumber})</span>
            </a>

            <button
              onClick={handleResetAndClose}
              className="text-xs text-zinc-500 hover:text-zinc-800 font-bold underline cursor-pointer"
            >
              Back to Menu
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-zinc-900">
                {t('cartEmpty')}
              </h3>
              <p className="text-sm text-zinc-500 mt-1 max-w-xs">
                {t('cartEmptyDesc')}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="px-6 py-2.5 rounded-xl gold-button text-black text-sm font-bold shadow-xs cursor-pointer"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          /* Cart Items and Checkout Form */
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            
            {/* List of items */}
            <div className="p-4 space-y-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                {t('cartItems')} ({items.length})
              </span>
              {items.map((cartItem) => (
                <div
                  key={cartItem.cartItemId}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80"
                >
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-zinc-900 truncate">
                      {isUrdu ? cartItem.item.nameUrdu || cartItem.item.name : cartItem.item.name}
                    </h4>
                    {cartItem.selectedVariant && (
                      <span className="text-xs text-amber-700 font-semibold block">
                        {isUrdu && cartItem.selectedVariant.labelUrdu ? cartItem.selectedVariant.labelUrdu : cartItem.selectedVariant.label}
                      </span>
                    )}
                    <span className="text-xs font-black text-zinc-950 mt-1 block">
                      Rs. {cartItem.unitPrice.toLocaleString()} each
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 bg-white border border-zinc-300 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                      className="p-1 rounded hover:bg-zinc-100 text-zinc-600 transition cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-zinc-900">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                      className="p-1 rounded hover:bg-zinc-100 text-zinc-600 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(cartItem.cartItemId)}
                    className="p-2 text-zinc-400 hover:text-red-600 transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* MANDATORY PAYMENT NOTICE */}
            <div className="p-4 bg-amber-500/10 border-y border-amber-400/40 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <h4 className="text-xs sm:text-sm font-black text-zinc-950 uppercase tracking-wide">
                  {t('paymentNotice')}
                </h4>
              </div>
              <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                {t('noCodNotice')}
              </p>
              <div className="bg-zinc-950 text-white rounded-lg p-3 flex items-center justify-between border border-amber-400/30">
                <div>
                  <span className="text-[11px] text-zinc-400 font-bold block uppercase tracking-wider">
                    JazzCash Account
                  </span>
                  <span className="text-lg font-black text-amber-400 tracking-wider">
                    0300 2934707
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block">Account Title</span>
                  <span className="text-xs font-bold text-white">The Royal Kitchen</span>
                </div>
              </div>
            </div>

            {/* Customer Details Form */}
            <form id="checkout-form" onSubmit={handleSubmitOrder} className="p-5 space-y-4">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                {t('customerDetails')}
              </span>

              {/* Name */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Ahmed"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  {t('phoneNum')} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="03XX-XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Area Selector */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  {t('selectArea')} *
                </label>
                <select
                  value={selectedArea.name}
                  onChange={(e) => {
                    const found = settings.deliveryAreas.find((a) => a.name === e.target.value);
                    if (found) setSelectedArea(found);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                >
                  {settings.deliveryAreas.map((area) => (
                    <option key={area.name} value={area.name}>
                      {area.name} — Rs. {area.fee} Delivery
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Operating from Gulshan-e-Iqbal, Block 6. Charges calculated according to your sector.
                </p>
              </div>

              {/* Complete Address */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  {t('deliveryAddress')} *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House/Apartment #, Street, Nearby Landmark, Sector..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* JazzCash Transaction ID */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  {t('enterTxnId')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. TID 01928374 or Sender Account Name"
                  value={jazzCashTxn}
                  onChange={(e) => setJazzCashTxn(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  You can also directly share the payment screenshot on WhatsApp after booking.
                </p>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  {t('orderNotes')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less oil, extra raita, call upon arrival..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </form>
          </div>
        )}

        {/* Footer Billing Breakdown and Submit */}
        {!completedOrderNumber && items.length > 0 && (
          <div className="p-4 bg-zinc-950 text-white border-t border-amber-500/20 space-y-3">
            
            {/* Price lines */}
            <div className="space-y-1.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>{t('itemTotal')}</span>
                <span className="font-bold text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('deliveryFee')} ({selectedArea.name})</span>
                <span className="font-bold text-white">Rs. {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-amber-400 pt-2 border-t border-zinc-800">
                <span>{t('totalAmount')}</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl gold-button text-black font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>{t('submitOrder')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
