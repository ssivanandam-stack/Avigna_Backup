/**
 * Default services matching the current public site / navbar.
 * Used to seed the DB when empty so existing content is preserved.
 */
export const DEFAULT_SERVICES = [
  {
    slug: "assessment",
    title: "Clinical Assessment",
    section: "Comprehensive Therapy",
    displayOrder: 0,
    isActive: true,
    showInNav: true,
    accent: "#14b8a6",
    image: "/image/image3.webp",
    intro:
      "A comprehensive assessment is the foundational step in your mental health journey. At Avighna Holistic Care, our expert clinicians conduct thorough evaluations to accurately diagnose and understand your unique psychological, emotional, and behavioral needs. This deep understanding allows us to craft a highly personalized and effective treatment plan tailored just for you.",
    qa: [
      {
        question: "What is a Clinical Assessment?",
        answer:
          "A clinical or psychiatric assessment is an in-depth evaluation conducted by a licensed mental health professional. It involves discussing your personal history, current symptoms, emotional struggles, and overall lifestyle to determine an accurate diagnosis and appropriate course of treatment.",
      },
      {
        question: "Who should get an Assessment?",
        answer:
          "Anyone experiencing persistent emotional distress, sudden mood changes, focus or attention issues, or significant behavioral shifts should consider an assessment. It is also crucial for individuals seeking a second opinion or those who require accurate diagnostic documentation.",
      },
      {
        question: "What should I expect during the process?",
        answer:
          "During your assessment, your provider will ask questions about your medical history, family dynamics, and daily stressors. We may use standardized questionnaires or psychological tests. The process is conversational, entirely confidential, and conducted at a pace that feels safe and comfortable for you.",
      },
      {
        question: "How does it guide my treatment?",
        answer:
          "The insights gathered from your assessment allow us to recommend the most effective therapeutic modalities, whether that involves individual therapy, medication management, or intensive outpatient programs. It ensures that we aren't just treating symptoms, but addressing the root causes of your distress.",
      },
    ],
  },
  {
    slug: "outpatient",
    title: "Outpatient Therapy",
    section: "Comprehensive Therapy",
    displayOrder: 1,
    isActive: true,
    showInNav: true,
    accent: "#ff5c00",
    image: "/outpatient.webp",
    intro:
      "Managing life’s challenges can feel overwhelming, especially when stress affects your work, school, or home life. At Avighna Holistic Care in Raleigh, NC, our experienced clinicians provide compassionate outpatient therapy to help you manage anxiety, depression, and stress while maintaining your daily routine. If you’re struggling, you don’t have to do it alone—contact Avighna Holistic Care today to schedule an appointment",
    qa: [
      {
        question: "What is Outpatient Therapy?",
        answer:
          "Outpatient therapy is a highly flexible mental health treatment model that allows you to receive professional counseling and psychiatric care without staying at a facility overnight. It is designed to integrate seamlessly into your everyday life, providing you with the tools and support you need while you continue with work, school, and family commitments.",
      },
      {
        question: "What are the signs you might need Outpatient Therapy?",
        answer:
          "The signs that you could benefit from outpatient therapy vary from person to person. Common indicators include persistent feelings of sadness or anxiety, difficulty managing stress, relationship conflicts, trouble concentrating, or turning to unhealthy coping mechanisms. If your mental health is negatively impacting your daily routine, outpatient therapy can provide a structured path forward.",
      },
      {
        question: "What causes the need for Outpatient Therapy?",
        answer:
          "People seek outpatient therapy for a wide variety of reasons. It may be triggered by sudden life changes, grief, workplace stress, or underlying mental health conditions like depression, anxiety, or PTSD. Additionally, unresolved childhood trauma, genetic predispositions, or ongoing medical issues can contribute to the need for consistent, professional mental health support.",
      },
      {
        question: "What are the treatments in Outpatient Therapy?",
        answer:
          "At the beginning of your visit, the team at Avighna Holistic Care will perform a comprehensive assessment to understand your unique needs. Treatment typically requires a multifaceted approach, blending evidence-based practices like Cognitive Behavioral Therapy (CBT) with person-centered counseling. Depending on your diagnosis, medication management may also be recommended to help relieve symptoms. Along with therapy, our team may recommend lifestyle adjustments—like mindfulness, exercise, and dietary changes—to support your overall well-being.",
      },
    ],
  },
  {
    slug: "school-based",
    title: "School Based Therapy",
    section: "Comprehensive Therapy",
    displayOrder: 2,
    isActive: true,
    showInNav: true,
    accent: "#14b8a6",
    image: "/schoolbased.webp",
    intro:
      "School can create intense academic and social pressure for many children and teens. At Avighna Holistic Care in Raleigh, NC, we provide compassionate school-based therapy to support students’ emotional and behavioral health, helping them manage anxiety, behavior challenges, and academic stress. If your child needs support, contact Avighna Holistic Care today to learn more about our school-based therapy services",
    qa: [
      {
        question: "What is School-Based Therapy?",
        answer:
          "School-Based Therapy is a specialized mental health service designed to support students dealing with emotional, behavioral, or psychological challenges that impact their academic life. By coordinating with educators, parents, and the student, therapists provide interventions that help children thrive in their educational environment.",
      },
      {
        question: "What are the signs a student needs School-Based Therapy?",
        answer:
          "Common signs include a sudden drop in academic performance, frequent absences, behavioral outbursts in the classroom, social withdrawal, or intense test anxiety. You might also notice the student complaining of frequent stomach aches or headaches before school, which are common physical manifestations of school-related stress.",
      },
      {
        question: "What causes school-related distress?",
        answer:
          "School distress can stem from various risk factors, including learning disabilities, bullying, social anxiety, family transitions (like divorce or moving), or underlying neurodivergent conditions like ADHD. The pressure to succeed academically and socially can act as a significant trigger for generalized anxiety or depression in adolescents.",
      },
      {
        question: "What are the treatments for students?",
        answer:
          "Treatment begins with a collaborative assessment involving the child, parents, and sometimes school staff. The team at Avighna Holistic Care utilizes age-appropriate interventions, such as play therapy for younger children and CBT for teens, to help them reframe negative thoughts and develop healthy coping mechanisms. We also focus on building social skills, emotional regulation, and self-advocacy, ensuring the student has a comprehensive support system both in and out of the classroom.",
      },
    ],
  },
  {
    slug: "holistic",
    title: "Holistic Care",
    section: "Specialized Programs",
    displayOrder: 3,
    isActive: true,
    showInNav: true,
    accent: "#ff5c00",
    image: "/holistic.webp",
    intro:
      "True healing requires looking beyond just the symptoms and treating the whole person. At Avighna Holistic Care in Raleigh, North Carolina, our signature Holistic Care program integrates mind, body, and spirit to foster deep, sustainable resilience. We understand that physical health, emotional well-being, and lifestyle are deeply connected. Our experienced team can help you uncover the root causes of your distress and guide you toward complete, balanced well-being.",
    qa: [
      {
        question: "What is Holistic Care?",
        answer:
          "Holistic care is an integrative approach to mental health that views the patient as a complete entity—mind, body, and spirit. Rather than solely focusing on a specific diagnosis or suppressing symptoms with medication alone, holistic care seeks to identify the underlying imbalances in your life, incorporating alternative and complementary therapies alongside traditional clinical practices.",
      },
      {
        question: "What are the signs you might benefit from Holistic Care?",
        answer:
          "If you feel like traditional treatments haven't fully addressed your concerns, or if you experience a mix of physical and emotional symptoms—such as chronic fatigue, unexplained pain, brain fog, alongside anxiety or depression—a holistic approach may be ideal. It is also highly beneficial for those who feel disconnected from their sense of purpose or community.",
      },
      {
        question: "What causes these systemic imbalances?",
        answer:
          "Imbalances can be caused by a combination of modern lifestyle factors. Chronic stress, poor nutrition, lack of sleep, environmental toxins, and a sedentary lifestyle can drastically impact your neurochemistry and emotional state. Trauma and unresolved emotional pain can also manifest physically, creating a cycle of distress that standard treatments may struggle to break.",
      },
      {
        question: "What are the treatments in Holistic Care?",
        answer:
          "Holistic treatment begins with a thorough examination of your physical health, lifestyle, and emotional history to rule out underlying medical conditions. The team at Avighna Holistic Care creates a deeply personalized plan that may include traditional psychotherapy alongside somatic experiencing, mindfulness meditation, nutritional counseling, and stress-reduction techniques like yoga or deep breathing exercises. By making targeted lifestyle changes and honoring the mind-body connection, we help you achieve long-lasting wellness.",
      },
    ],
  },
];
