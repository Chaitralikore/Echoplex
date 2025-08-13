import React, { useState, useEffect } from 'react';
import { Search, Camera, MapPin, Clock, User, AlertCircle, CheckCircle, Upload, Eye, Zap } from 'lucide-react';

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  description: string;
  lastSeen: string;
  reportedTime: Date;
  status: 'searching' | 'found' | 'potential-match';
  reportedBy: string;
  photoUrl?: string;
  aiMatchConfidence?: number;
  currentLocation?: string;
  cameraMatches?: CameraMatch[];
}

interface CameraMatch {
  cameraId: string;
  location: string;
  confidence: number;
  timestamp: Date;
  imageUrl?: string;
}

const LostAndFound: React.FC = () => {
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([
    {
      id: 'MP-001',
      name: 'Emma Thompson',
      age: 8,
      description: 'Wearing pink t-shirt and blue jeans, brown hair in ponytails',
      lastSeen: 'Food Court Area',
      reportedTime: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'potential-match',
      reportedBy: 'Sarah Thompson (Mother)',
      photoUrl: 'https://images.pexels.com/photos/1734015/pexels-photo-1734015.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      aiMatchConfidence: 0.87,
      currentLocation: 'Main Stage - Section B',
      cameraMatches: [
        {
          cameraId: 'CAM-12',
          location: 'Main Stage - Section B',
          confidence: 0.87,
          timestamp: new Date(Date.now() - 300000)
        },
        {
          cameraId: 'CAM-08',
          location: 'Food Court Exit',
          confidence: 0.73,
          timestamp: new Date(Date.now() - 1200000)
        }
      ]
    },
    {
      id: 'MP-002',
      name: 'Michael Chen',
      age: 65,
      description: 'Elderly man with gray beard, wearing blue jacket and khaki pants',
      lastSeen: 'West Gate Entrance',
      reportedTime: new Date(Date.now() - 900000), // 15 minutes ago
      status: 'searching',
      reportedBy: 'Lisa Chen (Daughter)',
      photoUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: 'MP-003',
      name: 'Jake Rodriguez',
      age: 16,
      description: 'Teen with red baseball cap, black hoodie, skateboard',
      lastSeen: 'Parking Lot C',
      reportedTime: new Date(Date.now() - 2700000), // 45 minutes ago
      status: 'found',
      reportedBy: 'Maria Rodriguez (Mother)',
      currentLocation: 'Security Station 2'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [newReport, setNewReport] = useState({
    name: '',
    age: '',
    description: '',
    lastSeen: '',
    reportedBy: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiScanResults, setAiScanResults] = useState({
    totalScans: 847,
    facesDetected: 12456,
    matchAttempts: 23,
    successRate: 0.78
  });

  useEffect(() => {
    // Simulate real-time AI matching updates
    const interval = setInterval(() => {
      setAiScanResults(prev => ({
        totalScans: prev.totalScans + Math.floor(Math.random() * 5),
        facesDetected: prev.facesDetected + Math.floor(Math.random() * 20),
        matchAttempts: prev.matchAttempts + (Math.random() > 0.9 ? 1 : 0),
        successRate: Math.max(0.5, Math.min(1, prev.successRate + (Math.random() - 0.5) * 0.02))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'found': return 'bg-green-900/20 text-green-400';
      case 'potential-match': return 'bg-yellow-900/20 text-yellow-400';
      default: return 'bg-red-900/20 text-red-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'found': return CheckCircle;
      case 'potential-match': return AlertCircle;
      default: return Search;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmitReport = () => {
    if (!newReport.name || !newReport.age || !newReport.description) return;

    const report: MissingPerson = {
      id: `MP-${String(missingPersons.length + 1).padStart(3, '0')}`,
      name: newReport.name,
      age: parseInt(newReport.age),
      description: newReport.description,
      lastSeen: newReport.lastSeen,
      reportedTime: new Date(),
      status: 'searching',
      reportedBy: newReport.reportedBy,
      photoUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined
    };

    setMissingPersons(prev => [report, ...prev]);
    setNewReport({ name: '', age: '', description: '', lastSeen: '', reportedBy: '' });
    setSelectedFile(null);
  };

  const handleStatusUpdate = (id: string, newStatus: MissingPerson['status']) => {
    setMissingPersons(prev => prev.map(person => 
      person.id === id ? { ...person, status: newStatus } : person
    ));
  };

  const filteredPersons = missingPersons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* AI Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-300">AI Face Scans</p>
              <p className="text-2xl font-bold text-white">{aiScanResults.totalScans.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-400" />
          </div>
          <div className="text-sm text-blue-300">Real-time processing</div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 border border-purple-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-300">Faces Detected</p>
              <p className="text-2xl font-bold text-white">{aiScanResults.facesDetected.toLocaleString()}</p>
            </div>
            <Camera className="h-8 w-8 text-purple-400" />
          </div>
          <div className="text-sm text-purple-300">Across all cameras</div>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-6 border border-green-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-300">Success Rate</p>
              <p className="text-2xl font-bold text-white">{Math.round(aiScanResults.successRate * 100)}%</p>
            </div>
            <Zap className="h-8 w-8 text-green-400" />
          </div>
          <div className="text-sm text-green-300">AI Accuracy</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 rounded-xl p-6 border border-yellow-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-300">Active Cases</p>
              <p className="text-2xl font-bold text-white">
                {missingPersons.filter(p => p.status !== 'found').length}
              </p>
            </div>
            <Search className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="text-sm text-yellow-300">Currently searching</div>
        </div>
      </div>

      {/* Search and Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Interface */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-400" />
            Search Missing Persons
          </h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or description..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-400">
            {filteredPersons.length} of {missingPersons.length} cases shown
          </div>
        </div>

        {/* New Report Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-400" />
            Report Missing Person
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={newReport.name}
                onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Age"
                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={newReport.age}
                onChange={(e) => setNewReport(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
            <input
              type="text"
              placeholder="Description (clothing, distinguishing features)"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={newReport.description}
              onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Last Seen Location"
                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={newReport.lastSeen}
                onChange={(e) => setNewReport(prev => ({ ...prev, lastSeen: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Reported By"
                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={newReport.reportedBy}
                onChange={(e) => setNewReport(prev => ({ ...prev, reportedBy: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 hover:bg-gray-600/50 transition-colors">
                <Upload className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              {selectedFile && (
                <span className="text-sm text-green-400">Photo selected: {selectedFile.name}</span>
              )}
            </div>
            <button
              onClick={handleSubmitReport}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Submit Report & Start AI Search
            </button>
          </div>
        </div>
      </div>

      {/* Missing Persons List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-400" />
            Active Missing Persons Cases
          </h3>
          <div className="text-sm text-gray-400">
            AI facial recognition active on {missingPersons.filter(p => p.status !== 'found').length} cases
          </div>
        </div>

        <div className="space-y-4">
          {filteredPersons.map((person) => {
            const StatusIcon = getStatusIcon(person.status);
            return (
              <div key={person.id} className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30 hover:border-gray-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                      {person.photoUrl ? (
                        <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{person.name}</h4>
                        <span className="text-sm text-gray-400">Age {person.age}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(person.status)}`}>
                          {person.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{person.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Last seen: {person.lastSeen}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {person.reportedTime.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <StatusIcon className="h-6 w-6 text-blue-400" />
                </div>

                {person.aiMatchConfidence && (
                  <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-400 font-medium">AI Match Detected</span>
                      <span className="text-yellow-400 font-bold">{Math.round(person.aiMatchConfidence * 100)}% Confidence</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-yellow-500 transition-all duration-300"
                        style={{ width: `${person.aiMatchConfidence * 100}%` }}
                      ></div>
                    </div>
                    {person.currentLocation && (
                      <div className="mt-2 text-sm text-yellow-300">
                        Current location: {person.currentLocation}
                      </div>
                    )}
                  </div>
                )}

                {person.cameraMatches && person.cameraMatches.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-300 mb-2">Camera Matches</h5>
                    <div className="space-y-2">
                      {person.cameraMatches.map((match, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-600/30 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <Camera className="h-4 w-4 text-blue-400" />
                            <div>
                              <div className="text-sm text-white">{match.location}</div>
                              <div className="text-xs text-gray-400">{match.cameraId} • {match.timestamp.toLocaleTimeString()}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-white">{Math.round(match.confidence * 100)}%</div>
                            <div className="text-xs text-gray-400">confidence</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Reported by: {person.reportedBy}
                  </div>
                  <div className="flex space-x-2">
                    {person.status === 'potential-match' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(person.id, 'found')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Confirm Found
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(person.id, 'searching')}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          False Match
                        </button>
                      </>
                    )}
                    {person.status === 'searching' && (
                      <button
                        onClick={() => handleStatusUpdate(person.id, 'found')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Mark as Found
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LostAndFound;