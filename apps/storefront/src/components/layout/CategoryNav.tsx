import type { Category } from "@spree/sdk";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface CategoryNavProps {
  rootCategories: Category[];
  basePath: string;
  locale: Locale;
}

/**
 * Persistent desktop category bar with hover mega-menus, in the style of
 * dense African marketplace storefronts (Jumia, Beauty Kenya, etc).
 * Hidden on mobile/tablet — MobileMenu already covers categories there.
 */
export async function CategoryNav({
  rootCategories,
  basePath,
  locale,
}: CategoryNavProps) {
  const t = await getTranslations({ locale, namespace: "header" });

  if (rootCategories.length === 0) return null;

  return (
    <nav
      aria-label="Category navigation"
      className="hidden lg:block bg-primary-600 text-white relative z-40"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-stretch text-sm font-medium">
          {/* "All categories" trigger — visually anchors the bar like Jumia's
              "Shop by Category" burger */}
          <li className="group relative">
            <button
              type="button"
              className="flex items-center gap-2 h-11 px-4 bg-primary-700 hover:bg-primary-800 transition-colors cursor-pointer"
            >
              <Menu className="size-4" />
              <span>{t("allCategories")}</span>
            </button>

            {/* Mega panel: all root categories as a simple list, opens on hover/focus */}
            <div
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-150 absolute left-0 top-full w-72 bg-white text-gray-800 shadow-xl border border-gray-100 rounded-b-md py-2"
            >
              {rootCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`${basePath}/c/${category.permalink}`}
                  className="block px-4 py-2 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </li>

          {/* Top-level category items with their own mega-menus */}
          {rootCategories.slice(0, 8).map((category) => {
            const hasChildren =
              category.children && category.children.length > 0;

            return (
              <li key={category.id} className="group relative">
                <Link
                  href={`${basePath}/c/${category.permalink}`}
                  className="flex items-center gap-1 h-11 px-4 hover:bg-primary-700 transition-colors"
                >
                  <span>{category.name}</span>
                  {hasChildren && (
                    <ChevronDown className="size-3.5 opacity-75" />
                  )}
                </Link>

                {hasChildren && (
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-150 absolute left-0 top-full min-w-[600px] max-w-3xl bg-white text-gray-800 shadow-xl border border-gray-100 rounded-b-md p-6 grid grid-cols-3 gap-x-6 gap-y-4">
                    {category.children?.map((child) => (
                      <div key={child.id}>
                        <Link
                          href={`${basePath}/c/${child.permalink}`}
                          className="font-semibold text-gray-900 hover:text-primary-700 transition-colors"
                        >
                          {child.name}
                        </Link>
                        {child.children && child.children.length > 0 && (
                          <ul className="mt-2 space-y-1.5">
                            {child.children.map((grandchild) => (
                              <li key={grandchild.id}>
                                <Link
                                  href={`${basePath}/c/${grandchild.permalink}`}
                                  className="text-sm text-gray-600 hover:text-primary-700 transition-colors"
                                >
                                  {grandchild.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}

          {/* Static promo-style links, Jumia-esque */}
          <li className="ml-auto flex items-center">
            <Link
              href={`${basePath}/products?sale=true`}
              className="flex items-center h-11 px-4 font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              {t("saleProducts")}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
