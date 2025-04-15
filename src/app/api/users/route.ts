// app/api/users/route.ts

import { NextResponse } from 'next/server';

type User = {
  userId: string;
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
      userId: Date.now().toString(),
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
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Dữ liệu gửi lên không hợp lệ' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.userId) {
      return NextResponse.json({ error: 'Thiếu trường userId' }, { status: 400 });
    }
    
    const userIndex = users.findIndex(user => user.userId === body.userId);
    
    if (userIndex === -1) {
      // Thêm user mới nếu không tìm thấy
      const newUser: User = {
        userId: body.userId,
        name: body.name || '',
        img: body.img || '',
        desc: body.desc || '',
        vote: body.vote ? Number(body.vote) : 0,
      };
      
      users.push(newUser);
      
      return NextResponse.json({
        message: 'Đã tạo user mới',
        user: newUser
      });
    }
    
    // Cập nhật thông tin user nếu tìm thấy
    const updatedUser = {
      ...users[userIndex],
      name: body.name || users[userIndex].name,
      img: body.img !== undefined ? body.img : users[userIndex].img,
      desc: body.desc !== undefined ? body.desc : users[userIndex].desc,
      vote: body.vote !== undefined ? Number(body.vote) : users[userIndex].vote
    };
    
    users[userIndex] = updatedUser;
    
    return NextResponse.json({
      message: 'User đã được cập nhật thành công',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error processing PUT request:', error);
    return NextResponse.json({ error: 'Dữ liệu gửi lên không hợp lệ' }, { status: 400 });
  }
}

/**
 * API DELETE: Xóa user theo userId
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Thiếu tham số userId' }, { status: 400 });
    }
    
    const initialLength = users.length;
    users = users.filter(user => user.userId !== userId);
    
    if (users.length === initialLength) {
      return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 });
    }
    
    return NextResponse.json({
      message: 'User đã được xóa thành công',
      userId
    });
  } catch (error) {
    console.error('Error processing DELETE request:', error);
    return NextResponse.json({ error: 'Lỗi khi xử lý yêu cầu xóa' }, { status: 500 });
  }
}
