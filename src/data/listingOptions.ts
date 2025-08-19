export const listingFieldLabels = {
  brand: "Brand",
  appliance_type: "Appliance Type",
  part_type: "Part Type",
  short_description: "Short Description",
  condition: "Condition",
  price: "Price",
  location: "Location",
  description: "Description",
};

export const listingSelectOptions = {
  brand: ["Bosch", "Samsung", "LG", "Whirlpool", "Electrolux", "Beko"],
  appliance_type: [
    "Washing Machine",
    "Fridge",
    "Toaster",
    "Oven",
    "Dryer",
    "Dishwasher",
  ],
  part_type: ["Drum", "Door", "Tray", "Motor", "Filter", "Control Panel"],
  condition: ["New", "Used"],
};

export const listingAdditionalFieldLabels = {
  condition: "Condition",
  price: "Price",
  location: "Location",
  description: "Description",
};

export const listingConditionOptions = [
  "New",
  "Used - Like New",
  "Used - Good",
  "Used - Acceptable",
];

export type ListingSelectField = keyof typeof listingSelectOptions;
