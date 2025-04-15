// app/api/users/[userId]/vote/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { voteType } = await request.json();
    
    // Ví dụ code cập nhật vote trong database
    // Trong thực tế bạn sẽ truy vấn DB và cập nhật dữ liệu
    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // const updatedVote = voteType === 'up' ? user.vote + 1 : user.vote - 1;
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { vote: updatedVote }
    // });
    
    // Giả lập kết quả trả về
    const updatedVote = voteType === 'up' ? 10 : 5; // Giả sử giá trị mới sau khi cập nhật
    
    return NextResponse.json({ 
      success: true, 
      updatedVote,
      message: 'Vote đã được cập nhật'
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật vote:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi cập nhật vote' },
      { status: 500 }
    );
  }
}