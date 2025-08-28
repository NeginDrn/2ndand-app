// Step 1 — Basic Info
export const basicListingFieldLabels = {
  brand: "Brand",
  applianceType: "Appliance Type",
  partType: "Part Type",
  shortDescription: "Short Description",
} as const;

// Step 2 — Additional Details
export const additionalListingFieldLabels = {
  condition: "Condition",
  price: "Price",
  location: "Location",
  description: "Description",
} as const;

// Centralised select options (keys must match field names above)
export const listingSelectOptions = {
  applianceType: [
    "Washing Machine",
    "Fridge",
    "Dishwasher",
    "Dryer",
    "Oven",
    "Microwave",
    "Toaster",
  ],
  brand: ["Bosch", "Samsung", "LG", "Whirlpool", "Electrolux", "Beko"],
  partType: [
    "Motor",
    "Door",
    "Drum",
    "Filter",
    "Shelf",
    "Control Panel",
    "Tray",
  ],
  condition: ["New", "Used - Like New", "Used - Good", "Used - Acceptable"],
} as const;

// ——— Types ———
export type BasicListingField = keyof typeof basicListingFieldLabels;
export type AdditionalListingField = keyof typeof additionalListingFieldLabels;
export type ListingFieldKey = BasicListingField | AdditionalListingField;
export type ListingSelectField = keyof typeof listingSelectOptions;
