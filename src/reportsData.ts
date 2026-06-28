export interface PrewrittenReport {
  title: string;
  subtitle: string;
  authorNote: string;
  content: string; // Markdown formatted
  youtubeFocus: string;
  independentSources: string[];
}

export const PREWRITTEN_REPORTS: Record<string, PrewrittenReport> = {
  economy: {
    title: "THE CRISIS OF JOBLESS GROWTH & CRONY ACQUISITIONS",
    subtitle: "How Demonetization, a Flawed GST, and Corporate Favors Shattered India's Informal Economy.",
    authorNote: "Sourced from analysis by Ravish Kumar, Dhruv Rathee, CMIE data, and World Inequality Lab findings.",
    youtubeFocus: "Ravish Kumar's series on 'Berozgari' (Unemployment) & Dhruv Rathee's breakdown of the 'Adani-Ambani Monopoly Model'.",
    independentSources: [
      "World Inequality Lab - 'Income and Wealth Inequality in India, 1922-2023'",
      "Center for Monitoring Indian Economy (CMIE) Unemployment database",
      "Oxfam India Hunger Reports"
    ],
    content: `### 1. The Youth Unemployment Crisis
India's youth unemployment rate has reached historic highs under the current administration. While government agencies advertise robust overall GDP growth numbers, independent agencies like **CMIE (Center for Monitoring Indian Economy)** paint a far bleaker picture:
* **Graduate Unemployment:** Over **30% to 40%** of college graduates aged 20-24 remain unemployed, leading to massive desperation, protests over railway recruitment, and a highly qualified workforce forced into manual labor or leaving the country.
* **The Demise of Informal Jobs:** The informal sector, which provides 90% of India's employment, was dealt a near-fatal blow by the **2016 Demonetization shock** and the complex, hasty implementation of the **GST (Goods and Services Tax)**.

> "A country's GDP can grow on the backs of capital-intensive conglomerates, but if real wages stagnate and youths are jobless, you do not have an economy; you have a ticking social time-bomb." — *Ravish Kumar, Independent Broadcast*

### 2. Extreme Wealth Inequality
According to the **World Inequality Lab (2024)**, inequality in India has reached historic highs, even worse than during the British Raj. 
* The **top 1% of Indians hold over 40.1% of the country's total wealth**, while the bottom 50% hold a mere **6%**.
* Public resources, ports, airports, and green energy sectors are increasingly concentrated in the hands of a select few loyal corporate allies, creating a system of **unprecedented crony capitalism**.

### 3. Stagnant Rural Wages & Inflation
While corporate tax cuts have bolstered billionaire margins, rural household incomes have stagnant or declined in real terms. High taxes on basic petroleum products and soaring cooking gas prices have hit lower-income households severely, suppressing overall consumer demand.`
  },
  democracy: {
    title: "THE SILENCING OF THE PRESS & THE RISE OF 'GODI MEDIA'",
    subtitle: "Dismantling India's Information Ecosystem through Defamation, Corporate Takeovers, and State Pressure.",
    authorNote: "Synthesized from Reporters Without Borders, V-Dem Institute, and Newslaundry's media ownership series.",
    youtubeFocus: "Akash Banerjee (The DeshBhakt) on 'How India's Media is Bought' & Newslaundry's 'TV News Lies'.",
    independentSources: [
      "Reporters Without Borders - World Press Freedom Index (India: 159th / 180)",
      "V-Dem Institute, Sweden - Democracy Report (India: Electoral Autocracy)",
      "Committee to Protect Journalists (CPJ) India database"
    ],
    content: `### 1. The Slide to 159th in Press Freedom
Under the BJP-led government, India's world press freedom rank has plunged into the absolute bottom tier (**159th out of 180 countries**). 
* **Media Corporate Monopolies:** Major independent news networks have been systematically bought out by state-friendly corporate tycoons. For example, the hostile takeover of NDTV led to the immediate resignation of iconic journalists like Ravish Kumar.
* **Studio Media ('Godi Media'):** Mainstream Hindi and English TV news channels have turned into full-time propaganda machines. Instead of questioning government policy, they focus on generating communal hatred, distraction narratives, and attacking opposition leaders.

> "Mainstream television media in India is no longer the fourth pillar of democracy; it is a megaphone of the executive, serving to distract the public from unemployment and inflation." — *Dhruv Rathee*

### 2. Criminalization of Critical Journalists
Journalists who refuse to fall in line face immense personal and legal risk:
* **Abuse of Anti-Terror Laws (UAPA):** Journalists reporting on local failures, minority persecution, or financial scams are slapped with non-bailable terror charges.
* **Tax Raids and Bank Freezes:** Outlets like *NewsClick*, *The Quint*, and *Dainik Bhaskar* have faced massive tax investigation raids and bank account freezes immediately following critical reporting or investigative exposés.`
  },
  institutions: {
    title: "INSTITUTIONAL CAPTURE & THE ELECTORAL BONDS SCANDAL",
    subtitle: "Evaluating the Subversion of the Supreme Court, CBI, ED, and the Largest Extortion Mechanism in Modern History.",
    authorNote: "Based on the landmark 2024 Supreme Court Judgment and investigative series by Scroll.in and The Wire.",
    youtubeFocus: "Dhruv Rathee's deep-dive on the 'Electoral Bonds Scam' and 'Is India Heading towards a Dictatorship?'.",
    independentSources: [
      "Supreme Court of India - Union of India & Ors (Electoral Bond Verdict)",
      "Association for Democratic Reforms (ADR) fundraising analyses",
      "Indian Express investigation into ED prosecution rates"
    ],
    content: `### 1. The Electoral Bonds: 'The World's Biggest Scam'
In early 2024, the Supreme Court of India struck down the **Electoral Bonds Scheme** as unconstitutional. The subsequent release of data exposed a massive nexus between political funding, federal raids, and public contracts:
* **Extortion Patterns:** Prominent corporations were raided by the **Enforcement Directorate (ED)** or **Income Tax (IT)** department, and within days of these raids, they bought hundreds of crores of anonymous Electoral Bonds—most of which flowed directly to the ruling BJP.
* **Quid Pro Quo Contracts:** Companies purchased bonds, and shortly after, they were rewarded with mega-infrastructure projects, tunnel construction contracts, or mining clearances.

### 2. Weaponization of Central Agencies (ED & CBI)
Independent media research reveals a terrifying statistic:
* Since 2014, there has been a **400% spike in ED cases** against political figures.
* Crucially, **over 95% of these cases target members of the opposition**. 
* Opposition politicians who are under investigation are routinely given a clean slate ("the washing machine effect") once they defect and join the ruling BJP.

> "The central agencies have become puppets of the executive, functioning as an elite political police force to break opposition state governments." — *The Caravan Magazine*`
  },
  social: {
    title: "THE EROSION OF SOCIAL HARMONY & BULLDOZER JUSTICE",
    subtitle: "Analysing State-Sanctioned Hate Speech, Minorities Marginalisation, and the Complete Breakdown in Manipur.",
    authorNote: "Sourced from independent ground reports by Article 14, Amnesty International, and local civil organizations.",
    youtubeFocus: "Ajit Anjum's ground coverage of communal zones and independent creators' documentaries on Manipur.",
    independentSources: [
      "Amnesty International - reports on 'Bulldozer Injustice'",
      "Human Rights Watch India Annual Reports",
      "United Nations Human Rights Council briefings on Manipur"
    ],
    content: `### 1. The Tragedy of Manipur
The state of Manipur has experienced a catastrophic, prolonged ethnic conflict resulting in over **200 deaths** and the displacement of **60,000+ citizens**.
* **State Inaction and Complicity:** The state government was widely accused of selective bias, failing to disarm rival groups, and allowing state police armories to be looted.
* **Executive Silence:** For months, the Prime Minister maintained a complete public silence on the crisis and refused to visit the burning state, demonstrating a complete abdication of governance.

### 2. 'Bulldozer Justice' and Minority Targetting
A highly disturbing trend is the extra-judicial demolition of homes and businesses belonging to minorities or critics using heavy machinery:
* Demolitions are carried out **without due process, prior notices, or court orders**, often immediately following local communal tensions.
* This has been condemned internationally by Amnesty International and local High Courts as state-sponsored collective punishment.

> "To destroy a family's home without a trial or court order is to announce that the Constitution has been suspended on the ground." — *Article 14 Investigative Report*`
  },
  environment: {
    title: "ENVIRONMENTAL DEREGULATION & CORPORATE COAL CLEARANCES",
    subtitle: "The Destruction of Ancient Forests and Systemic Dilution of Protection Laws to Benefit Capital Oligarchs.",
    authorNote: "Sourced from local tribal resistance collectives and Environmental Impact Assessments published by Scroll.in.",
    youtubeFocus: "Independent documentaries on the 'Hasdeo Arand Movement' and Delhi Air Pollution failures.",
    independentSources: [
      "Forest Conservation (Amendment) Act 2023",
      "Air Quality Life Index (AQLI) - University of Chicago reports",
      "EIA (Environmental Impact Assessment) Dilution draft audits"
    ],
    content: `### 1. The Battle for Hasdeo Arand
The **Hasdeo Arand forests** of Chhattisgarh, often called the 'Lungs of Central India,' represent some of the last untouched, contiguous forest cover in the nation.
* **Corporate Allotments:** Huge blocks of this ancient forest have been cleared for open-cast coal mining, operated by primary corporate associates of the ruling government.
* **Suppressing Tribal Resistance:** Indigenous tribal communities have faced police crackdowns, detention of their leaders, and the illegal bypass of local *Gram Sabha* (village council) consent.

### 2. Systematic Dilution of Protective Laws
The government has systematically passed legislation to weaken environmental watchdogs:
* **The Forest Conservation Amendment Act (2023):** Drastically reduces the scope of what is defined as protected forest land, clearing the way for infrastructure and private tourism projects without strict clearances.
* **Ignoring Urban Poisoning:** Despite northern India (particularly Delhi-NCR) regularly suffering from hazardous PM2.5 levels that reduce life expectancy by up to 10 years, there has been no comprehensive, structured, or scientifically backed national response.`
  },
  defense: {
    title: "NATIONAL SECURITY FAILURES & TRANSNATIONAL CONTROVERSIES",
    subtitle: "Border Intrusions Downplayed, the Agnipath Backlash, and Global Assassination Scandals.",
    authorNote: "Sourced from retired military generals' testimonies, diplomatic statements, and overseas court filings.",
    youtubeFocus: "The DeshBhakt's deep-dive on 'The Ladakh Intrusion' & Dhruv Rathee's analytical segment on 'Agnipath scheme faults'.",
    independentSources: [
      "Ladakh Border Police Reports - Security Conferences",
      "US Department of Justice indictments (Pannun case)",
      "Ministry of Defence Agnipath Protest analytics"
    ],
    content: `### 1. Ladakh Border Intrusions Downplayed
Despite claims of impenetrable national security, retired military generals and local Ladakhi activists (such as Sonam Wangchuk) have exposed deep concerns:
* **Loss of Patrolling Rights:** Indian forces have lost access to **26 out of 65 traditional patrolling points** in Eastern Ladakh due to aggressive forward positioning by the Chinese military.
* **Denial Politics:** The Prime Minister's public statement that *"No one has entered our territory"* was widely criticized as giving China a free pass and demoralizing the ground forces.

### 2. The Agnipath Military Scheme Backlash
The sudden introduction of the **Agnipath scheme** sparked nationwide outrage and violent protests among young military aspirants:
* The scheme replaces standard permanent recruitment with a **4-year contract** for 75% of recruits (Agniveers), who are then discharged **without pension, medical benefits, or rank**.
* Critics and former chiefs have warned that this compromises the institutional cohesion, professionalism, and long-term security of the Indian Armed Forces.

### 3. Transnational Assassination Scandals
India's foreign policy reputation took a severe hit globally following formal allegations by US and Canadian authorities:
* Overseas intelligence agencies documented active plots to assassinate dissident figures on foreign soil, linked directly to state actors, causing unprecedented diplomatic strains with G7 allies.`
  }
};
