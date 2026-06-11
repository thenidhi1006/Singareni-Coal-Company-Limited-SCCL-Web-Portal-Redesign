
import { useState, useEffect } from "react";
import axios from "axios";
const energyImage = "/images/energy.jpg";
const logoImage = "/images/logo.jpeg";
const opencastImage = "/images/opencast.jpg";
const undergroundImage = "/images/underground.jpg";

const tirumalaRaoImage = "/images/Tirumalarao.jpg";
const navinImage = "/images/SriNaveen.jpg";
const sandeepImage = "/images/sandeepKumar.png";
const sanjeevImage = "/images/SanjeevKumar.jpg";
const ajiteshImage = "/images/Sri_Ajitesh_Kumar.jpg";

const cmdImage = "/images/Director SCCL.jpeg";
const planningImage = "/images/Planning.jpeg";
const financeImage = "/images/Finance.jpg";

const teamImage = "/images/team.png";
const graphImage = "/images/graph.png";
const analysisImage = "/images/Analysis.png";

const mineVideo = "/mine.mp4";

const directorImageAliases = {
  "cmd.jpg": cmdImage,
  "planning.jpg": planningImage,
  "finance.jpg": financeImage,
  "tirumalaRao.jpg": tirumalaRaoImage,
  "tirumalarao.jpg": tirumalaRaoImage,
  "navin.jpg": navinImage,
  "sandeep.jpg": sandeepImage,
  "sanjeev.jpg": sanjeevImage,
  "ajitesh.jpg": ajiteshImage,
};

const resolveDirectorImage = (imageUrl) => {
  if (!imageUrl) return logoImage;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  const fileName = imageUrl.split("/").pop();
  const alias = directorImageAliases[fileName] || directorImageAliases[fileName?.toLowerCase()];

  if (alias) return alias;
  if (imageUrl.startsWith("/")) return imageUrl;

  return `/images/${imageUrl}`;
};

const normalizeDirector = (director) => {
  // Check if this is a heading
  if (director.type === 'heading') {
    return {
      ...director,
      isHeading: true,
      role: "",
      img: logoImage, // Use SCCL logo for headings
      tenure: "",
      expertise: "",
      education: "",
      working: "",
      pastExperience: "",
    };
  }
  
  return {
    ...director,
    isHeading: false,
    role: director.designation || director.role || "Director",
    img: resolveDirectorImage(director.imageUrl || director.img),
    tenure: director.tenure || "",
    expertise: director.expertise || "Corporate Governance",
    education: director.education || "Details will be updated soon.",
    working: director.working || director.description || "Details will be updated soon.",
    pastExperience: director.pastExperience || "Details will be updated soon.",
  };
};

const getNodeText = (node, tagName) => node.querySelector(tagName)?.textContent?.trim() || "";

const parseDirectorsXml = (xmlText) => {
  const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");
  const parseError = xmlDoc.querySelector("parsererror");

  if (parseError) {
    throw new Error("Invalid directors XML");
  }

  return Array.from(xmlDoc.querySelectorAll("director")).map((director) => {
    const type = director.getAttribute("type") || "";
    
    return normalizeDirector({
      id: getNodeText(director, "id"),
      name: getNodeText(director, "name"),
      designation: getNodeText(director, "designation"),
      imageUrl: getNodeText(director, "imageUrl"),
      tenure: getNodeText(director, "tenure"),
      description: getNodeText(director, "description"),
      expertise: getNodeText(director, "expertise"),
      education: getNodeText(director, "education"),
      working: getNodeText(director, "working"),
      pastExperience: getNodeText(director, "pastExperience"),
      type: type,
    });
  });
};

export default function SCCLHome() {
  // Navigation & Dropdown States
  const [message, setMessage] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [backendMessage, setBackendMessage] = useState("");
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [showDirectorModal, setShowDirectorModal] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDirector, setOpenDirector] = useState(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // CONTROL STATES
  const [expandedCategory, setExpandedCategory] = useState("About Us"); 
  const [selectedCategory, setSelectedCategory] = useState("About Us");
  const [selectedSubItem, setSelectedSubItem] = useState("Company Profile");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/message")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("Backend Error:", error);
      });

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const navigationData = {
    "About Us": ["Company Profile", "Our History", "Vision & Mission", "Board of Directors", "Milestones"],
    "Company": ["Corporate Structure", "Area & Units", "Joint Ventures", "MoU & Commitments"],
    "Business": ["Coal Mining", "Power Generation", "Consultancy Services", "Coal Quality"],
    "Tenders": ["Live Tenders", "Archive Tenders", "E-Procurement Portal", "Vendor Registration"],
    "Performance": ["Production Statistics", "Financial Highlights", "Physical Progress", "Annual Reports"],
    "CSR": ["Community Welfare", "Healthcare Initiatives", "Education & Skill Development", "Environment Projects"],
    "Careers": ["Current Openings", "Results", "Apprenticeship", "Employee Corner"]
  };

  const contentRepository = {
    "About Us": {
      "Company Profile": {
        title: "Corporate Profile & Overview",
        summary: "The Singareni Collieries Company Limited (SCCL) is a government-owned coal mining corporation jointly managed by the Government of Telangana (51%) and Government of India (49%). Operating across the rich Godavari Valley coalfields, SCCL serves as the vital energy engine driving southern India's industrial backbone.",
        details: ["Incorporated in 1920 with over a century of mining heritage.", "Pioneers in implementing heavy earthmoving automation across open cast environments.", "Supplier of raw materials to prominent power grids, fertilizer sectors, and cement manufacturing corridors."]
      },
      "Our History": {
        title: "A Centuries-Old Mining Heritage",
        summary: "From the discovery of extensive fossil fuel deposits in 1871 by the Geological Survey of India near Yellandu village to modern state governance, SCCL holds an uninterrupted history of industrial leadership.",
        details: ["1886: The Hyderabad Deccan Company acquires commercial mining leases.", "1945: The state acquisition under the Nizam shifts operational governance.", "1956: Reorganization institutes modern tripartite central/state investment strategies."]
      },
      "Vision & Mission": {
        title: "Strategic Vision & Core Commitments",
        summary: "To emerge as a premier energy giant by sustainably maximizing coal extraction velocity while deploying green energy alternatives and prioritizing global safety metrics.",
        details: ["Vision: Safely fuel India's growth through techno-commercial dominance and zero-harm workflows.", "Mission: Deliver premium grades of coal cleanly, satisfying demanding multi-ton consumer objectives reliably."]
      },
      "Board of Directors": {
        title: "Corporate Governance Architecture",
        summary: "Guided by prominent IAS officers and sector experts, our board executes robust financial and operational blueprints designed to protect worker welfare and drive commercial breakthroughs.",
        details: ["Chaired by administrative experts managing macro industrial updates.", "Continuous alignment with national ministry goals and environmental board mandates."]
      },
      "Milestones": {
        title: "Historical Records & Industrial Milestones",
        summary: "Breaking efficiency matrices year-over-year, SCCL consistently achieves monumental multi-million ton milestones, securing national recognition and safety accolades.",
        details: ["Successfully crossed the historic 70 Million Ton annual extraction barrier.", "Deployment of Asia's largest high-capacity continuous miners in underground units."]
      }
    },
    "Company": {
      "Corporate Structure": {
        title: "Organizational Hierarchy & Workflow",
        summary: "A transparent and highly communicative corporate matrix linking strategic executive boardrooms directly with technical mine-managers and ground teams.",
        details: ["Streamlined departments specializing in safety compliance, exploration, and commercial legal tracking.", "Decentralized control loops to minimize administrative delays during mission-critical tasks."]
      },
      "Area & Units": {
        title: "Active Operational Areas & Regional Fields",
        summary: "SCCL manages its sprawling infrastructure assets by segmenting operations across distinct regional hubs strategically located throughout the Godavari river belt.",
        details: ["Key sectors include Kothagudem, Ramagundam, Bellampalli, and Manuguru.", "Each sector functions with dedicated engineering pools, medical arrays, and processing facilities."]
      },
      "Joint Ventures": {
        title: "Synergistic National & Global Alliances",
        summary: "Forming strategic corporate unions with thermal giants and engineering innovators to scale output capacities and build downstream infrastructure smoothly.",
        details: ["Collaborative development projects alongside NTPC and state power distribution companies.", "Technology exchange frameworks with global mining conglomerates to integrate continuous miner systems."]
      },
      "MoU & Commitments": {
        title: "Memorandums of Understanding & Compliance",
        summary: "Formalizing industrial contracts, green targets, and supply-chain obligations with transparency to safeguard shareholder values and meet public commitments.",
        details: ["Signed pacts with environmental ministries tracking proactive mine-reclamation speeds.", "Guaranteed coal link agreements secured with multi-state power generating grids."]
      }
    },
    "Business": {
      "Coal Mining": {
        title: "Advanced Open Cast & Underground Extraction",
        summary: "Employing complex engineering mechanisms to extract vital coal seams safely from underground tunnels and extensive surface operations.",
        details: ["Underground units use shortwall, longwall, and continuous miner technologies.", "Open cast zones deploy mega dumpers, high-capacity draglines, and automated crushing setups."]
      },
      "Power Generation": {
        title: "Thermal & Commercial Solar Energy Portfolios",
        summary: "Diversifying from traditional solid fuels into direct electricity generation through high-efficiency thermal units and expanding commercial solar fields.",
        details: ["The 1200 MW Singareni Thermal Power Plant operates with top-tier Plant Load Factors (PLF).", "Over 200+ MW of captive solar array installations offset standard corporate industrial footprints."]
      },
      "Consultancy Services": {
        title: "Technical Engineering Advisory & Exploration Services",
        summary: "Sharing deep technical expertise built over a century to consult for external mining bodies in safety, deep-bore exploration, and system setups.",
        details: ["Expertise in complex strata mechanics, structural safety modeling, and environmental clearings.", "Advanced mine-mapping and continuous digital geological profiling for newer resource blocks."]
      },
      "Coal Quality": {
        title: "Rigorous Quality Assurance & Grade Controls",
        summary: "Ensuring that every shipped metric ton meets exact gross calorific value specifications through regular independent laboratory audits.",
        details: ["Implementation of automated cross-belt samplers across high-velocity loading docks.", "Third-party validation setups confirming exact material configurations for thermal plant inputs."]
      }
    },
    "Tenders": {
      "Live Tenders": {
        title: "Active Procurement Opportunities & Notices",
        summary: "Open bidding processes encouraging certified global and domestic engineering partners to supply state-of-the-art machinery and specialized labor pipelines.",
        details: ["Transparent list tracking heavy earthmoving rentals, structural supplies, and tech upgrades.", "Time-sensitive digital windows with clearly documented processing parameters and bid deadlines."]
      },
      "Archive Tenders": {
        title: "Historical Bidding Records & Closed Allocations",
        summary: "A reference directory storing information on finalized commercial biddings, historical costs, and past commercial contracts.",
        details: ["Comprehensive data points useful for upcoming industrial pricing evaluations.", "Maintains transparent audits on past contractual performance vectors and timelines."]
      },
      "E-Procurement Portal": {
        title: "Secured Electronic Bidding Workspace",
        summary: "A direct digital gateway optimized for rapid vendor interactions, certified encryption, and legally compliant online bidding.",
        details: ["Saves logistical overheads by processing security deposits and documents entirely online.", "Instant notifications tracking tender clarifications and modifications live."]
      },
      "Vendor Registration": {
        title: "New Partner Onboarding & Quality Verification",
        summary: "Clear instructions outlining the credentials and documentation required to become an authorized corporate supplier for SCCL.",
        details: ["Standard criteria screening for financial liquidity, safety track records, and operational capability.", "Streamlined digital verification portals built to prevent operational gridlocks for vendors."]
      }
    },
    "Performance": {
      "Production Statistics": {
        title: "Annual Metric-Ton Volume & Extraction Outputs",
        summary: "Real-time graphs and monthly summaries documenting actual raw coal output compared against targeted metrics across all active zones.",
        details: ["Consistently setting records with over 70+ Million Tons of annual coal extraction.", "Granular performance charts analyzing output velocity modifications month-over-month."]
      },
      "Financial Highlights": {
        title: "Fiscal Growth, Net Profits, & Revenue Records",
        summary: "A solid presentation of our financial strength, documenting multi-billion rupee turnover thresholds and substantial state dividend contributions.",
        details: ["Annual revenues hovering around ₹35,000 Crores with impressive profit margins.", "Favorable metrics in asset utility indices and continuous debt-reduction structures."]
      },
      "Physical Progress": {
        title: "Infrastructure Scaling & New Mine Preparations",
        summary: "Tracking the construction velocity of railway lines, overburden clearing metrics, and heavy industrial site developments.",
        details: ["Accelerated commissioning of dedicated freight lines for direct thermal station routing.", "Monitored excavation progress metrics for upcoming mega open cast blocks."]
      },
      "Annual Reports": {
        title: "Comprehensive Corporate & Sustainability Disclosures",
        summary: "Formally prepared corporate portfolios detailing structural changes, balance sheets, and environmental targets for complete public accountability.",
        details: ["Downloadable audited financial ledgers verified by statutory agencies.", "In-depth logs charting safety parameters alongside social progress goals."]
      }
    },
    "CSR": {
      "Community Welfare": {
        title: "Transforming Regional Lives & Living Environments",
        summary: "Investing substantial resources into upgrading drinking water channels, rural roads, and public spaces adjacent to our industrial hubs.",
        details: ["Provision of clean drinking water systems to surrounding villages within our mining zones.", "Sustained investments building connecting infrastructure to promote local micro-economies."]
      },
      "Healthcare Initiatives": {
        title: "Advanced Medical Operations & Free Clinics",
        summary: "Deploying high-quality regional hospital networks and mobile health units to provide free medical services to workers and the local community.",
        details: ["Fully functional specialist hospitals providing medical care to employee families.", "Regular health screening setups addressing respiratory safety across adjacent communities."]
      },
      "Education & Skill Development": {
        title: "Empowering Local Youth via Targeted Vocational Training",
        summary: "Sponsoring institutions and specialized training centers to equip the next generation with employment-ready industrial skills.",
        details: ["Operating specialized polytechnics and schools focused on practical technological curriculums.", "Fully funded apprenticeship allocations boosting employability across local technical sectors."]
      },
      "Environment Projects": {
        title: "Aggressive Reforelation & Bio-Reclamation Models",
        summary: "Counteracting active carbon and mining footprints by planting millions of native trees and turning closed quarries into eco-parks.",
        details: ["Extensive tree plantation drives restoring regional biodiversity balances efficiently.", "Deployment of advanced industrial effluent treatments protecting surrounding river basins."]
      }
    },
    "Careers": {
      "Current Openings": {
        title: "Recruitment Portals for Professional & Technical Talent",
        summary: "Looking for skilled mining engineers, geologists, financial experts, and technicians eager to drive a major public energy corporation forward.",
        details: ["Clear eligibility checklists tracking engineering, medical, and executive job notifications.", "Structured online pathways for submitting applications and verifying background documents."]
      },
      "Results": {
        title: "Official Examination Marks & Selection Merit Lists",
        summary: "Maintained lists tracking written exam results, interview shortlists, and final job allocations with complete transparency.",
        details: ["Regular updates organized by notification numbers to prevent confusion.", "Secure mechanisms for candidates to check their scores and ranking boards online."]
      },
      "Apprenticeship": {
        title: "Practical On-Site Training Paths for Skilled Trades",
        summary: "Providing critical operational exposure for ITI, diploma, and graduate engineering candidates inside real world mining setups.",
        details: ["Hands-on learning programs mentored directly by seasoned industrial supervisors.", "Valuable certifications that fulfill technical experience criteria for future jobs."]
      },
      "Employee Corner": {
        title: "Secure Portal for Worker Services & Personal Information",
        summary: "A private internal dashboard allowing our 43,000+ strong workforce to access payroll summaries, medical logs, and leave parameters.",
        details: ["Fast access to digital payslips, provident fund accounts, and medical history metrics.", "Streamlined workflows for handling employee grievances, welfare allocations, and retirement claims."]
      }
    }
  };

  const [directorsData, setDirectorsData] = useState([]);
  const [directorsLoading, setDirectorsLoading] = useState(true);
  const [directorsError, setDirectorsError] = useState("");

  useEffect(() => {
    setDirectorsLoading(true);
    setDirectorsError("");

    fetch("/data/directors.xml")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load directors XML");
        }
        return response.text();
      })
      .then((xmlText) => {
        setDirectorsData(parseDirectorsXml(xmlText));
      })
      .catch((error) => {
        console.error("Directors XML Error:", error);
        setDirectorsError("Unable to load directors data.");
        setDirectorsData([]);
      })
      .finally(() => {
        setDirectorsLoading(false);
      });
  }, []);

  const toggleMobileDropdown = (menuName) => {
    setMobileOpenDropdown(mobileOpenDropdown === menuName ? null : menuName);
  };

  const handleSelectSubItem = (category, subItem) => {
    setSelectedCategory(category);
    setSelectedSubItem(subItem);
    
    const workspaceElement = document.getElementById("interactive-workspace");
    if (workspaceElement) {
      workspaceElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategoryHeaderClick = (category) => {
    const firstItem = navigationData[category]?.[0];
    if (!firstItem) return;
    setExpandedCategory(category);
    handleSelectSubItem(category, firstItem);
  };

  const activeContent = contentRepository[selectedCategory]?.[selectedSubItem] || {
    title: "Select an Item",
    summary: "Please explore the operational tree index to read corporate disclosures.",
    details: []
  };

  return (
    <div className="bg-[#0A1020] text-white overflow-x-hidden font-sans selection:bg-[#C2A15D] selection:text-black">

      {/* TOP UTILITY BAR */}
      <div className="bg-[#070C14] text-gray-400 text-xs px-6 py-2 flex flex-wrap justify-center gap-6 border-b border-white/5 relative z-40">
        {["Home", "RTI Act, 2005", "Sitemap", "Mail", "Contact", "Social Media Wall"].map((item, i) => (
          <a key={i} href="#" className="hover:text-[#C2A15D] transition-colors">{item}</a>
        ))}
      </div>

      {/* FIXED NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0A1020]/95 backdrop-blur-md border-b border-white/5 shadow-2xl">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-4">
            <img src={logoImage} className="h-12 w-auto object-contain" alt="SCCL logo" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-wider text-white">The Singareni Collieries Company Limited </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-tight">(A Government Company)</p>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-sm font-bold tracking-wider text-white">SCCL</h1>
              <p className="text-[8px] text-gray-400 uppercase">(A Government Company)</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-2 h-14">
            {Object.keys(navigationData).map((menuName) => (
              <div 
                key={menuName}
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(menuName)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  onClick={() => {
                    setExpandedCategory(menuName);
                    handleSelectSubItem(menuName, navigationData[menuName][0]);
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                    selectedCategory === menuName ? "text-[#C2A15D] bg-white/5" : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {menuName}
                  <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${activeDropdown === menuName ? 'rotate-180 text-[#C2A15D]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeDropdown === menuName && (
                  <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-b-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {navigationData[menuName].map((subItem, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setExpandedCategory(menuName);
                          handleSelectSubItem(menuName, subItem);
                        }}
                        className={`w-full text-left block px-5 py-3 text-xs font-semibold transition-all duration-150 border-b border-gray-100 last:border-0 hover:bg-gray-50 hover:border-l-4 hover:border-l-[#C2A15D] ${
                          selectedSubItem === subItem && selectedCategory === menuName 
                            ? "text-black bg-gray-50 border-l-4 border-l-[#C2A15D]" 
                            : "text-gray-700 hover:text-black"
                        }`}
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0D1527] border-t border-white/10 max-h-[80vh] overflow-y-auto">
            {Object.keys(navigationData).map((menuName) => (
              <div key={menuName} className="border-b border-white/10">
                <button
                  onClick={() => toggleMobileDropdown(menuName)}
                  className="w-full px-6 py-4 text-left text-white font-medium flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <span className={selectedCategory === menuName ? "text-[#C2A15D]" : ""}>{menuName}</span>
                  <svg 
                    className={`w-5 h-5 text-[#C2A15D] transition-transform duration-200 ${mobileOpenDropdown === menuName ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileOpenDropdown === menuName && (
                  <div className="bg-[#0A1020] px-6 py-3 space-y-2">
                    {navigationData[menuName].map((subItem, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setExpandedCategory(menuName);
                          handleSelectSubItem(menuName, subItem);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left block px-4 py-2 text-sm rounded-lg transition-colors ${
                          selectedSubItem === subItem && selectedCategory === menuName
                            ? "text-black bg-[#C2A15D] font-semibold"
                            : "text-gray-300 hover:text-[#C2A15D] hover:bg-white/5"
                        }`}
                      >
                        {subItem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </header>

      <div className="h-20 lg:h-20"></div>

      {/* HERO SECTION */}
      <section className="relative h-[75vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute left-1/2 top-1/2 z-0 h-[100vw] min-h-full w-[100vh] min-w-full object-cover brightness-110 contrast-125 saturate-125"
          style={{ transform: "translate(-50%, -50%) rotate(-90deg) scale(1.25)" }}
        >
          <source src={mineVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#0A1020]/40 z-10"></div>
        <div className="relative z-20 text-center max-w-5xl px-6">
          <span className="text-[#C2A15D] text-xs md:text-sm font-bold tracking-widest uppercase border border-[#C2A15D]/30 px-4 py-1.5 rounded-full bg-[#C2A15D]/5">
            A Government Company
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mt-6">
            Powering India Through{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#C2A15D]">
              Sustainable Mining
            </span>
          </h1>
          <p className="mt-6 text-gray-300 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
            Delivering energy excellence through innovation, safety, and sustainable mining operations across India.
          </p>
        </div>
      </section>

      {/* INTERACTIVE WORKSPACE */}
      <section id="interactive-workspace" className="max-w-[1400px] mx-auto px-6 py-12 scroll-mt-24 relative z-30">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-[#0D1527] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl min-h-[480px] flex flex-col justify-between transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#C2A15D] uppercase tracking-wider">
                <span>{selectedCategory}</span>
                <span className="text-gray-600">/</span>
                <span className="text-white/70">{selectedSubItem}</span>
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">{activeContent.title}</h2>
                <div className="h-1 w-16 bg-[#C2A15D] mt-3 rounded-full"></div>
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-normal">{activeContent.summary}</p>
              <div className="pt-2 space-y-3">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider text-[#C2A15D]">Operational Framework:</h4>
                <div className="grid gap-2.5">
                  {activeContent.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-lg p-3 hover:border-[#C2A15D]/20 transition-colors">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C2A15D]/10 text-[#C2A15D] text-[10px] font-bold">{idx + 1}</span>
                      <p className="text-gray-400 text-xs leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <p>VERIFIED PROFILE RECORD</p>
              <p className="text-[#C2A15D]/60">SCCL-SYS // 2026</p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#070C14] border border-white/5 rounded-2xl p-4 shadow-xl sticky top-24 self-start">
            <div className="mb-4 pb-2 border-b border-white/5">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider text-[#C2A15D]">{selectedCategory}</h3>
              <p className="text-gray-400 text-xs mt-0.5">Operational Management Index</p>
            </div>
            <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
              <button className="w-full px-4 py-3 font-bold text-xs uppercase tracking-wider flex justify-between items-center bg-[#C2A15D]/10 text-[#C2A15D]">
                <span>{selectedCategory}</span>
                <svg className="w-4 h-4 text-[#C2A15D] rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="p-1.5 bg-[#0A1020]/60 space-y-1">
                {navigationData[selectedCategory]?.map((subItem) => {
                  const isSubSelected = selectedSubItem === subItem;
                  return (
                    <button
                      key={subItem}
                      onClick={() => handleSelectSubItem(selectedCategory, subItem)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition-all duration-150 flex items-center justify-between group ${
                        isSubSelected ? "bg-[#C2A15D] text-black font-semibold" : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{subItem}</span>
                      <svg className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isSubSelected ? "text-black opacity-100" : "text-[#C2A15D]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOARD OF DIRECTORS ================= */}
      <section className="max-w-[1400px] mx-auto px-6 py-12 border-t border-white/5 relative z-30">
        <div className="mb-10">
          <span className="text-[#C2A15D] text-xs font-bold uppercase tracking-widest">Leadership Architecture</span>
          <h2 className="text-2xl md:text-4xl font-extrabold mt-2 tracking-tight text-white">Board of Directors</h2>
          <div className="h-1 w-24 bg-[#C2A15D] mt-4 rounded-full"></div>
          <p className="text-gray-400 text-sm mt-5 max-w-3xl leading-relaxed">
            The Board of Directors of SCCL provides strategic direction, operational leadership, financial governance, and sustainable industrial vision for the organization.
          </p>
        </div>

        <div className="flex flex-col border border-white/10 rounded-2xl overflow-hidden">
          {directorsLoading && (
            <div className="bg-[#0D1527] px-6 py-8 text-sm text-gray-300">Loading directors...</div>
          )}

          {!directorsLoading && directorsError && (
            <div className="bg-[#0D1527] px-6 py-8 text-sm text-red-300">{directorsError}</div>
          )}

          {!directorsLoading && !directorsError && directorsData.length === 0 && (
            <div className="bg-[#0D1527] px-6 py-8 text-sm text-gray-300">No directors found in XML.</div>
          )}

          {directorsData.map((director, i) => {
            // Check if this is a heading type director
            if (director.isHeading) {
              return (
                <div
                  key={director.id || `heading-${i}`}
                  className="bg-gradient-to-r from-[#0A1020] to-[#0D1527] border-y border-[#C2A15D]/30"
                >
                  <div className="px-8 py-5 flex items-center gap-4">
                    <img 
                      src={logoImage} 
                      alt="SCCL Logo" 
                      className="w-10 h-10 object-contain opacity-80"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-7 bg-[#C2A15D] rounded-full"></div>
                      <h3 className="text-[#C2A15D] text-sm md:text-base font-bold uppercase tracking-widest">
                        {director.name}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            }
            
            // Regular director display
            return (
              <div
                key={director.id || `director-${i}`}
                className="bg-[#0D1527] hover:bg-[#111B30] transition-all duration-200"
                style={{ borderTop: i > 0 && !directorsData[i-1]?.isHeading ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
              >
                <div
                  className="grid grid-cols-[72px_1fr_auto] items-center gap-5 px-6 py-4 cursor-pointer"
                  onClick={() => setOpenDirector(openDirector === i ? null : i)}
                >
                  <img
                    src={director.img || logoImage}
                    alt={director.name}
                    className="w-[72px] h-[72px] rounded-lg object-cover object-top flex-shrink-0 bg-gray-800"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = logoImage;
                    }}
                  />
                  <div>
                    <p className="text-white font-bold text-sm md:text-base leading-snug">{director.name}</p>
                    {director.role && (
                      <p className="text-[#C2A15D] text-xs font-semibold mt-0.5">{director.role}</p>
                    )}
                    {director.tenure && (
                      <p className="text-gray-500 text-[11px] mt-1">{director.tenure}</p>
                    )}
                  </div>
                  <div className={`w-9 h-9 bg-[#C2A15D] rounded-md flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openDirector === i ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>

                {openDirector === i && (
                  <div className="px-6 pb-6 pt-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="pl-[88px]">
                      {(director.description || director.working) && (
                        <p className="text-gray-300 text-sm leading-relaxed mb-4 pt-4">
                          {director.description || director.working}
                        </p>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          ["Expertise", director.expertise],
                          ["Education", director.education],
                          ["Current Role", director.working],
                          ["Past Experience", director.pastExperience]
                        ].map(([label, val]) => {
                          if (!val) return null;
                          return (
                            <div key={label} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:border-[#C2A15D]/30 transition-colors">
                              <p className="text-[#C2A15D] text-[10px] uppercase tracking-widest font-bold mb-1">{label}</p>
                              <p className="text-gray-300 text-xs leading-relaxed">{val}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* WORKFORCE IMAGE DISPLAY */}
      <section className="max-w-[1400px] mx-auto px-6 py-12 border-t border-white/5 relative z-30">
        <div className="w-full space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[#C2A15D] text-xs font-bold uppercase tracking-widest">Our Workforce</span>
            <h3 className="text-xl md:text-2xl font-bold mt-1">The Singareni Management Team</h3>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0D1527] shadow-2xl max-w-5xl mx-auto">
            <div className="w-full h-[220px] sm:h-[320px] md:h-[400px] overflow-hidden relative">
              <img src={teamImage} className="w-full h-full object-cover object-center" alt="Singareni Team Workforce" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1020] via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* PERFORMANCE ANALYSIS SECTION */}
      <section className="relative z-30 max-w-[1400px] mx-auto px-6 py-12 border-t border-white/5">
        <div className="text-center mb-8">
          <span className="text-[#C2A15D] text-xs font-bold uppercase tracking-widest">Statistical Metrics</span>
          <h3 className="text-xl md:text-3xl font-bold tracking-wide mt-1">Productions & Growth Analysis</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto">
          <a
            href="/output-target"
            className="bg-[#0D1527] border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col justify-between shadow-xl hover:border-[#C2A15D]/60 hover:-translate-y-1 transition duration-300"
          >
            <div>
              <h4 className="text-[#C2A15D] text-xs font-bold uppercase tracking-wider mb-1">Annual Output Target Sheet</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Track target versus actual coal output across the year with month-wise progress and shortfall signals.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/5 p-2 flex items-center justify-center">
              <img src={graphImage} className="max-h-48 md:max-h-64 w-auto object-contain rounded-lg" alt="Production Growth Graph" />
            </div>
            <span className="mt-5 inline-flex w-fit items-center justify-center rounded-md bg-[#C2A15D] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
              Explore More
            </span>
          </a>
          <a
            href="/efficiency-metrics"
            className="bg-[#0D1527] border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col justify-between shadow-xl hover:border-[#C2A15D]/60 hover:-translate-y-1 transition duration-300"
          >
            <div>
              <h4 className="text-[#C2A15D] text-xs font-bold uppercase tracking-wider mb-1">Efficiency & Volumetric Metrics</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Compare operational efficiency, volumetric handling, and functional contribution across mining workflows.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden bg-white/5 border border-white/5 p-2 flex items-center justify-center">
              <img src={analysisImage} className="max-h-48 md:max-h-64 w-auto object-contain rounded-lg" alt="Performance Analysis Matrix" />
            </div>
            <span className="mt-5 inline-flex w-fit items-center justify-center rounded-md bg-[#C2A15D] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
              Explore More
            </span>
          </a>
        </div>
      </section>

      {/* FLOATING STATS PANELS */}
      <section className="relative z-30 max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-white/5">
        {[
          ["Coal Production", "72 MT", opencastImage],
          ["Employees", "43K+", undergroundImage],
          ["Revenue", "₹35K Cr", energyImage],
          ["Legacy", "130+ Years", logoImage]
        ].map(([title, value, img], i) => (
          <div key={i} className={`relative group overflow-hidden border border-white/10 bg-white/5 backdrop-blur hover:-translate-y-1.5 transition duration-300 shadow-lg ${i % 2 === 0 ? "rounded-2xl" : "rounded-[30px] md:rounded-[40px]"}`}>
            <img src={img} className={`w-full object-cover group-hover:scale-105 transition duration-500 ${i % 2 === 0 ? "h-28 md:h-36" : "h-36 md:h-48"}`} alt={title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-3 left-3">
              <h2 className="text-[#C2A15D] font-bold text-base md:text-lg">{value}</h2>
              <p className="text-gray-300 text-[10px] md:text-xs">{title}</p>
            </div>
          </div>
        ))}
      </section>

      {/* OPERATIONS SECTIONS */}
      <section className="max-w-[1400px] mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Underground Mining",
            desc: "Safe and advanced underground extraction methods ensuring structural stability and minimal environmental surface impacts.",
            img: undergroundImage,
            path: "/underground"
          },
          {
            title: "Open Cast Mining",
            desc: "Large-scale surface industrial excavation operations designed for optimal extraction throughput and strict security checks.",
            img: opencastImage,
            path: "/opencast"
          },
          {
            title: "Energy & Sustainability",
            desc: "Focus on commercial solar arrays, grid integration models, and aggressive post-mining eco-restoration.",
            img: energyImage,
            path: "/energy"
          }
        ].map((item, i) => (
          <div key={i} className="group bg-white/5 border border-white/10 overflow-hidden hover:-translate-y-1.5 transition duration-300 rounded-xl">
            <img src={item.img} className="h-48 md:h-56 w-full object-cover group-hover:scale-105 transition duration-500" alt={item.title} />
            <div className="p-5">
              <h3 className="text-base font-bold mb-2 group-hover:text-[#C2A15D] transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">{item.desc}</p>
              <a href={item.path} className="inline-flex px-4 py-2 rounded-full bg-[#C2A15D] text-black text-xs font-semibold hover:-translate-y-0.5 transition">Explore Deeply</a>
            </div>
          </div>
        ))}
      </section>

      {/* CORPORATE FOOTER */}
      <footer className="bg-[#070C14] border-t border-white/5 pt-12 pb-6">
        <div className="max-w-[1400px] mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-gray-400">
          <div>
            <img src={logoImage} className="h-8 mb-4 object-contain" alt="SCCL logo" />
            <p className="leading-relaxed text-xs">Singareni Collieries Company Limited. Reliability in coal extraction across generations.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Operational Hubs</h4>
            <div className="space-y-1.5 text-xs"><p>Kothagudem Area</p><p>Ramagundam Units</p><p>Bellampalli Operations</p><p>Manuguru Infrastructure</p></div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Regulatory Compliance</h4>
            <div className="space-y-1.5 text-xs"><p>Sustainability Charters</p><p>E-Governance Audits</p><p>Citizen Services Portal</p><p>Vigilance Clearances</p></div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Connect Globally</h4>
            <div className="space-y-1.5 text-xs"><p>Media Communications</p><p>Corporate Headquarters</p><p>Procurement Inquiries</p><p>Ombudsman Channel</p></div>
          </div>
        </div>
        <div className="text-center text-[11px] text-gray-500 mt-8 border-t border-white/5 pt-4">
          © 2026 SCCL • All Rights Reserved.
        </div>
      </footer>

    </div>
  ); 
}
