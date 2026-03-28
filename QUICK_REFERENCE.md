# Price Tracking System - Quick Reference

## Check for Stale Prices
```bash
# API
curl http://localhost:3000/api/admin/prices?action=stale -H "Authorization: Bearer TOKEN"

# Database
sqlite3 prisma/dev.db "SELECT name, pricePerPerson, lastVerified FROM Location WHERE lastVerified IS NULL OR (julianday('now') - julianday(lastVerified)) > 60;"
```

## Update a Venue Price
```bash
# Via API
curl -X POST http://localhost:3000/api/admin/prices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "locationId": "fischauktionshalle-hamburg",
    "newPrice": 86,
    "reason": "website verified",
    "verifiedBy": "admin@example.com"
  }'

# Via CLI
node scripts/update-prices.mjs \
  --location fischauktionshalle-hamburg \
  --price 86 \
  --reason "website verified" \
  --verified-by admin@example.com
```

## Verify Without Changing Price
```bash
# API
curl -X PUT http://localhost:3000/api/admin/prices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "locationId": "fischauktionshalle-hamburg",
    "verifiedBy": "admin@example.com"
  }'
```

## View Price History
```bash
# API
curl "http://localhost:3000/api/admin/prices?action=history&locationId=fischauktionshalle-hamburg" \
  -H "Authorization: Bearer TOKEN"

# Database
sqlite3 prisma/dev.db "SELECT * FROM PriceHistory WHERE locationId = 'fischauktionshalle-hamburg' ORDER BY createdAt DESC;"
```

## See All Prices with Status
```bash
# Database
sqlite3 prisma/dev.db "SELECT id, name, pricePerPerson, lastVerified, (julianday('now') - julianday(lastVerified)) as daysSince FROM Location ORDER BY daysSince DESC;"
```

## Bulk Update from CSV
```bash
node scripts/update-prices.mjs --file prices.csv --verified-by admin@example.com
```

CSV format:
```
locationId,price,reason
fischauktionshalle-hamburg,86,website verified
cch-congress-center-hamburg,135,venue contact
```

## Venue Contact Info

| Venue | Email | Phone | Website |
|-------|-------|-------|---------|
| CCH | info@cch.de | +49 40 3569 0 | cch.de |
| Cruise Center | info@nordevent.de | +49 40 2000 640 | nordevent.de |
| Fischauktionshalle | info@fischauktionshalle.com | +49 40 3005 1311 | fischauktionshalle.com |
| Schuppen 52 | info@gerresheim-serviert.de | +49 40 600 170 | gerresheim-serviert.de |
| Stage Theater | business.customers@stage-entertainment.com | +49 40 31186 101 | theaterimhafen.de |
| Edelfettwerk | mail@edelfettwerk.de | +49 40 8510 7830 | edelfettwerk.de |

## Location IDs
- `cch-congress-center-hamburg`
- `cruise-center-altona`
- `fischauktionshalle-hamburg`
- `schuppen-52`
- `stage-theater-im-hafen`
- `edelfettwerk`

## Reason Examples
- `website verified`
- `phone contact - confirmed`
- `venue email quote`
- `market adjustment`
- `catering cost increase`
- `seasonal pricing`
- `manual verification`

## Troubleshooting

**API returns 404**: Check location ID is correct
**Migration failed**: Run `npx prisma migrate resolve --rolled-back 20260328111610_add_price_tracking`
**Component not rendering**: Ensure admin is authenticated and data loaded
**Can't contact venue**: Try alternate contact method, note in system as unreachable
