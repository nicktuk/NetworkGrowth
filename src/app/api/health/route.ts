import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Verificar que la DB responde
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: 'connected'
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', db: 'disconnected' },
      { status: 503 }
    )
  }
}
