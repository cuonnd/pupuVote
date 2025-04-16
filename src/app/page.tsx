"use client";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  img: string;
  desc: string;
  vote: number;
}

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [votedUsers, setVotedUsers] = useState<
    Record<string, "up" | "down" | null>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [topUsers, setTopUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);

          // Sắp xếp và lấy top 3 user có lượt vote cao nhất
          const sortedUsers = [...data.users].sort((a, b) => b.vote - a.vote);
          setTopUsers(sortedUsers.slice(0, 4));
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    // Lấy dữ liệu vote từ localStorage
    const savedVotes = localStorage.getItem("userVotes");
    if (savedVotes) {
      setVotedUsers(JSON.parse(savedVotes));
    }
  }, []);
  console.log("user", users);

  const handleVote = async (userId: string, index: any) => {
    // Kiểm tra xem user này đã vote chưa
    if (votedUsers[userId]) {
      alert("Bạn đã bình chọn cho nhân vật này rồi!");
      return;
    }
    const user = users[index];
    const updatedVote = { ...user, vote: user.vote + 1 };
    try {
      const res = await fetch(`/api/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVote),
      });
      const result = await res.json();
      if (res.ok) {
        const updatedUsers = [...users];
        updatedUsers[index] = result.user;
        setUsers(updatedUsers);
        localStorage.setItem("userVotes", JSON.stringify(updatedUsers));
      } else {
        alert(result.error || "Có lỗi khi cập nhật vote");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật vote:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">User Rankings</h1>
          <a
            href="/dashboard"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            <span>Quản lý Users</span>
          </a>
        </div>
      </header>

      <main className="relative min-h-screen px-4 py-8">
        {/* Background image */}
        <img
          className="object-cover fixed top-0 left-0 h-full w-full z-0"
          src="https://media-public.canva.com/rkyHE/MAF-OPrkyHE/1/s2.png"
          alt="background"
        />

        {/* Nội dung chính */}
        <div className="absolute sm:top-3/5 left-0 right-0  z-10  flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {users.map((character, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white lg:bg-transparent bg-opacity-90 rounded-xl p-4 shadow-md lg:shadow-none"
              >
                <div className="text-center mb-4">
                  <h2 className="text-lg font-bold text-amber-700">
                    {character.name}
                  </h2>
                </div>
                <button
                  onClick={() =>
                    handleVote(character.id, users.indexOf(character))
                  }
                  disabled={Boolean(votedUsers[character.id])}
                  className="bg-[#86b186] hover:bg-green-500 text-white font-bold py-2 px-8 rounded-[12] mb-4"
                >
                  BÌNH CHỌN
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
    </div>
  );
}
