/**
 * Default insurance logos matching the current public site.
 * Paths point to frontend /public assets so existing logos keep working.
 */
export const DEFAULT_INSURANCE_LOGOS = [
  { name: "Aetna", imageUrl: "/aetna-logo.webp", displayOrder: 0 },
  { name: "BlueCross BlueShield", imageUrl: "/bcbs-logo.webp", displayOrder: 1 },
  { name: "Cigna", imageUrl: "/cigna-logo.webp", displayOrder: 2 },
  { name: "Optum", imageUrl: "/optum-logo.webp", displayOrder: 3 },
  { name: "MedCost", imageUrl: "/medcost-logo.webp", displayOrder: 4 },
  { name: "Tricare", imageUrl: "/tricare-logo.webp", displayOrder: 5 },
  { name: "UnitedHealthcare", imageUrl: "/uhc-logo.webp", displayOrder: 6 },
  {
    name: "Alliance Health",
    imageUrl: "/alliance-health-logo.webp",
    displayOrder: 7,
  },
  {
    name: "Healthy Blue",
    imageUrl: "/healthy-blue-logo.webp",
    displayOrder: 8,
  },
  {
    name: "Partners Direct",
    imageUrl: "/partners-direct-logo.webp",
    displayOrder: 9,
  },
  {
    name: "NC Medicaid",
    imageUrl: "/nc-medicaid-logo.webp",
    displayOrder: 10,
  },
  { name: "Medicare", imageUrl: "/medicare-logo.webp", displayOrder: 11 },
].map((item) => ({ ...item, isActive: true }));
