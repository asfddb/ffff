import React, { useState, useEffect } from "react";
import { 
  TrendingDown, 
  ShieldAlert, 
  FileText, 
  Users, 
  Leaf, 
  Sparkles, 
  Brain, 
  ExternalLink, 
  Globe, 
  Youtube, 
  AlertTriangle,
  MapPin,
  Building2,
  Video,
  Search,
  PlusCircle,
  Flame,
  BookOpen,
  Info,
  Maximize2,
  Compass,
  Layers,
  Map,
  Radio,
  Newspaper,
  Terminal,
  Activity
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { SECTORS, INDEX_HISTORY, RECOMMENDED_INDEPENDENT_MEDIA } from "./data";
import { PREWRITTEN_REPORTS } from "./reportsData";
import { STATE_DOSSIERS } from "./statesData";
import { Sector, IndexHistoryPoint, StateDossier, SavedReport } from "./types";

// Interactive Geographic Coordinates for India Map SVG (viewBox 0 0 600 600)
export const MAP_TILES = [
  { id: "jk", name: "JK", fullName: "Jammu & Kashmir", x: 200, y: 85, isUt: true, severity: "CRITICAL", lat: 34.0837, lon: 74.7973 },
  { id: "ladakh", name: "LA", fullName: "Ladakh", x: 245, y: 70, isUt: true, severity: "CRITICAL", lat: 34.1526, lon: 77.5771 },

  { id: "punjab", name: "PB", fullName: "Punjab", x: 190, y: 145, isUt: false, severity: "CRITICAL", lat: 31.1471, lon: 75.3412 },
  { id: "hp", name: "HP", fullName: "Himachal Pradesh", x: 235, y: 115, isUt: false, severity: "SEVERE", lat: 31.1048, lon: 77.1734 },
  { id: "chandigarh", name: "CH", fullName: "Chandigarh", x: 210, y: 135, isUt: true, severity: "CRITICAL", lat: 30.7333, lon: 76.7794 },
  { id: "uk", name: "UK", fullName: "Uttarakhand", x: 260, y: 145, isUt: false, severity: "CRITICAL", lat: 30.0668, lon: 79.0193 },

  { id: "rajasthan", name: "RJ", fullName: "Rajasthan", x: 135, y: 215, isUt: false, severity: "CRITICAL", lat: 27.0238, lon: 74.2179 },
  { id: "haryana", name: "HR", fullName: "Haryana", x: 200, y: 185, isUt: false, severity: "CRITICAL", lat: 29.0588, lon: 76.0856 },
  { id: "delhi", name: "DL", fullName: "Delhi", x: 215, y: 195, isUt: true, severity: "CRITICAL", lat: 28.7041, lon: 77.1025 },
  { id: "up", name: "UP", fullName: "Uttar Pradesh", x: 285, y: 220, isUt: false, severity: "CRITICAL", lat: 26.8467, lon: 80.9462 },
  { id: "sk", name: "SK", fullName: "Sikkim", x: 395, y: 230, isUt: false, severity: "SEVERE", lat: 27.5330, lon: 88.5122 },
  { id: "ar", name: "AR", fullName: "Arunachal", x: 505, y: 190, isUt: false, severity: "CRITICAL", lat: 28.2180, lon: 94.7278 },

  { id: "gujarat", name: "GJ", fullName: "Gujarat", x: 105, y: 275, isUt: false, severity: "CRITICAL", lat: 22.2587, lon: 71.1924 },
  { id: "mp", name: "MP", fullName: "Madhya Pradesh", x: 235, y: 280, isUt: false, severity: "CRITICAL", lat: 22.9734, lon: 78.6569 },
  { id: "bihar", name: "BR", fullName: "Bihar", x: 370, y: 245, isUt: false, severity: "CRITICAL", lat: 25.0961, lon: 85.3131 },
  { id: "assam", name: "AS", fullName: "Assam", x: 465, y: 225, isUt: false, severity: "CRITICAL", lat: 26.2006, lon: 92.9376 },
  { id: "nagaland", name: "NL", fullName: "Nagaland", x: 515, y: 215, isUt: false, severity: "CRITICAL", lat: 26.1584, lon: 94.5624 },

  { id: "dnhdd", name: "DN", fullName: "Daman, Diu, Dadra & Nagar Haveli", x: 120, y: 325, isUt: true, severity: "SEVERE", lat: 20.1800, lon: 73.0100 },
  { id: "maharashtra", name: "MH", fullName: "Maharashtra", x: 195, y: 365, isUt: false, severity: "CRITICAL", lat: 19.7515, lon: 75.7139 },
  { id: "cg", name: "CG", fullName: "Chhattisgarh", x: 290, y: 345, isUt: false, severity: "CRITICAL", lat: 21.2787, lon: 81.8661 },
  { id: "jh", name: "JH", fullName: "Jharkhand", x: 355, y: 295, isUt: false, severity: "SEVERE", lat: 23.6102, lon: 85.2799 },
  { id: "wb", name: "WB", fullName: "West Bengal", x: 385, y: 315, isUt: false, severity: "CRITICAL", lat: 22.9868, lon: 87.8550 },
  { id: "meghalaya", name: "ML", fullName: "Meghalaya", x: 450, y: 245, isUt: false, severity: "CRITICAL", lat: 25.4670, lon: 91.3662 },
  { id: "manipur", name: "MN", fullName: "Manipur", x: 510, y: 240, isUt: false, severity: "CRITICAL", lat: 24.6637, lon: 93.9063 },

  { id: "goa", name: "GA", fullName: "Goa", x: 160, y: 455, isUt: false, severity: "CRITICAL", lat: 15.2993, lon: 74.1240 },
  { id: "karnataka", name: "KA", fullName: "Karnataka", x: 195, y: 475, isUt: false, severity: "CRITICAL", lat: 15.3173, lon: 75.7139 },
  { id: "tg", name: "TG", fullName: "Telangana", x: 250, y: 395, isUt: false, severity: "CRITICAL", lat: 18.1124, lon: 79.0193 },
  { id: "od", name: "OD", fullName: "Odisha", x: 335, y: 355, isUt: false, severity: "CRITICAL", lat: 20.9517, lon: 83.3077 },
  { id: "tripura", name: "TR", fullName: "Tripura", x: 465, y: 265, isUt: false, severity: "SEVERE", lat: 23.9408, lon: 91.9882 },
  { id: "mizoram", name: "MZ", fullName: "Mizoram", x: 495, y: 270, isUt: false, severity: "SEVERE", lat: 23.1645, lon: 92.9376 },

  { id: "lakshadweep", name: "LD", fullName: "Lakshadweep", x: 125, y: 555, isUt: true, severity: "CRITICAL", lat: 10.5667, lon: 72.6333 },
  { id: "kerala", name: "KL", fullName: "Kerala", x: 200, y: 555, isUt: false, severity: "SEVERE", lat: 10.8505, lon: 76.2711 },
  { id: "ap", name: "AP", fullName: "Andhra Pradesh", x: 255, y: 455, isUt: false, severity: "SEVERE", lat: 15.9129, lon: 79.7400 },
  { id: "puducherry", name: "PY", fullName: "Puducherry", x: 250, y: 515, isUt: true, severity: "SEVERE", lat: 11.9416, lon: 79.8083 },

  { id: "tn", name: "TN", fullName: "Tamil Nadu", x: 235, y: 535, isUt: false, severity: "SEVERE", lat: 11.1271, lon: 78.6569 },
  { id: "andaman", name: "AN", fullName: "Andaman & Nicobar", x: 450, y: 535, isUt: true, severity: "CRITICAL", lat: 11.7401, lon: 92.6586 },
];

export const REGIONS = [
  {
    name: "North India",
    ids: ["jk", "ladakh", "hp", "punjab", "uk", "haryana", "chandigarh", "delhi"]
  },
  {
    name: "Central & West",
    ids: ["mp", "up", "gujarat", "maharashtra", "cg", "goa", "dnhdd", "rajasthan"]
  },
  {
    name: "South India",
    ids: ["ap", "tg", "karnataka", "kerala", "tn", "puducherry", "lakshadweep"]
  },
  {
    name: "East India",
    ids: ["bihar", "jh", "od", "wb", "andaman"]
  },
  {
    name: "Northeast",
    ids: ["assam", "ar", "manipur", "meghalaya", "tripura", "nagaland", "mizoram", "sk"]
  }
];

export const BREAKING_NEWS = [
  { state: "Madhya Pradesh", title: "Vyapam-3? New probe launched into medical university exam paper leaks", outlet: "The Wire", severity: "CRITICAL" },
  { state: "Manipur", title: "Over 60,000 displaced as ethnic clash accountability continues to stagnate", outlet: "The Caravan", severity: "CRITICAL" },
  { state: "Delhi", title: "Pollution index surges past hazardous limits; zero-action response questioned", outlet: "Scroll.in", severity: "SEVERE" },
  { state: "Maharashtra", title: "Local agrarian distress peaks as cooperative sugar mill mergers trigger state inquiry", outlet: "The Wire", severity: "SEVERE" },
  { state: "Gujarat", title: "Seaport drug seizures escalate: Independent experts warn of weak security loopholes", outlet: "Article 14", severity: "CRITICAL" },
  { state: "Bihar", title: "Bridge collapse toll reaches 17 this year; audit points to massive sub-standard contracting", outlet: "Newslaundry", severity: "CRITICAL" },
  { state: "Uttar Pradesh", title: "Hathras ground report: Court procedures raise human rights accountability questions", outlet: "Scroll.in", severity: "CRITICAL" },
  { state: "Punjab", title: "Agrarian water table plummets: Local farming unions appeal for central policy support", outlet: "The Caravan", severity: "SEVERE" },
];

export default function App() {
  // Navigation & Interactive States
  const [selectedSector, setSelectedSector] = useState<Sector>(SECTORS[0]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'timeline' | 'regional' | 'sources' | 'search'>('regional');

  // Interactive Local Search States
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");
  const [globalSearchFilter, setGlobalSearchFilter] = useState<'all' | 'states' | 'reports' | 'media' | 'articles'>('all');
  const [globalSearchModalDossier, setGlobalSearchModalDossier] = useState<StateDossier | null>(null);

  // Live News Ticker State
  const [activeNewsIdx, setActiveNewsIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNewsIdx((prev) => (prev + 1) % BREAKING_NEWS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Chart Interactive Hover State
  const [hoveredPoint, setHoveredPoint] = useState<IndexHistoryPoint | null>(INDEX_HISTORY[INDEX_HISTORY.length - 1]);

  // Regional Dossier States
  const [dossiersList, setDossiersList] = useState<StateDossier[]>(STATE_DOSSIERS);
  const [selectedStateId, setSelectedStateId] = useState<string>("mp");
  const [stateSearch, setStateSearch] = useState<string>("");
  const [subView, setSubView] = useState<'map' | 'list'>('list');
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [hoveredTileId, setHoveredTileId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'scanner' | 'internet'>('scanner');
  const [osmZoom, setOsmZoom] = useState<number>(7);

  // Regional Citizen Report Submission Form States
  const [newType, setNewType] = useState<'scandal' | 'article' | 'video'>('scandal');
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newSource, setNewSource] = useState<string>("");
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'SEVERE' | 'WARNING'>('WARNING');
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  // Icon Helper mapping
  const getSectorIcon = (name: string, sizeClass = "w-5 h-5") => {
    switch (name) {
      case "TrendingDown": return <TrendingDown className={sizeClass} />;
      case "ShieldAlert": return <ShieldAlert className={sizeClass} />;
      case "FileText": return <FileText className={sizeClass} />;
      case "Users": return <Users className={sizeClass} />;
      case "Leaf": return <Leaf className={sizeClass} />;
      default: return <ShieldAlert className={sizeClass} />;
    }
  };

  // Retrieve the pre-written critical analysis for the current sector
  const activeReport = PREWRITTEN_REPORTS[selectedSector.id] || PREWRITTEN_REPORTS.economy;

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      setFeedbackMessage("⚠️ Error: Please fill out all required fields.");
      return;
    }

    const updatedDossiers = dossiersList.map(dossier => {
      if (dossier.id === selectedStateId) {
        if (newType === 'scandal') {
          return {
            ...dossier,
            scandals: [
              ...dossier.scandals,
              {
                title: newTitle,
                desc: newDesc,
                severity: newSeverity
              }
            ]
          };
        } else if (newType === 'article') {
          return {
            ...dossier,
            articles: [
              ...dossier.articles,
              {
                title: newTitle,
                outlet: newSource || "Citizen Submission",
                summary: newDesc,
                url: "#"
              }
            ]
          };
        } else {
          return {
            ...dossier,
            videos: [
              ...dossier.videos,
              {
                title: newTitle,
                creator: newSource || "Independent Reporter",
                summary: newDesc,
                youtubeUrl: "#"
              }
            ]
          };
        }
      }
      return dossier;
    });

    setDossiersList(updatedDossiers);
    
    // Clear inputs and show success
    const currentName = dossiersList.find(d => d.id === selectedStateId)?.name || "Selected State";
    setFeedbackMessage(`✓ SUCCESS: Filed "${newTitle}" into ${currentName} Dossier!`);
    setNewTitle("");
    setNewDesc("");
    setNewSource("");
    
    // Auto clear feedback after 4 seconds
    setTimeout(() => {
      setFeedbackMessage("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans flex flex-col selection:bg-red-500 selection:text-white">
      
      {/* 1. Header */}
      <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-4 sm:px-8 bg-zinc-900/50 sticky top-0 z-50 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-600 rounded-sm flex items-center justify-center font-black text-white text-base tracking-tighter">
            IND
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              India Governance Research Platform
              <span className="text-xs font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded uppercase font-semibold">
                Independent Oversight
              </span>
            </h1>
            <p className="text-xs text-zinc-500 font-mono tracking-wide mt-0.5 uppercase">UNFILTERED INVESTIGATIVE REVIEWS OF FAILURE VECTORS & POLICY FLAWS</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
          <div className="hidden lg:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-zinc-400 font-bold uppercase tracking-wider">CRITICAL FEED: ACTIVE</span>
          </div>
        </div>
      </header>

      {/* 2. Top-Level Warning Bar alerting the scope */}
      <div className="bg-red-950/25 border-b border-red-900/40 px-4 sm:px-8 py-4 text-xs sm:text-sm text-red-400 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
        <div className="space-y-1">
          <p className="leading-relaxed font-semibold">
            Methodological Focus: Bypassing Mainstream Corporate Televised Outlets ("Godi Media")
          </p>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            This platform synthesizes verified research, global democracy metrics, and investigative reporting from India's remaining independent digital media portals and video journalists. Standard pro-government televised studio debates are intentionally omitted to provide an unfiltered look at structural flaws.
          </p>
        </div>
      </div>

      {/* 3. Main Dashboard Layout Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
        
        {/* Left Column (span 3): Sector Picker & Verified Independent Outlet Directory */}
        <aside className="lg:col-span-3 bg-zinc-950/40 p-4 sm:p-6 flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Oversight Vectors</h2>
              <span className="text-[10px] font-mono text-zinc-600">SELECT TO VIEW</span>
            </div>
            
            <div className="space-y-2">
              {SECTORS.map((sector) => {
                const isActive = selectedSector.id === sector.id;
                return (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 border flex items-start gap-3.5 group relative ${
                      isActive 
                        ? "bg-zinc-900 border-zinc-700 text-white shadow-xl" 
                        : "bg-transparent border-transparent hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-1.5 bg-red-500 rounded-r" />
                    )}
                    <span className={`p-2 rounded-md shrink-0 transition-colors ${
                      isActive ? "bg-red-500/15 text-red-400" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
                    }`}>
                      {getSectorIcon(sector.iconName, "w-6 h-6")}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold tracking-tight uppercase">{sector.title}</h3>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-1 group-hover:text-zinc-400 leading-normal">
                        {sector.shortDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Independent Media Catalog
            </h2>
            <div className="space-y-3">
              {RECOMMENDED_INDEPENDENT_MEDIA.map((media, idx) => (
                <div key={idx} className="p-3 bg-zinc-900/60 border border-zinc-800/60 rounded-lg flex flex-col gap-1.5 hover:border-zinc-700 transition">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-bold text-zinc-200 flex items-center gap-1.5">
                      {media.type === "YouTube Channel" ? (
                        <Youtube className="w-4 h-4 text-red-500" />
                      ) : (
                        <Globe className="w-4 h-4 text-zinc-400" />
                      )}
                      {media.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                      {media.type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{media.description}</p>
                  {media.keyPersonalities && (
                    <p className="text-[11px] text-zinc-500 font-mono">Host: {media.keyPersonalities}</p>
                  )}
                  <p className="text-[10px] text-red-400 font-mono font-medium">Focus: {media.focusArea}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Main Panel (span 6): Comprehensive High-Hitting Reports with Big Text */}
        <section className="lg:col-span-6 bg-zinc-950 p-4 sm:p-8 flex flex-col gap-8">
          
          {/* Sub Navigation Bar inside center */}
          <div className="flex border-b border-zinc-800 text-xs sm:text-sm md:text-base flex-wrap gap-y-2">
            <button 
              onClick={() => setActiveTab('regional')}
              className={`pb-4 px-4 font-bold transition-all relative flex items-center gap-1.5 ${
                activeTab === 'regional' ? 'text-white border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <MapPin className="w-4 h-4 text-red-500" />
              State-wise Dossiers
              <span className="text-[9px] font-mono bg-red-950 text-red-400 px-1 py-0.2 rounded font-bold animate-pulse">
                NEW
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('matrix')}
              className={`pb-4 px-4 font-bold transition-all relative ${
                activeTab === 'matrix' ? 'text-white border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Primary Failures & Analysis
            </button>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`pb-4 px-4 font-bold transition-all relative ${
                activeTab === 'timeline' ? 'text-white border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Decay Timeline Metrics
            </button>
            <button 
              onClick={() => setActiveTab('sources')}
              className={`pb-4 px-4 font-bold transition-all relative ${
                activeTab === 'sources' ? 'text-white border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Alternative Source Mapping
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`pb-4 px-4 font-bold transition-all relative flex items-center gap-1.5 ${
                activeTab === 'search' ? 'text-white border-b-2 border-red-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Search className="w-4 h-4 text-red-500" />
              Oversight Search Database
            </button>
          </div>


          {activeTab === 'regional' && (() => {
            const activeDossier = dossiersList.find(d => d.id === selectedStateId) || dossiersList[0];
            const filteredDossiers = dossiersList.filter(d => 
              d.name.toLowerCase().includes(stateSearch.toLowerCase()) || 
              d.shortSummary.toLowerCase().includes(stateSearch.toLowerCase())
            );

            return (
              <div className="space-y-8 animate-fadeIn">
                
                {/* State-wise Search Directory */}
                <div className="bg-zinc-900/40 p-6 sm:p-8 rounded-lg border border-zinc-800 space-y-6">
                  
                  {/* Dashboard Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                        <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                          Governance Failure Search & Oversight Directory
                        </h3>
                      </div>
                      <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                        Exposing structural failure indexes across all <strong>28 States</strong> and <strong>8 Union Territories</strong> of India. Use the search lookup engine or filters below to retrieve active dossiers.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Statistics Panel */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-950/40 p-4 rounded border border-zinc-900 font-mono text-xs text-zinc-400">
                    <div>
                      <span className="text-[10px] text-zinc-600 block uppercase font-bold">Total Jurisdictions</span>
                      <span className="text-sm font-bold text-white">36 Audited</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-600 block uppercase font-bold">Critical Risk Index</span>
                      <span className="text-sm font-bold text-red-400">26 High Alert</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-600 block uppercase font-bold">Current Selection</span>
                      <span className="text-sm font-bold text-red-500">{activeDossier.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-600 block uppercase font-bold">Submissions Gateway</span>
                      <span className="text-sm font-bold text-emerald-500">Online & Secured</span>
                    </div>
                  </div>

                  {/* Subview 1: Geographic Matrix Map */}
                  {false && (
                    <div className="space-y-6 animate-fadeIn">
                      
                      {/* Animated Live News Ticker Header */}
                      <div className="bg-red-950/15 border border-red-900/30 rounded-lg p-3 flex items-center gap-3 overflow-hidden font-mono text-xs">
                        <span className="flex items-center gap-1.5 shrink-0 bg-red-950/80 px-2.5 py-1 border border-red-500/30 text-red-400 font-bold tracking-widest uppercase rounded">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          🔴 LIVE WIRE
                        </span>
                        <div className="relative flex-1 h-5 overflow-hidden">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeNewsIdx}
                              initial={{ y: 16, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -16, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-0 flex items-center justify-between gap-4"
                            >
                              <span className="text-zinc-200 font-semibold truncate">
                                <span className="text-red-400 font-black uppercase tracking-wider mr-1.5">[{BREAKING_NEWS[activeNewsIdx].state}]</span>
                                {BREAKING_NEWS[activeNewsIdx].title}
                              </span>
                              <span className="text-[9px] text-zinc-500 uppercase font-bold shrink-0 hidden sm:inline">
                                Wire: {BREAKING_NEWS[activeNewsIdx].outlet}
                              </span>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Map Mode Workspace Selector Row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 gap-3">
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                          <span className="text-xs font-mono font-bold uppercase text-zinc-300">Target Mapping Feed:</span>
                        </div>
                        <div className="flex bg-zinc-900 p-0.5 rounded-md border border-zinc-800 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => setMapMode('scanner')}
                            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
                              mapMode === 'scanner'
                                ? "bg-red-950/80 text-red-400 border border-red-500/30 shadow-md"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            <Compass className="w-3.5 h-3.5" />
                            📡 TACTICAL HUD SCANNER
                          </button>
                          <button
                            type="button"
                            onClick={() => setMapMode('internet')}
                            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
                              mapMode === 'internet'
                                ? "bg-red-950/80 text-red-400 border border-red-500/30 shadow-md"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            <Globe className="w-3.5 h-3.5" />
                            🗺️ LIVE INTERNET MAP
                          </button>
                        </div>
                      </div>

                      {/* Region Highlighter Filter Row (Only relevant to SVG Map) */}
                      {mapMode === 'scanner' && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-wrap gap-1.5 items-center bg-zinc-950/20 p-2 rounded border border-zinc-900"
                        >
                          <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold px-2">Highlight Region:</span>
                          {["All", "North India", "Central & West", "South India", "East India", "Northeast"].map((regName) => {
                            const isActive = selectedRegion === regName;
                            return (
                              <button
                                key={regName}
                                type="button"
                                onClick={() => setSelectedRegion(regName)}
                                className={`px-2.5 py-1 rounded text-[11px] font-mono transition border ${
                                  isActive 
                                    ? "bg-red-950/20 border-red-500/50 text-white font-bold" 
                                    : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                {regName}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}

                      {/* Unified Animated Map Canvas Area */}
                      <AnimatePresence mode="wait">
                        {mapMode === 'scanner' ? (
                          <motion.div
                            key="vector_scanner"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-x-auto pb-4"
                          >
                            <div className="min-w-[640px] max-w-[800px] mx-auto bg-zinc-950/90 border border-zinc-900 rounded-xl p-4 md:p-6 relative shadow-2xl overflow-hidden">
                              
                              {/* HUD Coordinates / Grid Lines Overlay */}
                              <div className="absolute top-2 left-3 text-[9px] font-mono text-zinc-600">INDIA TACTICAL OVERSIGHT SECTORS (600x600)</div>
                              <div className="absolute top-2 right-3 text-[9px] font-mono text-zinc-600">HUD TELEMETRY: ACTIVE</div>

                              {/* Live Cyber HUD Status Readout Panel inside the Map */}
                              {(() => {
                                const hoveredTile = MAP_TILES.find(t => t.id === hoveredTileId);
                                const activeDisplayTile = hoveredTile || MAP_TILES.find(t => t.id === selectedStateId);
                                const displayDossier = dossiersList.find(d => d.id === activeDisplayTile?.id);
                                
                                return (
                                  <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-zinc-950/95 border border-zinc-900 p-3.5 rounded-lg shadow-lg backdrop-blur-md z-20 font-mono text-[11px] space-y-1.5 animate-fadeIn">
                                    <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5 mb-1.5">
                                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">
                                        {hoveredTile ? "⚡ Live HUD Scan" : "🎯 Active Sector"}
                                      </span>
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest ${
                                        activeDisplayTile?.severity === "CRITICAL" 
                                          ? "bg-red-950/40 text-red-400 border border-red-500/30" 
                                          : "bg-amber-950/40 text-amber-400 border border-amber-500/30"
                                      }`}>
                                        {activeDisplayTile?.severity}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-start gap-2">
                                      <span className="text-white text-xs font-extrabold uppercase">{activeDisplayTile?.fullName}</span>
                                      <span className="text-zinc-600 text-[10px]">ID: {activeDisplayTile?.id.toUpperCase()}</span>
                                    </div>
                                    <p className="text-zinc-400 text-[10px] leading-relaxed line-clamp-2">
                                      {displayDossier?.shortSummary || "Sector metadata logs awaiting retrieval command..."}
                                    </p>
                                    <div className="text-[10px] text-zinc-500 italic pt-1 flex justify-between items-center">
                                      <span>* Click dot to lock dossier below</span>
                                      {activeDisplayTile?.isUt && <span className="bg-zinc-900 px-1 py-0.2 rounded text-[9px] text-zinc-400 font-bold">UT</span>}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* SVG Map Core */}
                              <div className="flex justify-center items-center w-full min-h-[500px]">
                                <svg 
                                  viewBox="0 0 600 600" 
                                  className="w-full max-w-[550px] h-auto select-none relative"
                                >
                                  {/* Tactical Background Grid Lines */}
                                  <line x1="100" y1="0" x2="100" y2="600" stroke="rgba(244, 63, 94, 0.02)" strokeWidth="1" strokeDasharray="3 3" />
                                  <line x1="200" y1="0" x2="200" y2="600" stroke="rgba(244, 63, 94, 0.02)" strokeWidth="1" strokeDasharray="3 3" />
                                  <line x1="300" y1="0" x2="300" y2="600" stroke="rgba(244, 63, 94, 0.02)" strokeWidth="1" strokeDasharray="3 3" />
                                  <line x1="400" y1="0" x2="400" y2="600" stroke="rgba(244, 63, 94, 0.02)" strokeWidth="1" strokeDasharray="3 3" />
                                  <line x1="500" y1="0" x2="500" y2="600" stroke="rgba(244, 63, 94, 0.02)" strokeWidth="1" strokeDasharray="3 3" />
                                  <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(244, 63, 94, 0.02)" strokeWidth="1" strokeDasharray="3 3" />
                                  <line x1="0" y1="200" x2="600" y2="200" stroke="rgba(244, 63, 94, 0.02)" strokeWidth="1" strokeDasharray="3 3" />
                                  <line x1="0" y1="300" x2="600" y2="300" stroke="rgba(244, 63, 94, 0.02)" strokeWidth="1" strokeDasharray="3 3" />
                                  <line x1="0" y1="400" x2="600" y2="400" stroke="rgba(244, 63, 94, 0.02)" strokeWidth="1" strokeDasharray="3 3" />
                                  <line x1="0" y1="500" x2="600" y2="500" stroke="rgba(244, 63, 94, 0.02)" strokeWidth="1" strokeDasharray="3 3" />

                                  {/* Glowing Map Outer Silhouette Border */}
                                  <path
                                    d="M 215,45 L 225,45 L 240,35 L 260,55 L 275,70 L 280,95 L 270,105 L 285,120 L 335,180 L 405,200 L 415,210 L 430,210 L 455,195 L 495,180 L 535,165 L 550,185 L 545,220 L 530,260 L 510,265 L 490,250 L 480,245 L 465,230 L 430,255 L 415,285 L 390,300 L 360,340 L 310,410 L 290,480 L 265,550 L 250,570 L 240,565 L 210,540 L 190,480 L 165,420 L 155,360 L 125,315 L 90,295 L 65,265 L 85,245 L 125,230 L 150,175 L 180,145 L 190,90 Z"
                                    fill="none"
                                    stroke="rgba(239, 68, 68, 0.15)"
                                    strokeWidth="8"
                                    className="blur-sm"
                                  />

                                  {/* Realistic Detailed Background Outline of India */}
                                  <path
                                    d="M 215,45 L 225,45 L 240,35 L 260,55 L 275,70 L 280,95 L 270,105 L 285,120 L 335,180 L 405,200 L 415,210 L 430,210 L 455,195 L 495,180 L 535,165 L 550,185 L 545,220 L 530,260 L 510,265 L 490,250 L 480,245 L 465,230 L 430,255 L 415,285 L 390,300 L 360,340 L 310,410 L 290,480 L 265,550 L 250,570 L 240,565 L 210,540 L 190,480 L 165,420 L 155,360 L 125,315 L 90,295 L 65,265 L 85,245 L 125,230 L 150,175 L 180,145 L 190,90 Z"
                                    fill="rgba(15, 15, 17, 0.85)"
                                    stroke="rgba(239, 68, 68, 0.25)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />

                                  {/* Decorative Island Clusters */}
                                  <g opacity="0.4" stroke="rgba(239, 68, 68, 0.3)" fill="rgba(239, 68, 68, 0.1)">
                                    <circle cx="120" cy="530" r="3" />
                                    <circle cx="115" cy="540" r="2" />
                                    <circle cx="122" cy="550" r="3.5" />
                                    <circle cx="118" cy="565" r="2" />

                                    <ellipse cx="445" cy="510" rx="3" ry="5" />
                                    <ellipse cx="448" cy="525" rx="2" ry="6" />
                                    <ellipse cx="452" cy="540" rx="3.5" ry="4" />
                                    <ellipse cx="455" cy="555" rx="2.5" ry="5" />
                                    <ellipse cx="458" cy="570" rx="2" ry="4" />
                                  </g>

                                  {/* Interactive State Node Dots */}
                                  {MAP_TILES.map((tile) => {
                                    const belongsToSelectedRegion = 
                                      selectedRegion === "All" || 
                                      (REGIONS.find(reg => reg.name === selectedRegion)?.ids.includes(tile.id) ?? false);

                                    const isSelected = tile.id === selectedStateId;
                                    const isHovered = tile.id === hoveredTileId;
                                    const isCritical = tile.severity === "CRITICAL";

                                    const finalOpacity = belongsToSelectedRegion ? "opacity-100" : "opacity-30";

                                    return (
                                      <g 
                                        key={tile.id}
                                        className={`transition-all duration-300 cursor-pointer group ${finalOpacity}`}
                                        onMouseEnter={() => setHoveredTileId(tile.id)}
                                        onMouseLeave={() => setHoveredTileId(null)}
                                        onClick={() => {
                                          setSelectedStateId(tile.id);
                                          setFeedbackMessage("");
                                        }}
                                      >
                                        {/* Selection Halo Ring */}
                                        {isSelected && (
                                          <circle
                                            cx={tile.x}
                                            cy={tile.y}
                                            r="13"
                                            fill="none"
                                            stroke="rgba(239, 68, 68, 0.6)"
                                            strokeWidth="1.5"
                                            className="animate-pulse"
                                          />
                                        )}

                                        {/* Pulse Hover / Scan Wave Circle */}
                                        {(isSelected || isHovered) && (
                                          <circle
                                            cx={tile.x}
                                            cy={tile.y}
                                            r="22"
                                            fill="none"
                                            stroke={isCritical ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}
                                            strokeWidth="1"
                                            className="scale-animation"
                                            style={{ transformOrigin: `${tile.x}px ${tile.y}px` }}
                                          />
                                        )}

                                        {/* Core Dotted Icon representation */}
                                        <circle
                                          cx={tile.x}
                                          cy={tile.y}
                                          r={isSelected ? "7" : "5.5"}
                                          fill={isCritical ? "#ef4444" : "#f59e0b"}
                                          className={`shadow-lg transition-transform duration-300 ${
                                            isHovered ? "scale-125 stroke-white stroke-1.5" : "stroke-zinc-950 stroke"
                                          } ${isCritical && !isSelected ? "animate-pulse" : ""}`}
                                        />

                                        {/* Dynamic Label next to the dot */}
                                        <text
                                          x={tile.x + 9}
                                          y={tile.y + 3.5}
                                          className={`font-mono text-[9px] font-bold tracking-tight select-none pointer-events-none transition-all ${
                                            isSelected 
                                              ? "fill-red-400 text-xs font-black drop-shadow-md scale-105" 
                                              : isHovered 
                                                ? "fill-white drop-shadow-md" 
                                                : "fill-zinc-500"
                                          }`}
                                        >
                                          {tile.name}
                                        </text>
                                      </g>
                                    );
                                  })}
                                </svg>
                              </div>

                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="internet_osm"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                          >
                            {/* Live Web Map Viewframe - 2 Columns */}
                            <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-4 md:p-5 relative shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-between">
                              
                              <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5 mb-3.5 font-mono text-[10px]">
                                <span className="text-zinc-400 uppercase font-black tracking-widest flex items-center gap-2">
                                  <Terminal className="w-4 h-4 text-emerald-500 animate-pulse" />
                                  📡 LIVE TARGET GRID FEED: {activeDossier.name.toUpperCase()}
                                </span>
                                <span className="text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded font-bold">
                                  ZOOM: x{osmZoom}
                                </span>
                              </div>

                              {/* Real OpenStreetMap Embedded Map Core */}
                              {(() => {
                                const matchedTile = MAP_TILES.find(t => t.id === selectedStateId) || MAP_TILES[0];
                                const currentLat = matchedTile.lat;
                                const currentLon = matchedTile.lon;
                                
                                // Bounding box calculator to provide manual dynamic zooming increments on OpenStreetMap
                                const deltaVal = 10 / Math.pow(2, osmZoom - 4);
                                const minLon = currentLon - deltaVal;
                                const minLat = currentLat - deltaVal;
                                const maxLon = currentLon + deltaVal;
                                const maxLat = currentLat + deltaVal;

                                return (
                                  <div className="relative w-full h-[380px] rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden shadow-inner">
                                    
                                    {/* Intelligence Crosshairs Overlay */}
                                    <div className="absolute inset-0 pointer-events-none border border-red-500/10 flex items-center justify-center z-10">
                                      <div className="w-32 h-32 border border-dashed border-red-500/15 rounded-full animate-spin duration-15000" />
                                      <div className="absolute w-10 h-[1.5px] bg-red-500/30" />
                                      <div className="absolute h-10 w-[1.5px] bg-red-500/30" />
                                      <div className="absolute top-4 left-4 text-[9px] font-mono text-zinc-500 tracking-wider">REF_ST_SCANNER: ENCRYPTED</div>
                                      <div className="absolute bottom-4 right-4 text-[9px] font-mono text-zinc-500 tracking-wider">LIVE_FEED_ONLINE</div>
                                    </div>

                                    {/* Loaded real interactive map from internet */}
                                    <iframe
                                      title="Live Internet State Map Feed"
                                      width="100%"
                                      height="100%"
                                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${minLon.toFixed(5)}%2C${minLat.toFixed(5)}%2C${maxLon.toFixed(5)}%2C${maxLat.toFixed(5)}&layer=mapnik&marker=${currentLat.toFixed(5)}%2C${currentLon.toFixed(5)}`}
                                      className="filter brightness-90 contrast-110 saturate-75 opacity-90 hover:opacity-100 transition duration-300"
                                      style={{ border: 0 }}
                                    />
                                  </div>
                                );
                              })()}

                              {/* Depth Slider & Action Controls */}
                              {(() => {
                                const matchedTile = MAP_TILES.find(t => t.id === selectedStateId) || MAP_TILES[0];
                                return (
                                  <div className="mt-4 pt-3.5 border-t border-zinc-900 flex flex-wrap justify-between items-center gap-3 font-mono text-[11px]">
                                    <div className="flex items-center gap-3">
                                      <span className="text-zinc-500 uppercase font-black tracking-wider">SCAN DEPTH CONTROLS:</span>
                                      <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 rounded px-2.5 py-1">
                                        <span className="text-zinc-500">Wide</span>
                                        <input
                                          type="range"
                                          min="5"
                                          max="12"
                                          value={osmZoom}
                                          onChange={(e) => setOsmZoom(Number(e.target.value))}
                                          className="w-24 md:w-32 accent-red-500 bg-zinc-800 rounded h-1 cursor-pointer"
                                        />
                                        <span className="text-zinc-300 font-bold">Local</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <a
                                        href={`https://www.openstreetmap.org/?mlat=${matchedTile.lat}&mlon=${matchedTile.lon}#map=${osmZoom}/${matchedTile.lat}/${matchedTile.lon}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded font-bold transition flex items-center gap-1.5"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 text-red-500" /> OPEN MAP DIRECT
                                      </a>
                                    </div>
                                  </div>
                                );
                              })()}

                            </div>

                            {/* Localized Articles Wire & Metadata Sidebar - 1 Column */}
                            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 md:p-5 flex flex-col justify-between shadow-xl">
                              
                              <div className="space-y-4">
                                <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2.5">
                                  <Newspaper className="w-4 h-4 text-red-500" />
                                  <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                                    Local Articles: {activeDossier.name}
                                  </span>
                                </div>

                                {/* Scrolling Verified State Specific Articles List */}
                                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                                  {activeDossier.articles.map((art, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 bg-zinc-900/40 border border-zinc-800/60 rounded hover:border-red-500/30 transition-all text-[11px] space-y-1"
                                    >
                                      <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-mono text-red-400 font-bold uppercase bg-red-950/20 px-1.5 py-0.2 rounded border border-red-950/30">
                                          {art.outlet}
                                        </span>
                                        <span className="text-[8px] font-mono text-zinc-600 font-bold">VERIFIED ARTICLE</span>
                                      </div>
                                      <h5 className="font-extrabold text-zinc-200 leading-snug line-clamp-2">
                                        {art.title}
                                      </h5>
                                      <p className="text-zinc-400 line-clamp-2 leading-relaxed">
                                        {art.summary}
                                      </p>
                                    </div>
                                  ))}

                                  {/* Auto Correspondent Alert Ticker */}
                                  <div className="p-3 bg-red-950/10 border border-red-900/20 rounded text-[11px] space-y-1">
                                    <div className="flex items-center gap-1 text-red-400 font-bold font-mono text-[9px] uppercase tracking-wider">
                                      <Activity className="w-3.5 h-3.5 animate-pulse" /> LIVE WIRE INTEL ALERT
                                    </div>
                                    <p className="text-zinc-400 leading-snug">
                                      Submissions portal has added independent research papers from alternative publications regarding regional democratic scores...
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* State Geographic Coordinates Readout Panel */}
                              {(() => {
                                const matchedTile = MAP_TILES.find(t => t.id === selectedStateId) || MAP_TILES[0];
                                return (
                                  <div className="mt-4 pt-3.5 border-t border-zinc-900 bg-zinc-950/40 font-mono text-[10px] text-zinc-500 space-y-1">
                                    <div className="flex justify-between">
                                      <span>LATITUDE VALUE:</span>
                                      <span className="text-zinc-300 font-bold">{matchedTile.lat.toFixed(4)}° N</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>LONGITUDE VALUE:</span>
                                      <span className="text-zinc-300 font-bold">{matchedTile.lon.toFixed(4)}° E</span>
                                    </div>
                                    <div className="flex justify-between text-red-500/70 font-bold pt-1 border-t border-dashed border-zinc-900">
                                      <span>OVERSIGHT ROUTING:</span>
                                      <span>SECURED_SSL_LINK</span>
                                    </div>
                                  </div>
                                );
                              })()}

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Map Key & Tips */}
                      <div className="flex flex-wrap justify-between items-center text-xs font-mono text-zinc-500 bg-zinc-950/20 p-3 rounded border border-zinc-900 gap-2">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                            CRITICAL RISK RATING (DOT ON SCANNER)
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            SEVERE RISK RATING
                          </span>
                          <span className="flex items-center gap-1.5 font-bold">
                            <span>🖱️ Click any Dot to retrieve detailed oversight dossier</span>
                          </span>
                        </div>
                        <p className="text-zinc-600 italic">
                          * Map coordinates plot real physical locations.
                        </p>
                      </div>

                    </div>
                  )}

                  {/* Subview 2: Regional Directory Index List */}
                  {true && (
                    <div className="space-y-6 animate-fadeIn">
                      
                      {/* Search Bar Inline */}
                      <div className="relative w-full">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Search state dossiers, summary points, or territory failure logs..."
                          value={stateSearch}
                          onChange={(e) => setStateSearch(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2.5 pl-10 text-sm text-zinc-300 focus:outline-none focus:border-red-500 transition"
                        />
                      </div>

                      {/* Regional Grouping Render */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {REGIONS.map((region) => {
                          // Filter dossiers belonging to this region
                          const regionDossiers = dossiersList.filter(d => 
                            region.ids.includes(d.id) && 
                            (d.name.toLowerCase().includes(stateSearch.toLowerCase()) || d.shortSummary.toLowerCase().includes(stateSearch.toLowerCase()))
                          );

                          if (regionDossiers.length === 0) return null;

                          return (
                            <div key={region.name} className="space-y-3 bg-zinc-950/20 p-4 rounded-lg border border-zinc-900">
                              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2 flex justify-between items-center">
                                <span>{region.name} Region</span>
                                <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded font-mono">
                                  {regionDossiers.length} Audited
                                </span>
                              </h4>

                              <div className="space-y-2">
                                {regionDossiers.map((d) => {
                                  const isSelected = d.id === selectedStateId;
                                  return (
                                    <button
                                      key={d.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedStateId(d.id);
                                        setFeedbackMessage("");
                                      }}
                                      className={`w-full p-3 rounded-md text-left border text-xs transition duration-150 flex flex-col justify-between gap-1 ${
                                        isSelected 
                                          ? "bg-red-950/30 border-red-500 text-white font-bold shadow-sm" 
                                          : "bg-zinc-950/80 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span className="font-bold flex items-center gap-1.5">
                                          <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-red-500" : "text-zinc-600"}`} />
                                          {d.name}
                                        </span>
                                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-red-500 animate-ping" : "bg-zinc-800"}`} />
                                      </div>
                                      <p className="text-[11px] text-zinc-500 leading-normal line-clamp-1 italic">
                                        {d.shortSummary}
                                      </p>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {stateSearch && dossiersList.filter(d => d.name.toLowerCase().includes(stateSearch.toLowerCase())).length === 0 && (
                        <p className="text-center py-8 text-zinc-600 text-xs font-mono">
                          No matches found for your search term. Try checking spelling or region.
                        </p>
                      )}

                    </div>
                  )}

                </div>

                {/* Main Active State dossier Sheet */}
                <div className="bg-zinc-900/20 border border-zinc-800 rounded-lg p-6 sm:p-8 space-y-6">
                  
                  {/* Dossier Header */}
                  <div className="border-b border-zinc-800 pb-5">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-950 text-red-500 text-[10px] font-mono rounded font-bold uppercase tracking-wider">
                          OVERSIGHT DOSSIER: ACTIVE
                        </span>
                        <span className="text-zinc-600 font-mono text-xs">/ REF: IND-ST-{activeDossier.id.toUpperCase()}-2026</span>
                      </div>
                      <span className="text-xs font-mono text-zinc-500">STRICT REVELATIONS</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      {activeDossier.name} Governance File
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 font-medium italic mt-2 leading-relaxed">
                      {activeDossier.shortSummary}
                    </p>
                  </div>

                  {/* Dynamic Metrics Panel for current State */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeDossier.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-zinc-900/60 p-4 rounded border border-zinc-800/80">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block mb-1">
                          {metric.label}
                        </span>
                        <span className="text-base sm:text-lg font-mono font-bold text-red-400">
                          {metric.value}
                        </span>
                        <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
                          {metric.detail}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 1. Systemic Scandals */}
                  <div className="space-y-4 pt-4 border-t border-zinc-900">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                      Systemic Failures & Scandals Registry
                    </h3>
                    
                    <div className="space-y-3">
                      {activeDossier.scandals.map((scandal, idx) => {
                        const isCritical = scandal.severity === 'CRITICAL';
                        const isSevere = scandal.severity === 'SEVERE';
                        return (
                          <div key={idx} className="p-4 bg-zinc-900/30 border border-zinc-800/60 rounded hover:border-zinc-700 transition">
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight uppercase">
                                {scandal.title}
                              </h4>
                              <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                                isCritical 
                                  ? "bg-red-950 text-red-400 border border-red-900/40 animate-pulse" 
                                  : isSevere 
                                    ? "bg-amber-950/50 text-amber-500 border border-amber-900/40" 
                                    : "bg-yellow-950/20 text-yellow-500 border border-yellow-900/20"
                              }`}>
                                {scandal.severity}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                              {scandal.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Fact Checked Articles & Journalism */}
                  <div className="space-y-4 pt-6 border-t border-zinc-900">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-zinc-400" />
                      Verified Investigative Journalism
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeDossier.articles.map((art, idx) => (
                        <div key={idx} className="p-4 bg-zinc-900/50 border border-zinc-800/60 rounded flex flex-col justify-between hover:border-zinc-700 transition">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-mono bg-red-950/40 text-red-400 px-2 py-0.5 rounded font-bold uppercase">
                                {art.outlet}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-600">VERIFIED RESEARCH</span>
                            </div>
                            <h4 className="text-sm font-bold text-zinc-200 tracking-tight leading-normal mb-1.5">
                              {art.title}
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                              {art.summary}
                            </p>
                          </div>
                          
                          <a 
                            href={art.url}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-mono font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                          >
                            Access Original Portal <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Investigative Video Themes */}
                  <div className="space-y-4 pt-6 border-t border-zinc-900">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Video className="w-4 h-4 text-red-400" />
                      Independent Video Investigations
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeDossier.videos.map((vid, idx) => (
                        <div key={idx} className="p-4 bg-zinc-900/50 border border-zinc-800/60 rounded flex flex-col justify-between hover:border-zinc-700 transition">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-bold">
                                HOST: {vid.creator}
                              </span>
                              <Youtube className="w-4 h-4 text-red-500" />
                            </div>
                            <h4 className="text-sm font-bold text-zinc-200 tracking-tight leading-normal mb-1.5 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shrink-0" />
                              {vid.title}
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                              {vid.summary}
                            </p>
                          </div>

                          <a 
                            href={vid.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                          >
                            Watch Full Segment <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Citizens Reporting Form Container */}
                <div className="bg-zinc-900/40 p-6 sm:p-8 rounded-lg border border-red-950/60 space-y-5">
                  <div className="border-b border-zinc-800 pb-3 flex items-start gap-3">
                    <Info className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Independent Evidence submission Gateway
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Contribute verified scandals, independent reports, or video logs into this active session of the <strong>{activeDossier.name}</strong> governance database.
                      </p>
                    </div>
                  </div>

                  {feedbackMessage && (
                    <div className={`p-3 rounded text-xs font-mono text-center border animate-pulse ${
                      feedbackMessage.startsWith("⚠️") 
                        ? "bg-amber-950/20 border-amber-900/50 text-amber-400" 
                        : "bg-emerald-950/20 border-emerald-900/50 text-emerald-400"
                    }`}>
                      {feedbackMessage}
                    </div>
                  )}

                  <form onSubmit={handleAddEvidence} className="space-y-4">
                    
                    {/* Item type pill selection */}
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold block mb-2">
                        Evidence Category
                      </label>
                      <div className="flex gap-2">
                        {(['scandal', 'article', 'video'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setNewType(type)}
                            className={`px-3 py-1.5 rounded text-xs font-mono border transition ${
                              newType === type 
                                ? "bg-red-950 text-red-400 border-red-500" 
                                : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:border-zinc-800"
                            }`}
                          >
                            {type === 'scandal' ? '🔥 Systemic Scandal' : type === 'article' ? '📰 News Report' : '📺 Video Log'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Title input */}
                      <div>
                        <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold block mb-1.5">
                          Evidence Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder={newType === 'scandal' ? "e.g., The Land Allotment Kickback" : "e.g., Investigation into forest logging"}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500 transition"
                        />
                      </div>

                      {/* Source/Creator if Article or Video, or Severity if Scandal */}
                      {newType === 'scandal' ? (
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold block mb-1.5">
                            Risk/Severity Level
                          </label>
                          <select
                            value={newSeverity}
                            onChange={(e) => setNewSeverity(e.target.value as any)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-400 focus:outline-none focus:border-red-500 transition"
                          >
                            <option value="CRITICAL">CRITICAL (System collapse or high casualties)</option>
                            <option value="SEVERE">SEVERE (Widespread institutional subversion)</option>
                            <option value="WARNING">WARNING (Regional governance irregularities)</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold block mb-1.5">
                            {newType === 'article' ? 'Journalistic Outlet / Source *' : 'Video Creator / Journalist *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={newSource}
                            onChange={(e) => setNewSource(e.target.value)}
                            placeholder={newType === 'article' ? "e.g., Scroll.in" : "e.g., Ravish Kumar"}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500 transition"
                          />
                        </div>
                      )}

                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold block mb-1.5">
                        Detailed Summary & Evidence Points *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Provide a comprehensive summary of facts, witnesses, and specific timeline failures..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500 transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded font-mono text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Publish & Subjoin Evidence to Dossier
                    </button>

                  </form>
                </div>

              </div>
            );
          })()}

          {activeTab === 'matrix' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Massive Metrics Header */}
              <div className="border-b border-zinc-800 pb-6">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-2xl sm:text-3xl font-light text-white">
                    Primary Policy <span className="text-red-500 font-semibold">Failure Vectors</span>
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">REF: BJP-GOV-2026-FLAW-MATRIX</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedSector.stats.map((stat, i) => (
                    <div key={i} className="bg-zinc-900 p-5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition">
                      <p className="text-3xl sm:text-4xl font-mono text-red-500 tracking-tighter font-bold">{stat.value}</p>
                      <p className="text-xs sm:text-sm font-bold text-zinc-200 mt-2 uppercase tracking-wide">{stat.label}</p>
                      <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Unfiltered Investigative Report with Large, Readable Typography */}
              <div className="bg-zinc-900/30 rounded-lg border border-zinc-800 p-6 sm:p-8 space-y-6">
                
                <div className="border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="p-1.5 bg-red-950/40 text-red-400 rounded-md">
                      {getSectorIcon(selectedSector.iconName, "w-6 h-6")}
                    </span>
                    <span className="text-xs font-mono text-red-400 uppercase tracking-widest font-bold">Investigative Briefing</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug uppercase">
                    {activeReport.title}
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-400 font-medium italic mt-1 leading-relaxed">
                    {activeReport.subtitle}
                  </p>
                </div>

                {/* Main Body with Large readable font sizes */}
                <div className="prose prose-invert prose-red max-w-none text-sm sm:text-base text-zinc-300 space-y-6 leading-relaxed">
                  <ReactMarkdown>{activeReport.content}</ReactMarkdown>
                </div>

                {/* Core References section */}
                <div className="border-t border-zinc-800 pt-6 mt-6 space-y-3 bg-zinc-950/40 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <span className="text-xs sm:text-sm font-bold uppercase text-zinc-200">Independent YouTube Investigative Themes</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {activeReport.youtubeFocus}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-900/80">
                    <span className="text-xs font-bold uppercase text-zinc-400 block mb-2">Verifiable Academic & Independent Sources:</span>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-500 list-disc list-inside">
                      {activeReport.independentSources.map((source, idx) => (
                        <li key={idx}>{source}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-zinc-900/30 p-6 sm:p-8 rounded-lg border border-zinc-800">
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-2">Metrics Timeline (2014 - 2026)</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  A multi-year timeline tracing India's index tracking since the BJP-led government came into power. Click on any year to review precise metrics.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {INDEX_HISTORY.map((pt) => {
                    const isSelected = hoveredPoint?.year === pt.year;
                    return (
                      <button
                        key={pt.year}
                        onClick={() => setHoveredPoint(pt)}
                        className={`p-3 rounded-lg border transition-all text-left flex flex-col justify-between h-32 ${
                          isSelected 
                            ? 'bg-red-950/30 border-red-500 text-white shadow-lg shadow-red-950/10' 
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <span className="text-sm font-bold font-mono">{pt.year}</span>
                        <div className="space-y-1.5 mt-3">
                          <div className="text-xs flex justify-between">
                            <span className="text-zinc-500">Press F.:</span>
                            <span className="font-mono text-red-400 font-bold">{pt.pressFreedomRank}</span>
                          </div>
                          <div className="text-xs flex justify-between">
                            <span className="text-zinc-500">Unemp.:</span>
                            <span className="font-mono text-zinc-300 font-bold">{pt.unemploymentRate}%</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Highlighted Year Breakdown with Bigger Text */}
                {hoveredPoint && (
                  <div className="mt-6 p-6 bg-zinc-950 rounded-lg border border-zinc-800">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                      <span className="text-base sm:text-lg font-black text-white">Focus Year Metric Deep-Dive: {hoveredPoint.year}</span>
                      <span className="text-xs sm:text-sm text-red-400 font-mono uppercase bg-red-950/30 px-2 py-0.5 rounded">
                        Democracy Score: {hoveredPoint.vdemScore} / 1.00
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-zinc-900 p-4 rounded-lg">
                        <span className="text-xs text-zinc-500 uppercase font-bold block mb-1">Press Freedom Rank</span>
                        <span className="text-lg sm:text-xl font-bold text-white">{hoveredPoint.pressFreedomRank} / 180</span>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">Lower rank signifies higher level of state interference and threats to reporters.</p>
                      </div>
                      
                      <div className="bg-zinc-900 p-4 rounded-lg">
                        <span className="text-xs text-zinc-500 uppercase font-bold block mb-1">Unemployment Rate</span>
                        <span className="text-lg sm:text-xl font-bold text-white">{hoveredPoint.unemploymentRate}%</span>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">Estimated average by CMIE tracking the decline of small-scale industries.</p>
                      </div>
                      
                      <div className="bg-zinc-900 p-4 rounded-lg">
                        <span className="text-xs text-zinc-500 uppercase font-bold block mb-1">Top 1% Wealth Share</span>
                        <span className="text-lg sm:text-xl font-bold text-white">{hoveredPoint.wealthShareTopOne}%</span>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">Percentage of national wealth cornered by the elite oligarch demographic.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-zinc-900/30 p-6 sm:p-8 rounded-lg border border-zinc-800">
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider mb-2">Alternative Media Landscapes</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Mainstream broadcast networks are largely synchronized with government policy. Here is how independent journalism challenges the status quo:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-zinc-950 rounded-lg border border-zinc-800/80">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2 mb-3">Independent Digital Outlets</h4>
                    <ul className="space-y-3 text-xs sm:text-sm">
                      <li className="leading-relaxed"><strong>The Wire:</strong> Non-profit, fearless journalism investigating surveillance (Pegasus) & crony contracts.</li>
                      <li className="leading-relaxed"><strong>Newslaundry:</strong> Completely subscriber-funded, exposing television news disinformation.</li>
                      <li className="leading-relaxed"><strong>Scroll.in:</strong> Meticulous ground reports detailing human rights, farm crises, and local pollution.</li>
                      <li className="leading-relaxed"><strong>The Caravan:</strong> Premier long-form investigative magazine exposing judicial compromises and corporate networks.</li>
                    </ul>
                  </div>

                  <div className="p-5 bg-zinc-950 rounded-lg border border-zinc-800/80">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2 mb-3">Prominent Video Journalists</h4>
                    <ul className="space-y-3 text-xs sm:text-sm">
                      <li className="leading-relaxed"><strong>Ravish Kumar:</strong> Reports on forgotten public struggles, rural inflation, and the lack of decent jobs.</li>
                      <li className="leading-relaxed"><strong>Dhruv Rathee:</strong> Explains complex policies, electoral bonds, and democratic mechanisms directly to millions.</li>
                      <li className="leading-relaxed"><strong>The DeshBhakt:</strong> Interactive high-research political satire investigating double-speak and civic metrics.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Database Search Hub Header */}
              <div className="bg-zinc-900/40 p-6 sm:p-8 rounded-lg border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Search className="w-5 h-5 text-red-500 animate-pulse" />
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    Oversight Central Search Database
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Lookup ground investigations, verified state dossiers, independent policy audits, and alternative media sources locally. Query specific keywords to bypass mainstream censorship.
                </p>

                {/* Main Input */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search states, scandals, policy reports, articles, or independent channels..."
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3.5 pl-12 pr-10 text-sm text-zinc-200 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 transition placeholder-zinc-600 font-mono"
                  />
                  {globalSearchQuery && (
                    <button
                      onClick={() => setGlobalSearchQuery("")}
                      className="absolute right-3 top-3 px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded text-xs font-bold transition"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* suggestion tags */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                  <span className="text-zinc-500 uppercase font-bold tracking-wider font-mono text-[9px]">Suggested:</span>
                  {[
                    "Electoral Bonds",
                    "Press Freedom",
                    "Youth Unemployment",
                    "Bulldozer Justice",
                    "Manipur conflict",
                    "Vyapam",
                    "Hasdeo Arand"
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setGlobalSearchQuery(tag)}
                      className="px-2.5 py-1 bg-zinc-950/80 hover:bg-zinc-900 hover:text-red-400 border border-zinc-900 text-[10px] text-zinc-400 rounded-full font-mono transition"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic local search results matching engine */}
              {(() => {
                const query = globalSearchQuery.trim().toLowerCase();

                // 1. Gather all possible matches
                // A. States matching
                const matchedStates = dossiersList.filter(s => {
                  if (!query) return false;
                  return (
                    s.name.toLowerCase().includes(query) ||
                    s.shortSummary.toLowerCase().includes(query) ||
                    s.scandals.some(sc => sc.title.toLowerCase().includes(query) || sc.desc.toLowerCase().includes(query)) ||
                    s.metrics.some(m => m.label.toLowerCase().includes(query) || m.value.toLowerCase().includes(query))
                  );
                });

                // B. Reports matching
                const matchedReports = Object.entries(PREWRITTEN_REPORTS).map(([id, r]) => ({ id, ...r })).filter(r => {
                  if (!query) return false;
                  return (
                    r.title.toLowerCase().includes(query) ||
                    r.subtitle.toLowerCase().includes(query) ||
                    r.content.toLowerCase().includes(query) ||
                    r.youtubeFocus.toLowerCase().includes(query) ||
                    r.independentSources.some(src => src.toLowerCase().includes(query))
                  );
                });

                // C. Recommended media outlets matching
                const matchedMedia = RECOMMENDED_INDEPENDENT_MEDIA.filter(m => {
                  if (!query) return false;
                  return (
                    m.name.toLowerCase().includes(query) ||
                    m.description.toLowerCase().includes(query) ||
                    m.focusArea.toLowerCase().includes(query) ||
                    (m.keyPersonalities && m.keyPersonalities.toLowerCase().includes(query))
                  );
                });

                // D. Articles matching (flattened from all states)
                const matchedArticles: { stateId: string; stateName: string; title: string; outlet: string; summary: string; url: string }[] = [];
                dossiersList.forEach(s => {
                  s.articles.forEach(art => {
                    if (!query) return;
                    if (
                      art.title.toLowerCase().includes(query) ||
                      art.summary.toLowerCase().includes(query) ||
                      art.outlet.toLowerCase().includes(query)
                    ) {
                      matchedArticles.push({
                        stateId: s.id,
                        stateName: s.name,
                        ...art
                      });
                    }
                  });
                });

                const totalResults = matchedStates.length + matchedReports.length + matchedMedia.length + matchedArticles.length;

                // Apply filter category selection
                const displayStates = globalSearchFilter === 'all' || globalSearchFilter === 'states' ? matchedStates : [];
                const displayReports = globalSearchFilter === 'all' || globalSearchFilter === 'reports' ? matchedReports : [];
                const displayMedia = globalSearchFilter === 'all' || globalSearchFilter === 'media' ? matchedMedia : [];
                const displayArticles = globalSearchFilter === 'all' || globalSearchFilter === 'articles' ? matchedArticles : [];

                const displayTotal = displayStates.length + displayReports.length + displayMedia.length + displayArticles.length;

                return (
                  <div className="space-y-6">
                    {/* Filters rail */}
                    {query && (
                      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-3">
                        <button
                          onClick={() => setGlobalSearchFilter('all')}
                          className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition ${
                            globalSearchFilter === 'all'
                              ? 'bg-red-950/40 text-red-400 border border-red-900/40'
                              : 'bg-zinc-950/40 text-zinc-500 hover:text-zinc-300 border border-zinc-900'
                          }`}
                        >
                          ALL MATCHES ({totalResults})
                        </button>
                        <button
                          onClick={() => setGlobalSearchFilter('states')}
                          className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition ${
                            globalSearchFilter === 'states'
                              ? 'bg-red-950/40 text-red-400 border border-red-900/40'
                              : 'bg-zinc-950/40 text-zinc-500 hover:text-zinc-300 border border-zinc-900'
                          }`}
                        >
                          STATES ({matchedStates.length})
                        </button>
                        <button
                          onClick={() => setGlobalSearchFilter('reports')}
                          className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition ${
                            globalSearchFilter === 'reports'
                              ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40'
                              : 'bg-zinc-950/40 text-zinc-500 hover:text-zinc-300 border border-zinc-900'
                          }`}
                        >
                          REPORTS ({matchedReports.length})
                        </button>
                        <button
                          onClick={() => setGlobalSearchFilter('articles')}
                          className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition ${
                            globalSearchFilter === 'articles'
                              ? 'bg-blue-950/40 text-blue-400 border border-blue-900/40'
                              : 'bg-zinc-950/40 text-zinc-500 hover:text-zinc-300 border border-zinc-900'
                          }`}
                        >
                          GROUND ARTICLES ({matchedArticles.length})
                        </button>
                        <button
                          onClick={() => setGlobalSearchFilter('media')}
                          className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition ${
                            globalSearchFilter === 'media'
                              ? 'bg-purple-950/40 text-purple-400 border border-purple-900/40'
                              : 'bg-zinc-950/40 text-zinc-500 hover:text-zinc-300 border border-zinc-900'
                          }`}
                        >
                          INDEPENDENT CHANNELS ({matchedMedia.length})
                        </button>
                      </div>
                    )}

                    {/* Content results */}
                    {!query ? (
                      <div className="bg-zinc-950/30 rounded-lg border border-zinc-900 p-8 text-center space-y-4">
                        <div className="max-w-sm mx-auto space-y-2">
                          <Compass className="w-8 h-8 text-zinc-600 mx-auto animate-pulse" />
                          <p className="text-zinc-400 font-mono text-xs uppercase font-bold">Awaiting Search Input</p>
                          <p className="text-zinc-500 text-xs leading-relaxed">
                            Type a keyword above or select one of the suggested tags to start parsing the Indian governance oversight archives instantly.
                          </p>
                        </div>
                      </div>
                    ) : displayTotal === 0 ? (
                      <div className="bg-zinc-950/30 rounded-lg border border-zinc-900 p-8 text-center space-y-4">
                        <div className="max-w-sm mx-auto space-y-2">
                          <AlertTriangle className="w-8 h-8 text-amber-500/80 mx-auto animate-bounce" />
                          <p className="text-zinc-300 font-mono text-xs uppercase font-bold">Zero Records Matched</p>
                          <p className="text-zinc-500 text-xs leading-relaxed">
                            No dossiers, reports, articles, or channels matched the criteria for <strong className="text-zinc-300">"{query}"</strong>. Try a different query or adjust your filters.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        
                        {/* 1. MATCHED STATES */}
                        {displayStates.map((state) => (
                          <div
                            key={state.id}
                            className="bg-zinc-900/20 border border-zinc-800 hover:border-red-500/30 rounded-lg p-5 transition space-y-4 shadow-xl"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-[9px] font-mono bg-red-950/40 text-red-400 px-2.5 py-0.5 rounded border border-red-900/30 font-black uppercase tracking-wider">
                                  STATE DOSSIER RECORD
                                </span>
                                <h4 className="text-base font-extrabold text-white mt-1.5 flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4 text-red-500" />
                                  {state.name}
                                </h4>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setGlobalSearchModalDossier(state)}
                                  className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 text-[10px] text-zinc-300 border border-zinc-800 rounded font-mono font-bold transition flex items-center gap-1"
                                >
                                  📂 Open Full Dossier
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedStateId(state.id);
                                    setActiveTab('regional');
                                  }}
                                  className="px-3 py-1.5 bg-red-950/30 hover:bg-red-900/30 text-[10px] text-red-400 border border-red-500/30 rounded font-mono font-bold transition flex items-center gap-1"
                                >
                                  🗺️ Map View
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed italic">
                              "{state.shortSummary}"
                            </p>

                            {/* Scandals highlights */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-900/50">
                              {state.scandals.slice(0, 2).map((scandal, sIdx) => (
                                <div key={sIdx} className="p-2.5 bg-zinc-950/60 rounded border border-zinc-900 text-[11px] space-y-1">
                                  <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                                    <span className="text-zinc-400 uppercase">AUDITED FLUSHPOINT</span>
                                    <span className={
                                      scandal.severity === 'CRITICAL' ? 'text-red-500' :
                                      scandal.severity === 'SEVERE' ? 'text-amber-500' : 'text-zinc-500'
                                    }>
                                      ● {scandal.severity}
                                    </span>
                                  </div>
                                  <h5 className="font-extrabold text-zinc-300 leading-snug">{scandal.title}</h5>
                                  <p className="text-zinc-500 line-clamp-2 leading-relaxed">{scandal.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* 2. MATCHED REPORTS */}
                        {displayReports.map((report) => (
                          <div
                            key={report.id}
                            className="bg-zinc-900/20 border border-zinc-800 hover:border-amber-500/30 rounded-lg p-5 transition space-y-4 shadow-xl"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-[9px] font-mono bg-amber-950/40 text-amber-400 px-2.5 py-0.5 rounded border border-amber-900/30 font-black uppercase tracking-wider">
                                  CRITICAL OVERSIGHT REPORT
                                </span>
                                <h4 className="text-base font-extrabold text-white mt-1.5 flex items-center gap-1.5">
                                  <FileText className="w-4 h-4 text-amber-400" />
                                  {report.title}
                                </h4>
                              </div>
                              <button
                                onClick={() => {
                                  const matchingSector = SECTORS.find(sec => sec.id === report.id);
                                  if (matchingSector) {
                                    setSelectedSector(matchingSector);
                                  }
                                  setActiveTab('sources');
                                }}
                                className="px-3 py-1.5 bg-amber-950/30 hover:bg-amber-900/30 text-[10px] text-amber-400 border border-amber-500/30 rounded font-mono font-bold transition flex items-center gap-1 shrink-0"
                              >
                                📄 Open Full Analysis
                              </button>
                            </div>

                            <p className="text-xs text-zinc-300 font-bold leading-normal">
                              {report.subtitle}
                            </p>

                            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                              {report.content.replace(/[#*`>]/g, "")}
                            </p>

                            <div className="text-[10px] font-mono text-zinc-500 bg-zinc-950/50 p-2.5 rounded border border-zinc-900/50 flex justify-between items-center">
                              <span>PRIMARY VERIFICATION METHODOLOGY:</span>
                              <span className="text-amber-400 font-bold uppercase">{report.authorNote}</span>
                            </div>
                          </div>
                        ))}

                        {/* 3. MATCHED ARTICLES */}
                        {displayArticles.map((art, aIdx) => (
                          <div
                            key={aIdx}
                            className="bg-zinc-900/20 border border-zinc-800 hover:border-blue-500/30 rounded-lg p-5 transition space-y-3 shadow-xl"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <div className="flex flex-wrap gap-2 items-center">
                                  <span className="text-[9px] font-mono bg-blue-950/40 text-blue-400 px-2.5 py-0.5 rounded border border-blue-900/30 font-black uppercase tracking-wider">
                                    VERIFIED GROUND ARTICLE
                                  </span>
                                  <span className="text-[9px] font-mono bg-zinc-950 text-zinc-500 px-2 py-0.5 rounded border border-zinc-900">
                                    REGION: {art.stateName}
                                  </span>
                                </div>
                                <h4 className="text-sm font-extrabold text-white mt-2 flex items-center gap-1.5">
                                  <Newspaper className="w-4 h-4 text-blue-400" />
                                  {art.title}
                                </h4>
                              </div>
                              <a
                                href={art.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 text-[10px] text-zinc-300 border border-zinc-800 rounded font-mono font-bold transition flex items-center gap-1 shrink-0"
                              >
                                🌐 VISIT SITE
                                <ExternalLink className="w-3 h-3 text-zinc-500" />
                              </a>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {art.summary}
                            </p>

                            <div className="text-[10px] font-mono text-zinc-500 flex justify-between">
                              <span>SOURCE OUTLET: <strong className="text-blue-400 uppercase">{art.outlet}</strong></span>
                              <button
                                onClick={() => {
                                  setSelectedStateId(art.stateId);
                                  setActiveTab('regional');
                                }}
                                className="text-red-400 hover:underline font-bold"
                              >
                                View State Dossier →
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* 4. MATCHED CHANNELS / MEDIA */}
                        {displayMedia.map((media, mIdx) => (
                          <div
                            key={mIdx}
                            className="bg-zinc-900/20 border border-zinc-800 hover:border-purple-500/30 rounded-lg p-5 transition space-y-3 shadow-xl"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="text-[9px] font-mono bg-purple-950/40 text-purple-400 px-2.5 py-0.5 rounded border border-purple-900/30 font-black uppercase tracking-wider">
                                  {media.type}
                                </span>
                                <h4 className="text-sm font-extrabold text-white mt-1.5 flex items-center gap-1.5">
                                  {media.type === "YouTube Channel" ? (
                                    <Youtube className="w-4 h-4 text-red-500" />
                                  ) : (
                                    <Globe className="w-4 h-4 text-purple-400" />
                                  )}
                                  {media.name}
                                </h4>
                              </div>
                              {media.keyPersonalities && (
                                <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2.5 py-1 rounded border border-zinc-800 font-bold shrink-0">
                                  🎙️ {media.keyPersonalities}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {media.description}
                            </p>

                            <div className="text-[10px] font-mono text-zinc-500 border-t border-zinc-900/50 pt-2 flex flex-wrap gap-x-6">
                              <span>KEY AUDIT FOCUS: <strong className="text-purple-400 uppercase">{media.focusArea}</strong></span>
                            </div>
                          </div>
                        ))}

                      </div>
                    )}
                  </div>
                );
              })()}

              {/* MODAL DISPLAY FOR GLOBAL STATE DOSSIER */}
              <AnimatePresence>
                {globalSearchModalDossier && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
                    >
                      {/* Modal Header */}
                      <div className="p-5 border-b border-zinc-900 bg-zinc-900/20 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-mono bg-red-950 text-red-400 px-2.5 py-0.5 rounded border border-red-900/30 font-black uppercase">
                            State Audited Dossier
                          </span>
                          <h3 className="text-lg font-black text-white mt-1 flex items-center gap-1.5">
                            <MapPin className="w-5 h-5 text-red-500" />
                            {globalSearchModalDossier.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => setGlobalSearchModalDossier(null)}
                          className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center font-bold text-sm transition"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div className="p-6 overflow-y-auto space-y-6 text-sm">
                        
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Summary Context</h4>
                          <p className="text-zinc-300 leading-relaxed italic text-xs">
                            "{globalSearchModalDossier.shortSummary}"
                          </p>
                        </div>

                        {/* Scandals */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-900 pb-1.5">
                            Major Governance Scandals ({globalSearchModalDossier.scandals.length})
                          </h4>
                          <div className="space-y-2.5">
                            {globalSearchModalDossier.scandals.map((s, idx) => (
                              <div key={idx} className="p-3 bg-zinc-900/30 border border-zinc-800/80 rounded space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                                  <span className="text-zinc-400 uppercase">SCANDAL #{idx + 1}</span>
                                  <span className={
                                    s.severity === 'CRITICAL' ? 'text-red-500' :
                                    s.severity === 'SEVERE' ? 'text-amber-500' : 'text-zinc-500'
                                  }>
                                    ● {s.severity}
                                  </span>
                                </div>
                                <h5 className="font-extrabold text-zinc-200">{s.title}</h5>
                                <p className="text-zinc-400 text-xs leading-relaxed">{s.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-900 pb-1.5">
                            Key Metrics & Failure Scores
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {globalSearchModalDossier.metrics.map((m, idx) => (
                              <div key={idx} className="p-3 bg-zinc-900/50 border border-zinc-900 rounded font-mono text-[11px] space-y-1">
                                <span className="text-zinc-500 block text-[9px] uppercase">{m.label}</span>
                                <span className="text-red-400 font-black text-xs block">{m.value}</span>
                                <p className="text-zinc-600 text-[10px] leading-snug">{m.detail}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Articles list */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-900 pb-1.5">
                            Local Media Ground Articles ({globalSearchModalDossier.articles.length})
                          </h4>
                          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                            {globalSearchModalDossier.articles.map((art, idx) => (
                              <div key={idx} className="p-2.5 bg-zinc-900/10 border border-zinc-900 rounded hover:border-zinc-800 transition text-xs space-y-1 flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono bg-red-950/20 text-red-400 border border-red-950/30 px-1.5 py-0.2 rounded font-bold uppercase">
                                      {art.outlet}
                                    </span>
                                  </div>
                                  <h5 className="font-bold text-zinc-300 leading-snug">{art.title}</h5>
                                  <p className="text-zinc-500 text-[11px] leading-relaxed line-clamp-2">{art.summary}</p>
                                </div>
                                <a
                                  href={art.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Modal Footer */}
                      <div className="p-4 border-t border-zinc-900 bg-zinc-900/10 flex justify-end gap-3">
                        <button
                          onClick={() => setGlobalSearchModalDossier(null)}
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded font-mono text-xs font-bold transition"
                        >
                          CLOSE DOSSIER
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStateId(globalSearchModalDossier.id);
                            setGlobalSearchModalDossier(null);
                            setActiveTab('regional');
                          }}
                          className="px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/40 rounded font-mono text-xs font-bold transition flex items-center gap-1.5"
                        >
                          🗺️ VIEW ON TACTICAL SCANNER
                        </button>
                      </div>

                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>
          )}

        </section>

        {/* Right Column (span 3): Democratic Decay Visual Indices & Warning Bulletins */}
        <aside className="lg:col-span-3 bg-zinc-950 p-4 sm:p-6 flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Democratic Decay Indices</h2>
              <span className="text-[10px] font-mono text-zinc-600">2014 - 2026 TRENDS</span>
            </div>

            {/* Custom Responsive SVG Charts */}
            <div className="space-y-6">
              
              {/* Press Freedom Chart */}
              <div className="bg-zinc-900/30 p-3 rounded border border-zinc-800/80">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-zinc-400 font-medium">Press Freedom Decline</span>
                  <span className="text-red-400 font-mono font-bold">140 → 161 (Worst)</span>
                </div>
                {/* SVG Line Graph */}
                <div className="h-28 w-full bg-zinc-950 rounded flex items-center justify-center p-2 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    
                    {/* Line path representing steep fall (140 to 161) */}
                    <path 
                      d="M 5,20 L 20,25 L 35,22 L 50,28 L 65,36 L 80,45 L 95,48" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                    
                    {/* Glowing dots */}
                    <circle cx="5" cy="20" r="2" fill="#fff" />
                    <circle cx="50" cy="28" r="2" fill="#ef4444" />
                    <circle cx="95" cy="48" r="2" fill="#ef4444" className="animate-pulse" />
                  </svg>
                  <div className="absolute bottom-1 left-2 text-[8px] font-mono text-zinc-500">2014</div>
                  <div className="absolute bottom-1 right-2 text-[8px] font-mono text-zinc-500">2026 (Est.)</div>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal mt-1.5">
                  Reflects reporters detained under UAPA, forced channel buy-outs, and targeting of regional portals.
                </p>
              </div>

              {/* Unemployment Crisis Chart */}
              <div className="bg-zinc-900/30 p-3 rounded border border-zinc-800/80">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-zinc-400 font-medium">Unemployment Average (%)</span>
                  <span className="text-red-400 font-mono font-bold">5.4% → 8.4%</span>
                </div>
                {/* SVG Line Graph */}
                <div className="h-28 w-full bg-zinc-950 rounded flex items-center justify-center p-2 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    
                    {/* Path representing rising unemployment */}
                    <path 
                      d="M 5,42 L 20,41 L 35,37 L 50,18 L 65,22 L 80,17 L 95,15" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                    
                    <circle cx="5" cy="42" r="2" fill="#fff" />
                    <circle cx="50" cy="18" r="2" fill="#ef4444" />
                    <circle cx="95" cy="15" r="2" fill="#ef4444" className="animate-pulse" />
                  </svg>
                  <div className="absolute bottom-1 left-2 text-[8px] font-mono text-zinc-500">2014</div>
                  <div className="absolute bottom-1 right-2 text-[8px] font-mono text-zinc-500">2026 (Est.)</div>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal mt-1.5">
                  Sudden spikes matching 2016 demonetization damage and 2020 pandemic lockdown mismanagement.
                </p>
              </div>

              {/* Wealth Inequality Chart */}
              <div className="bg-zinc-900/30 p-3 rounded border border-zinc-800/80">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-zinc-400 font-medium">Top 1% Wealth Share (%)</span>
                  <span className="text-red-400 font-mono font-bold">31.2% → 40.6%</span>
                </div>
                {/* SVG Line Graph */}
                <div className="h-28 w-full bg-zinc-950 rounded flex items-center justify-center p-2 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    
                    {/* Path representing rising wealth share */}
                    <path 
                      d="M 5,38 L 20,33 L 35,26 L 50,21 L 65,18 L 80,17 L 95,15" 
                      fill="none" 
                      stroke="#ef4444" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                    
                    <circle cx="5" cy="38" r="2" fill="#fff" />
                    <circle cx="95" cy="15" r="2" fill="#ef4444" className="animate-pulse" />
                  </svg>
                  <div className="absolute bottom-1 left-2 text-[8px] font-mono text-zinc-500">2014</div>
                  <div className="absolute bottom-1 right-2 text-[8px] font-mono text-zinc-500">2026 (Est.)</div>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal mt-1.5">
                  Calculated by World Inequality Database, highlighting extreme polarization & wealth consolidation.
                </p>
              </div>

            </div>
          </div>

          <div className="mt-auto p-4 bg-red-950/20 border border-red-900/50 rounded flex flex-col gap-2">
            <span className="text-[11px] font-bold text-red-400 font-mono uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              Oversight Advisory
            </span>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
              The Supreme Court of India declared Electoral Bonds unconstitutional, noting the severe threat of anonymous corporate donations driving executive state capture. Institutional watchdogs must monitor agency neutrality.
            </p>
          </div>
        </aside>

      </div>

      {/* 5. Footer */}
      <footer className="h-12 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 sm:px-8 justify-between text-[11px] font-mono text-zinc-500 shrink-0">
        <div className="flex gap-4 sm:gap-6 uppercase">
          <span>Oversight Mode: ACTIVE</span>
          <span className="hidden sm:inline">Protocol: Grounded Investigative Satire & Critical Science</span>
          <span className="hidden md:inline text-red-500 font-bold">STRICT FILTERING</span>
        </div>
        <div>© 2026 INDEPENDENT GOVERNANCE PROJECT</div>
      </footer>

    </div>
  );
}
