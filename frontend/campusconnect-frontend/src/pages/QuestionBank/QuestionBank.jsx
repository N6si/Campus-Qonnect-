import React, { useState, useEffect, useContext } from "react";
import API from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Upload, Search, Download, FileText, Trash2, BookOpen, Filter } from "lucide-react";

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Computer Science",
  "Data Structures", "Algorithms", "Database", "Networks",
  "Operating Systems", "Software Engineering", "Electronics", "Other"
];

const YEARS = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"];

export default function QuestionBank() {
  const { user } = useContext(AuthContext);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    year: "",
    semester: "",
    file: null,
  });

  const canUpload = user?.role === "teacher" || user?.role === "admin";

  useEffect(() => {
    fetchPapers();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPapers = async () => {
    try {
      const res = await API.get("/api/question-bank");
      setPapers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!form.title || !form.subject || !form.year || !form.file) {
      showToast("Please fill all fields and select a PDF", "error");
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("subject", form.subject);
      data.append("year", form.year);
      data.append("semester", form.semester);
      data.append("file", form.file);
      await API.post("/api/question-bank/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Question paper uploaded successfully!");
      setForm({ title: "", subject: "", year: "", semester: "", file: null });
      setShowUpload(false);
      fetchPapers();
    } catch (err) {
      showToast(err.response?.data?.detail || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this paper?")) return;
    try {
      await API.delete(`/api/question-bank/${id}`);
      showToast("Paper deleted");
      fetchPapers();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const res = await API.get(`/api/question-bank/download/${id}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      showToast("Download failed", "error");
    }
  };

  const filtered = papers.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = filterSubject ? p.subject === filterSubject : true;
    const matchYear = filterYear ? p.year === filterYear : true;
    return matchSearch && matchSubject && matchYear;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 999, padding: "0.75rem 1.25rem", borderRadius: "0.625rem", background: toast.type === "error" ? "rgba(248,113,113,0.15)" : "rgba(52,211,153,0.15)", border: `1px solid ${toast.type === "error" ? "rgba(248,113,113,0.3)" : "rgba(52,211,153,0.3)"}`, color: toast.type === "error" ? "#f87171" : "var(--green)", fontSize: "0.875rem", fontWeight: 500 }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        <Sidebar user={user} />

        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Header */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 0.25rem" }}>
                  📚 Question Bank
                </h1>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
                  {papers.length} papers available · Mumbai University Past Papers
                </p>
              </div>
              {canUpload && (
                <button
                  onClick={() => setShowUpload(!showUpload)}
                  className="btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Upload size={15} />
                  Upload Paper
                </button>
              )}
            </div>

            {/* Upload form */}
            {showUpload && canUpload && (
              <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Paper Title *</label>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Data Structures May 2023" className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Subject *</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="form-input">
                      <option value="">Select subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Year *</label>
                    <select value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="form-input">
                      <option value="">Select year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>Semester</label>
                    <select value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} className="form-input">
                      <option value="">Select semester</option>
                      {["Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Sem 6","Sem 7","Sem 8"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, display: "block", marginBottom: "0.375rem" }}>PDF File *</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={e => setForm({ ...form, file: e.target.files[0] })}
                    style={{ width: "100%", padding: "0.5rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.5rem", color: "var(--text-primary)", fontSize: "0.8rem" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={handleUpload} disabled={uploading} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.375rem", opacity: uploading ? 0.7 : 1 }}>
                    <Upload size={14} /> {uploading ? "Uploading..." : "Upload"}
                  </button>
                  <button onClick={() => setShowUpload(false)} className="btn-ghost">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Search + Filters */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search papers..."
                className="form-input"
                style={{ paddingLeft: "2.25rem", width: "100%" }}
              />
            </div>
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="form-input" style={{ minWidth: "160px" }}>
              <option value="">All Subjects</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="form-input" style={{ minWidth: "120px" }}>
              <option value="">All Years</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            {(filterSubject || filterYear || search) && (
              <button onClick={() => { setSearch(""); setFilterSubject(""); setFilterYear(""); }} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <Filter size={13} /> Clear
              </button>
            )}
          </div>

          {/* Papers grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Loading papers...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "1rem", color: "var(--text-muted)" }}>
              <BookOpen size={40} style={{ margin: "0 auto 1rem", display: "block", opacity: 0.3 }} />
              <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.25rem" }}>No papers found</div>
              <div style={{ fontSize: "0.875rem" }}>
                {canUpload ? "Upload the first question paper!" : "Check back later for papers."}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {filtered.map(paper => (
                <div key={paper.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "0.875rem", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  {/* Icon + title */}
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "0.625rem", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={18} style={{ color: "var(--accent)" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem", lineHeight: 1.3 }}>{paper.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>by {paper.uploaded_by}</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    <span style={{ padding: "0.2rem 0.5rem", borderRadius: "0.375rem", background: "var(--accent-soft)", color: "var(--accent)", fontSize: "0.7rem", fontWeight: 600 }}>{paper.subject}</span>
                    {paper.year && <span style={{ padding: "0.2rem 0.5rem", borderRadius: "0.375rem", background: "var(--bg-secondary)", color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>{paper.year}</span>}
                    {paper.semester && <span style={{ padding: "0.2rem 0.5rem", borderRadius: "0.375rem", background: "var(--bg-secondary)", color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>{paper.semester}</span>}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                    <button
                      onClick={() => handleDownload(paper.id, paper.title)}
                      className="btn-primary"
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", padding: "0.5rem" }}
                    >
                      <Download size={13} /> Download
                    </button>
                    {(user?.role === "teacher" || user?.role === "admin") && (
                      <button
                        onClick={() => handleDelete(paper.id)}
                        style={{ width: "36px", height: "36px", borderRadius: "0.5rem", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171" }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}