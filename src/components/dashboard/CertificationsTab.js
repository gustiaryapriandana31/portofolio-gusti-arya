"use client";
import React, { useState, useEffect } from "react";
import { LuPlus, LuPencil, LuTrash2, LuX, LuUpload, LuEye, LuExternalLink } from "react-icons/lu";
import { compressImage } from "@/lib/imageCompressor";

export default function CertificationsTab({ showMsg }) {
  const [certsData, setCertsData] = useState({ certifications: [], achievements: [] });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [certType, setCertType] = useState("certification"); // "certification" | "achievement"
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState(""); // for cert
  const [certPeriod, setCertPeriod] = useState("");
  const [certLink, setCertLink] = useState(""); // for cert
  const [certImage, setCertImage] = useState(""); // for cert single image
  const [certEvent, setCertEvent] = useState(""); // for achievement
  const [certDesc, setCertDesc] = useState(""); // for achievement
  const [certImages, setCertImages] = useState([]); // array of strings (paths)
  
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState(null);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/certifications");
      const data = await res.json();
      setCertsData({
        certifications: Array.isArray(data.certifications) ? data.certifications : [],
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
      });
    } catch (error) {
      console.error("Gagal memuat data sertifikasi:", error);
      showMsg("error", "Gagal memuat data sertifikasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setCertTitle("");
    setCertIssuer("");
    setCertPeriod("");
    setCertLink("");
    setCertImage("");
    setCertEvent("");
    setCertDesc("");
    setCertImages([]);
  };

  const handleStartEdit = (item, type) => {
    resetForm();
    setEditingId(item.id);
    setShowAddForm(false);
    setCertType(type);
    setCertTitle(item.title);
    setCertPeriod(item.period);
    if (type === "certification") {
      setCertIssuer(item.issuer);
      setCertLink(item.link);
      setCertImage(item.image || "");
    } else if (type === "achievement") {
      setCertEvent(item.event);
      setCertDesc(item.description);
      setCertImages(item.images || []);
      setCertLink(item.link || "");
    }
  };

  // Image Upload handler
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

      setCertImages((prev) => [...prev, ...data.paths]);
      showMsg("success", `Sukses mengunggah ${data.paths.length} gambar.`);
    } catch (err) {
      showMsg("error", err.message);
    } finally {
      setUploadingFiles(false);
      e.target.value = ""; // Reset input
    }
  };

  const removeUploadedImage = (index) => {
    setCertImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (certType === "certification") {
      if (!certTitle || !certIssuer || !certPeriod) {
        showMsg("error", "Judul sertifikasi, penerbit, dan periode wajib diisi.");
        return false;
      }
    } else if (certType === "achievement") {
      if (!certTitle || !certEvent || !certPeriod || !certDesc) {
        showMsg("error", "Judul prestasi, nama event, periode, dan deskripsi wajib diisi.");
        return false;
      }
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    let bodyData = {
      id: editingId,
      title: certTitle,
      period: certPeriod,
    };

    if (certType === "certification") {
      bodyData = {
        ...bodyData,
        issuer: certIssuer,
        link: certLink || "#",
        image: certImage || null,
      };
    } else if (certType === "achievement") {
      bodyData = {
        ...bodyData,
        event: certEvent,
        description: certDesc,
        images: certImages,
        link: certLink || null,
      };
    }

    try {
      const res = await fetch(`/api/certifications?type=${certType}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data.");

      showMsg("success", editingId ? "Data berhasil diperbarui!" : "Data baru berhasil ditambahkan!");
      resetForm();
      fetchCerts();
    } catch (err) {
      showMsg("error", err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(`/api/certifications?type=${type}&id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus data.");

      showMsg("success", "Data berhasil dihapus!");
      fetchCerts();
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
            Kelola Sertifikasi & Prestasi
          </h2>
          <p className="text-xs text-slate-400 font-poppins mt-1">
            Lakukan penambahan, modifikasi, atau penghapusan data sertifikat & prestasi
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
                {editingId ? "Edit Data" : "Tambah Data Baru"}
              </h3>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Tipe Data</label>
                  <div className="flex gap-4">
                    {[
                      { id: "certification", label: "Lisensi & Sertifikasi" },
                      { id: "achievement", label: "Prestasi / Awards" },
                    ].map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-sm text-slate-350 cursor-pointer">
                        <input
                          type="radio"
                          name="cert_type_radio"
                          checked={certType === s.id}
                          onChange={() => setCertType(s.id)}
                          className="accent-accent"
                          disabled={!!editingId}
                        />
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Judul / Nama Sertifikat / Nama Penghargaan</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama penghargaan/sertifikat"
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>

                  {certType === "certification" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Penerbit (Issuer)</label>
                        <input
                          type="text"
                          placeholder="Contoh: BNSP / Dicoding"
                          value={certIssuer}
                          onChange={(e) => setCertIssuer(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Link Kredensial</label>
                        <input
                          type="text"
                          placeholder="Contoh: https://..."
                          value={certLink}
                          onChange={(e) => setCertLink(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-3 pt-2">
                        <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Foto / Screenshot Sertifikat (Opsional)</label>
                        <div className="flex flex-wrap gap-4 items-center">
                          {!certImage ? (
                            <label className="flex flex-col items-center justify-center w-24 h-24 rounded-lg border-2 border-dashed border-slate-800 hover:border-accent cursor-pointer transition-colors text-slate-500 hover:text-accent bg-slate-950/20">
                              <LuUpload size={20} className="mb-1" />
                              <span className="text-[10px] font-medium">Upload File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const files = e.target.files;
                                  if (!files || files.length === 0) return;
                                  setUploadingFiles(true);
                                  try {
                                    const compressed = await compressImage(files[0]);
                                    const formData = new FormData();
                                    formData.append("files", compressed);
                                    
                                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                                    const data = await res.json();
                                    if (!res.ok) throw new Error(data.error || "Gagal upload.");
                                    setCertImage(data.paths[0]);
                                    showMsg("success", "Sukses mengunggah gambar sertifikat.");
                                  } catch (err) {
                                    showMsg("error", err.message);
                                  } finally {
                                    setUploadingFiles(false);
                                    e.target.value = "";
                                  }
                                }}
                                disabled={uploadingFiles}
                              />
                            </label>
                          ) : (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                              <img src={certImage} alt="Preview" className="object-cover w-full h-full" />
                              <button
                                type="button"
                                onClick={() => setCertImage("")}
                                className="absolute top-1 right-1 p-1 bg-red-950/90 border border-red-800 rounded-full text-red-450 hover:text-white"
                              >
                                <LuX size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                        {uploadingFiles && <p className="text-[10px] text-accent animate-pulse font-ibm-plex-mono">Mengunggah file...</p>}
                      </div>
                    </>
                  )}

                  {certType === "achievement" && (
                    <>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Nama Event / Penyelenggara</label>
                        <input
                          type="text"
                          placeholder="Contoh: IT Festival MI Polsri 2024"
                          value={certEvent}
                          onChange={(e) => setCertEvent(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Link Sertifikat / Kredensial (Opsional)</label>
                        <input
                          type="text"
                          placeholder="Contoh: https://drive.google.com/..."
                          value={certLink}
                          onChange={(e) => setCertLink(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Periode / Waktu</label>
                    <input
                      type="text"
                      placeholder="Contoh: Oktober 2024"
                      value={certPeriod}
                      onChange={(e) => setCertPeriod(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>

                  {certType === "achievement" && (
                    <>
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Deskripsi / Detail Penghargaan</label>
                        <textarea
                          rows={3}
                          placeholder="Tuliskan bagaimana cara Anda memenangkan event tersebut..."
                          value={certDesc}
                          onChange={(e) => setCertDesc(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                        />
                      </div>

                      {/* Images Uploader */}
                      <div className="md:col-span-2 space-y-3 pt-2">
                        <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Foto Dokumentasi (Mendukung Banyak Foto)</label>
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

                          {certImages.map((path, idx) => (
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
                    </>
                  )}
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
            <div className="space-y-8">
              
              {/* Licenses & Certifications */}
              <div className="space-y-4">
                <h3 className="text-sm font-ibm-plex-mono text-accent uppercase tracking-wider font-bold">Sertifikat Akademik</h3>
                {certsData.certifications.map((c) => (
                  <div key={c.id} className="p-4 rounded-lg border border-slate-800 bg-slate-900/15 flex justify-between items-center gap-4">
                    <div>
                      <span className="font-semibold text-white text-sm block leading-snug">{c.title}</span>
                      <span className="text-xs text-slate-400 block mt-1">{c.issuer} ({c.period})</span>
                      
                      {/* Action Links & Previews */}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs font-ibm-plex-mono">
                        {c.link && c.link !== "#" && (
                          <a
                            href={c.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline flex items-center gap-1"
                          >
                            <span>Link Kredensial</span>
                            <LuExternalLink size={11} />
                          </a>
                        )}
                        {c.image && (
                          <button
                            type="button"
                            onClick={() => setSelectedPreviewImage(c.image)}
                            className="text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <span>Lihat Sertifikat</span>
                            <LuEye size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(c, "certification")}
                        className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-450 hover:text-white transition-colors"
                      >
                        <LuPencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, "certification")}
                        className="p-2 rounded bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <div className="space-y-4">
                <h3 className="text-sm font-ibm-plex-mono text-accent uppercase tracking-wider font-bold">Prestasi (Achievements)</h3>
                {certsData.achievements.map((ach) => (
                  <div key={ach.id} className="p-5 rounded-lg border border-slate-800 bg-slate-900/15 flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <h4 className="font-bold text-white text-sm leading-snug">{ach.title}</h4>
                      <p className="text-xs text-accent mt-0.5">{ach.event} ({ach.period})</p>
                      <p className="text-xs text-slate-400 mt-2">{ach.description.substring(0, 100)}...</p>

                      {/* Action Links & Previews */}
                      <div className="flex flex-wrap gap-3 mt-3 text-xs font-ibm-plex-mono">
                        {ach.link && ach.link !== "#" && (
                          <a
                            href={ach.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline flex items-center gap-1"
                          >
                            <span>Link Kredensial / Sertifikat</span>
                            <LuExternalLink size={11} />
                          </a>
                        )}
                      </div>

                      {ach.images && ach.images.length > 0 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                          {ach.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="doc"
                              className="w-10 h-10 object-cover rounded border border-slate-800 shrink-0 cursor-pointer hover:border-accent transition-colors"
                              onClick={() => setSelectedPreviewImage(img)}
                              title="Klik untuk memperbesar"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(ach, "achievement")}
                        className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      >
                        <LuPencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(ach.id, "achievement")}
                        className="p-2 rounded bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {certsData.certifications.length === 0 && certsData.achievements.length === 0 && (
                <div className="text-center py-16 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                  Tidak ada data yang tersedia untuk kolom ini.
                </div>
              )}

            </div>
          )}
        </>
      )}
      {/* Image Preview Modal */}
      {selectedPreviewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-lg p-2 overflow-hidden shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 border border-slate-800 text-slate-450 hover:text-white transition-all z-10"
              title="Tutup"
            >
              <LuX size={16} />
            </button>
            <img
              src={selectedPreviewImage}
              alt="Pratinjau Sertifikat"
              className="max-w-full max-h-[85vh] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
