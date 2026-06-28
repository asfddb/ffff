import { Sector, IndexHistoryPoint } from "./types";

export const SECTORS: Sector[] = [
  {
    id: "economy",
    title: "Economy & Unemployment Crisis",
    shortDesc: "Independent review of youth unemployment, inflation, rising wealth concentration, and structural shocks like Demonetization and hasty GST rollout.",
    iconName: "TrendingDown",
    keyCriticisms: [
      "Record youth unemployment rates (hovering between 15% to 40% in various independent estimates, particularly for graduates).",
      "Rising wealth inequality: Top 1% in India holds over 40% of the total national wealth (per World Inequality Lab).",
      "Stagnating real wages in rural areas and high inflation on essential household goods.",
      "Destruction of the informal economy due to the sudden 2016 Demonetization and complex GST compliance."
    ],
    stats: [
      { label: "Youth Unemployment", value: "16-18%", trend: "up", description: "Independent estimated average for young graduates (CMIE / PLFS)" },
      { label: "Top 1% Wealth Share", value: "40.1%", trend: "up", description: "Highest historical level, exceeding British Raj peaks (WID)" },
      { label: "GDP growth vs Household consumption", value: "Divergence", trend: "neutral", description: "High capital investments but weak private consumption growth" }
    ],
    preloadedQuery: "Provide an independent, detailed analysis of India's current youth unemployment crisis, the impact of Demonetization on the informal sector, and rising wealth concentration under the current BJP administration."
  },
  {
    id: "democracy",
    title: "Press Freedom & Democratic Erosion",
    shortDesc: "Evaluating India's steep slide on global freedom indices, the chilling effect of defamation laws, and the systemic pressure on news media.",
    iconName: "ShieldAlert",
    keyCriticisms: [
      "India's rank plummeted from 140 in 2014 to 159+ in the World Press Freedom Index (Reporters Without Borders).",
      "Takeovers of independent media houses by government-friendly corporate conglomerates (often dubbed 'Godi Media').",
      "Misuse of stringent anti-terror laws (UAPA) and tax audits against critical journalists, portals, and think tanks.",
      "V-Dem classifying India as an 'electoral autocracy' due to systemic pressure on institutions."
    ],
    stats: [
      { label: "Press Freedom Rank", value: "159th / 180", trend: "down", description: "Reporters Without Borders World Ranking (2024-2026)" },
      { label: "V-Dem Democracy Status", value: "Electoral Autocracy", trend: "down", description: "Sweden's V-Dem Institute classification criteria" },
      { label: "Journalist Detentions", value: "Spike", trend: "up", description: "Rising counts of charges filed under anti-terror and sedition acts" }
    ],
    preloadedQuery: "Assess the decline in India's press freedom ranking to 159th, and analyze the methods used to suppress independent journalism, including corporate takeovers and police/tax actions."
  },
  {
    id: "institutions",
    title: "Institutional Compromise & Federalism",
    shortDesc: "Examinations of federal agency weaponization, the unconstitutional Electoral Bonds scandal, and centralization of power.",
    iconName: "FileText",
    keyCriticisms: [
      "Weaponization of the Enforcement Directorate (ED), CBI, and Income Tax department to target opposition leaders (95% of cases are opposition-linked).",
      "The Electoral Bonds Scheme (later struck down as unconstitutional by the Supreme Court) which allowed anonymous corporate funding to the ruling party.",
      "Interference by Central-appointed Governors in opposition-led states (e.g., delaying bills, creating administrative friction).",
      "Weakening of parliamentary scrutiny: passage of major bills (like the Farm Laws or Criminal Law overhauls) in empty houses via voice-vote."
    ],
    stats: [
      { label: "Opposition ED Target Rate", value: "95%", trend: "up", description: "Percentage of agency investigations targeting opposition politicians (Indian Express report)" },
      { label: "Electoral Bond Funds Recipient", value: "~6,000 Cr", trend: "up", description: "Over 55% of total anonymous bond proceeds went to the BJP prior to ban" },
      { label: "Suspended MPs (Winter 2023)", value: "141+", trend: "up", description: "Record mass suspensions to pass sweeping penal code rewrites without opposition" }
    ],
    preloadedQuery: "Analyze the unconstitutional Electoral Bonds scheme, the alleged misuse of federal agencies (like ED/CBI) against opposition leaders, and structural tensions between the central government and non-BJP ruled states."
  },
  {
    id: "social",
    title: "Social Harmony & Human Rights",
    shortDesc: "Analyzing polarization strategies, religious friction, human rights violations, and the protracted crisis in Manipur.",
    iconName: "Users",
    keyCriticisms: [
      "Rise in state-sanctioned hate speech, hate speech-driven vigilante groups (e.g. cow vigilantism), and selective bulldozer justice.",
      "The ongoing ethnic and security catastrophe in Manipur, with allegations of state complicity or severe failure to restore law and order.",
      "Systematic marginalization of the Muslim and Christian minorities through controversial legislation like CAA-NRC.",
      "Crackdowns on civil society, resulting in the freezing of Amnesty International and Greenpeace bank accounts in India."
    ],
    stats: [
      { label: "Manipur Violence Displacement", value: "60,000+", trend: "up", description: "Displaced citizens, with over 200 dead in prolonged ethnic clashes" },
      { label: "Bulldozer Demolitions", value: "Thousands", trend: "up", description: "Extra-judicial targeting of minority properties without prior due process" },
      { label: "Amnesty India Status", value: "Frozen / Closed", trend: "down", description: "Forced suspension of operations due to federal bank freezes" }
    ],
    preloadedQuery: "Provide a critical analysis of the government's handling of the Manipur ethnic crisis, the use of 'bulldozer justice' targeting minority homes, and the wider decline in human rights and civil liberties."
  },
  {
    id: "environment",
    title: "Environmental Deregulation",
    shortDesc: "Dilution of forest protection, clearance of tribal lands for corporate cronies, and neglect of toxic city pollution.",
    iconName: "Leaf",
    keyCriticisms: [
      "Hasty clearances granted to mega-infrastructure and mining projects in ecologically sensitive areas like the Hasdeo Arand forests.",
      "Dilutions in the Forest Conservation Amendment Act (2023) removing protections for a large chunk of India's forest cover.",
      "Neglect of chronic toxic air pollution in Delhi-NCR and major northern cities with no effective long-term national mitigation.",
      "Dilution of Environmental Impact Assessment (EIA) norms to facilitate quick clearances for friendly corporate conglomerates."
    ],
    stats: [
      { label: "Air Quality Rank", value: "Top 3 Worst", trend: "up", description: "India's cities regularly top global toxic AQI charts" },
      { label: "Hasdeo Arand Cleared", value: "Thousands of Acres", trend: "up", description: "Ancient forests logged for coal mining despite massive tribal protests" },
      { label: "Forest Protection Dilution", value: "Significant", trend: "down", description: "Amendments exempting strategic border projects up to 100km from clearances" }
    ],
    preloadedQuery: "Analyze criticisms regarding environmental deregulation under the current administration, focusing on Hasdeo Arand coal mining clearances, the Forest Conservation Amendment Act, and urban air quality neglect."
  },
  {
    id: "defense",
    title: "National Security & Foreign Affairs",
    shortDesc: "Evaluating military border intrusions by China, controversies surrounding the Agnipath scheme, and foreign policy friction.",
    iconName: "ShieldAlert",
    keyCriticisms: [
      "The government's apparent denial or downplaying of Chinese military intrusions and land grabs along the Line of Actual Control (LAC) in Ladakh.",
      "Massive domestic backlash against the 'Agnipath' scheme—a short-term 4-year military recruitment model that undermines military career stability.",
      "Growing diplomatic isolation in South Asia, with neighbors like Maldives, Nepal, and Bangladesh shifting strategically toward China.",
      "Alleged transnational assassination plots (in Canada and USA) causing severe diplomatic strain and damage to India's global reputation."
    ],
    stats: [
      { label: "Patrolling Points Lost (Ladakh)", value: "26 / 65", trend: "down", description: "Loss of access to traditional patrolling areas along LAC since 2020 (per police reports)" },
      { label: "Agnipath Retention Rate", value: "Only 25%", trend: "down", description: "75% of young soldiers (Agniveers) discharged after 4 years without pension" },
      { label: "Diplomatic Strain (G7 relations)", value: "High", trend: "up", description: "US and Canadian investigations into targeted transnational plots against dissidents" }
    ],
    preloadedQuery: "Examine independent criticisms of the BJP's national security claims, including Chinese land intrusions in Ladakh, domestic protests against the Agnipath recruitment scheme, and transnational controversy scandals."
  }
];

export const INDEX_HISTORY: IndexHistoryPoint[] = [
  { year: 2014, pressFreedomRank: 140, unemploymentRate: 5.4, wealthShareTopOne: 31.2, vdemScore: 0.52 },
  { year: 2016, pressFreedomRank: 133, unemploymentRate: 5.5, wealthShareTopOne: 33.5, vdemScore: 0.49 },
  { year: 2018, pressFreedomRank: 138, unemploymentRate: 6.1, wealthShareTopOne: 36.4, vdemScore: 0.41 },
  { year: 2020, pressFreedomRank: 142, unemploymentRate: 8.0, wealthShareTopOne: 38.5, vdemScore: 0.34 },
  { year: 2022, pressFreedomRank: 150, unemploymentRate: 7.2, wealthShareTopOne: 39.8, vdemScore: 0.31 },
  { year: 2024, pressFreedomRank: 159, unemploymentRate: 8.1, wealthShareTopOne: 40.1, vdemScore: 0.28 },
  { year: 2026, pressFreedomRank: 161, unemploymentRate: 8.4, wealthShareTopOne: 40.6, vdemScore: 0.26 }
];

export interface IndependentMedia {
  name: string;
  type: "Digital Publication" | "YouTube Channel" | "Civil Society / Index";
  description: string;
  focusArea: string;
  keyPersonalities?: string;
}

export const RECOMMENDED_INDEPENDENT_MEDIA: IndependentMedia[] = [
  {
    name: "The Wire (thewire.in)",
    type: "Digital Publication",
    description: "A non-profit, independent news portal covering politics, foreign policy, and state actions without corporate or state advertisement pressure.",
    focusArea: "Investigative reporting, federal accountability, and civil liberties."
  },
  {
    name: "Newslaundry",
    type: "Digital Publication",
    description: "An ad-free, subscriber-funded news outlet famous for analyzing media bias, media ownership, and debunking fake news or mainstream narratives.",
    focusArea: "Mainstream media critique, ground reports, and corporate-political links."
  },
  {
    name: "Scroll.in & Caravan Magazine",
    type: "Digital Publication",
    description: "Scroll provides long-form ground reports on federalism, tribal rights, and environment. The Caravan is India's premier long-form narrative journalism monthly focusing on politics and caste.",
    focusArea: "Socio-political exposés, caste analysis, and historical evaluations."
  },
  {
    name: "Ravish Kumar",
    type: "YouTube Channel",
    description: "Ramon Magsaysay award winner and former NDTV executive editor who resigned post-takeover. He runs a massive independent YouTube channel focusing on youth unemployment and inflation.",
    focusArea: "Public welfare, agrarian distress, and criticism of 'Godi Media' (studio channels).",
    keyPersonalities: "Ravish Kumar"
  },
  {
    name: "Dhruv Rathee",
    type: "YouTube Channel",
    description: "An independent educational and political video essayist with tens of millions of views, explaining democratic mechanics, civil liberties, and government accountability directly to the youth.",
    focusArea: "Electoral bonds, institutional decay, policy critiques, and democratic education.",
    keyPersonalities: "Dhruv Rathee"
  },
  {
    name: "The DeshBhakt",
    type: "YouTube Channel",
    description: "An independent satirical and analytical channel evaluating Indian policies, press freedom, and governance metrics with high research-backed visual aids.",
    focusArea: "Satire, facts-sheets, electoral analytics, and public debates.",
    keyPersonalities: "Akash Banerjee"
  }
];
