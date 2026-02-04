'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Job, Company, Application, JobFilters } from '@/types';
import { mockJobs, mockCompanies, mockApplications, filterJobs } from '@/lib/mockData';

interface DataContextType {
  jobs: Job[];
  companies: Company[];
  applications: Application[];
  getJobById: (id: string) => Job | undefined;
  getJobBySlug: (slug: string) => Job | undefined;
  getCompanyById: (id: string) => Company | undefined;
  searchJobs: (filters: JobFilters) => Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  addApplication: (application: Application) => void;
  getApplicationsByJob: (jobId: string) => Application[];
  getApplicationsByUser: (userId: string) => Application[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [companies] = useState<Company[]>(mockCompanies);
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  const getJobById = useCallback((id: string) => {
    return jobs.find(j => j.id === id);
  }, [jobs]);

  const getJobBySlug = useCallback((slug: string) => {
    return jobs.find(j => j.slug === slug);
  }, [jobs]);

  const getCompanyById = useCallback((id: string) => {
    return companies.find(c => c.id === id);
  }, [companies]);

  const searchJobs = useCallback((filters: JobFilters) => {
    return filterJobs(jobs, filters);
  }, [jobs]);

  const addJob = useCallback((job: Job) => {
    setJobs(prev => [...prev, job]);
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === id ? { ...job, ...updates } : job
    ));
  }, []);

  const addApplication = useCallback((application: Application) => {
    setApplications(prev => [...prev, application]);
    // Also update job's applicants list
    setJobs(prev => prev.map(job => 
      job.id === application.jobId
        ? { ...job, applicants: [...(job.applicants || []), application.userId] }
        : job
    ));
  }, []);

  const getApplicationsByJob = useCallback((jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  }, [applications]);

  const getApplicationsByUser = useCallback((userId: string) => {
    return applications.filter(app => app.userId === userId);
  }, [applications]);

  return (
    <DataContext.Provider
      value={{
        jobs,
        companies,
        applications,
        getJobById,
        getJobBySlug,
        getCompanyById,
        searchJobs,
        addJob,
        updateJob,
        addApplication,
        getApplicationsByJob,
        getApplicationsByUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
