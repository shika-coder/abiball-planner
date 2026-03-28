# Venue Price Verification Guide

A step-by-step guide for verifying and updating venue prices.

## Quick Reference: Current Prices

| Venue | Price | Contact | Website |
|-------|-------|---------|---------|
| CCH – Congress Center | €129 | info@cch.de, +49 40 3569 0 | https://www.cch.de/ |
| Cruise Center Altona | €119 | info@nordevent.de, +49 40 2000 640 | https://www.nordevent.de/en/eventlocations/cruise-center-altona/ |
| Fischauktionshalle | €84 | info@fischauktionshalle.com, +49 40 3005 1311 | https://www.fischauktionshalle.com/eventlocation/ |
| Schuppen 52 | €92 | info@gerresheim-serviert.de, +49 40 600 170 | https://www.gerresheim-serviert.de/en/locations/schuppen-52/ |
| Stage Theater im Hafen | €123 | business.customers@stage-entertainment.com, +49 40 31186 101 | https://www.theaterimhafen.de/theatervermietung/stage-theater-im-hafen-hamburg |
| Edelfettwerk | €88 | mail@edelfettwerk.de, +49 40 8510 7830 | https://edelfettwerk.de/ |

## How to Verify Prices

### Option 1: Check Website (Easiest)
1. Visit venue's booking website (see "Website" column above)
2. Look for event pricing/packages
3. Note the per-person price
4. If price matches: Mark as verified (use CLI or API)
5. If price differs: Update and record reason

### Option 2: Phone Contact
1. Call venue contact number
2. Ask: "What is your current price per person for a graduation ball?"
3. Specify party size: ~400-500 guests
4. Note any seasonal variations
5. Update or verify in system

### Option 3: Email Request
1. Send email to contact address with template below:

---

**Subject:** Price Verification for Abiball Event - [Date]

Dear [Venue Name],

We're working on our venue booking platform and need to confirm your current pricing for graduation ball events (Abibälle) for groups of 400-500 guests.

Could you please confirm:
- **Current price per person for large graduation events?**
- **Any package options available?**
- **Seasonal price variations?**
- **Catering included or separate?**

Current price in our system: **€[PRICE]**

Thank you!

---

## Updating Prices

### If Price Hasn't Changed:
Mark as verified (no change to price):
```bash
curl -X PUT http://localhost:3000/api/admin/prices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "locationId": "venue-id",
    "verifiedBy": "your-email@example.com"
  }'
```

### If Price Has Changed:
Update with new price:
```bash
curl -X POST http://localhost:3000/api/admin/prices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "locationId": "venue-id",
    "newPrice": 135,
    "reason": "website verified - 2024 price increase",
    "verifiedBy": "your-email@example.com"
  }'
```

### Reason Examples:
- "website verified"
- "phone contact - confirmed"
- "venue email quote received"
- "market adjustment - competitor research"
- "catering adjustment"

## Verification Schedule

### Recommended Frequency:
- **Monthly**: Check 1-2 venues per week
- **Quarterly**: Full verification of all 6 venues
- **Ad-hoc**: After major venue changes or seasonal shifts

### Flag for Immediate Checking:
- Venue website shows major event
- Competitor venue raised prices significantly
- Venue sends promotional email
- New booking trends show budget concerns

## Bulk Verification Script

To mark all venues as verified today (initial setup):
```bash
# Create a timestamp file for reference
date > last_verified.txt

# Then update via API
curl -X PUT http://localhost:3000/api/admin/prices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"locationId":"cch-congress-center-hamburg","verifiedBy":"admin@example.com"}'
# ... repeat for each venue
```

Or use the CSV update method:
```bash
node scripts/update-prices.mjs \
  --file scripts/prices.csv \
  --verified-by admin@example.com
```

## Troubleshooting

### Venue Website Doesn't Show Pricing
- This is common - venues often require quote requests
- Contact venue directly by phone or email
- Use estimated competitive pricing as fallback
- Document the reason for any estimate

### Price Varies by Season
- Record the high season price (summer months)
- Add note about seasonal variation in reason field
- Consider separate pricing tiers if variation is large

### Can't Reach Venue
- Try alternate contact method
- Leave message with contact request
- Set reminder to check again next week
- Don't update price - keep existing until verified

### Price Discrepancy (Ours vs Website)
- If website price is higher: Update to website price
- If website price is lower: Verify with venue (may be special offer)
- Document finding in price history

## Price Change Notification

When a significant price change occurs (>5% change):
1. Update the price in system
2. Document in reason field: "X% increase from venue"
3. Consider notifying platform team
4. Monitor user feedback on budget impact

## Archival & Compliance

All price changes are automatically logged with:
- Old and new price
- Date of change
- Admin email
- Change reason

This creates an audit trail for:
- User disputes about pricing
- Market analysis
- Budget tracking
- Compliance records

## Monthly Report Template

Use this to track verification progress:

```
Month: [Month/Year]
Verification Date: [Date]
Verified By: [Email]

Status:
□ CCH Congress Center - €129 (Last verified: __)
□ Cruise Center Altona - €119 (Last verified: __)
□ Fischauktionshalle - €84 (Last verified: __)
□ Schuppen 52 - €92 (Last verified: __)
□ Stage Theater im Hafen - €123 (Last verified: __)
□ Edelfettwerk - €88 (Last verified: __)

Changes Made:
- [Venue]: €[Old] → €[New] (Reason: [Reason])

Notes:
[Any other observations or follow-ups needed]
```
