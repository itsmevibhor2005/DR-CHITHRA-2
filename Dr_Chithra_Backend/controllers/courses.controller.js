// controllers/courseController.js

import admin, { db, storage } from "../config/firebase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v4 as uuidv4 } from "uuid";
// import { ref, uploadBytes, getDownloadURL } from "firebase-admin/storage";

// 🔹 GET all courses (Public)
export const getAllCourses = asyncHandler(async (req, res) => {
  try {
    const snapshot = await db.collection("courses").get();
    const courses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res
      .status(200)
      .json(new ApiResponse(200, courses, "Courses fetched successfully"));
  } catch (error) {
    throw new ApiErrors(500, "Failed to fetch courses");
  }
});

// 🔹 ADD new course (Authenticated)
export const addCourse = asyncHandler(async (req, res) => {
  try {
    const {
      course_name,
      course_code,
      description,
      prerequisites = "[]",
      references = "[]",
      resources = "[]",
      venue = "",
      lectures = "[]",
    } = req.body;

    // Parse fields safely
    const parsedLectures = JSON.parse(lectures);
    const parsedPrerequisites = JSON.parse(prerequisites);
    const parsedReferences = JSON.parse(references);
    const parsedResources = JSON.parse(resources);

    const pdfFiles = req.files || [];
    const bucket = admin.storage().bucket();

    // Handle cover image upload if exists
    let coverImageUrl = null;
    if (req.file) {
      const coverImageName = `covers/${uuidv4()}_${req.file.originalname}`;
      const coverImageFile = bucket.file(coverImageName);
      await coverImageFile.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype },
      });
      coverImageUrl = await coverImageFile.getSignedUrl({
        action: "read",
        expires: "03-09-2491", // Far future date
      });
      coverImageUrl = coverImageUrl[0]; // getSignedUrl returns an array
    }

    // Handle lecture PDFs
    for (let i = 0; i < parsedLectures.length; i++) {
      const file = pdfFiles[i];
      if (file) {
        const uniqueName = `lectures/${uuidv4()}_${file.originalname}`;
        const fileUpload = bucket.file(uniqueName);
        await fileUpload.save(file.buffer, {
          metadata: { contentType: file.mimetype },
        });

        const [downloadURL] = await fileUpload.getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        });

        parsedLectures[i].pdf = downloadURL;
        parsedLectures[i].pdfPath = uniqueName; // Store path for deletion later
      }
    }

    const docRef = await db.collection("courses").add({
      course_name,
      course_code,
      cover_image: coverImageUrl,
      description,
      lectures: parsedLectures,
      prerequisites: parsedPrerequisites,
      references: parsedReferences,
      resources: parsedResources,
      venue,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, { id: docRef.id }, "Course added successfully")
      );
  } catch (error) {
    console.error("Add Course Error:", error);
    throw new ApiErrors(500, "Failed to add course");
  }
});
  
  

// 🔹 UPDATE course (Authenticated)
export const updateCourse = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if course exists
    const courseDoc = await db.collection("courses").doc(id).get();
    if (!courseDoc.exists) {
      throw new ApiError(404, "Course not found");
    }

    // Handle cover image upload if present
    if (req.file) {
      // Process the image (upload to cloud storage, etc.)
      const coverImageUrl = await uploadToCloudinary(req.file);
      updates.coverImage = coverImageUrl;
    }

    // Update the course document
    await db.collection("courses").doc(id).update(updates);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Course updated successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Failed to update course"
        )
      );
  }
});

// 🔹 DELETE course (Authenticated)
export const deleteCourse = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const courseDoc = await db.collection("courses").doc(id).get();

    if (!courseDoc.exists) {
      throw new ApiErrors(404, "Course not found");
    }

    const courseData = courseDoc.data();
    const lectures = courseData.lectures || [];

    const bucket = admin.storage().bucket();

    // Delete all lecture PDFs
    for (const lecture of lectures) {
      if (lecture.pdfPath) {
        // Use pdfPath instead of pdf URL
        const file = bucket.file(lecture.pdfPath);
        try {
          await file.delete();
        } catch (err) {
          console.error("Failed to delete file:", lecture.pdfPath, err);
        }
      }
    }

    // Delete cover image if exists
    if (courseData.cover_image) {
      try {
        // Extract path from URL or store path separately like with PDFs
        // This assumes you stored the path separately - adjust as needed
        const coverPath = courseData.cover_image_path;
        if (coverPath) {
          await bucket.file(coverPath).delete();
        }
      } catch (err) {
        console.error("Failed to delete cover image:", err);
      }
    }

    await db.collection("courses").doc(id).delete();
    res
      .status(200)
      .json(new ApiResponse(200, null, "Course deleted successfully"));
  } catch (error) {
    throw new ApiErrors(500, error.message || "Failed to delete course");
  }
});

// 🔹 ADD lecture to a course (Authenticated)
// 🔹 ADD lecture to a course (Authenticated)
export const addLecture = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { name, video } = req.body;
      const pdfFile = req.file;
      // Validate course exists
      const courseRef = db.collection("courses").doc(id);
      const courseDoc = await courseRef.get();
      
      if (!courseDoc.exists) {
        throw new ApiErrors(404, "Course not found");
      }
  
      const bucket = admin.storage().bucket();
      let pdfUrl = null;
      let pdfPath = null;
  
      // Handle PDF upload if exists
      if (pdfFile) {
        pdfPath = `lectures/${uuidv4()}_${pdfFile.originalname}`;
        const fileUpload = bucket.file(pdfPath);
        await fileUpload.save(pdfFile.buffer, {
          metadata: { contentType: pdfFile.mimetype },
        });
        
        [pdfUrl] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-09-2491'
        });
      }
  
      // Create new lecture object
      const newLecture = {
        name,
        pdf: pdfUrl,
        pdfPath: pdfPath,
        video: video || null,
        createdAt: new Date().toISOString() // Using client-side timestamp
      };
  
      // Add lecture to course's lectures array
      await courseRef.update({
        lectures: admin.firestore.FieldValue.arrayUnion(newLecture)
      });
  
      res
        .status(201)
        .json(new ApiResponse(201, newLecture, "Lecture added successfully"));
    } catch (error) {
      console.error("Add Lecture Error:", error);
      throw new ApiErrors(500, error.message || "Failed to add lecture");
    }
  });
  
  // 🔹 UPDATE lecture in a course (Authenticated)
// 🔹 UPDATE lecture in a course (Authenticated)
export const updateLecture = asyncHandler(async (req, res) => {
    try {
      const { courseId, lectureIndex } = req.params;
      const { name, video } = req.body;
      const pdfFile = req.file;
  
      // Validate course exists
      const courseRef = db.collection("courses").doc(courseId);
      const courseDoc = await courseRef.get();
      
      if (!courseDoc.exists) {
        throw new ApiErrors(404, "Course not found");
      }
  
      const courseData = courseDoc.data();
      const lectures = courseData.lectures || [];
      
      // Validate lecture exists
      if (lectureIndex >= lectures.length || lectureIndex < 0) {
        throw new ApiErrors(404, "Lecture not found");
      }
  
      const bucket = admin.storage().bucket();
      const updatedLecture = { ...lectures[lectureIndex] };
  
      // Update fields if provided
      if (name) updatedLecture.name = name;
      if (video !== undefined) updatedLecture.video = video;
  
      // Handle PDF update if new file provided
      if (pdfFile) {
        // Delete old PDF if exists
        if (updatedLecture.pdfPath) {
          try {
            await bucket.file(updatedLecture.pdfPath).delete();
          } catch (err) {
            console.error("Failed to delete old PDF:", err);
          }
        }
  
        // Upload new PDF
        const pdfPath = `lectures/${uuidv4()}_${pdfFile.originalname}`;
        const fileUpload = bucket.file(pdfPath);
        await fileUpload.save(pdfFile.buffer, {
          metadata: { contentType: pdfFile.mimetype },
        });
        
        [updatedLecture.pdf] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-09-2491'
        });
        updatedLecture.pdfPath = pdfPath;
      }
  
      // Update the lecture in the array
      lectures[lectureIndex] = updatedLecture;
  
      await courseRef.update({ lectures });
  
      res
        .status(200)
        .json(new ApiResponse(200, updatedLecture, "Lecture updated successfully"));
    } catch (error) {
      console.error("Update Lecture Error:", error);
      throw new ApiErrors(500, error.message || "Failed to update lecture");
    }
  });
  
  // 🔹 DELETE lecture from a course (Authenticated)
 // 🔹 DELETE lecture from a course (Authenticated)
export const deleteLecture = asyncHandler(async (req, res) => {
    try {
      const { courseId, lectureIndex } = req.params;
  
      // Validate course exists
      const courseRef = db.collection("courses").doc(courseId);
      const courseDoc = await courseRef.get();
      
      if (!courseDoc.exists) {
        throw new ApiErrors(404, "Course not found");
      }
  
      const courseData = courseDoc.data();
      const lectures = courseData.lectures || [];
      
      // Validate lecture exists
      if (lectureIndex >= lectures.length || lectureIndex < 0) {
        throw new ApiErrors(404, "Lecture not found");
      }
  
      const lectureToDelete = lectures[lectureIndex];
  
      // Delete associated PDF if exists
      if (lectureToDelete.pdfPath) {
        const bucket = admin.storage().bucket();
        try {
          await bucket.file(lectureToDelete.pdfPath).delete();
        } catch (err) {
          console.error("Failed to delete PDF:", err);
        }
      }
  
      // Remove lecture from array
      lectures.splice(lectureIndex, 1);
  
      await courseRef.update({ lectures });
  
      res
        .status(200)
        .json(new ApiResponse(200, null, "Lecture deleted successfully"));
    } catch (error) {
      console.error("Delete Lecture Error:", error);
      throw new ApiErrors(500, error.message || "Failed to delete lecture");
    }
  });