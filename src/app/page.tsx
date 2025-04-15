'use client'
import { ArrowDownIcon, ArrowUpIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  img: string;
  desc: string;
  vote: number;
}

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [votedUsers, setVotedUsers] = useState<Record<string, 'up' | 'down' | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [topUsers, setTopUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/users');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);
          
          // Sắp xếp và lấy top 3 user có lượt vote cao nhất
          const sortedUsers = [...data.users].sort((a, b) => b.vote - a.vote);
          setTopUsers(sortedUsers.slice(0, 3));
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
    
    // Lấy dữ liệu vote từ localStorage
    const savedVotes = localStorage.getItem('userVotes');
    if (savedVotes) {
      setVotedUsers(JSON.parse(savedVotes));
    }
  }, []);
  console.log("user",users)

  const handleVote = async (userId: string, voteType: 'up' | 'down') => {
    // Kiểm tra xem user này đã vote chưa
    if (votedUsers[userId]) {
      alert('Bạn đã vote cho người dùng này rồi!');
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
      });

      if (res.ok) {
        const result = await res.json();
        
        // Cập nhật state
        setUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, vote: result.updatedVote } : user
          )
        );
        
        // Lưu trạng thái đã vote vào localStorage
        const newVotedUsers = { ...votedUsers, [userId]: voteType };
        setVotedUsers(newVotedUsers);
        localStorage.setItem('userVotes', JSON.stringify(newVotedUsers));
        
        // Cập nhật top users
        const updatedUser = users.find(u => u.id === userId);
        if (updatedUser) {
          const updatedTopUsers = [...users]
            .map(u => u.id === userId ? { ...u, vote: result.updatedVote } : u)
            .sort((a, b) => b.vote - a.vote)
            .slice(0, 3);
          setTopUsers(updatedTopUsers);
        }
      } else {
        const error = await res.json();
        alert(error.message || 'Có lỗi xảy ra khi vote');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Có lỗi xảy ra khi vote');
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

      <main className="container mx-auto px-4 py-8">
        {/* Top Users Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Users</h2>
          {topUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topUsers.map((user, index) => (
                <div 
                  key={user.id + user.name}
                  className={`rounded-xl overflow-hidden border bg-white shadow-lg relative ${
                    index === 0 ? 'md:col-span-3 lg:col-span-1 transform md:scale-105' : ''
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-white p-2 rounded-full z-10 shadow-md">
                      <StarIconSolid className="h-5 w-5" />
                    </div>
                  )}
                  <div className="aspect-video w-full relative overflow-hidden">
                    {user.img ? (
                      <img 
                        src={user.img} 
                        alt={user.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        #{index + 1}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{user.desc}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {/* <span className="font-medium text-gray-700 mr-2">Votes:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.vote > 0 ? 'bg-green-100 text-green-700' : 
                          user.vote < 0 ? 'bg-red-100 text-red-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.vote}
                        </span> */}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleVote(user.id, 'up')}
                          disabled={Boolean(votedUsers[user.id])}
                          className={`p-2 rounded-full transition-colors ${
                            votedUsers[user.id] === 'up' 
                              ? 'bg-green-500 text-white' 
                              : votedUsers[user.id] 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                        >
                          <ArrowUpIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleVote(user.id, 'down')}
                          disabled={Boolean(votedUsers[user.id])}
                          className={`p-2 rounded-full transition-colors ${
                            votedUsers[user.id] === 'down' 
                              ? 'bg-red-500 text-white' 
                              : votedUsers[user.id] 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          <ArrowDownIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <p className="text-gray-500">Chưa có đủ dữ liệu để hiển thị top users.</p>
            </div>
          )}
        </section>
        
        {/* All Users Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <p className="text-gray-500">Không có user nào trong hệ thống.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((user,index) => (
                <div key={user.id+index} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all">
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-3 bg-indigo-100 flex items-center justify-center">
                        {user.img ? (
                          <img 
                            src={user.img} 
                            alt={user.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-xl font-bold text-indigo-400">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{user.desc || "Không có mô tả"}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-2">Votes:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.vote > 0 ? 'bg-green-100 text-green-700' : 
                          user.vote < 0 ? 'bg-red-100 text-red-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.vote}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleVote(user.id, 'up')}
                          disabled={Boolean(votedUsers[user.id])}
                          className={`p-1.5 rounded-full transition-colors ${
                            votedUsers[user.id] === 'up' 
                              ? 'bg-green-500 text-white' 
                              : votedUsers[user.id] 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title={votedUsers[user.id] ? "Bạn đã vote cho user này" : "Upvote"}
                        >
                          <ArrowUpIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleVote(user.id, 'down')}
                          disabled={Boolean(votedUsers[user.id])}
                          className={`p-1.5 rounded-full transition-colors ${
                            votedUsers[user.id] === 'down' 
                              ? 'bg-red-500 text-white' 
                              : votedUsers[user.id] 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          title={votedUsers[user.id] ? "Bạn đã vote cho user này" : "Downvote"}
                        >
                          <ArrowDownIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      
      {/* <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} User Rankings. All rights reserved.</p>
        </div> 
      </footer> */}
    </div>
  );
}