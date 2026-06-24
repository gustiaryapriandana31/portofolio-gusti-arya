"use client";
import React, { useState, useEffect } from "react";
import { LuPlus, LuPencil, LuTrash2, LuX, LuCheck } from "react-icons/lu";

export default function EducationTab({ showMsg }) {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [period, setPeriod] = useState("");

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/education");
      const data = await res.json();
      setEducationList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat data pendidikan:", error);
      showMsg("error", "Gagal memuat data pendidikan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setDegree("");
    setInstitution("");
    setPeriod("");
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setShowAddForm(false);
    setDegree(item.degree);
    setInstitution(item.institution);
    setPeriod(item.period);
  };

  const validateForm = () => {
    if (!degree || !institution || !period) {
      showMsg("error", "Semua kolom Gelar, Institusi, dan Periode wajib diisi.");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const method = editingId ? "PUT" : "POST";
    const bodyData = {
      id: editingId,
      degree,
      institution,
      period,
    };

    try {
      const res = await fetch("/api/education", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data.");

      showMsg("success", editingId ? "Data pendidikan berhasil diperbarui!" : "Data pendidikan berhasil ditambahkan!");
      resetForm();
      fetchEducation();
    } catch (err) {
      showMsg("error", err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pendidikan ini?")) return;

    try {
      const res = await fetch(`/api/education?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus data.");

      showMsg("success", "Data pendidikan berhasil dihapus!");
      fetchEducation();
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
            Kelola Pendidikan
          </h2>
          <p className="text-xs text-slate-400 font-poppins mt-1">
            Lakukan penambahan, modifikasi, atau penghapusan data pendidikan
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
                {editingId ? "Edit Data Pendidikan" : "Tambah Data Pendidikan Baru"}
              </h3>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block">Gelar / Jurusan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sarjana Sistem Informasi (S.Kom)"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-350 font-ibm-plex-mono uppercase tracking-wider block">Institusi</label>
                    <input
                      type="text"
                      placeholder="Contoh: Universitas Sriwijaya"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-350 font-ibm-plex-mono uppercase tracking-wider block">Periode</label>
                    <input
                      type="text"
                      placeholder="Contoh: 2021 – 2025"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>
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
              {educationList.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 rounded-lg border border-slate-800 bg-slate-900/30 flex flex-wrap justify-between items-start gap-4 hover:border-slate-800/80 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-white font-poppins text-base leading-snug">{edu.degree}</h4>
                    <p className="text-sm text-accent font-medium mt-1">{edu.institution}</p>
                    <p className="text-xs text-slate-450 font-ibm-plex-mono mt-1.5">{edu.period}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStartEdit(edu)}
                      className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                      <LuPencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(edu.id)}
                      className="p-2 rounded bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <LuTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {educationList.length === 0 && (
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
