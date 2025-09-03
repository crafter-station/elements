# Polar.sh Setup Guide for Elements Sponsorship

## Overview
This guide helps you set up real Polar.sh integration for the Elements sponsorship page using the actual Polar dashboard.

## 1. Create Polar Account
1. Go to [polar.sh](https://polar.sh) and create an account
2. Create an organization for "Elements" or "Crafter Station"
3. Set up your payout account in **Settings > Finance**

## 2. Create Products
Go to **Products > Create Product** and create these 4 products:

### Tip Jar ($3+ one-time)
**Product Information:**
- **Name**: `Tip Jar`
- **Description**:
  ```markdown
  One-time thank you donation for Elements.

  **What you get:**
  - Good karma
  - My eternal gratitude
  - Warm fuzzy feeling
  ```

**Pricing:**
- ✅ **One-time purchase** (not subscription)
- **Price**: $3 (minimum)
- ✅ Enable "Pay what you want"

**Automated Benefits:** None

### Supporter Tier ($15/month)
**Product Information:**
- **Name**: `Elements Supporter`
- **Description**:
  ```markdown
  Monthly support for Elements development.

  **What you get:**
  - Name in credits
  - Progress updates
  - Feel good vibes
  ```

**Pricing:**
- ✅ **Subscription**
- **Billing Cycle**: Monthly
- **Price**: $15/month (minimum)
- ✅ Enable "Pay what you want"

**Automated Benefits:**
- Add **Custom** benefit: "Name in project credits"

### Sponsor Tier ($75/month)
**Product Information:**
- **Name**: `Elements Sponsor`
- **Description**:
  ```markdown
  Serious support for Elements development.

  **What you get:**
  - Logo on sponsor wall
  - Priority feature requests
  - Direct feedback line
  ```

**Pricing:**
- ✅ **Subscription**
- **Billing Cycle**: Monthly
- **Price**: $75/month (minimum)
- ✅ Enable "Pay what you want"

**Automated Benefits:**
- Add **Custom** benefit: "Logo on sponsor wall"
- Add **Custom** benefit: "Priority feature requests"

### Backer Tier ($300+/month)
**Product Information:**
- **Name**: `Elements Backer`
- **Description**:
  ```markdown
  Break my piggy bank and make me work full-time on open source!

  **What you get:**
  - Everything above
  - Custom component requests
  - Monthly video calls
  - I'll probably cry (happy tears)
  ```

**Pricing:**
- ✅ **Subscription**
- **Billing Cycle**: Monthly
- **Price**: $300/month (minimum)
- ✅ Enable "Pay what you want"

**Automated Benefits:**
- Add **Custom** benefit: "Custom component development"
- Add **Custom** benefit: "Monthly 1:1 video calls"

## 3. Get Product IDs
After creating each product, copy the **Product ID** from the product page. You'll need these IDs for the integration.

## 4. Create Checkout Links
For each product:
1. Go to **Checkout Links**
2. Click **Create Checkout Link**
3. Select the product
4. Configure settings:
   - **Success URL**: `https://yourdomain.com/sponsor/success`
   - ✅ **Allow discount codes** (optional)
5. Save and copy the checkout link URL

## 5. Get API Credentials
1. Go to **Settings > API**
2. Create a new API key with these scopes:
   - `checkout_links:write`
   - `checkouts:write`
   - `products:read`
   - `orders:read`
3. Copy your access token

## 6. Update Environment Variables
Update your `.env` file with:

```env
# Replace with your actual Polar access token
POLAR_ACCESS_TOKEN=polar_at_xxxxxxxxxxxx
POLAR_SUCCESS_URL=https://yourdomain.com/success?checkout_id={CHECKOUT_ID}
POLAR_BASE_URL=https://api.polar.sh
```

## 7. Update Product IDs
In `/lib/polar.ts`, update the `POLAR_PRODUCT_IDS` object with your actual product IDs from Polar dashboard:

```typescript
const POLAR_PRODUCT_IDS = {
  "Tip Jar": "prod_xxxxxxxx", // Copy from Polar dashboard
  Supporter: "prod_xxxxxxxx",
  Sponsor: "prod_xxxxxxxx",
  Backer: "prod_xxxxxxxx",
};
```

## 8. Set Up Benefits (Optional)
To automate benefit delivery:
1. Go to **Benefits**
2. Create benefits for each tier:
   - **Custom** benefits for manual fulfillment
   - **Discord Invite** if you have a Discord
   - **GitHub Repository Access** for private repos
   - **File Downloads** for exclusive content

## 9. Configure Customer Fields (Optional)
To collect additional info during checkout:
1. Go to **Checkout Fields > Manage Custom Fields**
2. Create fields like:
   - Company name (for sponsors)
   - GitHub username
   - Discord username
   - Usage description

## 10. Test Integration
1. Run your development server: `npm run dev`
2. Go to `/sponsor`
3. Select a tier and click "Sponsor"
4. Should redirect to Polar checkout
5. Complete test purchase with Stripe test cards

## 11. Production Deployment
1. Update success URLs in Polar checkout links
2. Switch to live Stripe keys in Polar dashboard
3. Test with real payment methods

## Troubleshooting
- Check browser console for API errors
- Verify your Polar access token has correct scopes
- Make sure product IDs match exactly
- Check Polar dashboard for failed requests

## Resources
- [Polar API Docs](https://docs.polar.sh/api-reference/introduction)
- [Checkout Links Guide](https://docs.polar.sh/features/checkout/links)
- [Next.js Integration](https://docs.polar.sh/guides/nextjs)