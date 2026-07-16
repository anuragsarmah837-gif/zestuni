import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Eye, Percent, Sparkles, MessageCircle, Heart, ZoomIn } from 'lucide-react';
import { Uniform, UniformCategory, Institution, WebsiteSettings } from '../types';

interface ProductDetailModalProps {
  uniform: Uniform;
  categories: UniformCategory[];
  institutions: Institution[];
  settings: WebsiteSettings;
  onClose: () => void;
}

export default function ProductDetailModal({
  uniform,
  categories,
  institutions,
  settings,
  onClose
}: ProductDetailModalProps) {
  // Image Viewer State
  const imageList = [
    uniform.images.main,
    uniform.images.front,
    uniform.images.back,
    uniform.images.side,
    ...(uniform.images.gallery || [])
  ].filter((img): img is string => !!img);

  const [activeImage, setActiveImage] = useState(imageList[0] || uniform.images.main);
  const [selectedSize, setSelectedSize] = useState(uniform.availableSizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  // WhatsApp Order Drawer
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const activeCategory = categories.find(c => c.id === uniform.categoryId)?.name || 'Official Uniform';
  const activeInstitution = institutions.find(i => i.id === uniform.institutionId);
  const institutionName = activeInstitution ? activeInstitution.name : 'Zestwear General line';

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const increaseQuantity = () => {
    if (quantity < 100) setQuantity(prev => prev + 1);
  };

  // Image zoom magnification feature
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  // Process and send the WhatsApp redirection API
  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;

    const messageTemplate = `Hello Zestwear,

I want to order the following uniform:

Institution:
${institutionName}

Product:
${uniform.name}

Size:
${selectedSize}

Quantity:
${quantity}

Customer Name:
${customerName}

Phone:
${customerPhone}

Address:
${customerAddress}

Please confirm my order.`;

    const cleanNumber = settings.whatsappNumber.replace(/\D/g, ''); // numerical digits only
    const cleanUrlText = encodeURIComponent(messageTemplate);
    const apiLink = `https://wa.me/${cleanNumber}?text=${cleanUrlText}`;

    // redirect
    window.open(apiLink, '_blank', 'referrerPolicy=no-referrer');
    setShowOrderForm(false);
  };

  const discountAmount = uniform.discountPrice ? uniform.price - uniform.discountPrice : 0;

  return (
    <div id="product-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      {/* Container Box */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-3xl overflow-hidden shadow-2xl transition-all h-[90vh] md:h-auto overflow-y-auto">

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black text-white hover:scale-105 transition-all"
          title="Close Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT: Image Gallery with Magnification */}
          <div className="p-6 md:p-8 space-y-4 border-r border-neutral-100 dark:border-neutral-900 flex flex-col justify-center">
            <div className="w-full">
              {/* Active Large Image Display Frame */}
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center border border-neutral-200/50 dark:border-neutral-800 cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => {
                  setIsZoomed(false);
                  setZoomStyle({});
                }}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={activeImage}
                  alt={uniform.name}
                  style={isZoomed ? zoomStyle : {}}
                  className="w-full h-full object-cover transition-transform duration-100"
                />

                {!isZoomed && (
                  <div className="absolute bottom-3 right-3 p-2 bg-black/70 rounded-lg text-white backdrop-blur-xs flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase">
                    <ZoomIn className="w-3.5 h-3.5" /> Hover to Zoom
                  </div>
                )}
              </div>

              {/* Thumbnails Selection Row */}
              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-black dark:border-white scale-102' : 'border-transparent opacity-60'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Ordering parameters or Drawer Form */}
          <div className="p-6 md:p-8 flex flex-col justify-between self-stretch relative bg-neutral-50/40 dark:bg-black/10">
            {showOrderForm ? (
              /* WhatsApp Details Subform Drawer overlay */
              <div className="h-full flex flex-col justify-between space-y-6 animate-fadeIn">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/10 text-green-500 rounded-md text-[10px] uppercase tracking-widest font-mono font-extrabold border border-green-500/10">
                    <MessageCircle className="w-3.5 h-3.5" /> SECURE WHATSAPP DRAFT
                  </div>
                  <h3 className="text-2xl font-bold font-sans tracking-tight text-neutral-900 dark:text-white">Order Details Form</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
                    Enter your customer coordinates below. This generates the exact official text draft required by administrative counselors for shipment verification.
                  </p>
                </div>

                <form onSubmit={handleSendWhatsAppOrder} className="space-y-4 flex-1">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white rounded-xl text-xs font-sans text-neutral-800 dark:text-neutral-100"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white rounded-xl text-xs font-sans text-neutral-800 dark:text-neutral-100"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400">Delivery Address *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Jorhat, Assam - Pin 785101"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white rounded-xl text-xs font-sans text-neutral-800 dark:text-neutral-100 resize-none"
                    />
                  </div>

                  {/* Confirm button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      className="w-1/3 py-3.5 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl text-xs font-bold font-sans"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-extrabold tracking-tight transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      Confirm & Send via WhatsApp
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Normal product info parameters screen */
              <div className="h-full flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-widest mb-1.5">
                    <span>{activeCategory}</span>
                    <span>SKU: {uniform.sku}</span>
                  </div>

                  {/* Product Title */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight text-neutral-900 dark:text-white leading-tight">
                    {uniform.name}
                  </h2>

                  {/* Institution tag with logo outline */}
                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-205">
                    <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                      <img src={activeInstitution?.logo} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span>{institutionName}</span>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="flex items-baseline gap-3 mt-6">
                    {uniform.discountPrice ? (
                      <>
                        <span className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
                          ₹{uniform.discountPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-neutral-400 line-through">
                          ₹{uniform.price.toLocaleString('en-IN')}
                        </span>
                        <div className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/10 text-[10px] font-mono uppercase font-bold rounded">
                          Save ₹{(uniform.price - uniform.discountPrice).toLocaleString('en-IN')}
                        </div>
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                        ₹{uniform.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Description text */}
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed mt-6">
                    {uniform.description}
                  </p>

                  {/* Textile specs details table */}
                  <div className="mt-6 border border-neutral-200/60 dark:border-neutral-800 rounded-xl overflow-hidden text-xs bg-white dark:bg-black/40">
                    <div className="grid grid-cols-2 p-3">
                      <span className="font-mono text-neutral-400 uppercase tracking-wider">FABRIC COMPOSITE</span>
                      <span className="font-sans font-semibold text-neutral-800 dark:text-white text-right truncate">
                        {uniform.fabricType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* selectors container */}
                <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                  {/* Size pill selectors */}
                  <div className="space-y-2">
                    <span className="block text-xs font-mono uppercase tracking-widest text-neutral-400">SELECT SIZING CODEX</span>
                    <div className="flex flex-wrap gap-2">
                      {uniform.availableSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[44px] h-[44px] rounded-xl text-xs font-bold font-sans tracking-wide transition-all ${selectedSize === size
                              ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                              : 'bg-white dark:bg-black border border-neutral-205 dark:border-neutral-800 text-neutral-600 hover:border-black'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* quantity and submit line */}
                  <div className="flex items-center gap-4 pt-2">
                    {/* Qty count control */}
                    <div className="flex items-center border border-neutral-205 dark:border-neutral-800 rounded-xl bg-white dark:bg-black p-0.5">
                      <button
                        onClick={decreaseQuantity}
                        className="p-3 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-sm font-extrabold font-mono text-neutral-800 dark:text-neutral-100 min-w-[32px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={increaseQuantity}
                        className="p-3 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                        disabled={quantity >= 100}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Order Trigger */}
                    <button
                      onClick={() => setShowOrderForm(true)}
                      className="flex-1 py-4 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-xl text-sm font-extrabold tracking-tight transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      Generate WhatsApp Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
