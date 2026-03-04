import { useTranslation } from "react-i18next";
import Icon from "../components/common/Icon";

// affiliate: "az" = Amazon Associates UK
const PRODUCTS = [
  {
    id: "scale",
    slug: "scale",
    tier: "starter",
    icon: "scale",
    badge: null,
    priceRange: "£12–20",
    affiliate: "az",
  },
  {
    id: "banneton",
    slug: "banneton",
    tier: "starter",
    icon: "banneton",
    badge: null,
    priceRange: "£15–30",
    affiliate: "az",
  },
  {
    id: "lame",
    slug: "lame",
    tier: "starter",
    icon: "lame",
    badge: null,
    priceRange: "£8–15",
    affiliate: "az",
  },
  {
    id: "dutch-oven",
    slug: "dutch-oven",
    tier: "starter",
    icon: "dutch-oven",
    badge: "shopBadgePop",
    priceRange: "£30–50",
    affiliate: "az",
  },
  {
    id: "fwsy-book",
    slug: "fwsy-book",
    tier: "starter",
    icon: "book",
    badge: "shopBadgePop",
    priceRange: "£18–25",
    affiliate: "az",
  },
  {
    id: "thermapen",
    slug: "thermapen",
    tier: "upgrade",
    icon: "thermometer",
    badge: "shopBadgeBest",
    priceRange: "£90",
    affiliate: "az",
  },
  {
    id: "breville",
    slug: "breville",
    tier: "upgrade",
    icon: "oven",
    badge: null,
    priceRange: "£230",
    affiliate: "az",
  },
  {
    id: "kitchenaid",
    slug: "kitchenaid",
    tier: "upgrade",
    icon: "mixer",
    badge: null,
    priceRange: "£300–400",
    affiliate: "az",
  },
  {
    id: "le-creuset",
    slug: "le-creuset",
    tier: "upgrade",
    icon: "dutch-oven",
    badge: "shopBadgePrem",
    priceRange: "£280–350",
    affiliate: "az",
  },
  {
    id: "bread-slicer",
    slug: "bread-slicer",
    tier: "artisan",
    icon: "bread-slicer",
    badge: "shopBadgeHeirloom",
    priceRange: "£100–130",
    affiliate: "az",
  },
  {
    id: "proofer",
    slug: "proofer",
    tier: "artisan",
    icon: "proofer",
    badge: "shopBadgePro",
    priceRange: "£170–200",
    affiliate: "az",
  },
  {
    id: "dough-whisk",
    slug: "dough-whisk",
    tier: "artisan",
    icon: "dough-whisk",
    badge: null,
    priceRange: "£8–12",
    affiliate: "az",
  },
  {
    id: "oval-banneton",
    slug: "oval-banneton",
    tier: "artisan",
    icon: "oval-banneton",
    badge: null,
    priceRange: "£15–20",
    affiliate: "az",
  },
];

const PRODUCT_ICONS = {
  scale: (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="8" y="28" width="32" height="12" rx="3" />
      <path d="M16 28 L18 14 Q24 10 30 14 L32 28" />
      <circle cx="24" cy="22" r="3" />
      <line x1="24" y1="22" x2="24" y2="18" />
    </svg>
  ),
  banneton: (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 32 Q10 22 24 22 Q38 22 38 32 L36 38 Q36 40 34 40 L14 40 Q12 40 12 38 Z" />
      <line x1="14" y1="27" x2="14" y2="39" />
      <line x1="19" y1="24" x2="19" y2="39" />
      <line x1="24" y1="23" x2="24" y2="39" />
      <line x1="29" y1="24" x2="29" y2="39" />
      <line x1="34" y1="27" x2="34" y2="39" />
    </svg>
  ),
  lame: (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 40 L36 12" strokeLinecap="round" />
      <path d="M36 12 Q44 8 42 18 Q40 26 32 24 Q28 20 36 12Z" fill="currentColor" opacity="0.2" />
      <circle cx="10" cy="38" r="3" fill="currentColor" />
    </svg>
  ),
  "dutch-oven": (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 22 Q8 40 24 40 Q40 40 40 22 Z" />
      <ellipse cx="24" cy="22" rx="16" ry="6" />
      <ellipse cx="24" cy="15" rx="16" ry="6" />
      <circle cx="24" cy="12" r="2" fill="currentColor" />
      <path d="M6 24 L4 24 M42 24 L44 24" strokeLinecap="round" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="8" y="8" width="32" height="36" rx="3" />
      <path d="M16 8 L16 44" />
      <path d="M20 16 L32 16 M20 22 L32 22 M20 28 L30 28" />
    </svg>
  ),
  thermometer: (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="24" cy="36" r="6" />
      <rect x="21" y="10" width="6" height="24" rx="3" />
      <line x1="24" y1="34" x2="24" y2="22" stroke="currentColor" strokeWidth="3" />
      <line x1="28" y1="16" x2="32" y2="16" />
      <line x1="28" y1="20" x2="30" y2="20" />
      <line x1="28" y1="24" x2="32" y2="24" />
    </svg>
  ),
  mixer: (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M24 8 L24 28" />
      <circle cx="24" cy="8" r="4" />
      <path d="M18 28 Q14 32 14 38 L34 38 Q34 32 30 28 Z" />
      <path d="M28 16 Q36 12 38 20" strokeLinecap="round" />
      <path d="M38 20 L40 22" strokeLinecap="round" />
    </svg>
  ),
  oven: (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="10" width="36" height="32" rx="4" />
      <rect x="10" y="18" width="28" height="18" rx="2" />
      <circle cx="16" cy="14" r="2" />
      <circle cx="24" cy="14" r="2" />
      <circle cx="32" cy="14" r="2" />
      <line x1="14" y1="27" x2="34" y2="27" strokeDasharray="3,3" />
    </svg>
  ),
  "bread-slicer": (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="24" width="36" height="18" rx="3" />
      <path d="M12 24 L12 14 Q12 10 16 10 L32 10 Q36 10 36 14 L36 24" />
      <circle cx="36" cy="18" r="4" />
      <line x1="36" y1="14" x2="36" y2="18" />
      <line x1="18" y1="10" x2="18" y2="42" strokeDasharray="2,2" opacity="0.5" />
    </svg>
  ),
  proofer: (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="12" width="36" height="28" rx="4" />
      <rect x="10" y="16" width="28" height="20" rx="2" />
      <circle cx="24" cy="26" r="6" strokeDasharray="3,2" />
      <path d="M22 24 L24 28 L26 24" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="36" y1="8" x2="36" y2="12" />
    </svg>
  ),
  "dough-whisk": (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="24" y1="6" x2="24" y2="20" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 20 Q14 28 16 36 Q18 42 24 42 Q30 42 32 36 Q34 28 30 20" />
      <path d="M20 24 Q22 30 24 24 Q26 30 28 24" />
    </svg>
  ),
  "oval-banneton": (
    <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="24" cy="30" rx="18" ry="10" />
      <ellipse cx="24" cy="28" rx="14" ry="7" />
      <line x1="12" y1="28" x2="12" y2="34" />
      <line x1="18" y1="24" x2="18" y2="36" />
      <line x1="24" y1="22" x2="24" y2="38" />
      <line x1="30" y1="24" x2="30" y2="36" />
      <line x1="36" y1="28" x2="36" y2="34" />
    </svg>
  ),
};

const BOOKS = [
  {
    id: "tudor",
    gumroadUrl: "https://fermenter26.gumroad.com/l/tudor-si-maia",
    badgeKey: "shopBadgeNew",
    badgeClass: "",
    coverSrc: "/assets/book-tudor-cover.webp",
    coverFallback: "/assets/book-tudor-cover.jpg",
    coverAlt: "Tudor și Maia — Povestea Borcanului Viu cover",
    roOnly: true,
  },
  {
    id: "handbook",
    gumroadUrl: "https://fermenter26.gumroad.com/l/handbook",
    badgeKey: "shopBadgeBestseller",
    badgeClass: "shop-book__badge--bestseller",
    coverSrc: null,
    coverAlt: "The Complete Sourdough Handbook cover",
  },
  {
    id: "milo",
    gumroadUrl: "https://fermenter26.gumroad.com/l/milo-and-maia",
    badgeKey: "shopBadgeNew",
    badgeClass: "",
    coverSrc: "/assets/book-milo-cover.webp",
    coverFallback: "/assets/book-milo-cover.jpg",
    coverAlt: "Milo & Maia — A Sourdough Adventure for Kids cover",
  },
];

const CTA_KEY = {
  az: "shopViewAmazon",
};

function ProductCard({ product }) {
  const { t } = useTranslation();

  const icon = PRODUCT_ICONS[product.icon] || PRODUCT_ICONS.book;
  const ctaKey = CTA_KEY[product.affiliate] || "shopViewAmazon";
  const priceDisplay = product.priceRange.startsWith("shop")
    ? t(product.priceRange)
    : product.priceRange;

  return (
    <div className="shop-card">
      {product.badge && (
        <div className="shop-card__badge">{t(product.badge)}</div>
      )}
      <div className="shop-card__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="shop-card__name">{t(`shopProd_${product.id}_name`)}</div>
      <div className="shop-card__desc">{t(`shopProd_${product.id}_desc`)}</div>
      <div className="shop-card__price">{priceDisplay}</div>
      <a
        href={`/go/${product.slug}`}
        target="_blank"
        rel="noopener sponsored"
        className="shop-card__btn"
        aria-label={`${t(ctaKey)} — ${t(`shopProd_${product.id}_name`)}`}
      >
        {t(ctaKey)}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ marginLeft: "6px" }}>
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  );
}

function BookCard({ book }) {
  const { t, i18n } = useTranslation();
  const isRomanian = i18n.language === "ro";

  if (book.roOnly && !isRomanian) return null;

  return (
    <div className="shop-book">
      {book.badgeKey && (
        <div className={`shop-book__badge ${book.badgeClass || ""}`}>
          {t(book.badgeKey)}
        </div>
      )}

      {book.coverSrc ? (
        <picture>
          <source srcSet={book.coverSrc} type="image/webp" />
          {book.coverFallback && (
            <source srcSet={book.coverFallback} type="image/jpeg" />
          )}
          <img
            className="shop-book__cover"
            src={book.coverFallback || book.coverSrc}
            alt={book.coverAlt}
            loading="lazy"
            width="600"
            height="803"
          />
        </picture>
      ) : (
        <div className="shop-book__cover-placeholder">
          <Icon name="book" size={48} />
          <span>{t(`shopBook_${book.id}_name`)}</span>
        </div>
      )}

      <div className="shop-book__body">
        <div className="shop-book__name">{t(`shopBook_${book.id}_name`)}</div>
        <div className="shop-book__tagline">
          {t(`shopBook_${book.id}_tagline`)}
        </div>
        <div className="shop-book__desc">{t(`shopBook_${book.id}_desc`)}</div>

        <div className="shop-book__chips">
          {[1, 2, 3].map((n) => (
            <span key={n} className="shop-book__chip">
              {t(`shopBook_${book.id}_chip${n}`)}
            </span>
          ))}
        </div>

        <div className="shop-book__footer">
          <div className="shop-book__price">
            {t(`shopBook_${book.id}_price`)}
          </div>
          <a
            href={book.gumroadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shop-book__cta"
            aria-label={`${t(`shopBook_${book.id}_cta`)} — ${t(`shopBook_${book.id}_name`)}`}
          >
            {t(`shopBook_${book.id}_cta`)}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function ShopPage() {
  const { t } = useTranslation();

  const starterKit = PRODUCTS.filter((p) => p.tier === "starter");
  const upgradeKit = PRODUCTS.filter((p) => p.tier === "upgrade");
  const artisanKit = PRODUCTS.filter((p) => p.tier === "artisan");

  return (
    <div className="section shop-page">
      {/* Our Books — premium section */}
      <div className="shop-books">
        <div className="shop-books__header">
          <h2 className="shop-books__heading">
            <Icon name="heart" size={20} style={{ color: "var(--accent)" }} />
            {t("shopBooksHeading")}
          </h2>
          <p className="shop-books__subheading">{t("shopBooksSubheading")}</p>
        </div>
        <div className="shop-books__grid">
          {BOOKS.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <p className="shop-books__brand-line">{t("shopBooksBrandLine")}</p>
      </div>

      <div className="shop-header">
        <h2 className="section-title">{t("shopTitle")}</h2>
        <p className="shop-subtitle">{t("shopSubtitle")}</p>
      </div>

      <div className="shop-tier">
        <div className="shop-tier__label">{t("shopTier1")}</div>
        <div className="shop-grid">
          {starterKit.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <div className="shop-tier">
        <div className="shop-tier__label">{t("shopTier2")}</div>
        <div className="shop-grid">
          {upgradeKit.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <div className="shop-tier">
        <div className="shop-tier__label">{t("shopTier3")}</div>
        <div className="shop-grid">
          {artisanKit.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <p className="shop-disclaimer">{t("shopDisclaimer")}</p>
    </div>
  );
}

export default ShopPage;
