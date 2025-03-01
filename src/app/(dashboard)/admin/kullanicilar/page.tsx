"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/app/components/ui/Skeleton";

// Kullanıcı tipi
type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "PROVIDER" | "ADMIN";
  createdAt: string;
  phoneNumber: string | null;
  address: string | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Gerçek uygulamada API'dan verileri alacağız
        // Şimdilik verileri simüle edelim
        // const response = await fetch('/api/admin/users');
        // const data = await response.json();
        
        // Simüle edilmiş veriler
        const mockUsers: User[] = Array.from({ length: 25 }, (_, index) => ({
          id: `user-${index + 1}`,
          name: `Kullanıcı ${index + 1}`,
          email: `kullanici${index + 1}@example.com`,
          role: index % 7 === 0 ? "ADMIN" : index % 3 === 0 ? "PROVIDER" : "USER",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          phoneNumber: index % 4 === 0 ? null : `+90 5${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 1000)}${Math.floor(Math.random() * 1000)}`,
          address: index % 3 === 0 ? `Örnek Adres ${index + 1}, Ankara` : null,
        }));
        
        setTimeout(() => {
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Kullanıcılar yüklenirken hata oluştu:", error);
        toast.error("Kullanıcılar yüklenirken bir hata oluştu");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Arama ve filtreleme işlevi
  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.role.toLowerCase().includes(searchTermLower)
    );
  });

  // Sayfalama hesaplamaları
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Kullanıcı silme (simüle edilmiş)
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        // Gerçek API çağrısı
        // await fetch(`/api/admin/users/${userId}`, {
        //   method: 'DELETE',
        // });
        
        // Simüle edilmiş silme
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast.success("Kullanıcı başarıyla silindi");
      } catch (error) {
        console.error("Kullanıcı silinirken hata oluştu:", error);
        toast.error("Kullanıcı silinirken bir hata oluştu");
      }
    }
  };

  // Rol renklerini belirle
  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "PROVIDER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Sayfalama kontrolü için fonksiyonlar
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <Link
          href="/admin/kullanicilar/ekle"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Yeni Kullanıcı Ekle
        </Link>
      </div>

      {/* Arama ve filtreleme */}
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Kullanıcı ara... (isim, email veya rol)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Kullanıcı tablosu */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Skeleton className="h-10 w-10 rounded-full" />
                          </div>
                          <div className="ml-4">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-24 mt-1" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20 mt-1" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </td>
                    </tr>
                  ))
                : currentItems.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phoneNumber || "Belirtilmemiş"}</div>
                        <div className="text-sm text-gray-500">{user.address || "Belirtilmemiş"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role === "USER"
                            ? "Kullanıcı"
                            : user.role === "PROVIDER"
                            ? "Sağlayıcı"
                            : "Yönetici"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/kullanicilar/${user.id}`}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 p-2 rounded"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Sayfalama */}
        {!loading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Önceki
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Sonraki
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{indexOfFirstItem + 1}</span>
                  {" - "}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredUsers.length)}</span>
                  {" / "}
                  <span className="font-medium">{filteredUsers.length}</span> sonuç gösteriliyor
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Önceki</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Sayfa numaraları */}
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? "text-gray-300" : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Sonraki</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 