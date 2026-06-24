"use client";
import React, { useState, useEffect } from "react";
import { LuPlus, LuPencil, LuTrash2, LuX } from "react-icons/lu";

export default function SkillsTab({ showMsg }) {
  const [skillsData, setSkillsData] = useState({ skills: [], softSkills: [], hobbies: [] });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [skillType, setSkillType] = useState("skill"); // "skill" | "softskill" | "hobby"
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState(80);
  const [skillLabel, setSkillLabel] = useState("Menengah (Intermediate)");
  const [skillCategory, setSkillCategory] = useState("hard");
  const [skillIcon, setSkillIcon] = useState(""); // for hobbies

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkillsData({
        skills: Array.isArray(data.skills) ? data.skills : [],
        softSkills: Array.isArray(data.softSkills) ? data.softSkills : [],
        hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
      });
    } catch (error) {
      console.error("Gagal memuat data skills:", error);
      showMsg("error", "Gagal memuat data skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setSkillName("");
    setSkillLevel(80);
    setSkillLabel("Menengah (Intermediate)");
    setSkillCategory("hard");
    setSkillIcon("");
  };

  const handleStartEdit = (item, type) => {
    resetForm();
    setEditingId(item.id);
    setShowAddForm(false);
    setSkillType(type);
    setSkillName(item.name);
    if (type === "skill") {
      setSkillLevel(item.level);
      setSkillLabel(item.label);
      setSkillCategory(item.category);
    } else if (type === "hobby") {
      setSkillIcon(item.icon);
    }
  };

  const validateForm = () => {
    if (skillType === "skill") {
      if (!skillName || !skillLabel) {
        showMsg("error", "Nama skill dan Label kemahiran wajib diisi.");
        return false;
      }
    } else if (skillType === "softskill") {
      if (!skillName) {
        showMsg("error", "Nama soft skill wajib diisi.");
        return false;
      }
    } else if (skillType === "hobby") {
      if (!skillName || !skillIcon) {
        showMsg("error", "Nama hobi dan icon emoji wajib diisi.");
        return false;
      }
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    let bodyData = { id: editingId, name: skillName };

    if (skillType === "skill") {
      bodyData = {
        ...bodyData,
        level: Number(skillLevel),
        label: skillLabel,
        category: skillCategory,
      };
    } else if (skillType === "hobby") {
      bodyData = {
        ...bodyData,
        icon: skillIcon,
      };
    }

    try {
      const res = await fetch(`/api/skills?type=${skillType}`, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data.");

      showMsg("success", editingId ? "Data skill berhasil diperbarui!" : "Data skill berhasil ditambahkan!");
      resetForm();
      fetchSkills();
    } catch (err) {
      showMsg("error", err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(`/api/skills?type=${type}&id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus data.");

      showMsg("success", "Data berhasil dihapus!");
      fetchSkills();
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
            Kelola Skills & Interests
          </h2>
          <p className="text-xs text-slate-400 font-poppins mt-1">
            Lakukan penambahan, modifikasi, atau penghapusan data skills
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
                      { id: "skill", label: "Hard/Language Skill" },
                      { id: "softskill", label: "Soft Skill" },
                      { id: "hobby", label: "Hobi / Minat" },
                    ].map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-sm text-slate-350 cursor-pointer">
                        <input
                          type="radio"
                          name="skill_type_radio"
                          checked={skillType === s.id}
                          onChange={() => setSkillType(s.id)}
                          className="accent-accent"
                          disabled={!!editingId}
                        />
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Nama</label>
                    <input
                      type="text"
                      placeholder={skillType === "hobby" ? "Contoh: Catur" : "Contoh: Javascript"}
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                    />
                  </div>

                  {skillType === "skill" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Tingkatan Kemahiran (0 - 100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={skillLevel}
                          onChange={(e) => setSkillLevel(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Kategori</label>
                        <select
                          value={skillCategory}
                          onChange={(e) => setSkillCategory(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-accent"
                        >
                          <option value="hard">Hard Skill / Tech Stack</option>
                          <option value="language">Bahasa (Language)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Label Tingkatan (e.g. Mahir (Expert), Intermediate)</label>
                        <input
                          type="text"
                          placeholder="Contoh: Mahir (Expert)"
                          value={skillLabel}
                          onChange={(e) => setSkillLabel(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                        />
                      </div>
                    </>
                  )}

                  {skillType === "hobby" && (
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-ibm-plex-mono uppercase tracking-wider block font-bold">Emoji / Icon Hobi</label>
                      <input
                        type="text"
                        placeholder="Contoh: ♟️ atau 🧩"
                        value={skillIcon}
                        onChange={(e) => setSkillIcon(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent"
                      />
                    </div>
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
                    disabled={submitLoading}
                    className="px-5 py-2.5 rounded-lg bg-accent text-slate-950 hover:bg-accent-hover disabled:opacity-50 disabled:pointer-events-none transition-colors text-sm font-bold font-poppins"
                  >
                    {submitLoading ? "Menyimpan..." : "Simpan Data"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lists */}
          {!showAddForm && !editingId && (
            <div className="space-y-8">
              
              {/* Hard/Language Skills */}
              <div className="space-y-4">
                <h3 className="text-sm font-ibm-plex-mono text-accent uppercase tracking-wider font-bold">Hard Skills & Language Skills</h3>
                {skillsData.skills.map((s) => (
                  <div key={s.id} className="p-4 rounded-lg border border-slate-800 bg-slate-900/15 flex justify-between items-center gap-4">
                    <div>
                      <span className="font-semibold text-white text-sm">{s.name}</span>
                      <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 ml-2 font-ibm-plex-mono">{s.label} ({s.level}%)</span>
                      <span className="text-[10px] text-slate-550 block mt-1 uppercase font-ibm-plex-mono">{s.category} skill</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(s, "skill")}
                        className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                      >
                        <LuPencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, "skill")}
                        className="p-2 rounded bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Soft Skills */}
              <div className="space-y-4">
                <h3 className="text-sm font-ibm-plex-mono text-accent uppercase tracking-wider font-bold">Soft Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skillsData.softSkills.map((s) => (
                    <div key={s.id} className="p-4 rounded-lg border border-slate-800 bg-slate-900/15 flex justify-between items-center gap-4">
                      <span className="font-medium text-slate-200 text-sm">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(s, "softskill")}
                          className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          <LuPencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, "softskill")}
                          className="p-2 rounded bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hobbies */}
              <div className="space-y-4">
                <h3 className="text-sm font-ibm-plex-mono text-accent uppercase tracking-wider font-bold">Hobbies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skillsData.hobbies.map((h) => (
                    <div key={h.id} className="p-4 rounded-lg border border-slate-800 bg-slate-900/15 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{h.icon}</span>
                        <span className="font-medium text-slate-200 text-sm">{h.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(h, "hobby")}
                          className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          <LuPencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(h.id, "hobby")}
                          className="p-2 rounded bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {skillsData.skills.length === 0 && skillsData.softSkills.length === 0 && skillsData.hobbies.length === 0 && (
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
