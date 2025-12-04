'use client'
import React, {useEffect, useState} from "react";

// Default export a single React component that contains two pages: Profile and Users List.
// Styling uses Tailwind CSS utility classes. This file is ready to paste into a React + Tailwind project.

export default function App() {
    const [route, setRoute] = useState("users"); // 'users' or 'profile'
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(1);

    const DeleteUsers = async () => {
        const response = await fetch("https://apiserverlean.vercel.app/v1/users/1", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer api-token-test",
            },
        })
        const data = await response.json();
        alert(data.message);
    }

    const GetUsers = async () => {
        const response = await fetch("https://apiserverlean.vercel.app/v1/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer api-token-test",
            },
        })
        const data = await response.json();
        console.log("API response", data.data);
        setUsers(data.data);
    }

    useEffect(() => {
        (async () => {
            await GetUsers()
        })()
    }, []);


    const selectedUser = users?.find((u) => u.id === selectedUserId) || users[0];

    function formatDate(iso) {
        const d = new Date(iso);
        return d.toLocaleString();
    }

    function removeUser(id) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        // if removed user was selected, select first one
        if (selectedUserId === id && users.length > 1) setSelectedUserId(users[0].id);
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Quản lý người dùng</h1>
                    <nav className="space-x-2">
                        <button
                            onClick={() => setRoute("users")}
                            className={`px-3 py-1 rounded-md ${route === "users" ? "bg-blue-600 text-white" : "bg-white border"}`}
                        >
                            Danh sách
                        </button>
                        <button
                            onClick={() => setRoute("profile")}
                            className={`px-3 py-1 rounded-md ${route === "profile" ? "bg-blue-600 text-white" : "bg-white border"}`}
                        >
                            Profile
                        </button>
                    </nav>
                </header>

                {route === "users" ? (
                    <main>
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium">Danh sách người dùng</h2>
                                <div className="flex items-center gap-2">
                                    <input
                                        placeholder="Tìm kiếm theo tên hoặc email"
                                        className="px-3 py-2 border rounded-md w-60"
                                        onChange={(e) => {
                                            const q = e.target.value.toLowerCase();
                                            if (!q) return setUsers(users);
                                            setUsers(users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            setUsers(users);
                                        }}
                                        className="px-3 py-2 bg-gray-100 rounded-md border"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead>
                                    <tr className="text-sm text-gray-500 border-b">
                                        <th className="p-3">#</th>
                                        <th className="p-3">User</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Role</th>
                                        <th className="p-3">Created At</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((u, idx) => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="p-3 align-middle">{idx + 1}</td>
                                            <td className="p-3 flex items-center gap-3">
                                                <img src={u.avatar} alt={u.name}
                                                     className="w-10 h-10 rounded-full object-cover"/>
                                                <div>
                                                    <div className="font-medium">{u.name}</div>
                                                    <div className="text-xs text-gray-500">ID: {u.id}</div>
                                                </div>
                                            </td>
                                            <td className="p-3">{u.email}</td>
                                            <td className="p-3">
                          <span
                              className={`px-2 py-1 rounded-md text-xs ${u.role === 'Admin' ? 'bg-red-100 text-red-700' : u.role === 'Editor' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {u.role}
                          </span>
                                            </td>
                                            <td className="p-3">{formatDate(u.created_at)}</td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUserId(u.id);
                                                            setRoute('profile');
                                                        }}
                                                        className="px-3 py-1 border rounded-md"
                                                    >
                                                        Xem
                                                    </button>
                                                    <button
                                                        onClick={() => DeleteUsers()}
                                                        className="px-3 py-1 border rounded-md bg-red-50 text-red-600"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {users.length === 0 && (
                                <div className="p-6 text-center text-gray-500">Không có người dùng nào.</div>
                            )}
                        </div>
                    </main>
                ) : (
                    <main>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
                                <div className="flex flex-col items-center text-center">
                                    <img src={selectedUser.avatar} className="w-28 h-28 rounded-full object-cover mb-4"
                                         alt={selectedUser.name}/>
                                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                    <p className="text-sm text-gray-500">{selectedUser.email}</p>

                                    <div className="mt-3 flex gap-2">
                    <span
                        className={`px-3 py-1 rounded-full text-sm ${selectedUser.role === 'Admin' ? 'bg-red-100 text-red-700' : selectedUser.role === 'Editor' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {selectedUser.role}
                    </span>
                                    </div>

                                    <div className="mt-4 text-xs text-gray-500">Tham
                                        gia: {formatDate(selectedUser.created_at)}</div>

                                    <div className="mt-6 flex gap-2">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Chỉnh sửa
                                        </button>
                                        <button className="px-4 py-2 border rounded-md"
                                                onClick={() => setRoute('users')}>Quay lại
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-medium mb-4">Chi tiết</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b pb-2">
                                        <div className="text-gray-500">Tên</div>
                                        <div>{selectedUser.name}</div>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <div className="text-gray-500">Email</div>
                                        <div>{selectedUser.email}</div>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <div className="text-gray-500">Role</div>
                                        <div>{selectedUser.role}</div>
                                    </div>

                                    <div className="flex justify-between border-b pb-2">
                                        <div className="text-gray-500">Created at</div>
                                        <div>{formatDate(selectedUser.created_at)}</div>
                                    </div>

                                    <div className="pt-4">
                                        <h4 className="text-sm font-medium">Hoạt động gần đây</h4>
                                        <ul className="mt-2 text-xs text-gray-600 list-disc pl-5">
                                            <li>Đăng nhập lần cuối: {formatDate(new Date().toISOString())}</li>
                                            <li>Chỉnh sửa hồ sơ: —</li>
                                            <li>Đổi role: —</li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </main>
                )}

                <footer className="mt-8 text-center text-xs text-gray-400">UI mẫu — bạn có thể chỉnh sửa dữ liệu mẫu
                    hoặc tích hợp API của riêng bạn.
                </footer>
            </div>
        </div>
    );
}
