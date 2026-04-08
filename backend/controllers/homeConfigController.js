const HomeConfig = require("../models/HomeConfig");

const defaultConfig = {
  sections: {
    showStats: true,
    showBudget: true,
    showLatest: true,
    showTopRated: true,
    showBrands: true,
    showPromo: true,
  },
  headings: {
    featured: "Top Deals For You",
    latest: "Latest Arrivals",
    topRated: "Top Rated Picks",
    budget: "Shop By Budget",
    brands: "Top Brands On ElectroHub",
  },
  statsCards: [
    { label: "Happy Shoppers", value: "50K+" },
    { label: "Orders Delivered", value: "120K+" },
    { label: "Partner Brands", value: "50+" },
    { label: "Daily Discounts", value: "200+" },
  ],
  budgetCards: [
    {
      title: "Under Rs. 10,000",
      subtitle: "Accessories and value picks",
      link: "/products?maxPrice=10000",
    },
    {
      title: "Rs. 10,001 - 30,000",
      subtitle: "Best value phones and tablets",
      link: "/products?minPrice=10001&maxPrice=30000",
    },
    {
      title: "Premium Range",
      subtitle: "Flagship and performance devices",
      link: "/products?minPrice=30001",
    },
  ],
  brands: {
    title: "Top Brands On ElectroHub",
    useAutoBrands: true,
    manualBrands: [],
  },
  promo: {
    eyebrow: "ElectroHub Plus",
    title: "Unlock Exclusive Early Access Deals",
    description:
      "Get priority offers, flash sale alerts and limited-time coupons delivered straight to your profile.",
    primaryText: "Join Free",
    primaryLink: "/register",
    secondaryText: "Continue Shopping",
    secondaryLink: "/products",
  },
};

const sanitizeText = (value, fallback = "") => {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
};

const sanitizeBoolean = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  if (value === undefined || value === null) return fallback;
  return Boolean(value);
};

const sanitizeArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value;
};

const normalizeConfig = (payload = {}) => {
  const sections = payload.sections || {};
  const headings = payload.headings || {};
  const brands = payload.brands || {};
  const promo = payload.promo || {};

  const statsCards = sanitizeArray(payload.statsCards).slice(0, 4).map((item, index) => ({
    label: sanitizeText(item?.label, defaultConfig.statsCards[index]?.label || `Stat ${index + 1}`),
    value: sanitizeText(item?.value, defaultConfig.statsCards[index]?.value || "0"),
  }));

  const budgetCards = sanitizeArray(payload.budgetCards).slice(0, 3).map((item, index) => ({
    title: sanitizeText(item?.title, defaultConfig.budgetCards[index]?.title || `Budget ${index + 1}`),
    subtitle: sanitizeText(item?.subtitle, defaultConfig.budgetCards[index]?.subtitle || ""),
    link: sanitizeText(item?.link, defaultConfig.budgetCards[index]?.link || "/products"),
  }));

  const manualBrands = sanitizeArray(brands.manualBrands)
    .map((name) => sanitizeText(name))
    .filter(Boolean)
    .slice(0, 20);

  return {
    sections: {
      showStats: sanitizeBoolean(sections.showStats, defaultConfig.sections.showStats),
      showBudget: sanitizeBoolean(sections.showBudget, defaultConfig.sections.showBudget),
      showLatest: sanitizeBoolean(sections.showLatest, defaultConfig.sections.showLatest),
      showTopRated: sanitizeBoolean(sections.showTopRated, defaultConfig.sections.showTopRated),
      showBrands: sanitizeBoolean(sections.showBrands, defaultConfig.sections.showBrands),
      showPromo: sanitizeBoolean(sections.showPromo, defaultConfig.sections.showPromo),
    },
    headings: {
      featured: sanitizeText(headings.featured, defaultConfig.headings.featured),
      latest: sanitizeText(headings.latest, defaultConfig.headings.latest),
      topRated: sanitizeText(headings.topRated, defaultConfig.headings.topRated),
      budget: sanitizeText(headings.budget, defaultConfig.headings.budget),
      brands: sanitizeText(headings.brands, defaultConfig.headings.brands),
    },
    statsCards: statsCards.length ? statsCards : defaultConfig.statsCards,
    budgetCards: budgetCards.length ? budgetCards : defaultConfig.budgetCards,
    brands: {
      title: sanitizeText(brands.title, defaultConfig.brands.title),
      useAutoBrands: sanitizeBoolean(brands.useAutoBrands, defaultConfig.brands.useAutoBrands),
      manualBrands,
    },
    promo: {
      eyebrow: sanitizeText(promo.eyebrow, defaultConfig.promo.eyebrow),
      title: sanitizeText(promo.title, defaultConfig.promo.title),
      description: sanitizeText(promo.description, defaultConfig.promo.description),
      primaryText: sanitizeText(promo.primaryText, defaultConfig.promo.primaryText),
      primaryLink: sanitizeText(promo.primaryLink, defaultConfig.promo.primaryLink),
      secondaryText: sanitizeText(promo.secondaryText, defaultConfig.promo.secondaryText),
      secondaryLink: sanitizeText(promo.secondaryLink, defaultConfig.promo.secondaryLink),
    },
  };
};

const mergeWithDefaults = (data = {}) => ({
  ...defaultConfig,
  ...data,
  sections: { ...defaultConfig.sections, ...(data.sections || {}) },
  headings: { ...defaultConfig.headings, ...(data.headings || {}) },
  brands: { ...defaultConfig.brands, ...(data.brands || {}) },
  promo: { ...defaultConfig.promo, ...(data.promo || {}) },
  statsCards: Array.isArray(data.statsCards) && data.statsCards.length ? data.statsCards : defaultConfig.statsCards,
  budgetCards: Array.isArray(data.budgetCards) && data.budgetCards.length ? data.budgetCards : defaultConfig.budgetCards,
});

const getOrCreateHomeConfig = async () => {
  const existing = await HomeConfig.findOne({ key: "home" }).lean();
  if (existing) return mergeWithDefaults(existing);

  const created = await HomeConfig.create({ key: "home", ...defaultConfig });
  return mergeWithDefaults(created.toObject());
};

exports.getHomeConfig = async (req, res) => {
  try {
    const config = await getOrCreateHomeConfig();

    res.status(200).json({
      success: true,
      config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateHomeConfig = async (req, res) => {
  try {
    const normalized = normalizeConfig(req.body || {});

    const updated = await HomeConfig.findOneAndUpdate(
      { key: "home" },
      {
        $set: {
          ...normalized,
          key: "home",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    res.status(200).json({
      success: true,
      message: "Home page settings updated successfully",
      config: mergeWithDefaults(updated),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
