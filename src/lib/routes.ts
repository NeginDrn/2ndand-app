// src/lib/routes.ts
export const ROUTES = {
  home: "/",
  search: "/search",
  listings: {
    index: "/listings",
  },
  createListing: {
    basicInfo: "/create-listing/basic-info",
    additionalDetails: "/create-listing/additional-details",
    confirmation: "/create-listing/listing-confirmation",
  },
  auth: {
    register: "/register",
    login: "/login",
    resetPassword: "/reset-password",
  },
  account: {
    myListings: "/my-listings",
  },
} as const;
