export const STAGES = [
  "Customer Registered",
  "Requirements Collected",
  "Apartment Search",
  "Apartment Confirmed",
  "Packers Booked",
  "Utilities Setup",
  "Address Change",
  "Move Completed",
  "Post-Move Support"
];

export const INITIAL_RELOCATIONS = [
  {
    id: "RELO-1001",
    customerName: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@example.com",
    sourceCity: "Bengaluru",
    destinationCity: "Mumbai",
    moveDate: "2026-08-15",
    currentStage: "Utilities Setup",
    priority: "High",
    budget: "₹45,000 / month",
    propertyPreference: "2 BHK Semi-furnished, Powai / Bandra West",
    notes: "Has a pet dog. Requires high-speed fiber internet pre-installed before arrival.",
    tasks: [
      { id: "t1", title: "Upload Aadhaar & Pan Card", assignedTo: "Rahul (Customer)", dueDate: "2026-08-05", priority: "High", completed: true },
      { id: "t2", title: "Confirm Lease Agreement in Powai", assignedTo: "Aditya (Property Partner)", dueDate: "2026-08-08", priority: "High", completed: true },
      { id: "t3", title: "Book Express Movers & Packers", assignedTo: "Operations Exec", dueDate: "2026-08-10", priority: "Medium", completed: true },
      { id: "t4", title: "Schedule Internet Installation (Airtel Fiber)", assignedTo: "Operations Exec", dueDate: "2026-08-13", priority: "Critical", completed: false },
      { id: "t5", title: "Submit Bank Address Change Form", assignedTo: "Rahul (Customer)", dueDate: "2026-08-14", priority: "Low", completed: false }
    ],
    activities: [
      { id: "a1", time: "2026-08-01 10:30 AM", type: "system", title: "Customer Registered", desc: "Rahul initiated relocation request via QuickMove portal." },
      { id: "a2", time: "2026-08-03 02:15 PM", type: "doc", title: "KYC Documents Verified", desc: "Aadhaar and rental agreement verified by legal team." },
      { id: "a3", time: "2026-08-08 11:00 AM", type: "property", title: "Apartment Confirmed", desc: "Lease agreement signed for Hiranandani Powai." },
      { id: "a4", time: "2026-08-10 04:30 PM", type: "logistics", title: "Packers & Movers Booked", desc: "Slot locked with SafeMove Logistics for 15 Aug morning." }
    ]
  },
  {
    id: "RELO-1002",
    customerName: "Ananya Verma",
    phone: "+91 91234 56789",
    email: "ananya.v@techcorp.io",
    sourceCity: "Delhi NCR",
    destinationCity: "Bengaluru",
    moveDate: "2026-08-12",
    currentStage: "Apartment Search",
    priority: "Critical",
    budget: "₹60,000 / month",
    propertyPreference: "3 BHK Gated Society in Indiranagar or HSR Layout",
    notes: "Corporate relocation sponsor. Urgent move due to office joining date.",
    tasks: [
      { id: "t21", title: "Upload Salary Slip & Company ID", assignedTo: "Ananya (Customer)", dueDate: "2026-08-04", priority: "High", completed: true },
      { id: "t22", title: "Shortlist 3 Gated Apartments in HSR", assignedTo: "Property Executive", dueDate: "2026-08-06", priority: "Critical", completed: true },
      { id: "t23", title: "Schedule Virtual Walkthrough Video Call", assignedTo: "Property Executive", dueDate: "2026-08-07", priority: "Critical", completed: false },
      { id: "t24", title: "Draft Security Deposit Agreement", assignedTo: "Operations Exec", dueDate: "2026-08-09", priority: "High", completed: false },
      { id: "t25", title: "Book Inter-state Movers Slot", assignedTo: "Logistics Team", dueDate: "2026-08-10", priority: "High", completed: false }
    ],
    activities: [
      { id: "a21", time: "2026-08-02 09:00 AM", type: "system", title: "Priority Onboarding Completed", desc: "Corporate relocation voucher applied." },
      { id: "a22", time: "2026-08-05 03:20 PM", type: "property", title: "Shortlisted 3 Properties", desc: "Pre-screened apartments sent via WhatsApp preview." }
    ]
  },
  {
    id: "RELO-1003",
    customerName: "Vikram Patel",
    phone: "+91 99887 76655",
    email: "vikram.p@startup.in",
    sourceCity: "Pune",
    destinationCity: "Hyderabad",
    moveDate: "2026-08-20",
    currentStage: "Packers Booked",
    priority: "Medium",
    budget: "₹35,000 / month",
    propertyPreference: "2 BHK Fully Furnished near HITEC City",
    notes: "Wants climate-controlled vehicle for sensitive electronic items.",
    tasks: [
      { id: "t31", title: "Sign Digital Lease Contract", assignedTo: "Vikram (Customer)", dueDate: "2026-08-11", priority: "Medium", completed: true },
      { id: "t32", title: "Lock Packers Pickup Slot (10 AM)", assignedTo: "Logistics Partner", dueDate: "2026-08-12", priority: "Medium", completed: true },
      { id: "t33", title: "Coordinate Utility Transfer (Electricity Bill)", assignedTo: "Operations Exec", dueDate: "2026-08-16", priority: "Low", completed: false },
      { id: "t34", title: "Order Gas Connection Transfer", assignedTo: "Operations Exec", dueDate: "2026-08-18", priority: "Medium", completed: false }
    ],
    activities: [
      { id: "a31", time: "2026-08-04 11:15 AM", type: "system", title: "Requirements Verified", desc: "Budget and location preferences confirmed." },
      { id: "a32", time: "2026-08-07 05:00 PM", type: "property", title: "Lease Deposit Paid", desc: "Token payment transferred to landlord." }
    ]
  },
  {
    id: "RELO-1004",
    customerName: "Priya Nair",
    phone: "+91 97654 32109",
    email: "priya.nair@designstudio.com",
    sourceCity: "Chennai",
    destinationCity: "Bengaluru",
    moveDate: "2026-08-09",
    currentStage: "Move Completed",
    priority: "Low",
    budget: "₹40,000 / month",
    propertyPreference: "1 BHK / Studio in Koramangala",
    notes: "Move successfully conducted on Aug 6th. Pending final check-in survey.",
    tasks: [
      { id: "t41", title: "Complete Post-Move Deep Cleaning", assignedTo: "Facility Partner", dueDate: "2026-08-07", priority: "Low", completed: true },
      { id: "t42", title: "Collect Customer Satisfaction Feedback", assignedTo: "Operations Exec", dueDate: "2026-08-08", priority: "Low", completed: true },
      { id: "t43", title: "Close Support Ticket & Invoice", assignedTo: "Finance Team", dueDate: "2026-08-09", priority: "Low", completed: false }
    ],
    activities: [
      { id: "a41", time: "2026-08-06 06:00 PM", type: "logistics", title: "Unpacking & Setup Finished", desc: "All boxes unpacked without damage." },
      { id: "a42", time: "2026-08-07 10:00 AM", type: "utility", title: "Wi-Fi Active", desc: "Fiber broadband set up and speed tested." }
    ]
  },
  {
    id: "RELO-1005",
    customerName: "Rohan Mehta",
    phone: "+91 98112 23344",
    email: "rohan.mehta@finance.org",
    sourceCity: "Ahmedabad",
    destinationCity: "Gurugram",
    moveDate: "2026-08-25",
    currentStage: "Requirements Collected",
    priority: "Medium",
    budget: "₹50,000 / month",
    propertyPreference: "3 BHK High-rise in Golf Course Road",
    notes: "Requires parking space for 2 SUVs.",
    tasks: [
      { id: "t51", title: "Collect Preferred Viewing Schedule", assignedTo: "Operations Exec", dueDate: "2026-08-10", priority: "Medium", completed: false },
      { id: "t52", title: "Verify Gated Society Pet & Vehicle Bylaws", assignedTo: "Property Executive", dueDate: "2026-08-12", priority: "Low", completed: false }
    ],
    activities: [
      { id: "a51", time: "2026-08-06 02:00 PM", type: "system", title: "Initial Consultation Completed", desc: "Move parameters captured." }
    ]
  },
  {
    id: "RELO-1006",
    customerName: "Sneha Gupta",
    phone: "+91 90000 11122",
    email: "sneha.g@health.org",
    sourceCity: "Kolkata",
    destinationCity: "Hyderabad",
    moveDate: "2026-08-14",
    currentStage: "Address Change",
    priority: "High",
    budget: "₹38,000 / month",
    propertyPreference: "2 BHK Gated Community in Gachibowli",
    notes: "Wants address proof updated in Passport and Aadhaar quickly.",
    tasks: [
      { id: "t61", title: "Submit Bank Passbook Address Update", assignedTo: "Sneha (Customer)", dueDate: "2026-08-11", priority: "High", completed: false },
      { id: "t62", title: "Schedule LPG Gas Cylinder Transfer", assignedTo: "Operations Exec", dueDate: "2026-08-13", priority: "Medium", completed: false }
    ],
    activities: [
      { id: "a61", time: "2026-08-05 04:00 PM", type: "utility", title: "Utility Setup Completed", desc: "Electricity meter account transferred." }
    ]
  }
];
