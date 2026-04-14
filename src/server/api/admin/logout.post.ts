// Fix #2 (Critical): Server-side logout to clear httpOnly cookie
// JavaScript cannot delete httpOnly cookies — this must be done server-side
export default defineEventHandler(async (event) => {
  deleteCookie(event, 'admin_token')
  return { status: 'success' }
})
