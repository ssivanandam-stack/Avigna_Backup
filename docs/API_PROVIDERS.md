# Provider Management API

Base URL: `/api`

Authentication for admin routes: `Authorization: Bearer <JWT_TOKEN>`

---

## Public Endpoints

### GET /providers

Returns active, non-deleted providers sorted by `displayOrder` ascending.

**Response fields (list):**

| Field | Type |
|-------|------|
| id | string |
| displayName | string |
| credentials | string |
| designation | string |
| specialty | string |
| shortBio | string |
| profileImageUrl | string |
| location | string |
| yearsOfExperience | number |
| languages | string[] |
| isFeatured | boolean |
| displayOrder | number |

**Example response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Providers fetched successfully",
  "data": [
    {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "displayName": "Rasheedah Fletcher, LCMHC",
      "credentials": "LCMHC",
      "designation": "Licensed Clinical Mental Health Counselor",
      "specialty": "Child & Adolescent Therapy",
      "shortBio": "Compassionate clinician specializing in children, adolescents, and family support.",
      "profileImageUrl": "https://avighnahc.com/images/providers/rasheedah-fletcher.jpg",
      "location": "Raleigh, NC",
      "yearsOfExperience": 12,
      "languages": ["English"],
      "isFeatured": true,
      "displayOrder": 1
    }
  ]
}
```

---

### GET /providers/:id

Returns the full profile for a single active provider.

**Additional fields vs list:** `firstName`, `lastName`, `fullBio`, `email`, `phone`, `createdAt`, `updatedAt`

Inactive or soft-deleted providers return `404`.

---

## Admin Endpoints

All routes require a valid admin JWT (`protect` middleware).

### GET /admin/providers

List all providers for admin management.

**Query params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| includeDeleted | boolean | false | Include soft-deleted providers |

---

### POST /admin/providers

Create a new provider.

**Required body fields:**

- `displayName`
- `designation`
- `specialty`

**Optional body fields:**

- `firstName`, `lastName`, `credentials`, `shortBio`, `fullBio`
- `profileImageUrl`, `email`, `phone`, `location`
- `yearsOfExperience`, `languages`, `displayOrder`, `isFeatured`, `status`

**Example request:**

```json
{
  "displayName": "Jane Doe, LCSW",
  "designation": "Licensed Clinical Social Worker",
  "specialty": "Family Therapy",
  "shortBio": "Brief bio for team card.",
  "fullBio": "Full biography for profile page.",
  "email": "jane.doe@avighnahc.com",
  "phone": "(919) 555-0100",
  "isFeatured": false,
  "status": "Active"
}
```

---

### PUT /admin/providers/:id

Update an existing provider. Send at least one field.

**Activate / Inactivate:**

```json
{ "status": "Active" }
```

```json
{ "status": "Inactive" }
```

---

### PATCH /admin/providers/reorder

Bulk update display order.

**Example request:**

```json
{
  "providers": [
    { "id": "665f1a2b3c4d5e6f7a8b9c0d", "displayOrder": 1 },
    { "id": "665f1a2b3c4d5e6f7a8b9c0e", "displayOrder": 2 }
  ]
}
```

---

### DELETE /admin/providers/:id

Soft deletes a provider (`isDeleted: true`, `status: "Inactive"`). Record remains in database for admin audit.

---

## Validation & Security

- Joi validation on create, update, and reorder
- `express-mongo-sanitize` strips `$` and `.` from request bodies
- Public routes filter `status: "Active"` and `isDeleted: false`
- Invalid MongoDB ObjectIds return `400`

---

## Setup

```bash
# Sync indexes
node scripts/migrateProviders.js

# Seed sample data
node scripts/seedProviders.js

# Force re-seed (clears existing providers)
FORCE_SEED=true node scripts/seedProviders.js
```

---

## Testing

### 1. Public list

```bash
curl http://localhost:5002/api/providers
```

### 2. Public detail

```bash
curl http://localhost:5002/api/providers/<PROVIDER_ID>
```

### 3. Admin login

```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"avighna@avighnahc.com\",\"password\":\"YOUR_PASSWORD\"}"
```

### 4. Create provider (admin)

```bash
curl -X POST http://localhost:5002/api/admin/providers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"displayName\":\"Test Provider, LCMHC\",\"designation\":\"Counselor\",\"specialty\":\"Anxiety\"}"
```

### 5. Update provider status

```bash
curl -X PUT http://localhost:5002/api/admin/providers/<ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"status\":\"Inactive\"}"
```

### 6. Reorder providers

```bash
curl -X PATCH http://localhost:5002/api/admin/providers/reorder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"providers\":[{\"id\":\"<ID1>\",\"displayOrder\":1},{\"id\":\"<ID2>\",\"displayOrder\":2}]}"
```

### 7. Soft delete

```bash
curl -X DELETE http://localhost:5002/api/admin/providers/<ID> \
  -H "Authorization: Bearer <TOKEN>"
```

### Expected checks

- Inactive providers do not appear on `GET /api/providers`
- Soft-deleted providers return `404` on public detail
- Unauthenticated admin requests return `401`
- Missing required fields on create return `400`
