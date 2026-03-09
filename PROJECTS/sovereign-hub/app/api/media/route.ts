import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_ROOTS = [
  '/home/skywork/workspace/Documents',
  '/home/skywork/workspace/screenshots',
  '/home/skywork/workspace/PROJECTS'
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('path');

  if (!filePath) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  // 🛡️ Security Check: Ensure path is within allowed roots
  const absolutePath = path.resolve(filePath.startsWith('/') ? filePath : path.join('/home/skywork/workspace', filePath));
  
  const isAllowed = ALLOWED_ROOTS.some(root => absolutePath.startsWith(root));
  if (!isAllowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  if (!fs.existsSync(absolutePath)) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

  try {
    const fileBuffer = fs.readFileSync(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream';
    
    return new NextResponse(fileBuffer, {
      headers: { 'Content-Type': contentType }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}
