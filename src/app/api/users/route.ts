import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseClient";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

type User = {
  userId: string;
  name: string;
  img: string;
  desc: string;
  vote: number;
};

const usersCollection = collection(db, "users");

// GET: Lấy danh sách user
export async function GET() {
  const q = query(usersCollection, orderBy("vote", "desc"));
  const snapshot = await getDocs(q);

  const users: User[] = snapshot.docs.map((doc) => ({
    userId: doc.id,
    ...(doc.data() as Omit<User, "userId">),
  }));

  return NextResponse.json({ users });
}

// POST: Tạo user mới
export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name) {
    return NextResponse.json({ error: "Thiếu trường name" }, { status: 400 });
  }

  const docRef = await addDoc(usersCollection, {
    name: body.name,
    img: body.img || "",
    desc: body.desc || "",
    vote: body.vote ? Number(body.vote) : 0,
  });

  return NextResponse.json({
    message: "User đã được thêm thành công",
    user: { userId: docRef.id, ...body },
  });
}

// PUT: Cập nhật hoặc tạo mới user
export async function PUT(request: Request) {
  const body = await request.json();

  if (!body.userId) {
    return NextResponse.json({ error: "Thiếu trường userId" }, { status: 400 });
  }

  const userRef = doc(db, "users", body.userId);

  try {
    await updateDoc(userRef, {
      name: body.name,
      img: body.img,
      desc: body.desc,
      vote: body.vote,
    });

    return NextResponse.json({
      message: "User đã được cập nhật",
      user: { ...body },
    });
  } catch (err) {
    // Nếu không tồn tại, tạo mới
    await addDoc(usersCollection, {
      name: body.name || "",
      img: body.img || "",
      desc: body.desc || "",
      vote: body.vote || 0,
    });

    return NextResponse.json({
      message: "User mới đã được tạo",
      user: body,
    });
  }
}

// DELETE: Xóa user theo userId
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Thiếu tham số userId" },
      { status: 400 }
    );
  }

  const userRef = doc(db, "users", userId);
  await deleteDoc(userRef);

  return NextResponse.json({
    message: "User đã được xóa thành công",
    userId,
  });
}
