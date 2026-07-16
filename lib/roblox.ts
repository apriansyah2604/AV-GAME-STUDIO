import noblox from 'noblox.js';

/**
 * Utilitas untuk menangani operasi API Roblox.
 * PERINGATAN: Penggunaan otomatisasi payout memiliki risiko banned jika terdeteksi aktivitas mencurigakan.
 */

let isInitialized = false;

// --- Type definitions untuk sistem management ---
type RobloxFriendsResponse = {
  data: Array<{
    id: number
    name: string
    displayName: string
  }>
  previousPageCursor: string | null
  nextPageCursor: string | null
}

type RobloxFriendsFindResponse = {
  PreviousCursor: string | null
  NextCursor: string | null
  PageItems: Array<{
    id: number
    hasVerifiedBadge?: boolean
  }>
  HasMore?: boolean | null
}

type RobloxUsersResponse = {
  data: Array<{
    id: number
    name: string
    displayName: string
  }>
}

type RobloxPresenceResponse = {
  userPresences: Array<{
    userId: number
    userPresenceType: 0 | 1 | 2 | 3
    lastLocation?: string | null
    placeId?: number | null
    rootPlaceId?: number | null
    gameId?: string | null
    universeId?: number | null
  }>
}

type RobloxAuthenticatedUserResponse = {
  id: number
  name: string
  displayName?: string
}

type RobloxSearchUsersResponse = {
  data: Array<{
    id: number
    name: string
    displayName: string
    hasVerifiedBadge: boolean
  }>
  nextPageCursor: string | null
  previousPageCursor: string | null
}

// --- Cache untuk sistem management ---
const csrfTokenCache = new Map<string, { token: string; fetchedAt: number }>()
const userProfileCache = new Map<number, { name: string; displayName: string; fetchedAt: number }>()
const presenceCache = new Map<number, {
  isOnline: boolean
  presenceType: 'offline' | 'online' | 'in_game' | 'in_studio'
  lastLocation: string | null
  fetchedAt: number
}>()
const friendsCache = new Map<string, {
  friends: Array<{
    id: number
    name: string
    displayName: string
    isOnline: boolean
    presenceType: 'offline' | 'online' | 'in_game' | 'in_studio'
    lastLocation: string | null
  }>
  fetchedAt: number
}>()
const USER_PROFILE_CACHE_MS = 30 * 60 * 1000
const PRESENCE_CACHE_MS = 30 * 1000
const FRIENDS_CACHE_MS = 60 * 1000

// --- Helper functions untuk sistem management ---
export function normalizeAuthToken(input: string) {
  const raw = String(input || '').trim()
  if (!raw) return raw
  const unquoted = raw.replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '')
  const withoutPrefix = unquoted.startsWith('.ROBLOSECURITY=') ? unquoted.slice('.ROBLOSECURITY='.length) : unquoted
  return withoutPrefix.trim()
}

export function getSecurityCookie(authToken: string) {
  return `.ROBLOSECURITY=${normalizeAuthToken(authToken)}`
}

export function chunkArray<T>(arr: T[], size: number) {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

export async function fetchCsrfToken(authToken: string) {
  console.log('[fetchCsrfToken] Starting...')
  const tokenKey = normalizeAuthToken(authToken)
  
  // Check cache
  const cached = csrfTokenCache.get(tokenKey)
  if (cached && Date.now() - cached.fetchedAt < 10 * 60 * 1000) {
    console.log('[fetchCsrfToken] Using cached token')
    return cached.token
  }

  console.log('[fetchCsrfToken] Fetching new token from Roblox...')
  const res = await fetch('https://auth.roblox.com/v2/logout', {
    method: 'POST',
    headers: {
      'Cookie': getSecurityCookie(authToken),
      'Origin': 'https://www.roblox.com',
      'Referer': 'https://www.roblox.com/',
    },
  })

  console.log('[fetchCsrfToken] Roblox response status:', res.status)
  const token = res.headers.get('x-csrf-token')
  
  if (!token) {
    console.error('[fetchCsrfToken] No X-CSRF-TOKEN header in response')
    throw new Error('Gagal mengambil token keamanan Roblox. Pastikan auth token valid.')
  }

  console.log('[fetchCsrfToken] Got new token')
  csrfTokenCache.set(tokenKey, { token, fetchedAt: Date.now() })
  return token
}

export async function getRobloxUsersByIds(userIds: number[]) {
  const uniqueIds = Array.from(new Set(userIds)).filter(n => Number.isFinite(n))
  if (uniqueIds.length === 0) return new Map<number, { name: string; displayName: string }>()

  const result = new Map<number, { name: string; displayName: string }>()
  const now = Date.now()
  const missingIds: number[] = []

  for (const id of uniqueIds) {
    const cached = userProfileCache.get(id)
    if (cached && now - cached.fetchedAt < USER_PROFILE_CACHE_MS) {
      result.set(id, { name: cached.name, displayName: cached.displayName })
    } else {
      missingIds.push(id)
    }
  }

  const batches = chunkArray(missingIds, 50)

  for (const batch of batches) {
    const res = await fetch('https://users.roblox.com/v1/users', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ userIds: batch, excludeBannedUsers: false }),
      cache: 'no-store',
    })

    if (!res.ok) {
      if (res.status === 429) {
        return result
      }
      throw new Error(`Gagal mengambil profile user Roblox (HTTP ${res.status})`)
    }

    const json = (await res.json()) as RobloxUsersResponse
    for (const u of json.data ?? []) {
      if (typeof u?.id === 'number') {
        const profile = { name: u.name ?? '', displayName: u.displayName ?? '' }
        result.set(u.id, profile)
        userProfileCache.set(u.id, { ...profile, fetchedAt: Date.now() })
      }
    }
  }

  return result
}

export function mapPresenceType(type: number): 'offline' | 'online' | 'in_game' | 'in_studio' {
  if (type === 1) return 'online'
  if (type === 2) return 'in_game'
  if (type === 3) return 'in_studio'
  return 'offline'
}

export async function getRobloxPresenceByIds(authToken: string, userIds: number[]) {
  const uniqueIds = Array.from(new Set(userIds)).filter(n => Number.isFinite(n))
  const result = new Map<number, {
    isOnline: boolean
    presenceType: 'offline' | 'online' | 'in_game' | 'in_studio'
    lastLocation: string | null
  }>()
  if (uniqueIds.length === 0) return result

  const now = Date.now()
  const missingIds: number[] = []

  for (const id of uniqueIds) {
    const cached = presenceCache.get(id)
    if (cached && now - cached.fetchedAt < PRESENCE_CACHE_MS) {
      result.set(id, {
        isOnline: cached.isOnline,
        presenceType: cached.presenceType,
        lastLocation: cached.lastLocation,
      })
    } else {
      missingIds.push(id)
    }
  }

  const batches = chunkArray(missingIds, 100)
  if (batches.length === 0) return result

  let csrfToken = await fetchCsrfToken(authToken)

  for (const batch of batches) {
    let res = await fetch('https://presence.roblox.com/v1/presence/users', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        cookie: getSecurityCookie(authToken),
        'content-type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify({ userIds: batch }),
      cache: 'no-store',
    })

    if (res.status === 403) {
      const refreshed = res.headers.get('x-csrf-token')
      if (refreshed) {
        csrfTokenCache.set(normalizeAuthToken(authToken), { token: refreshed, fetchedAt: Date.now() })
        csrfToken = refreshed
        res = await fetch('https://presence.roblox.com/v1/presence/users', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            cookie: getSecurityCookie(authToken),
            'content-type': 'application/json',
            'x-csrf-token': csrfToken,
          },
          body: JSON.stringify({ userIds: batch }),
          cache: 'no-store',
        })
      }
    }

    if (!res.ok) {
      if (res.status === 429) return result
      throw new Error(`Gagal mengambil status online Roblox (HTTP ${res.status})`)
    }

    const json = (await res.json()) as RobloxPresenceResponse
    for (const presence of json.userPresences ?? []) {
      const value = {
        isOnline: presence.userPresenceType !== 0,
        presenceType: mapPresenceType(presence.userPresenceType),
        lastLocation: presence.lastLocation ?? null,
      }
      result.set(presence.userId, value)
      presenceCache.set(presence.userId, { ...value, fetchedAt: Date.now() })
    }
  }

  return result
}

// --- Exported functions untuk sistem payout ---
export async function initRoblox() {
  const ROBLOSECURITY = process.env.ROBLOX_COOKIE;
  
  if (!ROBLOSECURITY) {
    throw new Error('ROBLOX_COOKIE tidak ditemukan di environment variables.');
  }

  // Jika sudah inisialisasi, jangan lakukan lagi untuk menghemat resource
  if (isInitialized) return;
  
  try {
    // Inisialisasi koneksi dengan cookie
    await noblox.setCookie(ROBLOSECURITY);
    const user = await noblox.getCurrentUser();
    console.log(`Berhasil login sebagai: ${user.UserName}`);
    isInitialized = true;
    return user;
  } catch (error: any) {
    console.error('Gagal inisialisasi Roblox:', error.message);
    isInitialized = false;
    throw error;
  }
}

export async function getGroupFunds() {
  const GROUP_ID = Number(process.env.ROBLOX_GROUP_ID);
  console.log(`[ROBLOX] Using Group ID: ${GROUP_ID}`);
  try {
    await initRoblox();
    // Tambahkan timeout atau retry jika perlu di masa depan
    const funds = await noblox.getGroupFunds(GROUP_ID);
    return funds;
  } catch (error: any) {
    console.error('Gagal mengambil saldo grup:', error.message);
    // Reset status inisialisasi jika error agar percobaan berikutnya mencoba login ulang
    isInitialized = false;
    throw error;
  }
}

export async function processPayout(username: string, amount: number) {
  const GROUP_ID = Number(process.env.ROBLOX_GROUP_ID);
  
  try {
    await initRoblox();
    const botUser = await noblox.getCurrentUser();
    console.log(`[ROBLOX] Bot User: ${botUser.UserName} (${botUser.UserID})`);

    // 1. Dapatkan User ID dari Username dengan Retry
    let userId;
    let retryCount = 0;
    while (retryCount < 3) {
      try {
        userId = await noblox.getIdFromUsername(username);
        break;
      } catch (e) {
        retryCount++;
        if (retryCount === 3) throw new Error(`Username "${username}" tidak ditemukan di Roblox setelah 3 kali percobaan.`);
        await new Promise(res => setTimeout(res, 1000)); // Tunggu 1 detik sebelum retry
      }
    }
    
    // 2. Cek apakah user ada di grup
    let memberInfo;
    try {
      const targetGroupId = Number(process.env.ROBLOX_GROUP_ID);
      console.log(`[ROBLOX] Checking membership for UserID: ${userId} in GroupID: ${targetGroupId}`);
      
      // Menggunakan getMember sebagai alternatif yang lebih stabil
      memberInfo = await noblox.getMember(targetGroupId, userId);
      console.log(`[ROBLOX] Member Info:`, JSON.stringify(memberInfo));
    } catch (e: any) {
      console.error(`[ROBLOX] getMember Error:`, e.message);
      // Fallback: Jika getMember gagal, coba getRankNameInGroup
      try {
        const rank = await noblox.getRankInGroup(Number(process.env.ROBLOX_GROUP_ID), userId);
        if (rank > 0) {
          console.log(`[ROBLOX] Fallback check: User is in group with rank ${rank}`);
          memberInfo = { role: 'Member', rank: rank };
        }
      } catch (fallbackErr: any) {
        console.error(`[ROBLOX] Fallback Error:`, fallbackErr.message);
      }
      
      if (!memberInfo) {
        throw new Error(`Gagal mengambil data grup. Pastikan ID Grup ${process.env.ROBLOX_GROUP_ID} benar. (Detail: ${e.message})`);
      }
    }

    if (!memberInfo) {
      throw new Error(`User ${username} belum bergabung di grup.`);
    }

    // 3. Cek Saldo Grup
    const groupFunds = await noblox.getGroupFunds(GROUP_ID);
    console.log(`Saldo grup saat ini: ${groupFunds} Robux`);
    if (groupFunds < amount) {
      throw new Error(`Saldo Robux grup tidak cukup (Tersedia: ${groupFunds}).`);
    }

    // 4. Eksekusi Payout
    try {
      await noblox.groupPayout({
        group: GROUP_ID,
        member: [userId],
        amount: [amount],
        recurring: false,
        usePercentage: false
      });
    } catch (e: any) {
      if (e.message.includes('15 days') || e.message.includes('7 days')) {
        throw new Error('User harus berada di grup minimal selama 7-15 hari sebelum menerima payout.');
      }
      throw new Error(`Gagal mengirim Robux: ${e.message}`);
    }

    return {
      success: true,
      message: `Berhasil mengirim ${amount} Robux ke ${username}`,
      userId
    };
  } catch (error: any) {
    console.error('Payout Error:', error.message);
    isInitialized = false; // Reset jika terjadi error
    return {
      success: false,
      message: error.message
    };
  }
}

// --- Exported functions untuk sistem management ---
export async function getAuthenticatedRobloxUser(authToken: string) {
  console.log('[getAuthenticatedRobloxUser] Starting...')
  const res = await fetch('https://users.roblox.com/v1/users/authenticated', {
    headers: {
      'Accept': 'application/json',
      'Cookie': getSecurityCookie(authToken),
      'Origin': 'https://www.roblox.com',
      'Referer': 'https://www.roblox.com/',
    },
    cache: 'no-store',
  })

  console.log('[getAuthenticatedRobloxUser] Roblox response status:', res.status)

  if (!res.ok) {
    const responseText = await res.text().catch(() => '')
    console.error('[getAuthenticatedRobloxUser] Failed:', {
      status: res.status,
      response: responseText,
    })
    
    if (res.status === 401) {
      throw new Error('Auth token tidak valid atau sudah kadaluarsa. Silakan perbarui auth token Anda.')
    }
    throw new Error(`Gagal mengambil informasi user (HTTP ${res.status})`)
  }

  const data = await res.json()
  console.log('[getAuthenticatedRobloxUser] Got user:', { id: data.id, name: data.name })
  return data as RobloxAuthenticatedUserResponse
}

export async function listRobloxFriends(params: {
  robloxUserId: string
  authToken: string
  limit?: number
}) {
  const limit = Math.max(1, Math.min(1000, params.limit ?? 1000))
  const cacheKey = `${params.robloxUserId}:${limit}`
  const cachedFriends = friendsCache.get(cacheKey)
  if (cachedFriends && Date.now() - cachedFriends.fetchedAt < FRIENDS_CACHE_MS) {
    return cachedFriends.friends
  }

  const friendIds: number[] = []
  let cursor: string | null = null

  while (friendIds.length < limit) {
    const url = new URL(`https://friends.roblox.com/v1/users/${params.robloxUserId}/friends/find`)
    url.searchParams.set('userSort', 'FriendScore')
    url.searchParams.set('pageNumber', '1')
    url.searchParams.set('pageSize', String(Math.min(100, limit - friendIds.length)))
    if (cursor) url.searchParams.set('cursor', cursor)

    const res = await fetch(url.toString(), {
      headers: {
        accept: 'application/json',
        cookie: getSecurityCookie(params.authToken),
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      if (res.status === 429 && cachedFriends) {
        return cachedFriends.friends
      }
      throw new Error(`Gagal mengambil daftar teman Roblox (HTTP ${res.status})`)
    }

    const json = (await res.json()) as RobloxFriendsFindResponse
    friendIds.push(...(json.PageItems ?? []).map(friend => friend.id))
    cursor = json.NextCursor
    if (!cursor) break
  }

  const users = await getRobloxUsersByIds(friendIds)
  const presences = await getRobloxPresenceByIds(params.authToken, friendIds)
  const friends = friendIds.map(id => {
    const resolved = users.get(id)
    const presence = presences.get(id)
    return {
      id,
      name: resolved?.name ?? '',
      displayName: resolved?.displayName ?? '',
      isOnline: presence?.isOnline ?? false,
      presenceType: presence?.presenceType ?? 'offline',
      lastLocation: presence?.lastLocation ?? null,
    }
  })

  friendsCache.set(cacheKey, { friends, fetchedAt: Date.now() })
  return friends
}

export async function unfriendRobloxUser(params: { authToken: string; targetUserId: string }) {
  const url = `https://friends.roblox.com/v1/users/${params.targetUserId}/unfriend`
  const tokenKey = normalizeAuthToken(params.authToken)

  const attempt = async (csrfToken: string) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        cookie: getSecurityCookie(params.authToken),
        'content-type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      body: '{}',
    })
  }

  let csrfToken = await fetchCsrfToken(params.authToken)
  let res = await attempt(csrfToken)

  if (res.status === 403) {
    const refreshed = res.headers.get('x-csrf-token')
    if (refreshed) {
      csrfTokenCache.set(tokenKey, { token: refreshed, fetchedAt: Date.now() })
      csrfToken = refreshed
      res = await attempt(csrfToken)
    }
  }

  if (!res.ok) {
    throw new Error(`Gagal menghapus pertemanan (HTTP ${res.status})`)
  }

  return true
}

export async function sendRobloxPrivateMessage(params: {
  authToken: string
  senderUserId: string
  recipientId: string
  subject: string
  body: string
}) {
  console.log('[sendRobloxPrivateMessage] Starting with noblox.js:', {
    senderUserId: params.senderUserId,
    recipientId: params.recipientId,
    subjectLength: params.subject.length,
    bodyLength: params.body.length,
  })

  try {
    // Set cookie for noblox.js
    await noblox.setCookie(`.ROBLOSECURITY=${normalizeAuthToken(params.authToken)}`);
    console.log('[sendRobloxPrivateMessage] Successfully set cookie with noblox.js');

    // Send message using noblox.js's message function
    const result = await noblox.message(
      Number(params.recipientId),
      params.subject,
      params.body
    );

    console.log('[sendRobloxPrivateMessage] SUCCESS sending message with noblox.js:', result);
    return result;
  } catch (error) {
    console.error('[sendRobloxPrivateMessage] Failed to send message with noblox.js:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function searchRobloxUsers(query: string, limit: number = 20) {
  const url = new URL('https://users.roblox.com/v1/users/search')
  url.searchParams.set('keyword', query.trim())
  url.searchParams.set('limit', String(Math.max(1, Math.min(100, limit))))

  const res = await fetch(url.toString(), {
    headers: { accept: 'application/json' },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Gagal mencari pengguna Roblox (HTTP ${res.status})`)
  }

  const json = (await res.json()) as RobloxSearchUsersResponse
  return json.data || []
}