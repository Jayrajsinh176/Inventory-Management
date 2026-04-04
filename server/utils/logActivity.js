import Activity from "../models/activity.model.js";

/**
 * Log user activity - fail silently to never break main flow
 *
 * @param {Object} options - Activity logging options
 * @param {string} options.userId - User ID performing the action
 * @param {string} options.companyId - Company ID for multi-tenant isolation
 * @param {string} options.action - Activity action type (enum)
 * @param {string} [options.details] - Descriptive details about the activity
 * @param {Object} [options.metadata] - Additional metadata (e.g., productId, oldValues, newValues)
 *
 * @returns {Promise<void>}
 *
 * @example
 * logActivity({
 *   userId: req.user._id,
 *   companyId: req.user.company,
 *   action: "created_product",
 *   details: `Created product: "${productName}"`,
 *   metadata: { productId: product._id, sku: product.sku }
 * });
 */
export const logActivity = async ({
  userId,
  companyId,
  action,
  details = "",
  metadata = {},
}) => {
  try {
    // Validate required fields
    if (!userId || !companyId || !action) {
      console.error("[Activity Log] Missing required fields:", {
        userId,
        companyId,
        action,
      });
      return;
    }

    await Activity.create({
      user: userId,
      company: companyId,
      action,
      details,
      metadata,
    });
  } catch (error) {
    // Fail silently - never break main application flow
    console.error("[Activity Log Error]", {
      action,
      userId,
      companyId,
      error: error.message,
    });
  }
};
