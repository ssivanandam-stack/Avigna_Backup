import mongoose from "mongoose";
import dotenv from "dotenv";
import Review from "../src/models/Review.js";

dotenv.config();

const reviewsData = [
  {
    providerName: "Myracle Clay-Bennett",
    providerRole: "Therapist",
    firstName: "Alicia",
    lastName: "Carr",
    email: "alicia.carr@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Myracle Clay-Bennett is simply a miracle!! Her professionalism and approach to all my needs has surpassed anything that I could ever expect from a therapist. She has left a remarkable impact on my life and I am forever grateful for finding my perfect therapist!!!",
  },
  {
    providerName: "General Staff",
    providerRole: "Clinic",
    firstName: "Melody",
    lastName: "Fain",
    email: "melody.fain@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "It's difficult to find a good mental health office that accepts insurance and doesn't have a months-long waiting list. This office was so easy to work with and schedule my initial appointment. Someone actually answered the phone, which is very rare. Highly recommend!",
  },
  {
    providerName: "General Staff",
    providerRole: "Clinic",
    firstName: "VJ",
    lastName: "Krish",
    email: "vj.krish@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "When I visited the US with family, we were going through some emotional issues during our stay and so we wanted to take help from a mental health clinic. We were nervous, but some of our friends recommended Avighna Holistic Care and they were wonderful.",
  },
  {
    providerName: "General Staff",
    providerRole: "Clinic",
    firstName: "Shankar",
    lastName: "Ramanathan",
    email: "shankar.r@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Avighna Holistic Care is excellent. The team is professional, compassionate, and offers a variety of services. The therapists provide personalized care, and the staff is supportive to create a welcoming environment. Highly recommend for mental health support.",
  },
  {
    providerName: "Rasheedah Fletcher",
    providerRole: "Clinician",
    firstName: "Jasmine",
    lastName: "Edwards",
    email: "jasmine.edwards@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Ms. Fletcher (Rasheedah) is an amazing clinician. She listens to her clients and is always willing to answer questions. Not only does she counsel adults but she works with children too! I know in this area, it can be difficult to find clinicians that will work with children/adolescents and have availability.",
  },
  {
    providerName: "General Staff",
    providerRole: "Therapist",
    firstName: "Alisha",
    lastName: "Diggs",
    email: "alisha.diggs@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "My son has been going to Avighna Holistic Care for about 2 months now. He loves to go and be able to talk to someone about what’s going on in life, and not being judged. His therapist is such an amazing person and she communicates his needs perfectly.",
  },
  {
    providerName: "Sam",
    providerRole: "Therapist",
    firstName: "Robin",
    lastName: "C",
    email: "robin.c@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "I highly recommend Avighna. The Therapists, including Sam, are all committed to providing high quality care. The office is soothing and does not look clinical at all. You do not have to wait weeks or months to get in.",
  },
  {
    providerName: "Myracle Clay-Bennett",
    providerRole: "Therapist",
    firstName: "Makeba",
    lastName: "Story",
    email: "makeba.story@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Myracle is the best therapist available. If you are in the area please choose her! She listens to everything that you say, and offers an avenue where you feel like you can let your guard down and be your authentic self. Highly recommend!",
  },
  {
    providerName: "General Staff",
    providerRole: "Clinic",
    firstName: "BJ",
    lastName: "Durham",
    email: "bj.durham@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Avighna Holistic Care had a great open house! The staff was very welcoming and the space was inviting. Everything seemed to be designed intentionally to allow for a space of peace and serenity.",
  },
  {
    providerName: "Rasheedah Fletcher",
    providerRole: "Therapist",
    firstName: "Jessica",
    lastName: "OBerto",
    email: "jessica.oberto@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Quality counselors who are person-centered and respect their clients for who they are! Rasheedah is an amazing therapist and counselor who makes you feel seen, is creative in her approach and works from an equitable lens.",
  },
  {
    providerName: "Rasheedah Fletcher",
    providerRole: "Counselor",
    firstName: "Lakia",
    lastName: "Holliday",
    email: "lakia.holliday@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Ms. Fletcher stands out as an exemplary counselor, consistently demonstrating a deep commitment to student well-being and academic success. She is known for her approachable demeanor, making students feel comfortable and supported.",
  },
  {
    providerName: "General Staff",
    providerRole: "Clinic",
    firstName: "Zorayda",
    lastName: "Rodriguez",
    email: "zorayda.rodriguez@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Avighna Holistic Care is great. They offer a variety of counseling services. The office is very warm and inviting.",
  },
  {
    providerName: "Ana",
    providerRole: "Therapist",
    firstName: "Aaron",
    lastName: "Krah",
    email: "aaron.krah@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "I highly recommend Ana! She has a wealth of information and experience and never makes you feel rushed. If it’s your first time trying therapy or you’re just looking to start back again, ASK FOR ANA!!",
  },
  {
    providerName: "Rasheedah Fletcher",
    providerRole: "Therapist",
    firstName: "Destiny",
    lastName: "Johnson",
    email: "destiny.johnson@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Rasheedah is a great listener and provides solid, unbiased feedback. She is a huge advocate for mental health and wellbeing.",
  },
  {
    providerName: "Leadership",
    providerRole: "Clinic",
    firstName: "Janice",
    lastName: "Eisele",
    email: "janice.eisele@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback: "Incredible leadership and compassionate care.",
  },
  {
    providerName: "General Staff",
    providerRole: "Clinic",
    firstName: "Muyiwa",
    lastName: "Adeyeye",
    email: "muyiwa.adeyeye@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Avighna was so welcoming and the staff provided a warm experience. I appreciate the time I took talking with all of them. They are awesome!!",
  },
  {
    providerName: "General Staff",
    providerRole: "Providers",
    firstName: "Emily",
    lastName: "Allen",
    email: "emily.allen@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback: "Great providers and a very welcoming space!",
  },
  {
    providerName: "General Staff",
    providerRole: "Clinic",
    firstName: "Latarsha",
    lastName: "S",
    email: "latarsha.s@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback: "Beautiful facility. Gentle and kind staff.",
  },
  {
    providerName: "General Staff",
    providerRole: "Clinicians",
    firstName: "Alice",
    lastName: "Okamoto",
    email: "alice.okamoto@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback: "Friendly and compassionate group of clinicians!",
  },
  {
    providerName: "Sarah",
    providerRole: "Therapist",
    firstName: "J",
    lastName: "Green",
    email: "j.green@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "I always look forward to my sessions with Sarah. She's been a huge help and is an excellent therapist.",
  },
  {
    providerName: "Charday",
    providerRole: "Therapist",
    firstName: "Emily",
    lastName: "Evans",
    email: "emily.evans@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Charday is the best. She has helped me so much and I can't imagine having another therapist!",
  },
  {
    providerName: "Jason",
    providerRole: "Counselor",
    firstName: "Mike",
    lastName: "Bickford",
    email: "mike.bickford@example.com",
    wouldRecommend: true,
    rating: 5,
    status: "pending",
    feedback:
      "Jason is a great counselor. I like his approach and how he finds ways to help me.",
  },
];

const seedReviews = async () => {
  try {
    // Connect to your MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Insert all reviews into the database
    await Review.insertMany(reviewsData);

    console.log(
      `Successfully added ${reviewsData.length} reviews to the database!`,
    );
    console.log("You can now approve them from your admin panel.");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding reviews:", error);
    process.exit(1);
  }
};

seedReviews();
