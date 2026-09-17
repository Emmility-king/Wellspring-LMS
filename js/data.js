/**
 * Wellspring University LMS - Mock Data Engine
 */

const LMS_DATA = {
  studentProfile: {
    id: "WSU/2026/CS/0842",
    name: "Emma Okonjo",
    email: "e.okonjo@wellspringuniversity.edu.ng",
    department: "School of Computing",
    programme: "B.Sc. Software Engineering",
    level: "300 Level",
    gpa: "4.68 / 5.00",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    role: "student"
  },

  facultyProfile: {
    id: "WSU/FAC/CS/001",
    name: "Dr. Arinze Eze",
    email: "a.eze@wellspringuniversity.edu.ng",
    department: "School of Computing",
    role: "faculty",
    title: "Associate Professor & Dean of Computing",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },

  courses: [
    {
      id: "sen301",
      code: "SEN301",
      title: "Software Engineering & System Architecture",
      category: "Software Engineering",
      level: "300 Level",
      credits: 4,
      instructor: "Dr. Arinze Eze",
      instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      duration: "8 Weeks",
      rating: 4.9,
      enrolledCount: 142,
      progress: 75,
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85",
      description: "Master modern software architecture, Object-Oriented SOLID principles, requirement engineering, microservices, and continuous integration practices.",
      modules: [
        {
          id: "m1",
          title: "Module 1: Agile Software Lifecycles & Architecture",
          lessons: [
            {
              id: "les-1",
              title: "1.1 Agile SDLC & Scrum Ceremonies",
              type: "video",
              duration: "24 mins",
              completed: true,
              videoUrl: "https://www.youtube.com/embed/gP475kS32rM",
              summary: "Explore SDLC models, Scrum framework, sprint planning, user stories, and velocity tracking in production engineering teams.",
              readingContent: `
                <h3>1. Agile Fundamentals</h3>
                <p>Agile software engineering prioritizes iterative delivery over rigid Waterfall planning. Scrum teams work in sprints of 2 to 4 weeks to deliver incremental user value.</p>
                <div class="p-4 my-3 bg-blue-50 border-l-4 border-blue-600 rounded">
                  <strong>Key Takeaway:</strong> Continuous feedback loops and working software are the primary measures of progress.
                </div>
              `
            },
            {
              id: "les-2",
              title: "1.2 SOLID Design Principles & Clean Code",
              type: "reading",
              duration: "18 mins",
              completed: true,
              summary: "In-depth study of Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles.",
              readingContent: `
                <h3>Understanding SOLID Principles</h3>
                <p>SOLID design principles form the core foundation of scalable, maintainable object-oriented software systems.</p>
                <ul>
                  <li><strong>S - Single Responsibility:</strong> A class should have one, and only one, reason to change.</li>
                  <li><strong>O - Open/Closed:</strong> Software entities should be open for extension, but closed for modification.</li>
                  <li><strong>L - Liskov Substitution:</strong> Subtypes must be substitutable for their base types without altering correctness.</li>
                  <li><strong>I - Interface Segregation:</strong> Many client-specific interfaces are better than one general-purpose interface.</li>
                  <li><strong>D - Dependency Inversion:</strong> Depend upon abstractions, not concretions.</li>
                </ul>
              `
            }
          ]
        },
        {
          id: "m2",
          title: "Module 2: Microservices & Event-Driven Architecture",
          lessons: [
            {
              id: "les-3",
              title: "2.1 Microservices Patterns & API Gateways",
              type: "video",
              duration: "32 mins",
              completed: false,
              videoUrl: "https://www.youtube.com/embed/gP475kS32rM",
              summary: "Decomposing monoliths, REST vs gRPC communication, service discovery, API gateways, and distributed logging.",
              readingContent: `
                <h3>Decomposing Monoliths into Microservices</h3>
                <p>Microservices allow teams to independently deploy, scale, and maintain discrete business domains using bounded contexts.</p>
              `
            }
          ]
        }
      ]
    },
    {
      id: "csc305",
      code: "CSC305",
      title: "Database Systems & Data Modeling",
      category: "Computer Science",
      level: "300 Level",
      credits: 3,
      instructor: "Prof. Grace Nnamdi",
      instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      duration: "10 Weeks",
      rating: 4.8,
      enrolledCount: 188,
      progress: 60,
      thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=85",
      description: "Comprehensive introduction to relational algebra, SQL optimization, entity-relationship modeling, 3NF normalization, and ACID transaction semantics.",
      modules: [
        {
          id: "m-db1",
          title: "Module 1: Relational Algebra & ER Diagrams",
          lessons: [
            {
              id: "les-db1",
              title: "1.1 ER Diagram Design & Normalization to 3NF",
              type: "reading",
              duration: "25 mins",
              completed: true,
              summary: "Designing database schemas, identifying primary/foreign key constraints, eliminating redundancy with 1NF, 2NF, and 3NF rules.",
              readingContent: `
                <h3>Database Normalization Rules</h3>
                <p>Normalization reduces data redundancy and improves data integrity by structuring relational tables properly.</p>
              `
            }
          ]
        }
      ]
    },
    {
      id: "csc309",
      code: "CSC309",
      title: "Cyber Security & Modern Cryptography",
      category: "Cyber Security",
      level: "300 Level",
      credits: 3,
      instructor: "Engr. Victor Biobaku",
      instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      duration: "6 Weeks",
      rating: 4.95,
      enrolledCount: 165,
      progress: 40,
      thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=85",
      description: "Explore cryptographic algorithms (AES, RSA), public key infrastructure (PKI), OAuth 2.0 / JWT authentication, vulnerability scanning, and ethical hacking.",
      modules: [
        {
          id: "m-sec1",
          title: "Module 1: Cryptography & Auth Standards",
          lessons: [
            {
              id: "les-sec1",
              title: "1.1 Symmetric vs Asymmetric Encryption",
              type: "reading",
              duration: "20 mins",
              completed: false,
              summary: "Understanding key exchange protocols, AES-256 GCM encryption, and RSA key pairs.",
              readingContent: `
                <h3>Public Key Infrastructure & TLS</h3>
                <p>Asymmetric encryption relies on mathematically linked public and private keys to safely exchange secrets over insecure networks.</p>
              `
            }
          ]
        }
      ]
    },
    {
      id: "sen303",
      code: "SEN303",
      title: "Web Applications & Cloud Architecture",
      category: "Software Engineering",
      level: "300 Level",
      credits: 4,
      instructor: "Dr. Arinze Eze",
      instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      duration: "8 Weeks",
      rating: 4.87,
      enrolledCount: 154,
      progress: 90,
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=85",
      description: "Full-stack web engineering with modern responsive standards, serverless functions, state management, Docker containerization, and AWS/Vercel deployment.",
      modules: [
        {
          id: "m-web1",
          title: "Module 1: Responsive Layouts & Client State",
          lessons: [
            {
              id: "les-web1",
              title: "1.1 Modern CSS Grid & Flexbox Paradigms",
              type: "video",
              duration: "30 mins",
              completed: true,
              videoUrl: "https://www.youtube.com/embed/gP475kS32rM",
              summary: "Building fluid user interfaces across mobile and desktop viewpoints with Tailwind CSS and responsive design patterns.",
              readingContent: `
                <h3>Responsive Design Principles</h3>
                <p>Fluid grids, flexible media, and CSS media queries enable web applications to adapt gracefully across device screens.</p>
              `
            }
          ]
        }
      ]
    }
  ],

  quizzes: [
    {
      id: "quiz-sen301-midterm",
      courseId: "sen301",
      courseCode: "SEN301",
      title: "Software Engineering Mid-Semester CBT",
      durationMins: 15,
      totalPoints: 20,
      passingScore: 12,
      questions: [
        {
          id: "q1",
          question: "Which SOLID principle states that a software component should be open for extension but closed for modification?",
          options: [
            "Single Responsibility Principle",
            "Open/Closed Principle",
            "Liskov Substitution Principle",
            "Dependency Inversion Principle"
          ],
          correctIndex: 1,
          explanation: "The Open/Closed Principle (OCP) encourages expanding system behavior through inheritance or composition without modifying existing, tested source code."
        },
        {
          id: "q2",
          question: "In Scrum Agile methodology, what is the primary objective of the Daily Standup meeting?",
          options: [
            "To re-estimate all user stories in the backlog",
            "To conduct deep code reviews for ongoing pull requests",
            "To sync team progress, identify blockers, and state daily goals",
            "To showcase finished software increments to executive sponsors"
          ],
          correctIndex: 2,
          explanation: "The Daily Standup is a time-boxed 15-minute sync where team members answer: what was done yesterday, what will be done today, and are there any blockers."
        },
        {
          id: "q3",
          question: "Which architectural style breaks a software application down into loosely coupled, independently deployable services?",
          options: [
            "Monolithic Architecture",
            "Microservices Architecture",
            "Layered N-Tier Architecture",
            "Shared Database Monolith"
          ],
          correctIndex: 1,
          explanation: "Microservices isolate domain logic into autonomous services that communicate via lightweight APIs like REST or gRPC."
        },
        {
          id: "q4",
          question: "What does the 'D' in ACID transaction properties stand for in Database Systems?",
          options: [
            "Distributed",
            "Durability",
            "Decoupled",
            "Deterministic"
          ],
          correctIndex: 1,
          explanation: "Durability guarantees that once a transaction has been committed, its changes will persist even in the event of a system failure or power loss."
        }
      ]
    }
  ],

  assignments: [
    {
      id: "asgn-1",
      courseCode: "SEN301",
      title: "Software Design Patterns & Architecture Specification",
      dueDate: "Sep 22, 2026",
      points: 100,
      status: "Pending",
      submittedFile: null,
      grade: null,
      instructions: "Submit a detailed PDF document detailing the architectural pattern (MVC vs Microservices) chosen for an e-Commerce scaling scenario, along with UML Class diagrams."
    },
    {
      id: "asgn-2",
      courseCode: "CSC305",
      title: "Relational Database Normalization & SQL Queries",
      dueDate: "Sep 10, 2026",
      points: 100,
      status: "Graded",
      submittedFile: "Emma_Okonjo_CSC305_Assignment1.pdf",
      grade: "92 / 100",
      feedback: "Excellent ER diagram mapping and clean 3NF schema tables. Good work on index queries!",
      instructions: "Convert the provided un-normalized sales invoice document into 1NF, 2NF, and 3NF tables with foreign key constraints."
    }
  ],

  gradebook: [
    { courseCode: "SEN301", courseTitle: "Software Engineering & Architecture", cat1: 18, cat2: 19, exam: 54, total: 91, grade: "A", status: "Passed" },
    { courseCode: "CSC305", courseTitle: "Database Systems & Data Modeling", cat1: 17, cat2: 18, exam: 51, total: 86, grade: "A", status: "Passed" },
    { courseCode: "CSC309", courseTitle: "Cyber Security & Cryptography", cat1: 16, cat2: 17, exam: 48, total: 81, grade: "A", status: "Passed" },
    { courseCode: "SEN303", courseTitle: "Web Applications & Cloud Architecture", cat1: 19, cat2: 18, exam: 56, total: 93, grade: "A", status: "Passed" }
  ],

  announcements: [
    {
      id: "ann-1",
      title: "2026 First Semester Mid-Term CBT Examination Timetable",
      date: "Sep 15, 2026",
      author: "Office of the Registrar",
      category: "Academic",
      content: "All 300 Level Computer Science and Software Engineering students are advised to log into their Wellspring LMS portal to verify CBT schedule rosters for upcoming examinations."
    },
    {
      id: "ann-2",
      title: "Guest Masterclass: Cloud Systems & AI Architecture by Google Engineers",
      date: "Sep 12, 2026",
      author: "School of Computing",
      category: "Event",
      content: "Join us this Friday at 10:00 AM in the University ICT Auditorium for an interactive session on cloud microservices and generative AI tools."
    }
  ],

  studentSubmissions: [
    {
      id: "sub-101",
      assignmentTitle: "Software Design Patterns & Architecture Specification",
      courseCode: "SEN301",
      studentName: "Emma Okonjo",
      studentId: "WSU/2026/CS/0842",
      studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      submittedDate: "Sep 16, 2026",
      fileName: "Emma_Okonjo_SEN301_Architecture_Doc.pdf",
      fileSize: "2.4 MB",
      status: "Pending Review",
      maxScore: 100,
      grade: null,
      feedback: ""
    },
    {
      id: "sub-102",
      assignmentTitle: "Web Applications & Cloud Architecture System Specs",
      courseCode: "SEN303",
      studentName: "David Adeleke",
      studentId: "WSU/2026/CS/0890",
      studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      submittedDate: "Sep 15, 2026",
      fileName: "David_Adeleke_SEN303_Cloud.pdf",
      fileSize: "4.1 MB",
      status: "Pending Review",
      maxScore: 100,
      grade: null,
      feedback: ""
    },
    {
      id: "sub-103",
      assignmentTitle: "Relational Database Normalization & SQL Queries",
      courseCode: "CSC305",
      studentName: "Emma Okonjo",
      studentId: "WSU/2026/CS/0842",
      studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      submittedDate: "Sep 10, 2026",
      fileName: "Emma_Okonjo_CSC305_Assignment1.pdf",
      fileSize: "1.8 MB",
      status: "Graded",
      maxScore: 100,
      grade: 92,
      feedback: "Excellent ER diagram mapping and clean 3NF schema tables. Good work on index queries!"
    },
    {
      id: "sub-104",
      assignmentTitle: "Cyber Security Threat Modeling & AES Case Study",
      courseCode: "CSC309",
      studentName: "Chidinma Nwosu",
      studentId: "WSU/2026/CS/0721",
      studentAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      submittedDate: "Sep 09, 2026",
      fileName: "Chidinma_Nwosu_CSC309_CaseStudy.pdf",
      fileSize: "3.2 MB",
      status: "Graded",
      maxScore: 100,
      grade: 96,
      feedback: "Outstanding vulnerability assessment and thorough analysis of PKI infrastructure."
    }
  ],

  studentRoster: [
    {
      id: "WSU/2026/CS/0842",
      name: "Emma Okonjo",
      email: "e.okonjo@wellspringuniversity.edu.ng",
      programme: "B.Sc. Software Engineering",
      level: "300 Level",
      gpa: "4.68",
      coursesEnrolled: ["SEN301", "SEN303", "CSC305", "CSC309"],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      status: "Active"
    },
    {
      id: "WSU/2026/CS/0890",
      name: "David Adeleke",
      email: "d.adeleke@wellspringuniversity.edu.ng",
      programme: "B.Sc. Computer Science",
      level: "300 Level",
      gpa: "4.35",
      coursesEnrolled: ["SEN301", "SEN303", "CSC305"],
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      status: "Active"
    },
    {
      id: "WSU/2026/CS/0721",
      name: "Chidinma Nwosu",
      email: "c.nwosu@wellspringuniversity.edu.ng",
      programme: "B.Sc. Software Engineering",
      level: "300 Level",
      gpa: "4.82",
      coursesEnrolled: ["SEN301", "CSC305", "CSC309"],
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      status: "Active"
    },
    {
      id: "WSU/2026/CS/0915",
      name: "Babatunde Olamide",
      email: "b.olamide@wellspringuniversity.edu.ng",
      programme: "B.Sc. Cyber Security",
      level: "300 Level",
      gpa: "3.95",
      coursesEnrolled: ["SEN301", "SEN303", "CSC309"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      status: "Active"
    }
  ]
};
