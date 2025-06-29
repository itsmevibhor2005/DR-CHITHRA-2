import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory as buffers

// Custom file filter for different file types
const fileFilter = (req, file, cb) => {
  // For lecture PDFs (field name: 'pdf')
  if (file.fieldname === "pdf") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for lectures"), false);
    }
  }
  // For project images (accept both 'files' from frontend and 'images'/'newImages' for consistency)
  else if (
    file.fieldname === "files" ||
    file.fieldname === "images" ||
    file.fieldname === "newImages"
  ) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for projects"), false);
    }
  }
  // Reject any other files
  else {
    cb(new Error(`Unexpected file field: ${file.fieldname}`), false);
  }
};

// Main upload configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for all files
    files: 10, // Maximum number of files (for projects)
  },
});

// Specific middleware exports
export const uploadLecturePdf = upload.single("pdf"); // For single PDF uploads
export const uploadProjectImages = upload.array("images", 10); // Changed to accept 'files' field
export const uploadProjectNewImages = upload.array("images", 10); // Changed to accept 'files' field

export default upload;
