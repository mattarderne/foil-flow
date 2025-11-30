import { FlowData } from '../types';

export const flowLogic: FlowData = {
  // ==========================================
  // PHASE 0: THE ASSESSMENT CORE
  // ==========================================

  'root': {
    id: 'root',
    type: 'question',
    title: 'Core Assessment: Surf Skills',
    content: "Do you have a strong background in shortboard surfing? (Can you duck dive and read green waves?)",
    options: [
      { label: 'Yes, I surf.', nextId: 'q_wind_surfer' },
      { label: 'No / Beginner', nextId: 'q_wind_nonsurfer' }
    ]
  },

  // --- BRANCH A: THE SURFER ---

  'q_wind_surfer': {
    id: 'q_wind_surfer',
    type: 'question',
    title: 'Core Assessment: Wind',
    content: "Does your local spot see consistent wind (15kts+ / whitecaps)?",
    options: [
      { label: 'Yes, it gets windy.', nextId: 'q_boat_surfer_windy' },
      { label: 'No, mostly calm.', nextId: 'q_boat_surfer_calm' }
    ]
  },

  // Branch A1: Surfer + Windy
  'q_boat_surfer_windy': {
    id: 'q_boat_surfer_windy',
    type: 'question',
    title: 'Core Assessment: Boat access',
    content: "Do you have access to a boat or jet ski for towing?",
    options: [
      { label: 'Yes', nextId: 'res_tri_discipline' },
      { label: 'No', nextId: 'q_crowd_surfer_windy' }
    ]
  },
  'q_crowd_surfer_windy': {
    id: 'q_crowd_surfer_windy',
    type: 'question',
    title: 'Core Assessment: Environment',
    content: "Is the surf spot typically crowded with swimmers or traditional surfers?",
    options: [
      { label: 'Yes, crowded.', nextId: 'res_wing_surf_style' },
      { label: 'No, empty peaks.', nextId: 'res_hybrid_wing_prone' }
    ]
  },

  // Branch A2: Surfer + Calm
  'q_boat_surfer_calm': {
    id: 'q_boat_surfer_calm',
    type: 'question',
    title: 'Core Assessment: Boat access',
    content: "Do you have access to a boat or jet ski for towing?",
    options: [
      { label: 'Yes', nextId: 'res_wake_prone' },
      { label: 'No', nextId: 'q_crowd_surfer_calm' }
    ]
  },
  'q_crowd_surfer_calm': {
    id: 'q_crowd_surfer_calm',
    type: 'question',
    title: 'Core Assessment: Environment',
    content: "Is the surf spot typically crowded?",
    options: [
      { label: 'Yes, crowded.', nextId: 'q_budget_surfer' },
      { label: 'No, empty peaks.', nextId: 'q_wave_quality' }
    ]
  },

  // --- BRANCH B: THE NON-SURFER ---

  'q_wind_nonsurfer': {
    id: 'q_wind_nonsurfer',
    type: 'question',
    title: 'Core Assessment: Wind',
    content: "Does your local spot see consistent wind (15kts+ / whitecaps)?",
    options: [
      { label: 'Yes, it gets windy.', nextId: 'q_boat_nonsurfer_windy' },
      { label: 'No, mostly calm.', nextId: 'q_boat_nonsurfer_calm' }
    ]
  },

  // Branch B1: Non-Surfer + Windy
  'q_boat_nonsurfer_windy': {
    id: 'q_boat_nonsurfer_windy',
    type: 'question',
    title: 'Core Assessment: Boat access',
    content: "Do you have access to a boat or jet ski?",
    options: [
      { label: 'Yes', nextId: 'res_wake_wing' },
      { label: 'No', nextId: 'res_wing_standard' }
    ]
  },

  // Branch B2: Non-Surfer + Calm
  'q_boat_nonsurfer_calm': {
    id: 'q_boat_nonsurfer_calm',
    type: 'question',
    title: 'Core Assessment: Boat access',
    content: "Do you have access to a boat or jet ski?",
    options: [
      { label: 'Yes', nextId: 'res_wake_only' },
      { label: 'No', nextId: 'q_budget_nonsurfer' }
    ]
  },


  // ==========================================
  // PHASE 1: RECOMMENDATIONS & ROADMAPS
  // ==========================================

  'res_tri_discipline': {
    id: 'res_tri_discipline',
    type: 'result',
    title: 'The "Ultimate Waterman" Path',
    content: "You have every asset available: Surf skills, Wind, and a Boat. Do not limit yourself. Use each tool to accelerate the next.",
    analysis: {
      why: "You hit the jackpot. The boat allows for risk-free learning, the wing allows for massive 'time-on-foil' (100x more than prone), and your surf skills allow you to eventually bring it all back to the waves.",
      whyNot: [
        "Prone Only: Too slow to learn. You have a boat, use it.",
        "Wing Only: Wastes your surf potential.",
        "Assist: Unnecessary expense ($5k) since you have a boat."
      ]
    },
    roadmap: [
      { title: 'Step 1: The Boat (Week 1)', description: 'Use the boat to learn foil control without paddling or wind management. Learn to fly straight.' },
      { title: 'Step 2: The Wing (Months 1-3)', description: 'Use the wind for "Time on Foil". You will get 100x more flight time winging than paddling.' },
      { title: 'Step 3: Prone Foil (Lifetime)', description: 'Take your wing foil mast/plane to the prone board. Use your surf skills to paddle into waves.' }
    ],
    progressionLink: { label: 'Start Diagnostics', nextId: 'prone_q1' }
  },

  'res_hybrid_wing_prone': {
    id: 'res_hybrid_wing_prone',
    type: 'result',
    title: 'Strategy: Wind First, Surf Later',
    content: "You are a surfer with a windy spot. Even though you *can* prone foil, learning to Wing Foil first is the cheat code.",
    analysis: {
      why: "Wind provides constant power. A prone surfer might get 30 seconds of flight time per session. A winger gets 60 minutes. Learn to balance with the wing, then transfer that muscle memory to the surf.",
      whyNot: [
        "Pure Prone: Valid, but the learning curve is vertical. Expect 6 months of failure vs 1 month with a Wing.",
        "Foil Assist: Good option, but Winging is cheaper and utilizes the natural conditions you already have."
      ]
    },
    roadmap: [
      { title: 'Phase 1: Wing Foil', description: 'Learn to foil with the wing. The wind provides constant power, allowing you to learn balance 10x faster than prone.' },
      { title: 'Phase 2: The Cross-Over', description: 'Once you can gybe on the wing, buy a prone board. Use the SAME foil setup.' },
      { title: 'Phase 3: Prone Surfing', description: 'Take the prone board out on calm mornings. You already know how to foil; now just focus on the pop-up.' }
    ],
    progressionLink: { label: 'Start Wing Diagnostics', nextId: 'wing_q1' }
  },

  'res_wake_prone': {
    id: 'res_wake_prone',
    type: 'result',
    title: 'Strategy: Tow to Prone',
    content: "You have a boat and surf skills, but no wind. Use the boat as your simulator.",
    analysis: {
      why: "The hardest part of Prone foiling is 'The Pop-Up' + 'The Flight'. The boat lets you isolate 'The Flight'. Once you master riding the foil behind the boat, you only have to learn the pop-up.",
      whyNot: [
        "Wing Foil: You have no wind.",
        "Foil Assist: You have a boat, which is basically a free Foil Assist."
      ]
    },
    roadmap: [
      { title: 'Phase 1: Wake Foiling', description: 'Get towed. Learn to pump the foil outside the wake. This simulates the connection between waves.' },
      { title: 'Phase 2: Tow-In Surf', description: 'Have the boat tow you into small waves. Kick out and surf them.' },
      { title: 'Phase 3: Paddle Prone', description: 'Ditch the boat. You now know the feeling; you just need to paddle hard enough to catch the energy.' }
    ],
    progressionLink: { label: 'Start Prone Diagnostics', nextId: 'prone_q1' }
  },

  'res_wing_surf_style': {
    id: 'res_wing_surf_style',
    type: 'result',
    title: 'Strategy: Surf-Style Winging',
    content: "You are a surfer, but your spot is too crowded for prone foiling. Prone foiling is dangerous in crowds. Use the Wing to escape.",
    analysis: {
      why: "A foil is sharp and dangerous. In a crowded lineup, you are a liability. The Wing allows you to launch elsewhere and ride swells 500m outside the surf break where no one else is.",
      whyNot: [
        "Prone Foil: Dangerous to self and others in crowds.",
        "Foil Assist: Still presents a danger in crowded zones."
      ]
    },
    roadmap: [
      { title: 'Phase 1: Get Outside', description: 'Use the wing to blast upwind, far away from the crowded surf lineup.' },
      { title: 'Phase 2: Flagging', description: 'Learn to "Flag" (luff) the wing completely. Ride the open ocean swells like an endless point break.' },
      { title: 'Phase 3: Carving', description: 'Apply your shortboard cutback technique to the foil. The wing allows you to ride waves that never break.' }
    ],
    progressionLink: { label: 'Start Wing Diagnostics', nextId: 'wing_q1' }
  },

  'res_wake_wing': {
    id: 'res_wake_wing',
    type: 'result',
    title: 'Strategy: Tow to Wing',
    content: "You have no surf background, so the board balance will be hard. Use the boat to skip the 'struggle phase'.",
    analysis: {
      why: "Learning to manage a wing AND a foil at the same time is overwhelming. The boat isolates the foil skills. Once you can fly behind the boat, adding the wing is easy.",
      whyNot: [
        "Prone Foil: Without surf skills, this is nearly impossible.",
        "Pure Wing: Valid, but the boat will save you 10 sessions of falling."
      ]
    },
    roadmap: [
      { title: 'Phase 1: Wake Foiling', description: 'Learn to balance the foil behind the boat. No wing in hand.' },
      { title: 'Phase 2: Wing Handling', description: 'Practice handling the wing on the beach/land.' },
      { title: 'Phase 3: Combine', description: 'Take the wing on the water. Since you already know how to foil from the boat, you only need to focus on the wind.' }
    ],
    progressionLink: { label: 'Start Wing Diagnostics', nextId: 'wing_q1' }
  },

  'res_wake_only': {
    id: 'res_wake_only',
    type: 'result',
    title: 'Recommendation: Wake Foiling',
    content: "You have no wind and no surf skills, but you have a boat. This is your sport.",
    analysis: {
      why: "It is the only accessible option with your conditions. Prone is too hard without surf skills, and Wing is impossible without wind.",
      whyNot: [
        "Prone: Requires surf skills you don't have (yet).",
        "Wing: Requires wind you don't have."
      ]
    },
    roadmap: [
      { title: 'Setup', description: 'Short rope (40-60ft). Boat speed 10-12mph.' },
      { title: 'Goal 1', description: 'Consistent long flights in the wake.' },
      { title: 'Goal 2', description: 'Dropping the rope and pumping the wake.' }
    ],
    progressionLink: { label: 'Back to Start', nextId: 'root' }
  },

  'res_wing_standard': {
    id: 'res_wing_standard',
    type: 'result',
    title: 'Recommendation: Wing Foil',
    content: "You have wind, but no boat or surf skills. Winging is the most accessible path to flight.",
    analysis: {
      why: "Winging is the 'Pickleball' of foiling—accessible, safe, and fun. It relies on wind power rather than paddling fitness or wave knowledge.",
      whyNot: [
        "Prone: Too difficult without surf background.",
        "Wake: You don't have a boat."
      ]
    },
    roadmap: [
      { title: 'Phase 1', description: 'Wing handling on land. (Crucial step).' },
      { title: 'Phase 2', description: 'Taxiing on a large board without flying.' },
      { title: 'Phase 3', description: 'First short flights.' }
    ],
    progressionLink: { label: 'Start Wing Diagnostics', nextId: 'wing_q1' }
  },
  
  // --- REDIRECTS & EDGE CASES ---

  'q_wave_quality': {
    id: 'q_wave_quality',
    type: 'question',
    title: 'Wave Assessment',
    content: "Are the waves typically 'mushy' and slow, or heavy/hollow?",
    options: [
      { label: 'Mushy / Slow', nextId: 'res_prone_pure' },
      { label: 'Heavy / Hollow', nextId: 'res_surf_stay' }
    ]
  },
  'res_prone_pure': {
    id: 'res_prone_pure',
    type: 'result',
    title: 'Recommendation: Pure Prone Foil',
    content: "You are a surfer with uncrowded, mushy waves. This is the dream scenario for Prone Foiling.",
    analysis: {
      why: "You have the perfect environment. Prone foiling turns 'bad' surf days into the best days of your life.",
      whyNot: [
        "Wing: You don't have wind.",
        "Assist: Unnecessary cost. Your waves are easy to catch."
      ]
    },
    roadmap: [
      { title: 'Phase 1', description: 'Whitewater riding only. Learn stability.' },
      { title: 'Phase 2', description: 'Angled takeoffs on small green waves.' },
      { title: 'Phase 3', description: 'Pumping back out to connect waves.' }
    ],
    progressionLink: { label: 'Start Prone Diagnostics', nextId: 'prone_q1' }
  },

  'q_budget_surfer': {
    id: 'q_budget_surfer',
    type: 'question',
    title: 'Budget Assessment',
    content: "Since the spot is crowded and calm, you can't prone or wing safely. Is your budget flexible ($5k+) for an Assist motor?",
    options: [
      { label: 'Yes', nextId: 'res_assist' },
      { label: 'No', nextId: 'res_dock' }
    ]
  },
  'q_budget_nonsurfer': {
    id: 'q_budget_nonsurfer',
    type: 'question',
    title: 'Budget Assessment',
    content: "No wind, no boat, no surf skills. This is the hardest starting point. Is your budget flexible ($5k+)?",
    options: [
      { label: 'Yes', nextId: 'res_assist' },
      { label: 'No', nextId: 'res_dock' }
    ]
  },

  'res_assist': {
    id: 'res_assist',
    type: 'result',
    title: 'Recommendation: Foil Assist / Hybrid',
    content: "The 'Golden Ticket'. Use an electric motor (Foil Drive) to overcome the lack of waves/wind.",
    analysis: {
      why: "You have money but no conditions. The motor creates your own conditions. It allows you to catch unbreaking swells or fly on flat water.",
      whyNot: [
        "Prone: Hard to catch waves without assist in your conditions.",
        "Wing: No wind."
      ]
    },
    roadmap: [
      { title: 'Phase 1', description: 'Flat water e-foiling to learn balance.' },
      { title: 'Phase 2', description: 'Catching small bumps using the motor.' },
      { title: 'Phase 3', description: 'Releasing the throttle to pump freely.' }
    ],
    progressionLink: { label: 'Start Assist Diagnostics', nextId: 'assist_q1' }
  },
  'res_dock': {
    id: 'res_dock',
    type: 'result',
    title: 'Recommendation: Dock Start / Pump',
    content: "The 'Hard Way'. Low cost, extreme difficulty. You must run and jump off a dock.",
    analysis: {
      why: "It's the only option left. It costs almost nothing but requires extreme athleticism and patience.",
      whyNot: [
        "Assist: Budget constraints."
      ]
    },
    roadmap: [
      { title: 'Phase 1', description: 'The Dead Start. Learn to jump onto the board.' },
      { title: 'Phase 2', description: 'The Cardio. Pumping requires high fitness.' },
      { title: 'Phase 3', description: 'Connecting small boat wakes.' }
    ],
    progressionLink: { label: 'Back to Start', nextId: 'root' }
  },
  'res_surf_stay': {
    id: 'res_surf_stay',
    type: 'result',
    title: 'Recommendation: Stick to Surfing',
    content: "Your local waves are too dangerous for foiling (hollow/heavy).",
    analysis: {
      why: "Safety. Foils are guillotine blades. In heavy, hollow surf, the risk of injury is extreme, and the equipment will break.",
      whyNot: [
        "Foiling: It's for soft, mushy waves. Don't force it."
      ]
    },
    roadmap: [
      { title: 'Reasoning', description: 'Foils need soft, crumbling waves. Heavy barrels break foil gear and hurt riders.' },
      { title: 'Alternative', description: 'Travel to a different spot with softer waves to learn.' }
    ]
  },


  // ==========================================
  // PHASE 2: TECHNICAL PROGRESSION (DIAGNOSTICS)
  // ==========================================

  // --- PRONE DIAGNOSTICS ---
  'prone_q1': {
    id: 'prone_q1',
    type: 'question',
    title: 'Prone: The Basics',
    content: "Can you consistently catch whitewater or small waves and ride straight without breaching?",
    options: [
      { label: 'No', nextId: 'prone_adv_1' },
      { label: 'Yes', nextId: 'prone_q2' }
    ]
  },
  'prone_adv_1': {
    id: 'prone_adv_1',
    type: 'result',
    title: 'Drill: Stay in the Box',
    content: "Stability Check.",
    analysis: { why: "Foundation first.", whyNot: [] },
    roadmap: [
      { title: 'Stance', description: 'Feet centered over stringer. Weight forward.' },
      { title: 'Gear', description: 'Move mast back 1 inch if breaching.' }
    ],
    progressionLink: { label: 'Retry', nextId: 'prone_q1' }
  },
  'prone_q2': {
    id: 'prone_q2',
    type: 'question',
    title: 'Prone: Turning',
    content: "Can you perform a controlled bottom turn?",
    options: [
      { label: 'No', nextId: 'prone_adv_2' },
      { label: 'Yes', nextId: 'prone_q3' }
    ]
  },
  'prone_adv_2': {
    id: 'prone_adv_2',
    type: 'result',
    title: 'Drill: Bank to Turn',
    content: "You cannot steer flat.",
    analysis: { why: "Physics.", whyNot: [] },
    roadmap: [
      { title: 'Physics', description: 'Roll the board onto the rail (Bank) before pushing.' },
      { title: 'Gear', description: 'Use a smaller foil (800cm) to make rolling easier.' }
    ],
    progressionLink: { label: 'Retry', nextId: 'prone_q2' }
  },
  'prone_q3': {
    id: 'prone_q3',
    type: 'question',
    title: 'Prone: Pumping',
    content: "Can you pump back out and link 2 waves?",
    options: [
      { label: 'No', nextId: 'prone_adv_3' },
      { label: 'Yes', nextId: 'prone_master' }
    ]
  },
  'prone_adv_3': {
    id: 'prone_adv_3',
    type: 'result',
    title: 'Drill: The Pump Jump',
    content: "Pumping is unweighting.",
    analysis: { why: "Technique adjustment.", whyNot: [] },
    roadmap: [
      { title: 'Transition', description: 'Move front foot back 2 inches when wave ends.' },
      { title: 'Motion', description: 'Jump UP, don\'t push DOWN.' }
    ],
    progressionLink: { label: 'Retry', nextId: 'prone_q3' }
  },
  'prone_master': {
    id: 'prone_master',
    type: 'result',
    title: 'Status: Advanced Prone',
    content: "You are ripping.",
    analysis: { why: "Mastery achieved.", whyNot: [] },
    roadmap: [{ title: 'Next Level', description: 'Work on breaching turns and airs.' }]
  },

  // --- WING DIAGNOSTICS ---
  'wing_q1': {
    id: 'wing_q1',
    type: 'question',
    title: 'Wing: Taxiing',
    content: "Can you taxi upwind without flying?",
    options: [
      { label: 'No', nextId: 'wing_adv_1' },
      { label: 'Yes', nextId: 'wing_q2' }
    ]
  },
  'wing_adv_1': {
    id: 'wing_adv_1',
    type: 'result',
    title: 'Drill: The Slog',
    content: "Master board control on surface.",
    analysis: { why: "Safety first.", whyNot: [] },
    roadmap: [
      { title: 'Vision', description: 'Look over your shoulder upwind.' },
      { title: 'Volume', description: 'Ensure board is floaty enough.' }
    ],
    progressionLink: { label: 'Retry', nextId: 'wing_q1' }
  },
  'wing_q2': {
    id: 'wing_q2',
    type: 'question',
    title: 'Wing: Gybing',
    content: "Can you gybe (turn downwind) on foil?",
    options: [
      { label: 'No', nextId: 'wing_adv_2' },
      { label: 'Yes', nextId: 'wing_q3' }
    ]
  },
  'wing_adv_2': {
    id: 'wing_adv_2',
    type: 'result',
    title: 'Drill: Heineken Gybe',
    content: "Speed helps stability.",
    analysis: { why: "Momentum is key.", whyNot: [] },
    roadmap: [
      { title: 'Entry', description: 'Bear off to gain speed.' },
      { title: 'Hands', description: 'Swap hands before feet.' }
    ],
    progressionLink: { label: 'Retry', nextId: 'wing_q2' }
  },
  'wing_q3': {
    id: 'wing_q3',
    type: 'question',
    title: 'Wing: Tacking',
    content: "Can you tack (turn upwind)?",
    options: [
      { label: 'No', nextId: 'wing_adv_3' },
      { label: 'Yes', nextId: 'wing_master' }
    ]
  },
  'wing_adv_3': {
    id: 'wing_adv_3',
    type: 'result',
    title: 'Drill: Wing First',
    content: "The wing leads the turn.",
    analysis: { why: "Aerodynamics.", whyNot: [] },
    roadmap: [
      { title: 'Punch', description: 'Punch the wing through the wind eye.' },
      { title: 'Follow', description: 'Board follows the wing.' }
    ],
    progressionLink: { label: 'Retry', nextId: 'wing_q3' }
  },
  'wing_master': {
    id: 'wing_master',
    type: 'result',
    title: 'Status: Advanced Winger',
    content: "Ready for waves.",
    analysis: { why: "Mastery achieved.", whyNot: [] },
    roadmap: [{ title: 'Next Level', description: 'Flagging the wing on swell.' }]
  },

  // --- ASSIST DIAGNOSTICS ---
  'assist_q1': {
    id: 'assist_q1',
    type: 'question',
    title: 'Assist: Flight',
    content: "Can you sustain flight with motor?",
    options: [
      { label: 'No', nextId: 'assist_adv_1' },
      { label: 'Yes', nextId: 'assist_q2' }
    ]
  },
  'assist_adv_1': {
    id: 'assist_adv_1',
    type: 'result',
    title: 'Drill: Weight Forward',
    content: "Counter the motor lift.",
    analysis: { why: "Thrust mechanics.", whyNot: [] },
    roadmap: [{ title: 'Lean', description: 'Lean aggressively forward on throttle.' }],
    progressionLink: { label: 'Retry', nextId: 'assist_q1' }
  },
  'assist_q2': {
    id: 'assist_q2',
    type: 'question',
    title: 'Assist: Pumping',
    content: "Can you pump without motor?",
    options: [
      { label: 'No', nextId: 'assist_adv_2' },
      { label: 'Yes', nextId: 'assist_master' }
    ]
  },
  'assist_adv_2': {
    id: 'assist_adv_2',
    type: 'result',
    title: 'Drill: The Shuffle',
    content: "Transition balance.",
    analysis: { why: "Center of Gravity shift.", whyNot: [] },
    roadmap: [{ title: 'Jump', description: 'Jump feet back 3 inches when motor cuts.' }],
    progressionLink: { label: 'Retry', nextId: 'assist_q2' }
  },
  'assist_master': {
    id: 'assist_master',
    type: 'result',
    title: 'Status: Hybrid Master',
    content: "Surfing with power.",
    analysis: { why: "Mastery achieved.", whyNot: [] },
    roadmap: [{ title: 'Goal', description: 'Use motor only for 5 seconds per wave.' }]
  },
  
  // --- DW DIAGNOSTICS ---
  'dw_q1': { id: 'dw_q1', type: 'question', title: 'DW: Pop Up', content: "Can you paddle up in flat water?", options: [{label:'No', nextId: 'dw_adv_1'}, {label:'Yes', nextId:'dw_q2'}] },
  'dw_adv_1': { id: 'dw_adv_1', type: 'result', title: 'Drill: Sprint Interval', content: "Build paddle power.", analysis: { why: "Cardio is king.", whyNot: [] }, roadmap: [{title:'Timing', description:'Stroke when tail lifts.'}], progressionLink: {label:'Retry', nextId:'dw_q1'} },
  'dw_q2': { id: 'dw_q2', type: 'question', title: 'DW: Glide', content: 'Do bumps outrun you?', options: [{label:'Yes', nextId:'dw_adv_2'}, {label:'No', nextId:'dw_q3'}] },
  'dw_adv_2': { id: 'dw_adv_2', type: 'result', title: 'Drill: Stop Pumping', content:'Trust the glide.', analysis: { why: "Drag reduction.", whyNot: [] }, roadmap:[{title:'Relax', description:'Stand back, let the board run.'}], progressionLink:{label:'Retry', nextId:'dw_q2'} },
  'dw_q3': { id: 'dw_q3', type: 'question', title: 'DW: Connecting', content: 'Can you cross bumps?', options: [{label:'No', nextId:'dw_adv_3'}, {label:'Yes', nextId:'dw_master'}] },
  'dw_adv_3': { id: 'dw_adv_3', type: 'result', title: 'Drill: Diagonal Lines', content:'Find new energy.', analysis: { why: "Energy management.", whyNot: [] }, roadmap:[{title:'Bridge', description:'Use cross-chop to bridge swells.'}], progressionLink:{label:'Retry', nextId:'dw_q3'} },
  'dw_master': { id: 'dw_master', type: 'result', title:'Status: DW Master', content:'Endless glides.', analysis: { why: "Mastery achieved.", whyNot: [] }, roadmap:[{title:'Goal', description:'1 Mile Run.'}] }
};