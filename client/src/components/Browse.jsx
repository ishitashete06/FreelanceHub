import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import "../styles/SwipeProject.css";
import { FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Browse = () => {
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState([]); // Track bookmarked job IDs
  const [rejectedIds, setRejectedIds] = useState([]); // Track rejected job IDs
  const [swipeDirection, setSwipeDirection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/saved-projects", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data.success) {
          const savedIds = data.savedProjects.map((project) => project.jobId._id);
          setBookmarkedIds(savedIds); // Initialize with already saved jobs
        } else {
          console.error("Failed to fetch saved projects:", data.message);
        }
      } catch (error) {
        console.error("Error fetching saved projects:", error.message);
      }
    };

    fetchSavedJobs();

    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  const saveJobToBackend = async (jobId) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/saved-projects/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ jobId }),
      });
      const data = await response.json();

      if (!data.success) {
        console.error("Failed to save job:", data.message);
      } else {
        //console.log("Job saved successfully:", data.savedProject);
      }
    } catch (error) {
      console.error("Error saving job to backend:", error);
    }
  };

  const swipe = (direction) => {
    if (currentIndex >= allJobs.length) return;

    const currentJob = filteredJobs[currentIndex];
    if (!currentJob || !currentJob._id) return;

    setSwipeDirection(direction);

    if (direction === "swipe-right") {
      // Bookmark the job - add to bookmarked and save to backend
      setBookmarkedIds((prev) => [...prev, currentJob._id]);
      saveJobToBackend(currentJob._id);
    } else if (direction === "swipe-left") {
      // Reject the job - add to rejected jobs
      setRejectedIds((prev) => [...prev, currentJob._id]);
    }

    // Move to the next job in the list
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        // If we've reached the end of the available jobs, reset to 0 for circular behavior
        const nextIndex = prevIndex + 1;
        return nextIndex < filteredJobs.length ? nextIndex : 0; // Circular loop
      });
      setSwipeDirection(null);
    }, 500);
  };

  // Filter out bookmarked jobs and include rejected jobs in the loop
  const filteredJobs = allJobs
    .filter((job) => 
      !bookmarkedIds.includes(job._id) && // Exclude bookmarked jobs
      (rejectedIds.includes(job._id) || !rejectedIds.includes(job._id)) // Include rejected jobs in the cycle
    );

  const currentJob = currentIndex < filteredJobs.length ? filteredJobs[currentIndex] : null;
  const hasMoreJobs = filteredJobs.length > 0;

  const handleSavedProjectsClick = () => {
    navigate("/saved-projects");
  };

  return (
    <div>
      <Navbar />
      <div className="swipe-container">
        <header className="swipe-header">
          <h1>Explore Projects ({filteredJobs.length})</h1>
          <p>
            Your right-swiped projects will be available in your dashboard.
            Discover exciting opportunities below!
          </p>
          <FaBookmark className="saved-icon" onClick={handleSavedProjectsClick} />
        </header>

        {hasMoreJobs && currentJob ? (
          <div className={`card ${swipeDirection}`}>
            <div className="project-image-container">
              <img
                src={currentJob.company.logo || "default-logo-url.jpg"}
                alt={currentJob.company.name}
                className="project-image"
              />
            </div>
            <div className="card-content">
              <h2>{currentJob.title}</h2>
              <p>{currentJob.description}</p>
              <div className="details">
                <p>
                  <strong>Company:</strong> {currentJob.company.name}
                </p>
                <p>
                  <strong>Location:</strong> {currentJob.location}
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={currentJob.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {currentJob.company.website}
                  </a>
                </p>
                <p>
                  <strong>Salary:</strong> INR {currentJob.salary}
                </p>
                <p>
                  <strong>Experience:</strong> {currentJob.experienceLevel} years
                </p>
              </div>
            </div>
            <div className="buttons">
              <button
                onClick={() => swipe("swipe-left")}
                className="swipe-btn left"
              >
                ❌
              </button>
              <button
                onClick={() => swipe("swipe-right")}
                className="swipe-btn right"
              >
                ✔
              </button>
            </div>
          </div>
        ) : (
          <div className="end-card">
            <h2>No more projects to explore</h2>
            <p>
              Time to level up your skills! Click the button below to dive in
              and discover more opportunities!
            </p>
            <button
              className="explore-btn"
              onClick={() => navigate("/skill-development")}
            >
              Explore Skills
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;