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
    queryFn: async () => {
      const response = await fetch("/api/job-postings");
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      return data;
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });

  const uniqueLocations = Array.from(
    new Set(jobs.map((job) => job.location))
  );
  const uniqueDepartments = Array.from(
    new Set(jobs.map((job) => job.department).filter(Boolean))
  );

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = searchTerm
      ? job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.department?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

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

  const formatJobDetails = (job: JobPosting) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-600">Department</h3>
          <p className="text-gray-900">{job.department}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-600">Location</h3>
          <p className="text-gray-900">{job.location}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-600">Employment Type</h3>
          <p className="text-gray-900">{job.employmentType}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-600">Posted Date</h3>
          <p className="text-gray-900">
            {new Date(job.postedDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="prose max-w-none">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <SafeHtml 
            html={job.description} 
            className="prose prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
          />
        </div>
        
        {job.requirements && job.requirements.length > 0 && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Requirements</h3>
            <ul className="list-disc pl-5 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="text-gray-700">{req}</li>
              ))}
            </ul>
          </div>
        )}

        {job.salary && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Salary Range</h3>
            <p className="text-gray-700">
              {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} per year
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const JobCard = ({ job, isSelected, onClick }: { job: JobPosting; isSelected: boolean; onClick: () => void }) => (
    <motion.div
      onClick={onClick}
      className={`p-6 rounded-xl transition-all cursor-pointer ${
        isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white hover:bg-gray-50'
      } border shadow-sm hover:shadow-md`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              <Clock className="w-4 h-4 mr-1" />
              {job.employmentType}
            </span>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(job.postedDate).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );

  const JobDetailsModal = ({ job, onClose, onApply }: { job: JobPosting; onClose: () => void; onApply: () => void }) => (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen px-4 py-8">
        <div className="bg-white rounded-2xl max-w-4xl mx-auto shadow-xl">
          <div className="p-6 border-b relative">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <MapPin className="w-4 h-4 mr-2" />
                {job.location}
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <Clock className="w-4 h-4 mr-2" />
                {job.employmentType}
              </span>
            </div>
            <Button
              onClick={onApply}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Apply Now
            </Button>
          </div>
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <SafeHtml html={job.description} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load jobs. Please try again later.</p>
      </div>
    );
  }

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
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  {selectedLocation || "All Locations"}
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {isLocationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 mt-2 w-48 bg-white rounded-xl shadow-lg border"
                  >
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
                  </motion.div>
                )}
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                  className="flex items-center gap-2"
                >
                  {selectedDepartment || "All Departments"}
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {isDepartmentOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 mt-2 w-48 bg-white rounded-xl shadow-lg border"
                  >
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
                  </motion.div>
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
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onClick={() => setSelectedJob(job)}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Job Details */}
          <AnimatePresence mode="wait">
            {selectedJob && (
              <JobDetailsModal
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
                onApply={() => handleApply(selectedJob.id)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
