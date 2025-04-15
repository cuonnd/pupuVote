// app/api/users/route.ts

import { NextResponse } from 'next/server';

type User = {
  name: string;
  img: string;
  desc: string;
  vote: number;
};

// Biến lưu dữ liệu tạm thời cho danh sách user
// (Lưu ý: dữ liệu in-memory chỉ dùng cho demo, không an toàn cho production)
let users: User[] = [];

/**
 * API GET: Lấy danh sách các user
 */
export async function GET() {
  return NextResponse.json({ users });
}

/**
 * API POST: Lưu 1 user mới
 * Yêu cầu request có body dạng JSON chứa các trường name, img, desc, vote.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Kiểm tra dữ liệu hợp lệ (bạn có thể mở rộng kiểm tra theo yêu cầu)
    if (!body.name) {
      return NextResponse.json({ error: 'Thiếu trường name' }, { status: 400 });
    }
    
    const newUser: User = {
      name: body.name,
      img: body.img || '',
      desc: body.desc || '',
      vote: body.vote ? Number(body.vote) : 0,
    };

    users.push(newUser);

    return NextResponse.json({
      message: 'User đã được thêm thành công',
      user: newUser,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Dữ liệu gửi lên không hợp lệ' }, { status: 400 });
  }
}
