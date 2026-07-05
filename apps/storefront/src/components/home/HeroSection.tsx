import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { getStoreName } from "@/lib/store";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

export async function HeroSection({ basePath, locale }: HeroSectionProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "home",
  });
  const storeName = getStoreName();

  /* Demo-only: Remove for production. */
  const githubUrl = "https://github.com/spree/storefront";
  const quickstartUrl =
    "http://wa.me/qr/F7XBUE3WKBT2J1";

  return (
    <section className="border-b border-gray-200 min-h-[823px] md:min-h-0 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            {t("welcome", { storeName })}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            At Africa shoes Art, we believe every step matters. That's why we offer high-quality shoes that 
            combine style, comfort, and durability for every occasion. Whether you're looking for trendy sneakers,
             elegant formal shoes, reliable school shoes, or everyday casual wear, we have the perfect pair for you.
            team
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button size="lg" asChild>
              <Link href={`${basePath}/products`}>{t("shopNow")}</Link>
            </Button>
            {/* Demo-only: Remove for production. */}
            <Button variant="outline" size="lg" asChild>
              <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
               Twitter
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link
                href={quickstartUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
