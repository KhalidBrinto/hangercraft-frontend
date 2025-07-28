import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Color from '@/lib/models/Color';
import Size from '@/lib/models/Size';

export async function GET() {
  await dbConnect();
  const colors = await Color.find({});
  const sizes = await Size.find({});
  return NextResponse.json({ success: true, colors, sizes });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  if (body.type === 'color') {
    if (!body.name || !body.hexCode) {
      return NextResponse.json({ success: false, error: 'Name and hexCode required' }, { status: 400 });
    }
    const color = await Color.create({ name: body.name, hexCode: body.hexCode });
    return NextResponse.json({ success: true, color });
  } else if (body.type === 'size') {
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 });
    }
    const size = await Size.create({ name: body.name });
    return NextResponse.json({ success: true, size });
  } else {
    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  }
} 