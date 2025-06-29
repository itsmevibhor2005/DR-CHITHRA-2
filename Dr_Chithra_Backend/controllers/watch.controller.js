// controllers/watch.controller.js
import admin, { db } from "../config/firebase.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Main collection path
const MAIN_COLLECTION = "watch-out-for";

// 🔹 GET all competition items (Public)
export const getAllCompetitions = asyncHandler(async (req, res) => {
  try {
    const competitionsRef = db
      .collection(MAIN_COLLECTION)
      .doc("competitions")
      .collection("items");
    const snapshot = await competitionsRef.get();

    const competitions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res
      .status(200)
      .json(
        new ApiResponse(200, competitions, "Competitions fetched successfully")
      );
  } catch (error) {
    throw new ApiErrors(500, "Failed to fetch competitions");
  }
});

// 🔹 ADD new competition item (Authenticated)
export const addCompetition = asyncHandler(async (req, res) => {
  try {
    const { heading, link } = req.body;

    if (!heading || !link) {
      throw new ApiErrors(400, "Heading and link are required");
    }

    const competitionsRef = db
      .collection(MAIN_COLLECTION)
      .doc("competitions")
      .collection("items");
    const docRef = await competitionsRef.add({ heading, link });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: docRef.id },
          "Competition added successfully"
        )
      );
  } catch (error) {
    throw new ApiErrors(500, "Failed to add competition");
  }
});

// 🔹 UPDATE competition item (Authenticated)
export const updateCompetition = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, link } = req.body;

    if (!heading && !link) {
      throw new ApiErrors(400, "At least one field to update is required");
    }

    const competitionRef = db
      .collection(MAIN_COLLECTION)
      .doc("competitions")
      .collection("items")
      .doc(id);

    const updates = {};
    if (heading) updates.heading = heading;
    if (link) updates.link = link;

    await competitionRef.update(updates);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Competition updated successfully"));
  } catch (error) {
    throw new ApiErrors(500, "Failed to update competition");
  }
});

// 🔹 DELETE competition item (Authenticated)
export const deleteCompetition = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const competitionRef = db
      .collection(MAIN_COLLECTION)
      .doc("competitions")
      .collection("items")
      .doc(id);

    const doc = await competitionRef.get();

    if (!doc.exists) {
      throw new ApiErrors(404, "Competition not found");
    }

    await competitionRef.delete();
    res
      .status(200)
      .json(new ApiResponse(200, null, "Competition deleted successfully"));
  } catch (error) {
    throw new ApiErrors(500, error.message || "Failed to delete competition");
  }
});

// 🔹 GET all journal items (Public)
export const getAllJournals = asyncHandler(async (req, res) => {
  try {
    const journalsRef = db
      .collection(MAIN_COLLECTION)
      .doc("journals")
      .collection("items");
    const snapshot = await journalsRef.get();

    const journals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res
      .status(200)
      .json(new ApiResponse(200, journals, "Journals fetched successfully"));
  } catch (error) {
    throw new ApiErrors(500, "Failed to fetch journals");
  }
});

// 🔹 ADD new journal item (Authenticated)
export const addJournal = asyncHandler(async (req, res) => {
  try {
    const { heading, link } = req.body;

    if (!heading || !link) {
      throw new ApiErrors(400, "Heading and link are required");
    }

    const journalsRef = db
      .collection(MAIN_COLLECTION)
      .doc("journals")
      .collection("items");
    const docRef = await journalsRef.add({ heading, link });

    res
      .status(201)
      .json(
        new ApiResponse(201, { id: docRef.id }, "Journal added successfully")
      );
  } catch (error) {
    throw new ApiErrors(500, "Failed to add journal");
  }
});

// 🔹 UPDATE journal item (Authenticated)
export const updateJournal = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, link } = req.body;

    if (!heading && !link) {
      throw new ApiErrors(400, "At least one field to update is required");
    }

    const journalRef = db
      .collection(MAIN_COLLECTION)
      .doc("journals")
      .collection("items")
      .doc(id);

    const updates = {};
    if (heading) updates.heading = heading;
    if (link) updates.link = link;

    await journalRef.update(updates);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Journal updated successfully"));
  } catch (error) {
    throw new ApiErrors(500, "Failed to update journal");
  }
});

// 🔹 DELETE journal item (Authenticated)
export const deleteJournal = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const journalRef = db
      .collection(MAIN_COLLECTION)
      .doc("journals")
      .collection("items")
      .doc(id);

    const doc = await journalRef.get();

    if (!doc.exists) {
      throw new ApiErrors(404, "Journal not found");
    }

    await journalRef.delete();
    res
      .status(200)
      .json(new ApiResponse(200, null, "Journal deleted successfully"));
  } catch (error) {
    throw new ApiErrors(500, error.message || "Failed to delete journal");
  }
});

// 🔹 GET all read items (Public)
export const getAllReads = asyncHandler(async (req, res) => {
  try {
    const readsRef = db
      .collection(MAIN_COLLECTION)
      .doc("reads")
      .collection("items");
    const snapshot = await readsRef.get();

    const reads = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res
      .status(200)
      .json(new ApiResponse(200, reads, "Reads fetched successfully"));
  } catch (error) {
    throw new ApiErrors(500, "Failed to fetch reads");
  }
});

// 🔹 ADD new read item (Authenticated)
export const addRead = asyncHandler(async (req, res) => {
  try {
    const { heading, link } = req.body;

    if (!heading || !link) {
      throw new ApiErrors(400, "Heading and link are required");
    }

    const readsRef = db
      .collection(MAIN_COLLECTION)
      .doc("reads")
      .collection("items");
    const docRef = await readsRef.add({ heading, link });

    res
      .status(201)
      .json(new ApiResponse(201, { id: docRef.id }, "Read added successfully"));
  } catch (error) {
    throw new ApiErrors(500, "Failed to add read");
  }
});

// 🔹 UPDATE read item (Authenticated)
export const updateRead = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, link } = req.body;

    if (!heading && !link) {
      throw new ApiErrors(400, "At least one field to update is required");
    }

    const readRef = db
      .collection(MAIN_COLLECTION)
      .doc("reads")
      .collection("items")
      .doc(id);

    const updates = {};
    if (heading) updates.heading = heading;
    if (link) updates.link = link;

    await readRef.update(updates);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Read updated successfully"));
  } catch (error) {
    throw new ApiErrors(500, "Failed to update read");
  }
});

// 🔹 DELETE read item (Authenticated)
export const deleteRead = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const readRef = db
      .collection(MAIN_COLLECTION)
      .doc("reads")
      .collection("items")
      .doc(id);

    const doc = await readRef.get();

    if (!doc.exists) {
      throw new ApiErrors(404, "Read not found");
    }

    await readRef.delete();
    res
      .status(200)
      .json(new ApiResponse(200, null, "Read deleted successfully"));
  } catch (error) {
    throw new ApiErrors(500, error.message || "Failed to delete read");
  }
});
