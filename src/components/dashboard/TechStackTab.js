"use client";
import React, { useState, useEffect } from "react";
import { LuPlus, LuPencil, LuTrash2, LuX, LuInfo } from "react-icons/lu";

export default function TechStackTab({ showMsg }) {
  const [techList, setTechList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(""); // Devicon class (e.g., 'devicon-react-original colored') or image path
  const [category, setCategory] = useState("language"); // 'language' | 'framework' | 'library' | 'tool' | 'ai' | 'other'

  const fetchTechs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/technologies");
      const data = await res.json();
      setTechList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat data tech stack:", error);
      showMsg("error", "Gagal memuat data teknologi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechs();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setName("");
    setLogo("");
    setCategory("language");
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setShowAddForm(false);
    setName(item.name);
    setLogo(item.logo);
    setCategory(item.category);
  };

  const validateForm = () => {
    if (!name || !logo || !category) {
      showMsg("error", "Nama, logo (Devicon class/URL), dan kategori wajib diisi.");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const bodyData = {
      id: editingId,
      name,
      logo,
      category,
    };

    try {
      const res = await fetch("/api/technologies", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data.");

      showMsg("success", editingId ? "Data teknologi berhasil diperbarui!" : "Data teknologi baru berhasil ditambahkan!");
      resetForm();
      fetchTechs();
    } catch (err) {
      showMsg("error", err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus teknologi ini?")) return;

    try {
      const res = await fetch(`/api/technologies?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus data.");

      showMsg("success", "Data teknologi berhasil dihapus!");
      fetchTechs();
    } catch (err) {
      showMsg("error", err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header Controls */}
      <div className="flex justify-between items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-poppins text-white uppercase tracking-wide">
            Kelola Tech Stack
          </h2>
          <p className="text-xs text-slate-400 font-poppins mt-1">
            Lakukan manajemen daftar teknologi pemrograman, framework, tools, dll.
          </p>
        </div>
        {!showAddForm && !editingId && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-slate-950 font-poppins font-bold text-xs hover:bg-accent-hover transition-all"
          >
            <LuPlus size={16} />
            <span>Tambah Teknologi</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-slate-900 rounded-lg"></div>
          <div className="h-20 bg-slate-900 rounded-lg"></div>
        </div>
      ) : (
        <>
          {/* Form Create / Edit */}
          {(showAddForm || editingId) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Section */}
              <div className="lg:col-span-2 glow-card p-6 md:p-8 border border-slate-800 relative">
                <button
                  onClick={resetForm}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <LuX size={18} />
                </button>

                <h3 className="text-base font-bold font-poppins text-white mb-6 uppercase tracking-wider">
                  {editingId ? "Edit Teknologi" : "Tambah Teknologi Baru"}
                </h3>

                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Nama Teknologi</label>
                      <input
                        type="text"
                        placeholder="Contoh: React, Supabase, Tailwind CSS"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Kategori</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-accent"
                      >
                        <option value="language">Bahasa Pemrograman</option>
                        <option value="framework">Framework</option>
                        <option value="library">Library / Dependency</option>
                        <option value="tool">Development Tool</option>
                        <option value="ai">AI / Machine Learning Tool</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Ikon Class (Devicon) / Image URL</label>
                      <input
                        type="text"
                        placeholder="Contoh: devicon-react-original colored (atau link gambar /uploads/...)"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-150 placeholder-slate-500 focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  {/* Icon Preview */}
                  {logo && (
                    <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800 flex items-center gap-3 w-fit">
                      <span className="text-xs text-slate-400 font-ibm-plex-mono">Preview Ikon:</span>
                      <div className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded border border-slate-800">
                        {logo.startsWith("devicon-") ? (
                          <i className={`${logo} text-xl`}></i>
                        ) : (
                          <img src={logo} alt="Preview" className="w-6 h-6 object-contain" />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors text-sm font-semibold font-poppins"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="px-5 py-2.5 rounded-lg bg-accent text-slate-950 hover:bg-accent-hover disabled:opacity-50 disabled:pointer-events-none transition-colors text-sm font-bold font-poppins"
                    >
                      {submitLoading ? "Menyimpan..." : "Simpan Data"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Info & Helper Reference */}
              <div className="lg:col-span-1 p-5 rounded-lg border border-slate-800 bg-slate-950/40 space-y-4 text-xs leading-relaxed text-slate-350">
                <h4 className="font-bold text-white flex items-center gap-1 text-sm uppercase tracking-wide">
                  <LuInfo size={14} className="text-accent" />
                  <span>Devicon Guide</span>
                </h4>
                <p>Website ini terintegrasi dengan **Devicon**. Anda cukup menyalin kode class ikon yang diinginkan dari Devicon, maka ikon vektor akan tampil secara tajam.</p>
                
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <p className="font-bold text-slate-200">Contoh Class Populer:</p>
                  <ul className="space-y-1.5 font-ibm-plex-mono bg-slate-900/60 p-2.5 rounded border border-slate-800/50">
                    <li><strong className="text-accent">JS:</strong> devicon-javascript-plain colored</li>
                    <li><strong className="text-accent">React:</strong> devicon-react-original colored</li>
                    <li><strong className="text-accent">Next.js:</strong> devicon-nextjs-plain</li>
                    <li><strong className="text-accent">Laravel:</strong> devicon-laravel-original colored</li>
                    <li><strong className="text-accent">Supabase:</strong> devicon-supabase-plain colored</li>
                    <li><strong className="text-accent">Tailwind:</strong> devicon-tailwindcss-plain colored</li>
                    <li><strong className="text-accent">MySQL:</strong> devicon-mysql-original colored</li>
                    <li><strong className="text-accent">Python:</strong> devicon-python-plain colored</li>
                  </ul>
                </div>
                <p className="text-[10px] text-slate-500">Kunjungi [devicon.dev](https://devicon.dev) untuk mencari ratusan class ikon pemrograman lainnya.</p>
              </div>

            </div>
          )}

          {/* List data */}
          {!showAddForm && !editingId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {techList.map((tech) => (
                <div
                  key={tech.id}
                  className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 flex justify-between items-center gap-3 hover:border-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded border border-slate-800 bg-slate-950/40 flex items-center justify-center text-slate-100 shrink-0">
                      {tech.logo.startsWith("devicon-") ? (
                        <i className={`${tech.logo} text-xl`}></i>
                      ) : (
                        <img src={tech.logo} alt={tech.name} className="w-6 h-6 object-contain" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate leading-snug">{tech.name}</h4>
                      <span className="text-[9px] font-ibm-plex-mono text-slate-500 uppercase tracking-wider block mt-0.5">{tech.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleStartEdit(tech)}
                      className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                      <LuPencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(tech.id)}
                      className="p-1.5 rounded bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <LuTrash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {techList.length === 0 && (
                <div className="col-span-full text-center py-16 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                  Belum ada data teknologi yang dibuat. Mulai dengan menekan tombol "Tambah Teknologi" di atas.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
