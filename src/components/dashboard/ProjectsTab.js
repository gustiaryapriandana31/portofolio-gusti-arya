"use client";
import React, { useState, useEffect } from "react";
import { LuPlus, LuPencil, LuTrash2, LuX, LuUpload, LuCheck, LuChevronDown } from "react-icons/lu";
import RichTextEditor from "./RichTextEditor";
import { sanitizeHtml } from "@/lib/sanitize";
import { compressImage } from "@/lib/imageCompressor";

export default function ProjectsTab({ showMsg }) {
  const [projectsList, setProjectsList] = useState([]);
  const [availableTechs, setAvailableTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [projName, setProjName] = useState("");
  const [projDuration, setProjDuration] = useState("");
  const [projDesc, setProjDesc] = useState(""); // rich HTML description
  const [projLink, setProjLink] = useState("");
  const [projPurpose, setProjPurpose] = useState("");
  const [selectedTechIds, setSelectedTechIds] = useState([]); // array of selected tech IDs
  const [projImages, setProjImages] = useState([]); // array of image paths
  
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, techRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/technologies")
      ]);
      const [projData, techData] = await Promise.all([
        projRes.json(),
        techRes.json()
      ]);
      setProjectsList(Array.isArray(projData) ? projData : []);
      setAvailableTechs(Array.isArray(techData) ? techData : []);
    } catch (error) {
      console.error("Gagal memuat data projek:", error);
      showMsg("error", "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setProjName("");
    setProjDuration("");
    setProjDesc("");
    setProjLink("");
    setProjPurpose("");
    setSelectedTechIds([]);
    setProjImages([]);
    setShowDropdown(false);
  };

  const handleStartEdit = (item) => {
    resetForm();
    setEditingId(item.id);
    setShowAddForm(false);
    setProjName(item.name);
    setProjDuration(item.duration);
    setProjDesc(item.description || "");
    setProjLink(item.link || "");
    setProjPurpose(item.purpose);
    setSelectedTechIds(item.techIds || []);
    setProjImages(item.images || []);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i]);
        formData.append("files", compressed);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah gambar.");

      setProjImages((prev) => [...prev, ...data.paths]);
      showMsg("success", `Sukses mengunggah ${data.paths.length} gambar.`);
    } catch (err) {
      showMsg("error", err.message);
    } finally {
      setUploadingFiles(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeUploadedImage = (index) => {
    setProjImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleTech = (techId) => {
    setSelectedTechIds((prev) => 
      prev.includes(techId) ? prev.filter(id => id !== techId) : [...prev, techId]
    );
  };

  const validateForm = () => {
    if (!projName || !projDuration || !projDesc || projDesc.trim() === "<br>" || projDesc.trim() === "" || !projPurpose || selectedTechIds.length === 0) {
      showMsg("error", "Nama proyek, durasi, deskripsi, tujuan, dan minimal 1 teknologi wajib diisi.");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    
    const sanitizedDesc = sanitizeHtml(projDesc);

    const bodyData = {
      id: editingId,
      name: projName,
      duration: projDuration,
      description: sanitizedDesc,
      link: projLink || null,
      purpose: projPurpose,
      images: projImages,
      techIds: selectedTechIds, // new field IDs array
    };

    try {
      const res = await fetch("/api/projects", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data.");

      showMsg("success", editingId ? "Data proyek berhasil diperbarui!" : "Data proyek baru berhasil ditambahkan!");
      resetForm();
      fetchData();
    } catch (err) {
      showMsg("error", err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data proyek ini?")) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus data.");

      showMsg("success", "Data proyek berhasil dihapus!");
      fetchData();
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
            Kelola Projects
          </h2>
          <p className="text-xs text-slate-400 font-poppins mt-1">
            Lakukan penambahan, modifikasi, atau penghapusan data proyek
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
                {editingId ? "Edit Data Proyek" : "Tambah Data Proyek Baru"}
              </h3>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Nama Proyek</label>
                    <input
                      type="text"
                      placeholder="Contoh: PINDANG OI (Portal Integrasi Data...)"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Durasi Pengerjaan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Desember 2025 - Sekarang"
                      value={projDuration}
                      onChange={(e) => setProjDuration(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Link Proyek / Repositori GitHub (Opsional)</label>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={projLink}
                      onChange={(e) => setProjLink(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Tujuan Pembuatan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Memperlancar pelaporan kinerja harian di lingkungan BPS."
                      value={projPurpose}
                      onChange={(e) => setProjPurpose(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>

                  {/* Multi-Select Tech Stack Dropdown Selector */}
                  <div className="md:col-span-2 space-y-1.5 relative">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Teknologi / Tech Stack (Pilih Beberapa)</label>
                    
                    {/* Dropdown trigger */}
                    <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 flex justify-between items-center hover:border-slate-700 transition-all text-left"
                    >
                      <span>
                        {selectedTechIds.length === 0 
                          ? "Pilih Teknologi..." 
                          : `${selectedTechIds.length} Teknologi Terpilih`}
                      </span>
                      <LuChevronDown size={16} className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {/* Popover selector dropdown list */}
                    {showDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl max-h-60 overflow-y-auto p-3 z-45 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableTechs.map((tech) => {
                          const isSelected = selectedTechIds.includes(tech.id);
                          return (
                            <button
                              key={tech.id}
                              type="button"
                              onClick={() => handleToggleTech(tech.id)}
                              className={`flex items-center gap-2 p-2 rounded border text-xs text-left transition-all ${
                                isSelected 
                                  ? "bg-accent/10 border-accent text-accent font-semibold" 
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750 hover:bg-slate-900/60"
                              }`}
                            >
                              <div className="w-5 h-5 rounded border border-slate-800 bg-slate-950 flex items-center justify-center">
                                {tech.logo.startsWith("devicon-") ? (
                                  <i className={`${tech.logo} text-xs`}></i>
                                ) : (
                                  <img src={tech.logo} alt={tech.name} className="w-3.5 h-3.5 object-contain" />
                                )}
                              </div>
                              <span className="truncate flex-1">{tech.name}</span>
                              {isSelected && <LuCheck size={12} className="shrink-0" />}
                            </button>
                          );
                        })}
                        {availableTechs.length === 0 && (
                          <p className="col-span-full text-center text-slate-500 py-4">Belum ada data teknologi. Silakan tambahkan di menu &quot;Tech Stack&quot; terlebih dahulu.</p>
                        )}
                      </div>
                    )}

                    {/* Selected Badges Preview */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTechIds.map((id) => {
                        const tech = availableTechs.find(t => t.id === id);
                        if (!tech) return null;
                        return (
                          <div 
                            key={id}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200"
                          >
                            {tech.logo.startsWith("devicon-") ? (
                              <i className={`${tech.logo} text-xs`}></i>
                            ) : (
                              <img src={tech.logo} alt={tech.name} className="w-3.5 h-3.5 object-contain" />
                            )}
                            <span>{tech.name}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleTech(id)}
                              className="text-red-400 hover:text-white ml-0.5"
                            >
                              <LuX size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Deskripsi Proyek</label>
                    <RichTextEditor
                      value={projDesc}
                      onChange={setProjDesc}
                      placeholder="Tuliskan spesifikasi, link demo, formatting, dan kodingan contoh untuk proyek ini..."
                    />
                  </div>

                  {/* Screenshots Uploader */}
                  <div className="md:col-span-2 space-y-3 pt-2">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Foto / Screenshots Proyek (Multiple)</label>
                    <div className="flex flex-wrap gap-4 items-center">
                      <label className="flex flex-col items-center justify-center w-24 h-24 rounded-lg border-2 border-dashed border-slate-800 hover:border-accent cursor-pointer transition-colors text-slate-500 hover:text-accent bg-slate-950/20">
                        <LuUpload size={20} className="mb-1" />
                        <span className="text-[10px] font-medium">Upload File</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploadingFiles}
                        />
                      </label>

                      {projImages.map((path, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                          <img src={path} alt="Preview" className="object-cover w-full h-full" />
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-950/90 border border-red-800 rounded-full text-red-400 hover:text-white"
                          >
                            <LuX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    {uploadingFiles && <p className="text-[10px] text-accent animate-pulse font-ibm-plex-mono">Mengunggah file...</p>}
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
                    disabled={submitLoading || uploadingFiles}
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
              {projectsList.map((proj) => {
                const firstPoint = proj.description || "";
                const isHtml = firstPoint.trim().startsWith("<") || firstPoint.includes("<p>") || firstPoint.includes("<li>");

                return (
                  <div
                    key={proj.id}
                    className="p-5 rounded-lg border border-slate-800 bg-slate-900/30 flex flex-wrap justify-between items-start gap-4 hover:border-slate-800 transition-colors"
                  >
                    <div className="flex-1 min-w-[250px] overflow-hidden">
                      <h4 className="font-bold text-white font-poppins text-base leading-snug">{proj.name}</h4>
                      <p className="text-xs text-slate-500 font-ibm-plex-mono mt-1 mb-2">{proj.duration}</p>
                      
                      {isHtml ? (
                        <div 
                          className="rich-text-renderer text-xs text-slate-400 mb-3 max-w-full overflow-hidden" 
                          dangerouslySetInnerHTML={{ __html: firstPoint }}
                        />
                      ) : (
                        <p className="text-xs text-slate-400 mb-3">{firstPoint.substring(0, 155)}{firstPoint.length > 155 ? "..." : ""}</p>
                      )}
                      
                      {/* Badges preview */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {proj.techObjects && proj.techObjects.length > 0 ? (
                          proj.techObjects.map((tech) => (
                            <span 
                              key={tech.id} 
                              className="inline-flex items-center gap-1 text-[10px] font-ibm-plex-mono border border-slate-800 px-2 py-0.5 rounded text-slate-350 bg-slate-950/40"
                            >
                              {tech.logo.startsWith("devicon-") ? (
                                <i className={tech.logo}></i>
                              ) : (
                                <img src={tech.logo} alt={tech.name} className="w-3 h-3 object-contain" />
                              )}
                              <span>{tech.name}</span>
                            </span>
                          ))
                        ) : (
                          proj.technologies.map((t, i) => (
                            <span key={i} className="text-[10px] font-ibm-plex-mono border border-slate-800/80 px-2 py-0.5 rounded text-slate-400 bg-slate-950/40">{t}</span>
                          ))
                        )}
                      </div>

                      {proj.images && proj.images.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {proj.images.map((img, i) => (
                            <img key={i} src={img} alt="project-screenshot" className="w-12 h-12 object-cover rounded border border-slate-800 shrink-0" />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(proj)}
                        className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      >
                        <LuPencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-2 rounded bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {projectsList.length === 0 && (
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
