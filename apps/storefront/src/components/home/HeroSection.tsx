import { getTranslations } from "next-intl/server";
import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { PRODUCT_CARD_FIELDS } from "@/lib/data/cached";
import { cachedListProducts } from "@/lib/data/products";
import { getAccessToken } from "@/lib/spree";
import { getStoreName } from "@/lib/store";

interface HeroSectionProps {
  basePath: string;
  locale: string;
  country: string;
}

export async function HeroSection({
  basePath,
  locale,
  country,
}: HeroSectionProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "home",
  });
  const storeName = getStoreName();
  const shopNow = t("shopNow");

  /**
   * Pull a handful of real products to feature one per slide. Falls back
   * gracefully (no product image, text-only slide) if the store has no
   * products yet or the fetch fails.
   */
  const userToken = await getAccessToken();
  let featured: Array<{ name: string; imageUrl: string; href: string }> = [];
  try {
    const { data } = await cachedListProducts(
      { limit: 3, fields: PRODUCT_CARD_FIELDS },
      { locale, country },
      userToken,
    );
    featured = (data ?? [])
      .filter((p) => Boolean(p.thumbnail_url))
      .map((p) => ({
        name: p.name,
        imageUrl: p.thumbnail_url as string,
        href: `${basePath}/products/${p.slug}`,
      }));
  } catch {
    featured = [];
  }

  /**
   * Rotating promo banners, Jumia/Beauty-Kenya style: text + CTA on the
   * left, a themed product photo on the right. Each slide pulls a
   * different product (cycling through what's available) so the visual
   * matches the slide's campaign.
   */
  const slideDefs = [
    {
      id: "big-sale",
      gradientClassName: "bg-gradient-to-br from-primary-600 to-primary-800",
      eyebrow: "Limited time",
      title: `Big Sale at ${storeName}`,
      subtitle:
        "Up to 40% off sneakers, formal shoes, and everyday wear — while stocks last.",
      ctaHref: `${basePath}/products?sale=true`,
    },
    {
      id: "new-arrivals",
      gradientClassName: "bg-gradient-to-br from-gray-900 to-gray-700",
      eyebrow: "Just dropped",
      title: "New Arrivals for Every Occasion",
      subtitle:
        "Trendy sneakers, elegant formal shoes, and reliable school shoes — freshly stocked.",
      ctaHref: `${basePath}/products`,
    },
    {
      id: "free-shipping",
      gradientClassName: "bg-gradient-to-br from-primary-700 to-gray-900",
      eyebrow: "Nationwide delivery",
      title: "Fast Delivery Across Kenya",
      subtitle:
        "Order today and get your shoes delivered straight to your doorstep.",
      ctaHref: `${basePath}/products`,
    },
  ];

  const slides: HeroSlide[] = slideDefs.map((def, index) => {
    const product =
      featured.length > 0 ? featured[index % featured.length] : undefined;
    return {
      ...def,
      ctaLabel: shopNow,
      product,
    };
  });

  return <HeroCarousel slides={slides} />;
}
