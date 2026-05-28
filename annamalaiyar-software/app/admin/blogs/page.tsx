"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchBlogs = async () => {
    const { data } = await axios.get("/api/admin/blogs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id: string) => {
    if (confirm("Delete this blog?")) {
      await axios.delete(`/api/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gold-400">Blog Posts</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-gold-500 text-black px-4 py-2 rounded flex items-center gap-2"
        >
          <FiPlus /> New Post
        </Link>
      </div>
      <div className="grid gap-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="flex justify-between items-center bg-white/5 p-4 rounded-xl"
          >
            <div>
              <h3 className="font-semibold">{blog.title}</h3>
              <p className="text-sm text-gray-400">{blog.category}</p>
              <p className="text-xs text-gray-500">
                {blog.published ? "Published" : "Draft"}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href={`/admin/blogs/${blog.id}/edit`}
                className="text-blue-400"
              >
                <FiEdit2 />
              </Link>
              <button
                onClick={() => deleteBlog(blog.id)}
                className="text-red-400"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}