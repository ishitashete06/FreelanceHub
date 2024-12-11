import SavedProject from "../models/SavedProject.js";

export const saveProject = async (req, res) => {
  try {
    const { jobId } = req.body;  // Ensure jobId is extracted correctly
    const userId = req.id;
    //console.log("User ID:", userId);

    if (!jobId) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    // Check if the job is already saved
    const existing = await SavedProject.findOne({ userId, jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Job already saved" });
    }

    // Save the job
    const savedJob = new SavedProject({ userId, jobId});
    await savedJob.save();

    res.status(201).json({ success: true, message: "Job saved successfully", savedJob });
  } catch (error) {
    console.error("Error in saving job:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSavedProjects = async (req, res) => {
  try {
    const userId = req.id;

    // Fetch saved projects and populate the nested fields
    const savedProjects = await SavedProject.find({ userId })
      .populate({
        path: "jobId", // Populate the jobId field
        populate: {
          path: "company", // Populate the company field nested inside jobId
          select: "name website location logo description", // Fields to include from the Company model
        },
      })
      .populate({
        path: "userId", // Optionally populate user details if needed
        select: "fullname email phoneNumber", // Fields to include from the User model
      });

    res.status(200).json({ success: true, savedProjects });
  } catch (error) {
    console.error("Error fetching saved projects:", error.message);
    res.status(500).json({ success: false, message: "Error fetching saved projects" });
  }
};

