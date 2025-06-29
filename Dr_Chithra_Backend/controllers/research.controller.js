import admin, { db } from "../config/firebase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v4 as uuidv4 } from "uuid";

const MAIN_COLLECTION = "research";

// 🔹 INTERESTS SECTION

// GET all interests (Public)
const INTERESTS_DOC_ID = "main"; // fixed ID to ensure only one document

export const getAllInterests = asyncHandler(async (req, res) => {
  const doc = await db.collection(MAIN_COLLECTION).doc("interests").get();

  if (!doc.exists) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No interest document yet"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, [doc.data()], "Interest document fetched"));
});

export const addOrUpdateInterest = asyncHandler(async (req, res) => {
  const { heading, paragraph, interests } = req.body;

  if (!heading || !paragraph || !Array.isArray(interests)) {
    throw new ApiErrors(
      400,
      "Heading, paragraph and interests array are required"
    );
  }

  const data = {
    heading,
    paragraph,
    interests: interests.map((item) => ({
      id: item.id || uuidv4(), // ensure unique ID for each interest
      heading: item.heading || "",
      description: item.description || "",
    })),
  };

  await db.collection(MAIN_COLLECTION).doc("interests").set(data); // merge = false: overwrite

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Interest document created/updated successfully"
      )
    );
});

// 🔹 PROJECTS SECTION

// GET all projects (Public)


const MAIN_COLLECTION2 = "research";
const bucket = admin.storage().bucket();

// 🔹 PROJECTS SECTION WITH IMAGE HANDLING

// GET all projects (Public)
export const getAllProjects = asyncHandler(async (req, res) => {
  try {
    const projectsRef = db
      .collection(MAIN_COLLECTION2)
      .doc("projects")
      .collection("items");
    const snapshot = await projectsRef.get();

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res
      .status(200)
      .json(new ApiResponse(200, projects, "Projects fetched successfully"));
  } catch (error) {
    throw new ApiErrors(500, "Failed to fetch projects");
  }
});

// ADD new project (Authenticated)
export const addProject = asyncHandler(async (req, res) => {
  try {
    const { heading, description } = req.body;
    const files = req.files || [];

    if (!heading || !description) {
      throw new ApiErrors(400, "Heading and description are required");
    }

    // Process image uploads
    const imageUrls = [];
    for (const file of files) {
      const fileName = `projects/${uuidv4()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      const [downloadURL] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-09-2491", // Far future date
      });

      imageUrls.push({
        url: downloadURL,
        path: fileName,
      });
    }

    const projectsRef = db
      .collection(MAIN_COLLECTION2)
      .doc("projects")
      .collection("items");
    const docRef = await projectsRef.add({
      heading,
      description,
      images: imageUrls,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, { id: docRef.id }, "Project added successfully")
      );
  } catch (error) {
    console.error("Add Project Error:", error);
    throw new ApiErrors(500, "Failed to add project");
  }
});

// UPDATE project (Authenticated)
export const updateProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, description } = req.body;
    const newFiles = req.files || [];

    let imagesToDelete = [];

    try {
      if (req.body.imagesToDelete) {
        imagesToDelete = JSON.parse(req.body.imagesToDelete);
      }
    } catch (err) {
      console.error("Invalid imagesToDelete JSON:", req.body.imagesToDelete);
      imagesToDelete = [];
    }

    if (!heading && !description && !newFiles.length && !imagesToDelete) {
      throw new ApiErrors(400, "At least one field to update is required");
    }

    const projectRef = db
      .collection(MAIN_COLLECTION2)
      .doc("projects")
      .collection("items")
      .doc(id);

    const doc = await projectRef.get();
    if (!doc.exists) {
      throw new ApiErrors(404, "Project not found");
    }

    const projectData = doc.data();
    let currentImages = projectData.images || [];

    // Delete specified images
    for (const imagePath of imagesToDelete) {
      try {
        await bucket.file(imagePath).delete();
        currentImages = currentImages.filter((img) => img.path !== imagePath);
      } catch (err) {
        console.error("Failed to delete image:", imagePath, err);
      }
    }
    

    // Add new images
    const newImageUrls = [];
    for (const file of newFiles) {
      const fileName = `projects/${uuidv4()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      const [downloadURL] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      newImageUrls.push({
        url: downloadURL,
        path: fileName,
      });
    }

    const updates = {};
    if (heading) updates.heading = heading;
    if (description) updates.description = description;
    updates.images = [...currentImages, ...newImageUrls];

    await projectRef.update(updates);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Project updated successfully"));
  } catch (error) {
    console.error("Update Project Error:", error);
    throw new ApiErrors(500, "Failed to update project");
  }
});

// DELETE project (Authenticated)
export const deleteProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const projectRef = db
      .collection(MAIN_COLLECTION2)
      .doc("projects")
      .collection("items")
      .doc(id);

    const doc = await projectRef.get();
    if (!doc.exists) {
      throw new ApiErrors(404, "Project not found");
    }

    // Delete all associated images
    const projectData = doc.data();
    if (projectData.images && Array.isArray(projectData.images)) {
      for (const image of projectData.images) {
        try {
          await bucket.file(image.path).delete();
        } catch (err) {
          console.error("Failed to delete image:", image.path, err);
        }
      }
    }

    await projectRef.delete();
    res
      .status(200)
      .json(new ApiResponse(200, null, "Project deleted successfully"));
  } catch (error) {
    console.error("Delete Project Error:", error);
    throw new ApiErrors(500, error.message || "Failed to delete project");
  }
});