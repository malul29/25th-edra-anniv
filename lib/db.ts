// lib/db.ts
// Database helper using Upstash Redis with in-memory fallback for local dev

import { Redis } from '@upstash/redis';

export interface Guest {
  id: string;
  name: string;
  phone: string;
  attendance: 'hadir' | 'tidak';
  companions: number;
  message: string;
  timestamp: string;
}

const RSVP_KEY = 'edra:rsvp:guests';

// Supports both UPSTASH_ (local/standard) and KV_ (Vercel KV integration) naming
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  // Prefer UPSTASH_ vars, fall back to Vercel KV_ vars
  const url =
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL ??
    '';
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ??
    process.env.KV_REST_API_TOKEN ??
    '';

  if (url.startsWith('https://') && token.length > 10) {
    redis = new Redis({ url, token });
    return redis;
  }
  return null;
}

// In-memory fallback for local development
const memStore: Guest[] = [];

export async function getAllGuests(): Promise<Guest[]> {
  const client = getRedis();
  if (!client) return [...memStore];
  
  try {
    const data = await client.get<Guest[]>(RSVP_KEY);
    return data ?? [];
  } catch {
    return [...memStore];
  }
}

export async function addGuest(guest: Guest): Promise<void> {
  const client = getRedis();
  if (!client) {
    memStore.push(guest);
    return;
  }

  try {
    const existing = await getAllGuests();
    existing.push(guest);
    await client.set(RSVP_KEY, existing);
  } catch (e) {
    console.error('Redis error:', e);
    memStore.push(guest);
  }
}

export async function deleteGuest(id: string): Promise<void> {
  const client = getRedis();
  if (!client) {
    const idx = memStore.findIndex(g => g.id === id);
    if (idx !== -1) memStore.splice(idx, 1);
    return;
  }

  try {
    const existing = await getAllGuests();
    const updated = existing.filter(g => g.id !== id);
    await client.set(RSVP_KEY, updated);
  } catch (e) {
    console.error('Redis error:', e);
  }
}
