'use client'
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface User {
  id?: string;
  name: string;
  img: string;
  desc: string;
  vote: number;
}

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<User>({
    name: '',
    img: '',
    desc: '',
    vote: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
    
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'vote' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      
      if (res.ok) {
        setUsers(prev => [...prev, result.user]);
        setFormData({ name: '', img: '', desc: '', vote: 0 });
        setIsFormOpen(false);
      } else {
        alert(result.error || 'Có lỗi xảy ra khi thêm user');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Có lỗi xảy ra khi thêm user');
    } finally {
      setIsLoading(false);
    }
  };

  const incrementVote = (index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index].vote += 1;
    setUsers(updatedUsers);
    // Thực tế sẽ cần gửi request API để cập nhật vote
  };

  const decrementVote = (index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index].vote -= 1;
    setUsers(updatedUsers);
    // Thực tế sẽ cần gửi request API để cập nhật vote
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            User Directory
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Quản lý và theo dõi thông tin người dùng một cách đơn giản, hiệu quả với giao diện trực quan
          </p>
        </header>

        <div className="mb-10 flex justify-end">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
          >
            {isFormOpen ? 'Đóng form' : (
              <>
                <UserPlusIcon className="h-5 w-5 mr-2" />
                <span>Thêm User mới</span>
              </>
            )}
          </button>
        </div>

        {isFormOpen && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 transform transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <PlusIcon className="h-6 w-6 text-indigo-500 mr-2" />
              Thêm User mới
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tên</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required
                    placeholder="Nhập tên người dùng"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Ảnh (URL)</label>
                  <input 
                    type="text" 
                    name="img" 
                    value={formData.img} 
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea 
                  name="desc" 
                  value={formData.desc} 
                  onChange={handleChange} 
                  rows={3}
                  placeholder="Mô tả về người dùng này..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Vote</label>
                <input 
                  type="number" 
                  name="vote" 
                  value={formData.vote} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg mr-3 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                >
                  {isLoading ? 'Đang xử lý...' : 'Thêm User'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách User</h2>
          
          {users.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Không có user nào trong hệ thống.</p>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="mt-4 px-6 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-lg hover:bg-indigo-200 transition-colors"
              >
                Thêm user đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <div key={index} className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all group">
                  {user?.img ? (
                    <div className="aspect-video w-full relative overflow-hidden">
                      <img 
                        src={user.img} 
                        alt={user.name}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">{user?.name}</h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{user?.desc || "Không có mô tả"}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-2">Vote:</span>
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
                          onClick={() => incrementVote(index)}
                          className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        >
                          <ArrowUpIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => decrementVote(index)}
                          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <ArrowDownIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}