import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";
import { Plus, Pencil, Trash2, Check, X, Calendar } from "lucide-react";

const PRIMARY = "#0D9488";
const SECONDARY_LIGHT = "#CCFBF1";

const formatLabel = (value) => {
  if (!value) return "";
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export default function AS26WPDates({ eventDates }) {
  const [addForm, setAddForm] = useState({ value: "", label: "", disabled: false });
  const [addErrors, setAddErrors] = useState({});

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ value: "", label: "", disabled: false });
  const [editErrors, setEditErrors] = useState({});

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!addForm.value) { setAddErrors({ value: "Date is required." }); return; }
    if (!addForm.label.trim()) { setAddErrors({ label: "Label is required." }); return; }

    setProcessing(true);
    router.post(route("as26.dates.add"), {
      value:    addForm.value,
      label:    addForm.label.trim(),
      disabled: addForm.disabled,
    }, {
      onSuccess: () => { setAddForm({ value: "", label: "", disabled: false }); setAddErrors({}); },
      onError:   (errs) => setAddErrors(errs),
      onFinish:  () => setProcessing(false),
    });
  };

  const startEdit = (date) => {
    setEditTarget(date.value);
    setEditForm({ value: date.value, label: date.label, disabled: date.disabled });
    setEditErrors({});
  };

  const cancelEdit = () => { setEditTarget(null); setEditErrors({}); };

  const handleUpdate = () => {
    if (!editForm.label.trim()) { setEditErrors({ label: "Label is required." }); return; }
    setProcessing(true);
    router.put(route("as26.dates.update"), {
      old_value: editTarget,
      value:     editForm.value,
      label:     editForm.label.trim(),
      disabled:  editForm.disabled,
    }, {
      onSuccess: () => cancelEdit(),
      onError:   (errs) => setEditErrors(errs),
      onFinish:  () => setProcessing(false),
    });
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    setProcessing(true);
    router.delete(route("as26.dates.delete"), {
      data: { value: deleteConfirm.value },
      onSuccess: () => setDeleteConfirm(null),
      onFinish:  () => setProcessing(false),
    });
  };

  return (
    <MainLayout>
      <Head title="AS26 Event Dates Settings" />

      <div className="min-h-screen bg-gradient-to-b from-[#040B16] via-[#0A2635] to-[#0D6266] text-white pb-20 px-4 pt-8">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide" style={{ color: SECONDARY_LIGHT }}>
                Event Dates
              </h1>
              <p className="text-white/50 text-sm mt-1">{eventDates.length} date{eventDates.length !== 1 ? "s" : ""} configured</p>
            </div>
            <div className="flex gap-2">
              <a href="/AS26Registration/Schools" className="text-sm px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">
                Schools
              </a>
              <a href="/AS26Registration" className="text-sm px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">
                View Registration
              </a>
            </div>
          </div>

          {/* Add Form */}
          <form
            onSubmit={handleAdd}
            className="bg-white/10 backdrop-blur-sm border rounded-2xl p-5 mb-8 space-y-4"
            style={{ borderColor: PRIMARY }}
          >
            <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: SECONDARY_LIGHT }}>
              Add New Date
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/50 mb-1">Date</label>
                <input
                  type="date"
                  value={addForm.value}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAddForm((p) => ({ ...p, value: v, label: formatLabel(v) }));
                    setAddErrors({});
                  }}
                  className="w-full bg-white/10 border rounded-xl px-3 py-2 text-white outline-none"
                  style={{ borderColor: SECONDARY_LIGHT + "60", colorScheme: "dark" }}
                />
                {addErrors.value && <p className="text-red-400 text-xs mt-1">{addErrors.value}</p>}
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1">Display Label</label>
                <input
                  type="text"
                  value={addForm.label}
                  onChange={(e) => { setAddForm((p) => ({ ...p, label: e.target.value })); setAddErrors({}); }}
                  placeholder="e.g. January 25, 2026"
                  className="w-full bg-white/10 border rounded-xl px-3 py-2 text-white placeholder:text-white/30 outline-none"
                  style={{ borderColor: SECONDARY_LIGHT + "60" }}
                />
                {addErrors.label && <p className="text-red-400 text-xs mt-1">{addErrors.label}</p>}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
              <div
                onClick={() => setAddForm((p) => ({ ...p, disabled: !p.disabled }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${addForm.disabled ? "bg-red-500" : "bg-teal-500"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${addForm.disabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm">
                {addForm.disabled ? <span className="text-red-300">Registration Closed</span> : <span className="text-teal-300">Registration Open</span>}
              </span>
            </label>

            <button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-white transition hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: PRIMARY }}
            >
              <Plus className="w-4 h-4" /> Add Date
            </button>
          </form>

          {/* Dates Table */}
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: PRIMARY + "60" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: PRIMARY + "40", borderColor: PRIMARY + "60" }}>
                  <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-xs" style={{ color: SECONDARY_LIGHT }}>Date</th>
                  <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-xs" style={{ color: SECONDARY_LIGHT }}>Label</th>
                  <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-xs" style={{ color: SECONDARY_LIGHT }}>Status</th>
                  <th className="text-center px-4 py-3 font-bold uppercase tracking-wider text-xs" style={{ color: SECONDARY_LIGHT }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventDates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-white/30 italic">No dates configured yet.</td>
                  </tr>
                ) : (
                  eventDates.map((date) => {
                    const isEditing = editTarget === date.value;
                    return (
                      <tr key={date.value} className="border-b hover:bg-white/5 transition-colors" style={{ borderColor: PRIMARY + "30" }}>
                        {isEditing ? (
                          <>
                            <td className="px-4 py-2">
                              <input
                                type="date"
                                value={editForm.value}
                                onChange={(e) => setEditForm((p) => ({ ...p, value: e.target.value }))}
                                className="w-full bg-white/10 border rounded-lg px-2 py-1.5 text-white text-sm outline-none"
                                style={{ borderColor: SECONDARY_LIGHT + "60", colorScheme: "dark" }}
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={editForm.label}
                                onChange={(e) => { setEditForm((p) => ({ ...p, label: e.target.value })); setEditErrors({}); }}
                                className="w-full bg-white/10 border rounded-lg px-2 py-1.5 text-white text-sm outline-none"
                                style={{ borderColor: SECONDARY_LIGHT + "60" }}
                              />
                              {editErrors.label && <p className="text-red-400 text-xs mt-1">{editErrors.label}</p>}
                            </td>
                            <td className="px-4 py-2">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <div
                                  onClick={() => setEditForm((p) => ({ ...p, disabled: !p.disabled }))}
                                  className={`relative w-10 h-5 rounded-full transition-colors ${editForm.disabled ? "bg-red-500" : "bg-teal-500"}`}
                                >
                                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${editForm.disabled ? "translate-x-5" : "translate-x-0.5"}`} />
                                </div>
                                <span className={`text-xs font-semibold ${editForm.disabled ? "text-red-300" : "text-teal-300"}`}>
                                  {editForm.disabled ? "Closed" : "Open"}
                                </span>
                              </label>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={handleUpdate} disabled={processing} className="p-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 transition disabled:opacity-50" title="Save">
                                  <Check className="w-4 h-4 text-white" />
                                </button>
                                <button onClick={cancelEdit} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition" title="Cancel">
                                  <X className="w-4 h-4 text-white" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-white/70 font-mono text-xs">{date.value}</td>
                            <td className="px-4 py-3 text-white">{date.label}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${date.disabled ? "bg-red-500/20 text-red-300" : "bg-teal-500/20 text-teal-300"}`}>
                                {date.disabled ? "Closed" : "Open"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => startEdit(date)} className="p-1.5 rounded-lg hover:bg-white/20 transition text-cyan-300" title="Edit">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteConfirm(date)} className="p-1.5 rounded-lg hover:bg-red-500/30 transition text-red-400" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#0A2635] text-white p-6 rounded-2xl shadow-xl max-w-sm w-full border-2" style={{ borderColor: "#ef4444" }}>
            <h2 className="text-lg font-bold mb-2">Delete Date</h2>
            <p className="text-sm text-white/70 mb-6">
              Remove <span className="font-semibold text-white">{deleteConfirm.label}</span> from event dates?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} disabled={processing} className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition text-sm font-bold disabled:opacity-50">
                {processing ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
