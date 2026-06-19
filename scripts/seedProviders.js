import mongoose from "mongoose";
import dotenv from "dotenv";
import Provider from "../src/models/Provider.js";

dotenv.config();

const seedProviders = [
  {
    firstName: "Rasheedah",
    lastName: "Fletcher",
    displayName: "Rasheedah Fletcher, LCMHC",
    credentials: "LCMHC",
    designation: "Licensed Clinical Mental Health Counselor",
    specialty: "Child & Adolescent Therapy",
    shortBio:
      "Compassionate clinician specializing in children, adolescents, and family support.",
    fullBio:
      "Rasheedah Fletcher is a Licensed Clinical Mental Health Counselor with extensive experience supporting children, adolescents, and families. She creates a warm, collaborative environment and integrates evidence-based approaches tailored to each client.",
    profileImageUrl: "https://avighnahc.com/images/providers/rasheedah-fletcher.jpg",
    email: "rasheedah.fletcher@avighnahc.com",
    phone: "(919) 322-0140",
    location: "Raleigh, NC",
    yearsOfExperience: 12,
    languages: ["English"],
    displayOrder: 1,
    isFeatured: true,
    status: "Active",
  },
  {
    firstName: "Myracle",
    lastName: "Clay-Bennett",
    displayName: "Myracle Clay-Bennett, LCMHC",
    credentials: "LCMHC",
    designation: "Licensed Clinical Mental Health Counselor",
    specialty: "Anxiety, Depression & Trauma",
    shortBio:
      "Dedicated therapist helping adults navigate anxiety, depression, and life transitions.",
    fullBio:
      "Myracle Clay-Bennett supports adults facing anxiety, depression, trauma, and major life transitions. Her approach is client-centered, culturally responsive, and focused on sustainable healing.",
    profileImageUrl: "https://avighnahc.com/images/providers/myracle-clay-bennett.jpg",
    email: "myracle.clay-bennett@avighnahc.com",
    phone: "(919) 322-0140",
    location: "Raleigh, NC",
    yearsOfExperience: 8,
    languages: ["English"],
    displayOrder: 2,
    isFeatured: true,
    status: "Active",
  },
  {
    firstName: "Priya",
    lastName: "Sharma",
    displayName: "Priya Sharma, PMHNP-BC",
    credentials: "PMHNP-BC",
    designation: "Psychiatric Mental Health Nurse Practitioner",
    specialty: "Medication Management",
    shortBio:
      "Board-certified PMHNP providing thoughtful psychiatric evaluation and medication management.",
    fullBio:
      "Priya Sharma is a board-certified Psychiatric Mental Health Nurse Practitioner who partners with clients to develop holistic treatment plans that may include medication management alongside therapeutic support.",
    profileImageUrl: "",
    email: "priya.sharma@avighnahc.com",
    phone: "(919) 322-0140",
    location: "Raleigh, NC",
    yearsOfExperience: 10,
    languages: ["English", "Hindi"],
    displayOrder: 3,
    isFeatured: false,
    status: "Active",
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Provider.countDocuments();
  if (existing > 0) {
    console.log(`⚠️  ${existing} provider(s) already exist. Skipping seed.`);
    console.log("   Delete existing providers first or run with FORCE_SEED=true.");
    if (process.env.FORCE_SEED !== "true") {
      process.exit(0);
    }
    await Provider.deleteMany({});
    console.log("🗑️  Cleared existing providers (FORCE_SEED=true).");
  }

  const created = await Provider.insertMany(seedProviders);
  console.log(`✅ Seeded ${created.length} providers successfully.`);
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Provider seed failed:", err.message);
  process.exit(1);
});
