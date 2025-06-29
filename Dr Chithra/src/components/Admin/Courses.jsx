import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/courses`;

const tryParseArray = (value) => {
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value || "[]");
  } catch {
    return [];
  }
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    description: "",
    prerequisites: [],
    references: [],
    resources: [],
    venue: "",
    lectures: [],
  });
  const [coverImage, setCoverImage] = useState(null);
  const [lectureForm, setLectureForm] = useState({
    show: false,
    courseId: null,
    data: {},
    index: null,
    isEdit: false,
  });
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newReference, setNewReference] = useState("");
  const [newResource, setNewResource] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();

      const parsedCourses =
        data.data?.map((course) => ({
          ...course,
          prerequisites: tryParseArray(course.prerequisites),
          references: tryParseArray(course.references),
          resources: tryParseArray(course.resources),
          lectures: tryParseArray(course.lectures),
        })) || [];

      setCourses(parsedCourses);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("course_code", formData.course_code);
      form.append("course_name", formData.course_name);
      form.append("description", formData.description);
      form.append("prerequisites", JSON.stringify(formData.prerequisites));
      form.append("references", JSON.stringify(formData.references));
      form.append("resources", JSON.stringify(formData.resources));
      form.append("venue", formData.venue);
      if (coverImage) {
        form.append("cover_image", coverImage);
      }

      const method = editCourse ? "PUT" : "POST";
      const url = editCourse ? `${API_BASE}/${editCourse.id}` : API_BASE;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: form,
      });

      if (res.ok) {
        fetchCourses();
        resetForm();
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      course_code: "",
      course_name: "",
      description: "",
      prerequisites: [],
      references: [],
      resources: [],
      venue: "",
      lectures: [],
    });
    setEditCourse(null);
    setCoverImage(null);
    setNewPrerequisite("");
    setNewReference("");
    setNewResource("");
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("name", lectureForm.data.name);
      form.append("video", lectureForm.data.video || "");
      if (lectureForm.data.pdfFile) {
        form.append("pdf", lectureForm.data.pdfFile);
      }

      let url, method;
      if (lectureForm.isEdit) {
        method = "PUT";
        url = `${API_BASE}/${lectureForm.courseId}/lectures/${lectureForm.index}`;
      } else {
        method = "POST";
        url = `${API_BASE}/${lectureForm.courseId}/lectures`;
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: form,
      });

      if (res.ok) {
        fetchCourses();
        setLectureForm({
          show: false,
          courseId: null,
          data: {},
          index: null,
          isEdit: false,
        });
      }
    } catch (err) {
      console.error("Lecture submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });
      fetchCourses();
      setDeleteInfo(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const deleteLecture = async (courseId, index) => {
    try {
      await fetch(`${API_BASE}/${courseId}/lectures/${index}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });
      fetchCourses();
      setDeleteInfo(null);
    } catch (err) {
      console.error("Delete lecture error:", err);
    }
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData({
        ...formData,
        prerequisites: [...formData.prerequisites, newPrerequisite.trim()],
      });
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (index) => {
    const updated = [...formData.prerequisites];
    updated.splice(index, 1);
    setFormData({ ...formData, prerequisites: updated });
  };

  const addReference = () => {
    if (newReference.trim()) {
      setFormData({
        ...formData,
        references: [...formData.references, newReference.trim()],
      });
      setNewReference("");
    }
  };

  const removeReference = (index) => {
    const updated = [...formData.references];
    updated.splice(index, 1);
    setFormData({ ...formData, references: updated });
  };

  const addResource = () => {
    if (newResource.trim()) {
      setFormData({
        ...formData,
        resources: [...formData.resources, newResource.trim()],
      });
      setNewResource("");
    }
  };

  const removeResource = (index) => {
    const updated = [...formData.resources];
    updated.splice(index, 1);
    setFormData({ ...formData, resources: updated });
  };

  const openEditLecture = (courseId, lecture, index) => {
    setLectureForm({
      show: true,
      courseId,
      data: {
        name: lecture.name || "",
        video: lecture.video || "",
        pdfUrl: lecture.pdf,
      },
      index,
      isEdit: true,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => setShowForm(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
      >
        Add Course
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        courses.map((course) => (
          <div
            key={course.id}
            className="bg-white p-6 rounded-lg shadow-md space-y-4 border border-gray-100"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {course.cover_image && (
                <div className="w-full md:w-1/4">
                  <img
                    src={course.cover_image}
                    alt="Course cover"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {course.course_name} ({course.course_code})
                    </h3>
                    <p className="text-gray-600 mt-1">{course.description}</p>
                    {course.venue && (
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Venue:</span>{" "}
                        {course.venue}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditCourse(course);
                        setFormData({
                          course_code: course.course_code,
                          course_name: course.course_name,
                          description: course.description,
                          prerequisites: tryParseArray(course.prerequisites),
                          references: tryParseArray(course.references),
                          resources: tryParseArray(course.resources),
                          venue: course.venue || "",
                          lectures: tryParseArray(course.lectures),
                        });
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setDeleteInfo({ type: "course", id: course.id })
                      }
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {course.prerequisites?.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Prerequisites
                      </h4>
                      <ul className="space-y-1">
                        {course.prerequisites.map((pre, j) => (
                          <li key={j} className="text-sm text-gray-600">
                            • {pre}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.references?.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        References
                      </h4>
                      <ul className="space-y-1">
                        {course.references.map((ref, j) => (
                          <li key={j} className="text-sm text-gray-600">
                            • {ref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.resources?.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Resources
                      </h4>
                      <ul className="space-y-1">
                        {course.resources.map((res, j) => (
                          <li key={j} className="text-sm text-gray-600">
                            • {res}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  Lectures
                </h4>
                <button
                  onClick={() =>
                    setLectureForm({
                      show: true,
                      courseId: course.id,
                      data: {},
                      index: null,
                      isEdit: false,
                    })
                  }
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Lecture
                </button>
              </div>

              <div className="space-y-4">
                {course.lectures?.length > 0 ? (
                  course.lectures.map((lec, j) => (
                    <div
                      key={j}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-800">
                            {lec.name}
                          </h5>
                          <div className="flex gap-4 mt-2">
                            {lec.pdf && (
                              <a
                                href={lec.pdf}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Lecture PDF
                              </a>
                            )}
                            {lec.video && (
                              <a
                                href={lec.video}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                                Video Link
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditLecture(course.id, lec, j)}
                            className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              setDeleteInfo({
                                type: "lecture",
                                courseId: course.id,
                                index: j,
                              })
                            }
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No lectures added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editCourse ? "Update" : "Add"} Course
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleCourseSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Code
                      </label>
                      <input
                        type="text"
                        placeholder="Course Code"
                        value={formData.course_code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            course_code: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Name
                      </label>
                      <input
                        type="text"
                        placeholder="Course Name"
                        value={formData.course_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            course_name: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      placeholder="Venue"
                      value={formData.venue}
                      onChange={(e) =>
                        setFormData({ ...formData, venue: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverImage(e.target.files[0])}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {editCourse?.cover_image && !coverImage && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Current Image:</p>
                        <img
                          src={editCourse.cover_image}
                          alt="Current cover"
                          className="h-24 mt-1 rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prerequisites
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add prerequisite"
                        value={newPrerequisite}
                        onChange={(e) => setNewPrerequisite(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={addPrerequisite}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.prerequisites.map((pre, i) => (
                        <div
                          key={i}
                          className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                        >
                          {pre}
                          <button
                            type="button"
                            onClick={() => removePrerequisite(i)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      References
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add reference"
                        value={newReference}
                        onChange={(e) => setNewReference(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={addReference}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.references.map((ref, i) => (
                        <div
                          key={i}
                          className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                        >
                          {ref}
                          <button
                            type="button"
                            onClick={() => removeReference(i)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resources
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add resource"
                        value={newResource}
                        onChange={(e) => setNewResource(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={addResource}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.resources.map((res, i) => (
                        <div
                          key={i}
                          className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                        >
                          {res}
                          <button
                            type="button"
                            onClick={() => removeResource(i)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : editCourse ? (
                        "Update Course"
                      ) : (
                        "Add Course"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}

        {lectureForm.show && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {lectureForm.isEdit ? "Update" : "Add"} Lecture
                  </h2>
                  <button
                    onClick={() =>
                      setLectureForm({
                        show: false,
                        courseId: null,
                        data: {},
                        index: null,
                        isEdit: false,
                      })
                    }
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleLectureSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lecture Name
                    </label>
                    <input
                      type="text"
                      placeholder="Lecture Name"
                      value={lectureForm.data.name || ""}
                      onChange={(e) =>
                        setLectureForm({
                          ...lectureForm,
                          data: { ...lectureForm.data, name: e.target.value },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PDF File
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1">
                        <div className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) =>
                              setLectureForm({
                                ...lectureForm,
                                data: {
                                  ...lectureForm.data,
                                  pdfFile: e.target.files[0],
                                },
                              })
                            }
                            className="hidden"
                          />
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm">
                              {lectureForm.data.pdfFile?.name ||
                                (lectureForm.data.pdfUrl
                                  ? "Current file attached"
                                  : "Choose file")}
                            </span>
                          </div>
                        </div>
                      </label>
                      {lectureForm.data.pdfUrl && !lectureForm.data.pdfFile && (
                        <a
                          href={lectureForm.data.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com/video"
                      value={lectureForm.data.video || ""}
                      onChange={(e) =>
                        setLectureForm({
                          ...lectureForm,
                          data: { ...lectureForm.data, video: e.target.value },
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        setLectureForm({
                          show: false,
                          courseId: null,
                          data: {},
                          index: null,
                          isEdit: false,
                        })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : lectureForm.isEdit ? (
                        "Update Lecture"
                      ) : (
                        "Add Lecture"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteInfo && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {deleteInfo.type}? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteInfo(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteInfo.type === "course") {
                      deleteCourse(deleteInfo.id);
                    } else if (deleteInfo.type === "lecture") {
                      deleteLecture(deleteInfo.courseId, deleteInfo.index);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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
