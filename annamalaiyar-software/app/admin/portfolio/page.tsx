"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function PortfolioAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchItems = async () => {
    const { data } = await axios.get("/api/admin/portfolio", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (id: string) => {
    if (confirm("Delete?")) {
      await axios.delete(`/api/admin/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gold-400">Portfolio</h1>
        <Link href="/admin/portfolio/new" className="bg-gold-500 text-black px-4 py-2 rounded flex items-center gap-2">
          <FiPlus /> Add New
        </Link>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.category}</p>
            </div>
            <div className="flex gap-4">
              <Link href={`/admin/portfolio/${item.id}/edit`} className="text-blue-400"><FiEdit2 /></Link>
              <button onClick={() => deleteItem(item.id)} className="text-red-400"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}