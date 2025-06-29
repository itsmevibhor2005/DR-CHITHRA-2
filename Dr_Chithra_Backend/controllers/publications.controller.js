// controllers/publicationsController.js
import { db } from "../config/firebase.js"; // your firestore init
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const validSections = ["journals", "conferences", "thesis", "patents"];

// 🔹 Get All
export const getPublications = asyncHandler(async (req, res) => {
  const { section } = req.params;
  if (!validSections.includes(section))
    throw new ApiErrors(400, "Invalid section");

  const snapshot = await db.collection(`publications/${section}/items`).get();
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  res.status(200).json(new ApiResponse(200, data, "Fetched successfully"));
});

// 🔹 Add
export const addPublication = asyncHandler(async (req, res) => {
  const { section } = req.params;
    const heading = req.body.heading;
  const description = req.body.description;
    const link = req.body.link || null; // optional field
    
  if (!validSections.includes(section))
    throw new ApiErrors(400, "Invalid section");
  if (!heading || !description)
    throw new ApiErrors(400, "Heading and description are required");

  const docRef = await db
    .collection(`publications/${section}/items`)
    .add({ heading, description, link });
  res
    .status(201)
    .json(new ApiResponse(201, { id: docRef.id }, "Added successfully"));
});

// 🔹 Update
export const updatePublication = asyncHandler(async (req, res) => {
  const { section, id } = req.params;
  const { heading, description, link } = req.body;

  if (!validSections.includes(section))
    throw new ApiErrors(400, "Invalid section");

  const docRef = db.collection(`publications/${section}/items`).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) throw new ApiErrors(404, "Publication not found");

  await docRef.update({ heading, description, link });
  res.status(200).json(new ApiResponse(200, null, "Updated successfully"));
});

// 🔹 Delete
export const deletePublication = asyncHandler(async (req, res) => {
  const { section, id } = req.params;

  if (!validSections.includes(section))
    throw new ApiErrors(400, "Invalid section");

  const docRef = db.collection(`publications/${section}/items`).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) throw new ApiErrors(404, "Publication not found");

  await docRef.delete();
  res.status(200).json(new ApiResponse(200, null, "Deleted successfully"));
});
