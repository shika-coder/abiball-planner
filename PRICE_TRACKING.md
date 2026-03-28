# Price Tracking & Verification System

This system ensures venue prices stay accurate and up-to-date.

## Features

- **Automatic Staleness Detection**: Flags prices not verified in 60+ days
- **Price History Tracking**: Complete audit trail of all price changes
- **Bulk Updates**: Update multiple prices via CSV
- **Verification System**: Mark prices as verified without changing them
- **API Endpoints**: Manage prices programmatically
- **CLI Script**: Command-line tool for price updates

## Database Schema

### Location Model (Updated)
- `lastVerified`: DateTime - When price was last verified
- `priceHistory`: Relation to PriceHistory records

### PriceHistory Model (New)
- `id`: Unique identifier
- `locationId`: Which location
- `oldPrice`: Previous price
- `newPrice`: New price
- `reason`: Why it changed (e.g., "venue update", "market adjustment")
- `verifiedBy`: Admin email who made the change
- `createdAt`: When the change was recorded

## Usage

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add_price_tracking
```

### 2. Update Individual Price (API)

```bash
curl -X POST http://localhost:3000/api/admin/prices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "locationId": "cch-congress-center-hamburg",
    "newPrice": 135,
    "reason": "venue price increase",
    "verifiedBy": "admin@example.com"
  }'
```

### 3. Verify Price Without Change (API)

```bash
curl -X PUT http://localhost:3000/api/admin/prices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "locationId": "cch-congress-center-hamburg",
    "verifiedBy": "admin@example.com"
  }'
```

### 4. Get All Prices with Status (API)

```bash
curl http://localhost:3000/api/admin/prices \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 5. Get Stale Prices (API)

```bash
curl http://localhost:3000/api/admin/prices?action=stale \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 6. Get Price History (API)

```bash
curl "http://localhost:3000/api/admin/prices?action=history&locationId=cch-congress-center-hamburg" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 7. Update via CLI Script

#### Single Price Update
```bash
node scripts/update-prices.mjs \
  --location cch-congress-center-hamburg \
  --price 135 \
  --reason "venue update" \
  --verified-by admin@example.com
```

#### Bulk Update from CSV
```bash
node scripts/update-prices.mjs \
  --file prices.csv \
  --verified-by admin@example.com
```

#### CSV Format
```csv
locationId,price,reason
cch-congress-center-hamburg,135,venue price increase
fischauktionshalle-hamburg,86,market adjustment
cruise-center-altona,120,catering adjustment
```

## Workflow for Price Verification

### Weekly/Monthly Process:
1. Run the stale prices check via API:
   ```bash
   GET /api/admin/prices?action=stale
   ```

2. For each stale price:
   - Contact the venue or check their website
   - Update price if changed: `POST /api/admin/prices`
   - Mark as verified if unchanged: `PUT /api/admin/prices`

3. Document the verification in the `reason` field:
   - "website verified"
   - "venue contacted - no change"
   - "quote from venue received"

## Implementation Details

### Staleness Threshold
Currently set to 60 days. Modify in `src/lib/price-tracking.ts`:
```typescript
const PRICE_STALENESS_DAYS = 60;
```

### What Gets Logged
Every price change records:
- Old price and new price
- Who made the change
- When it was made
- Reason for the change
- Complete audit trail for compliance

## Initialization

All existing locations will have `lastVerified = null` initially.

To initialize them with today's date (marking them as verified):
```typescript
// In a migration or setup script
await prisma.location.updateMany({
  data: {
    lastVerified: new Date()
  }
});
```

## Integration with Admin Dashboard

In your admin dashboard, add a "Prices" section showing:
- [ ] All venues with days since last verification
- [ ] Red warning for prices > 60 days old
- [ ] Quick action buttons to verify or update
- [ ] Price history timeline for each venue
- [ ] Bulk update interface

## Testing

Check database directly:
```bash
# See all locations with price status
SELECT id, name, pricePerPerson, lastVerified FROM Location;

# See price history
SELECT locationId, oldPrice, newPrice, reason, createdAt FROM PriceHistory ORDER BY createdAt DESC;
```
