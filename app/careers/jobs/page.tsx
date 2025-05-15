"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock, ChevronDown, X, Building2, Briefcase } from "lucide-react";
import { JobPosting } from "@/types/jobPosting";
import Loader from "@/components/Loader";
import { SafeHtml } from "@/components/ui/safe-html";
import { useUser } from "@clerk/nextjs";

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

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-500">Failed to load jobs. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 -mt-[60px]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#272055] to-[#1D1840] text-white py-16">
        <div className="container mx-auto px-4 ">
          <h1 className="text-4xl font-bold text-white mb-6">Join Our Team</h1>
          <div className="max-w-3xl">
            <div className="bg-white rounded-xl shadow-lg p-2 flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search for jobs, departments, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 focus:outline-none text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="relative group hover:border-blue-500"
          >
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span>{selectedLocation || "All Locations"}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
            {isLocationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
              >
                {uniqueLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => {
                      setSelectedLocation(location);
                      setIsLocationOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700"
                  >
                    {location}
                  </button>
                ))}
              </motion.div>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
            className="relative group hover:border-purple-500"
          >
            <Building2 className="w-4 h-4 mr-2 text-purple-500" />
            <span>{selectedDepartment || "All Departments"}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
            {isDepartmentOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
              >
                {uniqueDepartments.map((department) => (
                  <button
                    key={department}
                    onClick={() => {
                      setSelectedDepartment(department || "");
                      setIsDepartmentOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-purple-50 text-gray-700"
                  >
                    {department}
                  </button>
                ))}
              </motion.div>
            )}
          </Button>

          {(selectedLocation || selectedDepartment) && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedLocation("");
                setSelectedDepartment("");
              }}
              className="text-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              {filteredJobs.length} Available Positions
            </h2>
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

          {/* Job Details Section */}
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
