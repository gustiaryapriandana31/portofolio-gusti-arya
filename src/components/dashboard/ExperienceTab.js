"use client";
import React, { useState, useEffect } from "react";
import { LuPlus, LuPencil, LuTrash2, LuX } from "react-icons/lu";
import RichTextEditor from "./RichTextEditor";
import { sanitizeHtml } from "@/lib/sanitize";

export default function ExperienceTab({ showMsg }) {
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [period, setPeriod] = useState("");
  const [pointsHtml, setPointsHtml] = useState(""); // Stores rich HTML text instead of newline points

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/experience");
      const data = await res.json();
      
      // Sort experiences (BPS first)
      let list = Array.isArray(data) ? data : [];
      list.sort((a, b) => {
        const isABps = a.company?.toLowerCase().includes("bps") || a.company?.toLowerCase().includes("badan pusat statistik");
        const isBBps = b.company?.toLowerCase().includes("bps") || b.company?.toLowerCase().includes("badan pusat statistik");
        if (isABps && !isBBps) return -1;
        if (!isABps && isBBps) return 1;
        return 0;
      });

      setExperienceList(list);
    } catch (error) {
      console.error("Gagal memuat data pengalaman:", error);
      showMsg("error", "Gagal memuat data pengalaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setTitle("");
    setCompany("");
    setPeriod("");
    setPointsHtml("");
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setShowAddForm(false);
    setTitle(item.title);
    setCompany(item.company);
    setPeriod(item.period);
    
    // Compatibility check: Convert standard points array to HTML lists if necessary
    const firstPoint = item.points[0] || "";
    const isHtml = firstPoint.trim().startsWith("<") || firstPoint.includes("<p>") || firstPoint.includes("<li>") || firstPoint.includes("<strong>");
    
    if (isHtml) {
      setPointsHtml(firstPoint);
    } else {
      if (item.points.length > 0) {
        const convertedHtml = `<ul>${item.points.map(p => `<li>${p}</li>`).join("")}</ul>`;
        setPointsHtml(convertedHtml);
      } else {
        setPointsHtml("");
      }
    }
  };

  const validateForm = () => {
    if (!title || !company || !period || !pointsHtml || pointsHtml.trim() === "<br>" || pointsHtml.trim() === "") {
      showMsg("error", "Judul, perusahaan, periode, dan detail pekerjaan wajib diisi.");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    
    // Protect against XSS
    const sanitizedHtml = sanitizeHtml(pointsHtml);

    // Save as a single element array in database to match type String[]
    const ptsArray = [sanitizedHtml];

    const bodyData = {
      id: editingId,
      title,
      company,
      period,
      points: ptsArray,
    };

    try {
      const res = await fetch("/api/experience", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data.");

      showMsg("success", editingId ? "Data pengalaman berhasil diperbarui!" : "Data pengalaman baru berhasil ditambahkan!");
      resetForm();
      fetchExperience();
    } catch (err) {
      showMsg("error", err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pengalaman ini?")) return;

    try {
      const res = await fetch(`/api/experience?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus data.");

      showMsg("success", "Data pengalaman berhasil dihapus!");
      fetchExperience();
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
            Kelola Pengalaman Kerja
          </h2>
          <p className="text-xs text-slate-400 font-poppins mt-1">
            Lakukan penambahan, modifikasi, atau penghapusan data pengalaman profesional
          </p>
        </div>
        {!showAddForm && !editingId && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-slate-950 font-poppins font-bold text-xs hover:bg-accent-hover transition-all"
          >
            <LuPlus size={16} />
            <span>Tambah Data</span>
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
            <div className="glow-card p-6 md:p-8 border border-slate-800 relative">
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <LuX size={18} />
              </button>

              <h3 className="text-base font-bold font-poppins text-white mb-6 uppercase tracking-wider">
                {editingId ? "Edit Data Pengalaman" : "Tambah Data Pengalaman Baru"}
              </h3>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Judul Pekerjaan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Internship Web Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Nama Perusahaan / Instansi</label>
                    <input
                      type="text"
                      placeholder="Contoh: Badan Pusat Statistik"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Periode Kerja</label>
                    <input
                      type="text"
                      placeholder="Contoh: Desember 2025 – Sekarang"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Detail Pekerjaan & Tanggung Jawab</label>
                  <RichTextEditor
                    value={pointsHtml}
                    onChange={setPointsHtml}
                    placeholder="Masukkan list tugas, link project, format teks tebal/miring, dan blok kodingan teknis..."
                  />
                </div>

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
          )}

          {/* List data */}
          {!showAddForm && !editingId && (
            <div className="space-y-4">
              {experienceList.map((exp) => {
                const isBps = exp.company?.toLowerCase().includes("bps") || exp.company?.toLowerCase().includes("badan pusat statistik");
                
                // Compatibility layout check
                const firstPoint = exp.points[0] || "";
                const isHtml = firstPoint.trim().startsWith("<") || firstPoint.includes("<p>") || firstPoint.includes("<li>");

                return (
                  <div
                    key={exp.id}
                    className={`p-5 rounded-lg border border-slate-800 bg-slate-900/30 flex flex-wrap justify-between items-start gap-4 hover:border-slate-800 transition-colors ${
                      isBps ? "border-emerald-500/20 bg-emerald-950/5" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-[250px]">
                      <h4 className="font-bold text-white font-poppins text-base leading-snug">{exp.title}</h4>
                      <p className={`text-sm font-medium mt-1 ${isBps ? "text-emerald-400" : "text-accent"}`}>{exp.company}</p>
                      <p className="text-xs text-slate-500 font-ibm-plex-mono mt-1.5 mb-3">{exp.period}</p>
                      
                      {/* Render HTML content safely inside a sandbox CSS class wrapper */}
                      {isHtml ? (
                        <div 
                          className="rich-text-renderer text-xs text-slate-400 leading-relaxed max-w-full overflow-hidden" 
                          dangerouslySetInnerHTML={{ __html: firstPoint }}
                        />
                      ) : (
                        <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                          {exp.points.map((p, i) => (
                            <li key={i}>{p.substring(0, 80)}{p.length > 80 ? "..." : ""}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(exp)}
                        className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      >
                        <LuPencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-2 rounded bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {experienceList.length === 0 && (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                  Tidak ada data yang tersedia untuk kolom ini.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
