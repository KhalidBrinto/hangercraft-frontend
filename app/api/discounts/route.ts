import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Discount from '@/lib/models/Discount';

// GET /api/discounts - Get all discounts with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isActive = searchParams.get('isActive');
    const type = searchParams.get('type');
    
    // Build query
    const query: Record<string, unknown> = {};
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    if (type) {
      query.type = type;
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const discounts = await Discount.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Discount.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: discounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discounts' },
      { status: 500 }
    );
  }
}

// POST /api/discounts - Create a new discount
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Basic validation
    if (!body.code || !body.type || !body.value || !body.maxUsage) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if discount code already exists
    const existingDiscount = await Discount.findOne({ code: body.code.toUpperCase() });
    if (existingDiscount) {
      return NextResponse.json(
        { success: false, error: 'Discount code already exists' },
        { status: 400 }
      );
    }
    
    // Create new discount
    const discount = new Discount({
      ...body,
      code: body.code.toUpperCase(),
      currentUsage: 0,
      usedBy: [],
      isActive: body.isActive !== undefined ? body.isActive : true
    });
    
    await discount.save();
    
    return NextResponse.json({
      success: true,
      data: discount,
      message: 'Discount created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating discount:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create discount' },
      { status: 500 }
    );
  }
} 