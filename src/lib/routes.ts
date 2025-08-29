// src/lib/routes.ts
export const ROUTES = {
  home: "/",

  auth: {
    register: "/register",
    login: "/login",
  },

  listings: {
    index: "/listings",
    //     details: (id: string) => `/listings/${id}`,
    //     search: "/search",
  },

  createListing: {
    basicInfo: "/create-listing/basic-info",
    additionalDetails: "/create-listing/additional-details",
    confirmation: "/create-listing/listing-confirmation",
  },
} as const;
