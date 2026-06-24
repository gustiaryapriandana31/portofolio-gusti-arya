"use client";
import { useState, useEffect } from "react";
import { LuStar, LuThumbsUp, LuHeart, LuMessageSquare, LuCircleAlert } from "react-icons/lu";

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch comments on mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/feedback");
      if (!res.ok) throw new Error("Gagal mengambil data testimoni.");
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, rating }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengirim ulasan.");
      }

      setSuccess(true);
      setName("");
      setComment("");
      setRating(5);
      
      // Refresh feedbacks
      await fetchFeedbacks();
      
      // Auto clear success state
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Gagal menyukai.");

      const updated = await res.json();
      
      // Local state update
      setFeedbacks(prev => 
        prev.map(item => item.id === id ? { ...item, likes: updated.likes } : item)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="feedback" className="py-24 border-t border-slate-900 bg-slate-950/20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-xs font-ibm-plex-mono text-neon-green uppercase tracking-widest mb-3">Interaksi & Dukungan</h2>
          <h3 className="text-3xl md:text-4xl font-audiowide font-bold text-white">
            SUPPORT & FEEDBACK
          </h3>
          <div className="w-16 h-1 bg-neon-green mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Input Form */}
          <div className="lg:col-span-5">
            <div className="glow-card p-6 md:p-8 sticky top-28">
              <h4 className="flex items-center gap-2 text-lg md:text-xl font-poppins font-bold text-white mb-6">
                <LuHeart size={20} className="text-neon-green fill-neon-green/20" />
                <span>Berikan Dukungan</span>
              </h4>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-ibm-plex-mono text-slate-400 uppercase">
                    Nama / Instansi
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-neon-green text-sm transition-all duration-300"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <span className="block text-xs font-ibm-plex-mono text-slate-400 uppercase">
                    Rating Portofolio
                  </span>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-slate-650 hover:scale-110 transition-transform duration-200"
                      >
                        <LuStar
                          size={24}
                          className={`${
                            star <= (hoverRating || rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-700"
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label htmlFor="comment" className="block text-xs font-ibm-plex-mono text-slate-400 uppercase">
                    Komentar / Dukungan
                  </label>
                  <textarea
                    id="comment"
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tulis pesan dukungan atau kritik konstruktif..."
                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-neon-green text-sm resize-none transition-all duration-300"
                  />
                </div>

                {/* Status Messages */}
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-poppins bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                    <LuCircleAlert size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 text-neon-green text-xs font-poppins bg-neon-green/10 border border-neon-green/20 p-3 rounded-lg">
                    <LuStar size={14} className="shrink-0 fill-neon-green/20" />
                    <span>Komentar berhasil dikirim! Terima kasih banyak.</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-neon-green hover:bg-neon-hover text-slate-950 font-bold font-poppins text-sm transition-all duration-300 shadow-md shadow-neon-green/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Dukungan"}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Comments Display */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h4 className="flex items-center gap-2.5 text-lg md:text-xl font-poppins font-bold text-white mb-2">
              <LuMessageSquare size={20} className="text-neon-green" />
              <span>Daftar Dukungan ({feedbacks.length})</span>
            </h4>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <span className="animate-spin h-6 w-6 border-2 border-neon-green border-t-transparent rounded-full mb-3"></span>
                <span className="font-ibm-plex-mono text-xs">Memuat ulasan...</span>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="border border-dashed border-slate-800/80 rounded-xl p-12 text-center text-slate-500 font-poppins flex flex-col items-center justify-center">
                <LuMessageSquare size={36} className="text-slate-700 mb-3" />
                <span className="text-sm font-medium">Belum ada ulasan atau rating.</span>
                <span className="text-xs text-slate-650 mt-1">Jadilah yang pertama memberikan support!</span>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between gap-4">
                    <div>
                      {/* Name & Stars */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h5 className="font-poppins font-semibold text-white text-sm">
                            {fb.name}
                          </h5>
                          <span className="text-[10px] text-slate-500 font-ibm-plex-mono">
                            {new Date(fb.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <LuStar
                              key={idx}
                              size={12}
                              className={
                                idx < fb.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-slate-850"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="text-slate-400 text-xs md:text-sm font-poppins mt-3 leading-relaxed">
                        {fb.comment}
                      </p>
                    </div>

                    {/* Like button */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/40">
                      <button
                        onClick={() => handleLike(fb.id)}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-neon-green transition-colors py-1 px-2 rounded hover:bg-slate-900 border border-transparent hover:border-slate-800"
                      >
                        <LuThumbsUp size={12} />
                        <span>Support ({fb.likes})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
