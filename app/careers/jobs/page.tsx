"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock, ChevronDown, X } from "lucide-react";
import { JobPosting } from "@/types/jobPosting";
import Loader from "@/components/Loader";
import { SafeHtml } from "@/components/ui/safe-html";
import { useUser } from "@clerk/nextjs";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery<JobPosting[]>({
    queryKey: ["jobs"],
    queryFn: () => fetch("/api/job-postings").then((res) => res.json()),
  });

  const uniqueLocations = Array.from(
    new Set(jobs.map((job) => job.location))
  );
  const uniqueDepartments = Array.from(
    new Set(jobs.map((job) => job.department).filter(Boolean))
  );

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.department?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesDepartment = !selectedDepartment || job.department === selectedDepartment;

    return matchesSearch && matchesLocation && matchesDepartment;
  });

  const handleApply = (jobId: string) => {
    if (!isSignedIn) {
      sessionStorage.setItem("pendingJobApplication", jobId);
      router.push("/login?redirect=/dashboard/apply");
      return;
    }

    router.push(`/dashboard/apply/${jobId}`);
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to load jobs</div>;

  return (
    <div className="min-h-screen bg-white -mt-[60px]">
      <div className="bg-gradient-to-r from-[#272055] to-[#1D1840] text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Open Positions
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
          Join a team where innovation meets impact and shape the
           future of technology!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Search Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for jobs or keywords"
                className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="w-full sm:w-auto px-8 py-3 bg-[#272055] hover:bg-[#272055]/90 text-white rounded-md">
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <MapPin className="w-4 h-4" />
                {selectedLocation || "Location"}
                <ChevronDown className="w-4 h-4" />
              </button>
              {isLocationOpen && uniqueLocations.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {uniqueLocations.map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        setSelectedLocation(location);
                        setIsLocationOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                {selectedDepartment || "Department"}
                <ChevronDown className="w-4 h-4" />
              </button>
              {isDepartmentOpen && uniqueDepartments.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {uniqueDepartments.map((department) => (
                    <button
                      key={department}
                      onClick={() => {
                        setSelectedDepartment(department || "");
                        setIsDepartmentOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      {department}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {(selectedLocation || selectedDepartment) && (
              <button
                onClick={() => {
                  setSelectedLocation("");
                  setSelectedDepartment("");
                }}
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 text-red-500"
              >
                Clear Filters
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 relative">
          {/* Left Side - Job Listings */}
          <div
            className={`flex-1 transition-all duration-300 ${
              selectedJob ? "lg:max-w-[50%]" : "max-w-full"
            }`}
          >
            <div className="mb-6">
              <h2 className="text-lg font-medium">
                {filteredJobs.length || 0} JOBS FOUND
              </h2>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  className={`p-6 border rounded-lg cursor-pointer transition-all
                    ${
                      selectedJob?.id === job.id
                        ? "border-[#33CCFF] bg-[#33CCFF]/10"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <h3 className="text-lg font-semibold mb-3">{job.title}</h3>
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Full time
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">R-{job.id}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side - Job Details */}
          <AnimatePresence mode="wait">
            {selectedJob && (
              <motion.div
                className={`fixed lg:relative inset-0 lg:inset-auto lg:w-[50%] bg-white z-50 lg:z-auto
                  ${selectedJob ? "lg:sticky lg:top-4" : ""} 
                  h-screen lg:h-[calc(100vh-8rem)] overflow-hidden border border-gray-200 rounded-lg`}
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
              >
                <div className="h-full overflow-y-auto">
                  <div className="p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl sm:text-2xl font-bold">
                        {selectedJob.title}
                      </h2>
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <Button
                      onClick={() => handleApply(selectedJob.id)}
                      className="w-full bg-[#33CCFF] hover:bg-[#272055]/90 text-white"
                    >
                      Apply
                    </Button>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-gray-500">
                            Department
                          </h3>
                          <p>{selectedJob.department}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-500">
                            Location
                          </h3>
                          <p>{selectedJob.location}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-500">
                            Position Type
                          </h3>
                          <p>Full time</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-500">
                            Posted Date
                          </h3>
                          <p>
                            {new Date(
                              selectedJob.postedDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="prose max-w-none">
                        <SafeHtml html={selectedJob.description} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
