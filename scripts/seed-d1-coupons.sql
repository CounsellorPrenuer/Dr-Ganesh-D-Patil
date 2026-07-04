-- Example coupon seed for drganeshdpatil (run only when adding coupons)
-- cd worker && npx wrangler d1 execute mentoria-db --remote --file="../scripts/seed-d1-coupons.sql"

INSERT OR REPLACE INTO coupons (id, code, discount_type, value, discount_value, min_amount, max_discount, active, expires_at, project_id)
VALUES
  ('drganeshdpatil-deepa10', 'DEEPA10', 'percent', 10, 10, 0, NULL, 1, NULL, 'drganeshdpatil'),
  ('drganeshdpatil-deepa500', 'DEEPA500', 'fixed', 500, 500, 1000, NULL, 1, NULL, 'drganeshdpatil');
