import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const SECTIONS = [
  { name: "Conferences", key: "conferences" },
  { name: "Journals", key: "journals" },
  { name: "Patents", key: "patents" },
  { name: "Thesis", key: "thesis" },
];

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/publications`;

export default function Publications() {
  const [selectedTab, setSelectedTab] = useState(SECTIONS[0]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    link: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async (sectionKey) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/${sectionKey}`);
      setData((prev) => ({ ...prev, [sectionKey]: res.data.data }));
    } catch (err) {
      setError("Failed to fetch publications.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(selectedTab.key);
    // eslint-disable-next-line
  }, [selectedTab]);

  const handleAddClick = () => {
    setEditing(null);
    setFormData({ heading: "", description: "", link: "" });
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    setEditing(item);
    setFormData({
      heading: item.heading,
      description: item.description,
      link: item.link || "",
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setError("You must be logged in to perform this action.");
      return;
    }
    try {
      if (editing) {
        // Edit
        await axios.put(
          `${API_BASE}/${selectedTab.key}/${editing.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add
        await axios.post(`${API_BASE}/${selectedTab.key}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ heading: "", description: "", link: "" });
      fetchData(selectedTab.key);
    } catch (err) {
      setError("Failed to save publication.");
    }
  };

  const confirmDelete = async() => {
    setError("");
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setError("You must be logged in to perform this action.");
      return;
    }
    try {
      await axios.delete(
        `${API_BASE}/${selectedTab.key}/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowConfirm(false);
      setDeleteId(null);
      fetchData(selectedTab.key);
    } catch (err) {
      setError("Failed to delete publication.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Publications</h1>
      <div className="flex gap-4 mb-4">
        {SECTIONS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              selectedTab.key === tab.key
                ? "bg-blue-600 text-white scale-105"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {tab.name}
          </button>
        ))}
        <button
          onClick={handleAddClick}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Add{" "}
          {selectedTab.name}
        </button>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {(data[selectedTab.key] || []).map((item) => (
            <motion.div
              key={item.id}
              layout
              className="flex justify-between items-center p-4 bg-white rounded shadow"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.heading}</h3>
                <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    className="text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.link}
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="text-blue-600 hover:underline"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-white/80 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-xl shadow-xl w-96 space-y-4"
            >
              <h2 className="text-xl font-semibold">
                {editing ? "Update" : "Add"}{" "}
                {selectedTab.name.endsWith("s")
                  ? selectedTab.name.slice(0, -1)
                  : selectedTab.name}
              </h2>
              <input
                type="text"
                placeholder="Heading"
                value={formData.heading}
                onChange={(e) =>
                  setFormData({ ...formData, heading: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-white/80 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-xl shadow-xl w-96 text-center"
            >
              <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-4">
                Are you sure you want to delete this{" "}
                {selectedTab.name.endsWith("s")
                  ? selectedTab.name.slice(0, -1)
                  : selectedTab.name}
                ?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
