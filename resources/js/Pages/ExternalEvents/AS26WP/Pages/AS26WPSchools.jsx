import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout.jsx";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";

const REGIONS = ["Luzon", "Visayas", "Mindanao"];
const MODES = ["Online", "Onsite"];

const PRIMARY = "#0D9488";
const SECONDARY_LIGHT = "#CCFBF1";

export default function AS26WPSchools({ regionsData }) {
  const [addForm, setAddForm] = useState({ region: "Luzon", mode: "Online", name: "" });
  const [addErrors, setAddErrors] = useState({});

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ region: "", mode: "", name: "" });
  const [editErrors, setEditErrors] = useState({});

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [schoolOptions, setSchoolOptions] = useState([]);
  const [schoolQuery, setSchoolQuery] = useState("");
  const [loadingSchools, setLoadingSchools] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoadingSchools(true);
      fetch(route("as26.schools.search") + `?island=${encodeURIComponent(addForm.region)}&q=${encodeURIComponent(schoolQuery)}`)
        .then((r) => r.json())
        .then((data) => setSchoolOptions(data))
        .catch(() => setSchoolOptions([]))
        .finally(() => setLoadingSchools(false));
    }, 300);
  }, [schoolQuery, addForm.region]);

  const [filterRegion, setFilterRegion] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const totalCount = REGIONS.reduce((sum, r) => {
    const region = regionsData[r] || {};
    return sum + (region.Online?.length || 0) + (region.Onsite?.length || 0);
  }, 0);

  const allRows = (() => {
    const rows = [];
    let counter = 1;
    REGIONS.forEach((region) => {
      MODES.forEach((mode) => {
        (regionsData[region]?.[mode] || []).forEach((name) => {
          rows.push({ region, mode, name, index: counter++ });
        });
      });
    });
    return rows;
  })();

  const filteredRows = filterRegion === "All"
    ? allRows
    : allRows.filter((r) => r.region === filterRegion);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pagedRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (region) => {
    setFilterRegion(region);
    setCurrentPage(1);
    cancelEdit();
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      setAddErrors({ name: "School name is required." });
      return;
    }
    setProcessing(true);
    router.post(route("as26.schools.add"), {
      region: addForm.region,
      mode: addForm.mode,
      name: addForm.name.trim(),
    }, {
      onSuccess: () => {
        setAddForm((prev) => ({ ...prev, name: "" }));
        setAddErrors({});
      },
      onError: (errs) => setAddErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  const startEdit = (region, mode, name) => {
    setEditTarget({ region, mode, name });
    setEditForm({ region, mode, name });
    setEditErrors({});
  };

  const cancelEdit = () => {
    setEditTarget(null);
    setEditErrors({});
  };

  const handleUpdate = () => {
    if (!editForm.name.trim()) {
      setEditErrors({ name: "School name is required." });
      return;
    }
    setProcessing(true);
    router.put(route("as26.schools.update"), {
      old_region: editTarget.region,
      old_mode: editTarget.mode,
      old_name: editTarget.name,
      new_region: editForm.region,
      new_mode: editForm.mode,
      new_name: editForm.name.trim(),
    }, {
      onSuccess: () => cancelEdit(),
      onError: (errs) => setEditErrors(errs),
      onFinish: () => setProcessing(false),
    });
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    setProcessing(true);
    router.delete(route("as26.schools.delete"), {
      data: {
        region: deleteConfirm.region,
        mode: deleteConfirm.mode,
        name: deleteConfirm.name,
      },
      onSuccess: () => setDeleteConfirm(null),
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <MainLayout>
      <Head title="AS26 Schools Settings" />

      <div className="min-h-screen bg-gradient-to-b from-[#040B16] via-[#0A2635] to-[#0D6266] text-white pb-20 px-4 pt-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide" style={{ color: SECONDARY_LIGHT }}>
                Schools / Venues
              </h1>
              <p className="text-white/50 text-sm mt-1">
                {totalCount} venues across {REGIONS.length} regions
              </p>
            </div>
            <div className="flex gap-2">
              <a href="/AS26Registration/Dates" className="text-sm px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">
                Event Dates
              </a>
              <a href="/AS26Registration" className="text-sm px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">
                View Registration
              </a>
            </div>
          </div>

          {/* Add Form */}
          <form
            onSubmit={handleAdd}
            className="bg-white/10 backdrop-blur-sm border rounded-2xl p-5 mb-10 space-y-4"
            style={{ borderColor: PRIMARY }}
          >
            <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: SECONDARY_LIGHT }}>
              Add New School
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={addForm.region}
                onChange={(e) => {
                    setAddForm((p) => ({ ...p, region: e.target.value, name: "" }));
                    setSchoolQuery("");
                    setSchoolOptions([]);
                  }}
                className="bg-white/10 border rounded-xl px-3 py-2 text-white appearance-none outline-none"
                style={{ borderColor: SECONDARY_LIGHT + "60" }}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r} className="text-black">{r}</option>
                ))}
              </select>

              <select
                value={addForm.mode}
                onChange={(e) => setAddForm((p) => ({ ...p, mode: e.target.value }))}
                className="bg-white/10 border rounded-xl px-3 py-2 text-white appearance-none outline-none"
                style={{ borderColor: SECONDARY_LIGHT + "60" }}
              >
                {MODES.map((m) => (
                  <option key={m} value={m} className="text-black">{m}</option>
                ))}
              </select>

              <div className="relative">
                <Combobox
                  value={addForm.name}
                  onChange={(val) => {
                    setAddForm((p) => ({ ...p, name: val }));
                    setAddErrors({});
                  }}
                  onClose={() => setSchoolQuery("")}
                >
                  <ComboboxInput
                    className="w-full bg-white/10 border rounded-xl px-3 py-2 text-white placeholder:text-white/40 outline-none"
                    style={{ borderColor: SECONDARY_LIGHT + "60" }}
                    placeholder={loadingSchools ? "Loading..." : "Search school name"}
                    displayValue={(val) => val}
                    onChange={(e) => {
                      setSchoolQuery(e.target.value);
                      setAddForm((p) => ({ ...p, name: e.target.value }));
                      setAddErrors({});
                    }}
                  />
                  <ComboboxOptions
                    anchor="bottom"
                    className="w-[var(--input-width)] bg-[#0A2635] border rounded-xl mt-1 overflow-y-auto z-[100] shadow-xl empty:invisible"
                    style={{ maxHeight: "180px" }}
                    style={{ borderColor: PRIMARY }}
                  >
                    {loadingSchools ? (
                      <div className="py-2 px-4 text-white/40 text-sm">Searching...</div>
                    ) : schoolOptions.length === 0 ? (
                      <div className="py-2 px-4 text-white/40 text-sm italic">No schools found.</div>
                    ) : (
                      schoolOptions.map((name) => (
                        <ComboboxOption
                          key={name}
                          value={name}
                          className={({ focus }) =>
                            `cursor-pointer select-none py-2 px-4 text-sm ${focus ? "bg-teal-500 text-black" : "text-white"}`
                          }
                        >
                          {name}
                        </ComboboxOption>
                      ))
                    )}
                  </ComboboxOptions>
                </Combobox>
              </div>
            </div>

            {addErrors.name && (
              <p className="text-red-400 text-sm">{addErrors.name}</p>
            )}

            <button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-white transition hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: PRIMARY }}
            >
              <Plus className="w-4 h-4" />
              Add School
            </button>
          </form>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {["All", ...REGIONS].map((r) => (
              <button
                key={r}
                onClick={() => handleFilterChange(r)}
                className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all"
                style={
                  filterRegion === r
                    ? { backgroundColor: PRIMARY, color: "#fff" }
                    : { backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }
                }
              >
                {r}
              </button>
            ))}
            <span className="ml-auto text-white/40 text-xs">
              {filteredRows.length} result{filteredRows.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Venues Table */}
          <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: PRIMARY + "60" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: PRIMARY + "40", borderColor: PRIMARY + "60" }}>
                  <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-xs" style={{ color: SECONDARY_LIGHT }}>#</th>
                  <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-xs" style={{ color: SECONDARY_LIGHT }}>School / Venue</th>
                  <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-xs" style={{ color: SECONDARY_LIGHT }}>Region</th>
                  <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-xs" style={{ color: SECONDARY_LIGHT }}>Mode</th>
                  <th className="text-center px-4 py-3 font-bold uppercase tracking-wider text-xs" style={{ color: SECONDARY_LIGHT }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-white/30 italic">
                      No schools found.
                    </td>
                  </tr>
                ) : (
                  pagedRows.map(({ region, mode, name, index }) => {
                    const isEditing =
                      editTarget?.region === region &&
                      editTarget?.mode === mode &&
                      editTarget?.name === name;

                    return (
                      <tr
                        key={`${region}-${mode}-${name}`}
                        className="border-b transition-colors hover:bg-white/5"
                        style={{ borderColor: PRIMARY + "30" }}
                      >
                        <td className="px-4 py-3 text-white/40 text-xs">{index}</td>

                        {isEditing ? (
                          <>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => { setEditForm((p) => ({ ...p, name: e.target.value })); setEditErrors({}); }}
                                className="w-full bg-white/10 border rounded-lg px-2 py-1.5 text-white text-sm outline-none"
                                style={{ borderColor: SECONDARY_LIGHT + "60" }}
                              />
                              {editErrors.name && <p className="text-red-400 text-xs mt-1">{editErrors.name}</p>}
                            </td>
                            <td className="px-4 py-2">
                              <select
                                value={editForm.region}
                                onChange={(e) => setEditForm((p) => ({ ...p, region: e.target.value }))}
                                className="bg-white/10 border rounded-lg px-2 py-1.5 text-white text-sm appearance-none outline-none w-full"
                                style={{ borderColor: SECONDARY_LIGHT + "60" }}
                              >
                                {REGIONS.map((r) => (
                                  <option key={r} value={r} className="text-black">{r}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <select
                                value={editForm.mode}
                                onChange={(e) => setEditForm((p) => ({ ...p, mode: e.target.value }))}
                                className="bg-white/10 border rounded-lg px-2 py-1.5 text-white text-sm appearance-none outline-none w-full"
                                style={{ borderColor: SECONDARY_LIGHT + "60" }}
                              >
                                {MODES.map((m) => (
                                  <option key={m} value={m} className="text-black">{m}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={handleUpdate}
                                  disabled={processing}
                                  className="p-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 transition disabled:opacity-50"
                                  title="Save"
                                >
                                  <Check className="w-4 h-4 text-white" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4 text-white" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-white">{name}</td>
                            <td className="px-4 py-3 text-white/70">{region}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                mode === "Online"
                                  ? "bg-blue-500/30 text-blue-200"
                                  : "bg-green-500/30 text-green-200"
                              }`}>
                                {mode}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => startEdit(region, mode, name)}
                                  className="p-1.5 rounded-lg hover:bg-white/20 transition text-cyan-300"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ region, mode, name })}
                                  className="p-1.5 rounded-lg hover:bg-red-500/30 transition text-red-400"
                                  title="Delete"
                                >
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-white/40 text-xs">
                Page {currentPage} of {totalPages} &nbsp;·&nbsp; showing {pagedRows.length} of {filteredRows.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium border border-white/20 hover:bg-white/10 disabled:opacity-30 transition"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="px-3 py-1.5 rounded-xl text-sm font-medium transition"
                    style={
                      currentPage === page
                        ? { backgroundColor: PRIMARY, color: "#fff" }
                        : { backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }
                    }
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium border border-white/20 hover:bg-white/10 disabled:opacity-30 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
          <div
            className="bg-[#0A2635] text-white p-6 rounded-2xl shadow-xl max-w-sm w-full border-2"
            style={{ borderColor: "#ef4444" }}
          >
            <h2 className="text-lg font-bold mb-2">Delete School</h2>
            <p className="text-sm text-white/70 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-white">{deleteConfirm.name}</span>?
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={processing}
                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition text-sm font-bold disabled:opacity-50"
              >
                {processing ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
