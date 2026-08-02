import React, { useState, useEffect, useMemo } from "react";
import { Heart, Star, Zap, Truck, ShoppingCart, Clock } from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data — swap for real Spree product objects. Shape mirrors what a
// storefront product-list response typically looks like, flattened for ease
// of use in a card component.
// ---------------------------------------------------------------------------
const PRODUCTS = [
  {
    id: "1",
    name: "Wireless Over-Ear Headphones with Active Noise Cancelling",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80",
    price: 3499,
    originalPrice: 6999,
    rating: 4.3,
    reviews: 812,
    badge: "flash",
    flashEndsAt: Date.now() + 1000 * 60 * 62,
    claimedPct: 68,
    freeDelivery: true,
    stock: "in",
  },
  {
    id: "2",
    name: "Men's Slim Fit Casual Cotton Shirt — Long Sleeve",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
    price: 1250,
    originalPrice: 1250,
    rating: 4.6,
    reviews: 204,
    badge: "new",
    freeDelivery: false,
    stock: "in",
  },
  {
    id: "3",
    name: "6L Air Fryer, Digital Touchscreen, 8 Presets",
    image:
      "https://images.unsplash.com/photo-1648396414601-2d8a2b1f42a3?w=500&q=80",
    price: 5999,
    originalPrice: 8499,
    rating: 4.8,
    reviews: 1543,
    badge: "topRated",
    freeDelivery: true,
    stock: "in",
  },
  {
    id: "4",
    name: "Stainless Steel Insulated Water Bottle, 1L",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    price: 899,
    originalPrice: 899,
    rating: 4.1,
    reviews: 67,
    badge: null,
    freeDelivery: false,
    stock: "low",
  },
  {
    id: "5",
    name: "Running Shoes — Lightweight Breathable Mesh",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80",
    price: 2799,
    originalPrice: 4200,
    rating: 4.4,
    reviews: 390,
    badge: "flash",
    flashEndsAt: Date.now() + 1000 * 60 * 18,
    claimedPct: 91,
    freeDelivery: true,
    stock: "in",
  },
  {
    id: "6",
    name: "Ceramic Non-Stick Cookware Set, 10 Pieces",
    image:
      "https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=500&q=80",
    price: 7200,
    originalPrice: 7200,
    rating: 4.0,
    reviews: 44,
    badge: null,
    freeDelivery: false,
    stock: "out",
  },
  {
    id: "7",
    name: "Kids' Backpack with Reflective Trim, 18L",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    price: 1699,
    originalPrice: 2100,
    rating: 4.5,
    reviews: 129,
    badge: "new",
    freeDelivery: true,
    stock: "in",
  },
  {
    id: "8",
    name: "Smart Watch, Heart Rate + SpO2, 1.4in Display",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    price: 4300,
    originalPrice: 9999,
    rating: 4.2,
    reviews: 2011,
    badge: "flash",
    flashEndsAt: Date.now() + 1000 * 60 * 155,
    claimedPct: 34,
    freeDelivery: true,
    stock: "in",
  },
];

const currency = (v) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(v);

function useCountdown(target) {
  const [remaining, setRemaining] = useState(() =>
    target ? Math.max(0, target - Date.now()) : 0
  );
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => {
      setRemaining(Math.max(0, target - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (!target) return null;
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return { h, m, s, done: remaining <= 0 };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            size={12}
            className={filled ? "fill-amber-400 text-amber-400" : "text-gray-300"}
          />
        );
      })}
    </div>
  );
}

function Badge({ discountPct, type }) {
  const styles = {
    flash: "bg-[#E8322A] text-white",
    new: "bg-[#1C1B1F] text-white",
    topRated: "bg-[#16A34A] text-white",
  };
  const labels = {
    flash: (
      <span className="flex items-center gap-0.5">
        <Zap size={11} className="fill-white" /> Flash sale
      </span>
    ),
    new: "New",
    topRated: "Top rated",
  };

  return (
    <div className="flex flex-col items-start gap-1">
      {discountPct > 0 && (
        <span className="rounded-sm bg-[#E8322A] px-1.5 py-0.5 text-[11px] font-bold text-white font-[Poppins,sans-serif]">
          -{discountPct}%
        </span>
      )}
      {type && (
        <span
          className={`rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide font-[Inter,sans-serif] ${styles[type]}`}
        >
          {labels[type]}
        </span>
      )}
    </div>
  );
}

function FlashTimer({ endsAt, claimedPct }) {
  const t = useCountdown(endsAt);
  if (!t || t.done) return null;
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#E8322A] font-[Inter,sans-serif]">
        <Clock size={12} />
        <span>
          {t.h > 0 ? `${pad(t.h)}:` : ""}
          {pad(t.m)}:{pad(t.s)} left
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#FCE4D9]">
        <div
          className="h-full rounded-full bg-[#FF7A1A]"
          style={{ width: `${claimedPct}%` }}
        />
      </div>
      <p className="text-[10px] text-[#6B6B76] font-[Inter,sans-serif]">
        {claimedPct}% claimed
      </p>
    </div>
  );
}

function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const discountPct = useMemo(() => {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  }, [product]);

  const outOfStock = product.stock === "out";

  return (
    <div
      className="group relative flex flex-col rounded-[12px] border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-300 ${
            hovered ? "scale-105" : "scale-100"
          } ${outOfStock ? "opacity-50 grayscale" : ""}`}
        />

        {/* Badges, top-left */}
        <div className="absolute left-2 top-2">
          <Badge discountPct={discountPct} type={product.badge} />
        </div>

        {/* Wishlist, top-right */}
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => setWishlisted((w) => !w)}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform active:scale-90"
        >
          <Heart
            size={15}
            className={
              wishlisted ? "fill-[#FF7A1A] text-[#FF7A1A]" : "text-gray-500"
            }
          />
        </button>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="rounded-sm bg-black/75 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white font-[Inter,sans-serif]">
              Out of stock
            </span>
          </div>
        )}

        {/* Quick add, slides up on hover */}
        {!outOfStock && (
          <button
            type="button"
            className={`absolute inset-x-2 bottom-2 flex items-center justify-center gap-1.5 rounded-[8px] bg-[#1C1B1F] py-2 text-[12px] font-semibold text-white transition-all duration-200 font-[Inter,sans-serif] ${
              hovered
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0 pointer-events-none"
            }`}
          >
            <ShoppingCart size={13} />
            Add to cart
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <p className="line-clamp-2 min-h-[32px] text-[12.5px] leading-tight text-[#1C1B1F] font-[Inter,sans-serif]">
          {product.name}
        </p>

        <div className="flex items-center gap-1">
          <Stars rating={product.rating} />
          <span className="text-[10.5px] text-[#6B6B76] font-[Inter,sans-serif]">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[15px] font-bold text-[#1C1B1F] font-[Poppins,sans-serif]">
            {currency(product.price)}
          </span>
          {discountPct > 0 && (
            <span className="text-[11px] text-[#9C9AA3] line-through font-[Inter,sans-serif]">
              {currency(product.originalPrice)}
            </span>
          )}
        </div>

        {product.badge === "flash" && !outOfStock && (
          <FlashTimer endsAt={product.flashEndsAt} claimedPct={product.claimedPct} />
        )}

        <div className="mt-auto flex items-center gap-2 pt-1.5">
          {product.freeDelivery && (
            <span className="flex items-center gap-0.5 text-[10.5px] font-medium text-[#16A34A] font-[Inter,sans-serif]">
              <Truck size={12} />
              Free delivery
            </span>
          )}
          {product.stock === "low" && !product.freeDelivery && (
            <span className="text-[10.5px] font-medium text-[#E8322A] font-[Inter,sans-serif]">
              Only a few left
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid() {
  return (
    <div className="min-h-screen w-full bg-[#F4F4F7] p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-sm bg-[#E8322A] px-2 py-1 text-[13px] font-bold text-white font-[Poppins,sans-serif]">
            <Zap size={14} className="fill-white" />
            Flash sales
          </span>
          <h2 className="text-[15px] font-semibold text-[#1C1B1F] font-[Poppins,sans-serif]">
            Deals ending soon
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
