"use client";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface User {
  userId: string;
  name: string;
  img: string;
  desc: string;
  vote: number;
}

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<string>();
  const [hasVoted, setHasVoted] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  // Thêm state để theo dõi vị trí scroll trước đó
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);
          // Sắp xếp theo vote nếu cần
          // const sortedUsers = [...data.users].sort((a, b) => b.vote - a.vote);
          // setUsers(sortedUsers);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    // Kiểm tra trạng thái bình chọn từ localStorage
    try {
      const hasVoted = localStorage.getItem("hasVoted");
      console.log("ID người bình chọn:", hasVoted);

      if (hasVoted === "true") {
        setHasVoted(true);
        const votedUserId = localStorage.getItem("votedUserId");
        console.log("ID người bình chọn:", votedUserId);
        if (votedUserId) {
          setSelected(votedUserId);
        }
      }
    } catch (error) {
      console.error("Lỗi khi đọc localStorage:", error);
    }
  }, []);

  const handleVote = async (userId: string, index: number) => {
    console.log("Bình chọn:", userId);

    try {
      // Kiểm tra xem đã bình chọn chưa
      if (hasVoted || localStorage.getItem("hasVoted") === "true") {
        alert("Bạn đã bình chọn rồi! Mỗi thiết bị chỉ được bình chọn 1 lần.");
        return;
      }
      console.log("Bình chọn:", index);

      setSelected(userId);

      const user = users[index];
      const updatedVote = { ...user, vote: user.vote + 1 };

      const res = await fetch(`/api/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVote),
      });

      const result = await res.json();
      if (res.ok) {
        // Cập nhật state
        const updatedUsers = [...users];
        updatedUsers[index] = result.user;
        setUsers(updatedUsers);
        setHasVoted(true);

        // Lưu trạng thái vào localStorage
        try {
          localStorage.setItem("hasVoted", "true");
          localStorage.setItem("votedUserId", userId);
        } catch (error) {
          console.error("Lỗi khi ghi localStorage:", error);
        }
      } else {
        alert(result.error || "Có lỗi khi cập nhật vote");
      }
    } catch (error) {
      console.error("Lỗi khi bình chọn:", error);
    }
  };

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        // Kiểm tra hướng scroll
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scroll xuống và đã scroll quá 100px
          setShowHeader(false);
        } else {
          // Scroll lên hoặc ở đầu trang
          setShowHeader(true);
        }
        // Cập nhật vị trí scroll cuối cùng
        setLastScrollY(window.scrollY);
      }
    };

    // Thêm event listener khi component mount
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);
    }

    // Cleanup event listener khi component unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', controlHeader);
      }
    };
  }, [lastScrollY]);
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen text-amber-950">
          Loading...
        </div>
      ) : (
        <>
          <header 
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 transition-transform duration-300 ${
              showHeader ? 'transform-none' : 'transform -translate-y-full'
            }`}
          >
            <div className="text-2xl font-bold text-amber-700 bg-white bg-opacity-80 px-6 py-2 rounded-full shadow-md">
              CỔNG BÌNH CHỌN
            </div>
          </header>

          <main className="px-4 py-8">
            {/* Background image */}
            <img
              className="object-cover fixed top-0 left-0 h-full w-full z-0"
              src="https://media-public.canva.com/rkyHE/MAF-OPrkyHE/1/s2.png"
              alt="background"
            />

            {/* Nội dung chính */}
            <div className="absolute top-[150] sm:top-3/5 left-0 right-0 z-10 flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                {users.map((character, index) => (
                  <div
                    key={character.userId}
                    className="flex flex-col items-center bg-white lg:bg-transparent bg-opacity-90 rounded-xl p-4 shadow-md lg:shadow-none"
                  >
                    <div className="text-center mb-4">
                      <h2 className="text-md font-bold text-amber-700">
                        {character.name}
                      </h2>
                    </div>
                    <button
                      onClick={() =>{handleVote(character.userId, index)}}
                      disabled={hasVoted}
                      className={`bg-[#86b186] hover:bg-green-500 text-white font-bold py-2 px-8 rounded-[12] mb-4 opacity-100
                      `}
                    >
                      {selected === character.userId ? "ĐÃ CHỌN" : "BÌNH CHỌN"}
                    </button>
                    <div className="h-32 w-32 sm:h-40 sm:w-40 mb-4">
                      <img
                        src={character.img}
                        alt={character.name}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}