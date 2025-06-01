import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { GitBranch, Layers, Terminal, Cloud, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

/**
 * Deployment & DevOps Component for EdPsych Connect
 * Provides an overview and management interface for deployment pipelines, CI/CD processes,
 * environment management, and release tracking.
 */
const DeploymentDevOps = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('pipelines');
  const [isLoading, setIsLoading] = useState(false);

  // Sample deployment pipeline data
  const [pipelineData, setPipelineData] = useState([
    {
      id: 'pipeline1',
      name: 'Production Deployment',
      branch: 'main',
      lastRun: '2 hours ago',
      duration: '8m 15s',
      status: 'Success',
      trigger: 'Manual',
      stages: [
        { name: 'Build', status: 'Success', duration: '2m 30s' },
        { name: 'Test', status: 'Success', duration: '3m 10s' },
        { name: 'Deploy to Staging', status: 'Success', duration: '1m 15s' },
        { name: 'Approve Production', status: 'Success', duration: '0m 10s' },
        { name: 'Deploy to Production', status: 'Success', duration: '1m 10s' }
      ]
    },
    {
      id: 'pipeline2',
      name: 'Staging Deployment',
      branch: 'develop',
      lastRun: '45 minutes ago',
      duration: '6m 45s',
      status: 'Success',
      trigger: 'Push to develop',
      stages: [
        { name: 'Build', status: 'Success', duration: '2m 25s' },
        { name: 'Test', status: 'Success', duration: '3m 05s' },
        { name: 'Deploy to Staging', status: 'Success', duration: '1m 15s' }
      ]
    },
    {
      id: 'pipeline3',
      name: 'Feature Branch Deployment',
      branch: 'feature/new-dashboard',
      lastRun: '1 day ago',
      duration: '7m 05s',
      status: 'Failed',
      trigger: 'Push to feature branch',
      stages: [
        { name: 'Build', status: 'Success', duration: '2m 40s' },
        { name: 'Test', status: 'Failed', duration: '3m 25s' },
        { name: 'Deploy to Dev Env', status: 'Skipped', duration: 'N/A' }
      ]
    }
  ]);

  // Sample environment data
  const [environmentData, setEnvironmentData] = useState([
    {
      id: 'prod',
      name: 'Production',
      url: 'https://edpsychconnect.com',
      status: 'Healthy',
      version: 'v1.2.1',
      lastDeployed: '2 hours ago',
      resources: { cpu: '60%', memory: '70%', instances: 5 }
    },
    {
      id: 'staging',
      name: 'Staging',
      url: 'https://staging.edpsychconnect.com',
      status: 'Healthy',
      version: 'v1.3.0-rc1',
      lastDeployed: '45 minutes ago',
      resources: { cpu: '40%', memory: '55%', instances: 2 }
    },
    {
      id: 'dev',
      name: 'Development',
      url: 'https://dev.edpsychconnect.com',
      status: 'Healthy',
      version: 'feature/new-dashboard',
      lastDeployed: '1 day ago',
      resources: { cpu: '30%', memory: '45%', instances: 1 }
    }
  ]);

  // Sample release data
  const [releaseData, setReleaseData] = useState([
    {
      id: 'release1',
      version: 'v1.2.1',
      date: '2 hours ago',
      notes: 'Hotfix for user profile update issue. Improved database query performance.',
      deployedTo: ['Production'],
      commits: 5,
      author: 'AI Assistant'
    },
    {
      id: 'release2',
      version: 'v1.2.0',
      date: '3 days ago',
      notes: 'Implemented Community & Collaboration features. Enhanced accessibility options. Updated dependencies.',
      deployedTo: ['Production'],
      commits: 45,
      author: 'AI Assistant'
    },
    {
      id: 'release3',
      version: 'v1.1.0',
      date: '1 week ago',
      notes: 'Launched AI Avatar Video System and core AI components. Added Mobile & PWA support.',
      deployedTo: ['Production'],
      commits: 62,
      author: 'AI Assistant'
    }
  ]);

  // Function to trigger a pipeline run
  const triggerPipeline = (pipelineId) => {
    console.log(`Triggering pipeline ${pipelineId}`);
    // In a real implementation, this would call a CI/CD API
    alert(`Pipeline ${pipelineId} run initiated.`);
  };

  // Function to view pipeline logs
  const viewPipelineLogs = (pipelineId) => {
    console.log(`Viewing logs for pipeline ${pipelineId}`);
    // In a real implementation, this would open the logs view
    alert(`Opening logs for pipeline ${pipelineId}.`);
  };

  // Function to view environment details
  const viewEnvironmentDetails = (envId) => {
    console.log(`Viewing details for environment ${envId}`);
    // In a real implementation, this would navigate to the environment details page
    alert(`Navigating to details for environment ${envId}.`);
  };

  // Function to view release notes
  const viewReleaseNotes = (releaseId) => {
    console.log(`Viewing release notes for ${releaseId}`);
    // In a real implementation, this would show the full release notes
    alert(`Displaying release notes for ${releaseId}.`);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Deployment & DevOps
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage CI/CD pipelines, environments, and releases
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('pipelines')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'pipelines'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 mr-2" />
              <span>CI/CD Pipelines</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('environments')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'environments'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              <span>Environments</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('releases')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'releases'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Cloud className="h-4 w-4 mr-2" />
              <span>Releases</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* CI/CD Pipelines Tab */}
        {activeTab === 'pipelines' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                CI/CD Pipelines
              </h3>
              <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                Create Pipeline
              </button>
            </div>

            <div className="space-y-4">
              {pipelineData.map(pipeline => (
                <div 
                  key={pipeline.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                        {pipeline.name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <GitBranch className="h-4 w-4 mr-1" />
                        <span className="mr-3">Branch: {pipeline.branch}</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="mr-3">Last Run: {pipeline.lastRun}</span>
                        <span>Duration: {pipeline.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pipeline.status === 'Success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : pipeline.status === 'Failed'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                      }`}>
                        {pipeline.status}
                      </span>
                      <button 
                        onClick={() => triggerPipeline(pipeline.id)}
                        className="p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        title="Run Pipeline"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => viewPipelineLogs(pipeline.id)}
                        className="p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                        title="View Logs"
                      >
                        <Terminal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {pipeline.stages.map((stage, index) => (
                      <div 
                        key={index}
                        className="flex items-center px-3 py-1.5 rounded-full border dark:border-gray-700 whitespace-nowrap"
                      >
                        {stage.status === 'Success' && <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />}
                        {stage.status === 'Failed' && <XCircle className="h-4 w-4 text-red-500 mr-1.5" />}
                        {stage.status === 'Running' && <RefreshCw className="h-4 w-4 text-blue-500 mr-1.5 animate-spin" />}
                        {stage.status === 'Skipped' && <Clock className="h-4 w-4 text-gray-500 mr-1.5" />}
                        <span className="text-xs text-gray-700 dark:text-gray-300 mr-1">{stage.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({stage.duration})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Environments Tab */}
        {activeTab === 'environments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Environments
              </h3>
              <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                Add Environment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {environmentData.map(env => (
                <div 
                  key={env.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {env.name}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      env.status === 'Healthy'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {env.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <a href={env.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary break-all">
                      {env.url}
                    </a>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                    <div>Version: {env.version}</div>
                    <div>Last Deployed: {env.lastDeployed}</div>
                    <div>CPU: {env.resources.cpu} | Memory: {env.resources.memory} | Instances: {env.resources.instances}</div>
                  </div>
                  <button 
                    onClick={() => viewEnvironmentDetails(env.id)}
                    className="text-sm text-primary hover:text-primary/90"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Releases Tab */}
        {activeTab === 'releases' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Releases
              </h3>
              <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                Create Release
              </button>
            </div>

            <div className="space-y-4">
              {releaseData.map(release => (
                <div 
                  key={release.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      Version {release.version}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {release.date}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {release.notes}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>Author: {release.author} | Commits: {release.commits}</span>
                    <button 
                      onClick={() => viewReleaseNotes(release.id)}
                      className="text-primary hover:text-primary/90"
                    >
                      View Full Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentDevOps;
