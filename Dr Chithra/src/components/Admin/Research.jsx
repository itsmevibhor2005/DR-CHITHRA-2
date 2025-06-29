import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SECTIONS = [
  { name: "Interests", key: "interests" },
  { name: "Projects", key: "projects" },
];

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/research`;

export default function ResearchAdmin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(SECTIONS[0].name);
  const [interests, setInterests] = useState([]);
  const [projects, setProjects] = useState([]);
  const [interestsMain, setInterestsMain] = useState({
    heading: "",
    paragraph: "",
  });
  const [loading, setLoading] = useState({
    interests: false,
    projects: false,
    main: false,
  });

  const [editMain, setEditMain] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(null);
  const [formData, setFormData] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [files, setFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [deleteInfo, setDeleteInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === "Interests") {
        setLoading((prev) => ({ ...prev, interests: true, main: true }));
        const mainRes = await fetch(`${API_BASE}/interests`);
        const mainData = await mainRes.json();
        if (mainData.data && mainData.data.length > 0) {
          setInterestsMain({
            heading: mainData.data[0].heading || "",
            paragraph: mainData.data[0].paragraph || "",
          });
          setInterests(mainData.data[0].interests || []);
        }
        setLoading((prev) => ({ ...prev, interests: false, main: false }));
      } else if (activeTab === "Projects") {
        setLoading((prev) => ({ ...prev, projects: true }));
        const res = await fetch(`${API_BASE}/projects`);
        const data = await res.json();
        setProjects(data.data || []);
        setLoading((prev) => ({ ...prev, projects: false }));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error(`Failed to fetch ${activeTab.toLowerCase()}: ${error.message}`);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
    setEditId(null);
    setEditMain(false);
  };

  const handleAdd = (type) => {
    setFormType(type);
    setFormData(type === "project" ? { images: [] } : {});
    setEditId(null);
    setEditIndex(null);
    setFiles([]);
    setImagesToDelete([]);
    setShowForm(true);
  };

  const handleEdit = (type, id, data) => {
    setFormType(type);
    setEditId(id);
    setEditIndex(id);
    setFormData({ ...data });
    setFiles([]);
    setImagesToDelete([]);
    setShowForm(true);
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === "project") {
        // For projects, use DELETE API
        const res = await fetch(`${API_BASE}/projects/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to delete project");
          toast.error("Failed to delete project");
        }
      } else if (type === "interest") {
        const updatedInterests = interests.filter((item) => item.id !== id);

        const interestData = {
          heading: interestsMain.heading,
          paragraph: interestsMain.paragraph,
          interests: updatedInterests,
        };

        const res = await fetch(`${API_BASE}/interests`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          },
          body: JSON.stringify(interestData),
        });

        if (!res.ok) throw new Error("Failed to delete interest");
      }
  

      // Refresh UI
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(`Failed to delete ${type}: ${error.message}`);
    }
  };
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formType === "interest") {
        const updatedInterests =
          editIndex !== null
            ? interests.map((item, idx) =>
                item.id === editId
                  ? {
                      ...item,
                      heading: formData.heading,
                      description: formData.description,
                    }
                  : item
              )
            : [
                ...interests,
                {
                  id: uuidv4(), // 🔹 generate unique ID for new interest
                  heading: formData.heading,
                  description: formData.description,
                },
              ];

        const interestData = {
          heading: interestsMain.heading,
          paragraph: interestsMain.paragraph,
          interests: updatedInterests,
        };

        const res = await fetch(`${API_BASE}/interests`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          },
          body: JSON.stringify(interestData),
        });

        if (res.ok) {
          fetchData();
          setShowForm(false);
          setEditIndex(null);
        }
      } else if (formType === "project") {
        const formDataToSend = new FormData();
        formDataToSend.append("heading", formData.heading);
        formDataToSend.append("description", formData.description);

        if (imagesToDelete.length > 0) {
          formDataToSend.append(
            "imagesToDelete",
            JSON.stringify(imagesToDelete)
          );
        }

        files.forEach((file) => {
          formDataToSend.append("images", file);
        });

        const url =
          editId !== null
            ? `${API_BASE}/projects/${editId}`
            : `${API_BASE}/projects`;
        const method = editId !== null ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          },
          body: formDataToSend,
        });

        if (res.ok) {
          fetchData();
          setShowForm(false);
          setEditId(null);
          setEditIndex(null);
          setFiles([]);
          setImagesToDelete([]);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to submit ${formType}: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateInterestsMain = async () => {
    try {
      const interestData = {
        heading: interestsMain.heading,
        paragraph: interestsMain.paragraph,
        interests,
      };

      const res = await fetch(`${API_BASE}/interests`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify(interestData),
      });

      if (res.ok) {
        fetchData();
        setEditMain(false);
      }
    } catch (error) {
      console.error("Error updating main interests:", error);
      toast.error(`Failed to update interests main: ${error.message}`);
    }
  };

  const removeImage = (indexToRemove) => {
    if (formData.images && formData.images[indexToRemove]?.path) {
      setImagesToDelete([
        ...imagesToDelete,
        formData.images[indexToRemove].path,
      ]);
    }
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== indexToRemove),
    });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);

    setFormData({
      ...formData,
      images: [
        ...(formData.images || []),
        ...newFiles.map((file) => ({
          url: URL.createObjectURL(file),
          path: `temp/${file.name}`,
        })),
      ],
    });
  };

  if (loading.interests || loading.projects || loading.main) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    <div className="p-6 space-y-6">
      <div className="flex gap-4">
        {SECTIONS.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabSwitch(tab.name)}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              activeTab === tab.name
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab === "Interests" && (
        <div className="space-y-4">
          {!editMain ? (
            <div>
              <h2 className="text-xl font-semibold">{interestsMain.heading}</h2>
              <p className="text-gray-700">{interestsMain.paragraph}</p>
              <button
                onClick={() => setEditMain(true)}
                className="mt-2 text-blue-600 hover:underline"
                >
                Edit
              </button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={interestsMain.heading}
                onChange={(e) =>
                  setInterestsMain({
                    ...interestsMain,
                    heading: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2 mb-2"
                />
              <textarea
                value={interestsMain.paragraph}
                onChange={(e) =>
                  setInterestsMain({
                    ...interestsMain,
                    paragraph: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
                rows={3}
                />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={updateInterestsMain}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                  Save
                </button>
                <button
                  onClick={() => setEditMain(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => handleAdd("interest")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
            Add Interest
          </button>

          <div className="grid gap-4">
            {interests.map((item, index) => (
              <div
              key={item.id || index}
              className="p-4 bg-white rounded shadow"
              >
                <h3 className="font-semibold text-lg">{item.heading}</h3>
                <p>{item.description}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit("interest", item.id, item)}
                    className="text-blue-600 hover:underline"
                    >
                    Update
                  </button>
                  <button
                    onClick={() =>
                      setDeleteInfo({ type: "interest", id: item.id })
                    }
                    className="text-red-600 hover:underline"
                    >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Projects" && (
        <div className="space-y-4">
          <button
            onClick={() => handleAdd("project")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Project
          </button>
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold text-lg">{project.heading}</h3>
                <p className="text-gray-700 mb-2">{project.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.images?.map((img, i) => (
                    <img
                    key={i}
                    src={img.url || img}
                    alt="project"
                    className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit("project", project.id, project)}
                    className="text-blue-600 hover:underline"
                    >
                    Update
                  </button>
                  <button
                    onClick={() =>
                      setDeleteInfo({ type: "project", id: project.id })
                    }
                    className="text-red-600 hover:underline"
                    >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Modal */}
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
                {editId ? "Update" : "Add"}{" "}
                {formType === "project" ? "Project" : "Interest"}
              </h2>
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  placeholder="Heading"
                  value={formData.heading || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, heading: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded mb-2"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded mb-2"
                  rows={3}
                  required
                  />
                {formType === "project" && (
                  <>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.images?.map((img, i) => (
                        <div key={i} className="relative">
                          <img
                            src={img.url || img}
                            alt="uploaded"
                            className="w-20 h-20 object-cover rounded"
                            />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                            >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="mb-2"
                      />
                  </>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded text-white transition-colors ${
                      isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    >
                    {isSubmitting ? "Processing..." : editId ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteInfo && (
          <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-96 space-y-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              >
              <h2 className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete this {deleteInfo.type}?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteInfo(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete(deleteInfo.type, deleteInfo.id);
                    setDeleteInfo(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
        </>
  );
}
