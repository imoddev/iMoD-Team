# 🔌 API Reference

## Overview

iMoD Team ใช้ Supabase เป็น Backend ทั้งหมด
- **Database**: PostgreSQL
- **Auth**: Supabase Auth (JWT)
- **Realtime**: Supabase Realtime
- **Storage**: Supabase Storage

---

## Authentication

### Login
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Logout
```typescript
await supabase.auth.signOut()
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

---

## Clients API

### List Clients
```typescript
const { data, error } = await supabase
  .from('clients')
  .select('*')
  .order('created_at', { ascending: false })
```

### Get Single Client
```typescript
const { data, error } = await supabase
  .from('clients')
  .select('*')
  .eq('id', clientId)
  .single()
```

### Create Client
```typescript
const { data, error } = await supabase
  .from('clients')
  .insert({
    company_name: 'OPPO Thailand',
    brand_name: 'OPPO',
    industry: 'smartphone',
    status: 'lead',
    contact_name: 'คุณสมชาย',
    contact_email: 'somchai@oppo.com',
    contact_phone: '081-111-1111'
  })
  .select()
  .single()
```

### Update Client
```typescript
const { data, error } = await supabase
  .from('clients')
  .update({ status: 'active' })
  .eq('id', clientId)
  .select()
  .single()
```

### Delete Client
```typescript
const { error } = await supabase
  .from('clients')
  .delete()
  .eq('id', clientId)
```

---

## Campaigns API

### List Campaigns by Client
```typescript
const { data, error } = await supabase
  .from('campaigns')
  .select('*')
  .eq('client_id', clientId)
  .order('start_date', { ascending: false })
```

### Create Campaign
```typescript
const { data, error } = await supabase
  .from('campaigns')
  .insert({
    client_id: clientId,
    name: 'OPPO Reno 12 Launch',
    campaign_type: 'product_launch',
    status: 'active',
    budget: 500000,
    start_date: '2026-02-01',
    end_date: '2026-02-28'
  })
  .select()
  .single()
```

---

## News Items API

### List News with Priority
```typescript
const { data, error } = await supabase
  .from('news_items')
  .select('*')
  .order('priority_score', { ascending: false })
  .limit(50)
```

### Filter by Category
```typescript
const { data, error } = await supabase
  .from('news_items')
  .select('*')
  .eq('category', 'apple')
  .order('priority_score', { ascending: false })
```

### Update News Status
```typescript
const { error } = await supabase
  .from('news_items')
  .update({ status: 'assigned' })
  .eq('id', newsId)
```

---

## Tasks API (Content/Video)

### List Tasks by Team
```typescript
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('team', 'content')
  .order('created_at', { ascending: false })
```

### List Tasks by Status
```typescript
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('status', 'in_progress')
```

### Create Task
```typescript
const { data, error } = await supabase
  .from('tasks')
  .insert({
    title: 'รีวิว iPhone 17 Air',
    description: 'รีวิวเชิงลึก',
    team: 'content',
    task_type: 'article',
    status: 'todo',
    priority: 'high',
    assigned_to: userId,
    deadline: '2026-02-01T18:00:00Z'
  })
  .select()
  .single()
```

### Update Task Status
```typescript
const { error } = await supabase
  .from('tasks')
  .update({ 
    status: 'done',
    completed_at: new Date().toISOString()
  })
  .eq('id', taskId)
```

---

## Profiles API (HR)

### List All Profiles
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('is_active', true)
  .order('full_name')
```

### Filter by Team
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('team', 'content')
  .eq('is_active', true)
```

---

## Leave Requests API

### List Pending Requests
```typescript
const { data, error } = await supabase
  .from('leave_requests')
  .select('*, profiles(*)')
  .eq('status', 'pending')
  .order('created_at', { ascending: false })
```

### Create Leave Request
```typescript
const { data, error } = await supabase
  .from('leave_requests')
  .insert({
    user_id: userId,
    leave_type: 'vacation',
    start_date: '2026-02-01',
    end_date: '2026-02-03',
    reason: 'ไปเที่ยว'
  })
  .select()
  .single()
```

### Approve/Reject Leave
```typescript
const { error } = await supabase
  .from('leave_requests')
  .update({
    status: 'approved', // or 'rejected'
    approved_by: approverId,
    approved_at: new Date().toISOString()
  })
  .eq('id', requestId)
```

---

## Attendance API

### Get Today's Attendance
```typescript
const today = new Date().toISOString().split('T')[0]
const { data, error } = await supabase
  .from('attendance')
  .select('*, profiles(*)')
  .eq('date', today)
```

### Check In
```typescript
const { error } = await supabase
  .from('attendance')
  .insert({
    user_id: userId,
    date: today,
    check_in: new Date().toISOString(),
    work_mode: 'office' // or 'wfh'
  })
```

### Check Out
```typescript
const { error } = await supabase
  .from('attendance')
  .update({ check_out: new Date().toISOString() })
  .eq('user_id', userId)
  .eq('date', today)
```

---

## Realtime Subscriptions

### Subscribe to Tasks Changes
```typescript
const channel = supabase
  .channel('tasks-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tasks' },
    (payload) => {
      console.log('Task changed:', payload)
    }
  )
  .subscribe()

// Unsubscribe
channel.unsubscribe()
```

### Subscribe to News Items
```typescript
const channel = supabase
  .channel('news-changes')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'news_items' },
    (payload) => {
      console.log('New news item:', payload.new)
    }
  )
  .subscribe()
```

---

## Storage API

### Upload File
```typescript
const { data, error } = await supabase.storage
  .from('designs')
  .upload(`thumbnails/${filename}`, file, {
    contentType: 'image/png'
  })
```

### Get Public URL
```typescript
const { data } = supabase.storage
  .from('designs')
  .getPublicUrl('thumbnails/image.png')

console.log(data.publicUrl)
```

### Delete File
```typescript
const { error } = await supabase.storage
  .from('designs')
  .remove(['thumbnails/image.png'])
```

---

## Error Handling

```typescript
const { data, error } = await supabase
  .from('clients')
  .select('*')

if (error) {
  if (error.code === 'PGRST116') {
    // Row not found
  } else if (error.code === '42501') {
    // Permission denied (RLS)
  } else {
    // Other error
    console.error(error.message)
  }
}
```

---

## Rate Limits

Supabase Free Tier:
- **API Requests**: 500K/month
- **Database**: 500MB
- **Storage**: 1GB
- **Bandwidth**: 2GB

Pro Plan ($25/month):
- **API Requests**: Unlimited
- **Database**: 8GB
- **Storage**: 100GB
- **Bandwidth**: 50GB
