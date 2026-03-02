/**
 * Launch Offer Configuration
 *
 * Update `taken` when customers sign up.
 * All components using this config will update automatically.
 */
export const launchOffer = {
  total: 10,
  taken: 7, // Update this when customers sign up
};

export const remainingSlots = launchOffer.total - launchOffer.taken;
