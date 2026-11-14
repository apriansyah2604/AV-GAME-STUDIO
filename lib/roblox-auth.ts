const getAllowedRobloxUserIds = () =>
  (process.env.AUTH_ROBLOX_ALLOWED_USER_IDS || '')
    .split(',')
    .map((userId) => userId.trim())
    .filter((userId) => /^\d+$/.test(userId))

export function isAllowedRobloxUserId(userId?: string | null) {
  return Boolean(userId && getAllowedRobloxUserIds().includes(userId))
}

export function getRobloxAdminUserId() {
  return process.env.AUTH_ROBLOX_ADMIN_USER_ID?.trim() || ''
}

export function hasRobloxAuthConfiguration() {
  return Boolean(
    process.env.AUTH_SECRET?.trim() &&
      process.env.AUTH_ROBLOX_CLIENT_ID?.trim() &&
      process.env.AUTH_ROBLOX_CLIENT_SECRET?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
      getRobloxAdminUserId() &&
      getAllowedRobloxUserIds().length > 0
  )
}
