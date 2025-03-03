import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Supabase auth istemcisi oluştur
  const supabase = createMiddlewareClient({ req, res })
  
  // Oturumu yenile
  await supabase.auth.getSession()
  
  return res
}

// Middleware'in çalışacağı yolları belirt
export const config = {
  matcher: [
    // Auth gerektiren yolların hepsi için middleware'i çalıştır
    '/profil/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    // Kimlik doğrulama sayfalarını hariç tut
    '/((?!api|_next/static|_next/image|favicon.ico|giris|kayit).*)'
  ],
} 