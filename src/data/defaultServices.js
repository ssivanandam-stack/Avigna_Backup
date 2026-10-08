/**
 * Default services matching the current public site / navbar.
 * Used to seed the DB when empty so existing content is preserved.
 */
export const DEFAULT_SERVICES = [
  {
    slug: "assessment",
    title: "Clinical Assessment",
    section: "Comprehensive Therapy",
    templateType: "specialized",
    displayOrder: 0,
    isActive: true,
    showInNav: true,
    accent: "#14b8a6",
    image: "/image/image3.webp",
    intro:
      "At Avighna Holistic Care, our Clinical Assessment services provide the clarity you need to move forward with confidence. Our licensed clinicians take a thorough, personalized approach — going beyond symptom checklists to understand the full picture of your mental health. If you're struggling, you don't have to do it alone — contact Avighna Holistic Care today to schedule an appointment.",
    specializedHeading: "Specialized Programs",
    specializedIntro:
      "Targeted evaluations and documentation services for ADHD and emotional support animals — available now.",
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
    programs: [
      {
        tabName: "ADHD Assessment",
        title: "ADHD Assessments",
        icon: "brain",
        accentColor: "#ff5c00",
        about:
          "Difficulty with focus, organization, impulsivity, forgetfulness, or follow-through can affect school, work, and daily life. An ADHD assessment can help clarify whether these symptoms are related to ADHD or another concern such as anxiety, depression, trauma, sleep issues, or learning challenges.\n\nAt Avighna Holistic Care, our ADHD assessments are designed to provide a clear, thoughtful evaluation rather than relying on a checklist alone. We review symptoms, history, functioning across settings, and other factors that may affect attention so we can make accurate recommendations for treatment, support, and next steps.",
        whoItHelps: [
          "Children and teens struggling with attention, school performance, impulsivity, or behavior.",
          "Adults dealing with chronic distractibility, disorganization, procrastination, time management problems, or workplace difficulties.",
          "Individuals who want diagnostic clarification before starting treatment or requesting school or workplace support.",
        ],
        whatsIncluded: [
          "Comprehensive clinical interview",
          "Review of symptoms at home, school, work, and daily life",
          "Standardized rating scales and screening tools",
          "Review of emotional, behavioral, academic, and medical history",
          "Diagnostic impressions and treatment recommendations",
          "Written documentation or report, if needed",
        ],
        pricing: [
          {
            label: "ADHD diagnostic consultation / screening visit",
            price: "$225–$300",
            note: "self-pay",
          },
          {
            label: "Comprehensive ADHD assessment with written report",
            price: "$650–$900",
            note: "self-pay",
          },
          {
            label: "School/work accommodation letter add-on",
            price: "$75–$150",
            note: "self-pay",
          },
        ],
        image: "/image/image23.webp",
        qa: [
          {
            question: "What does an ADHD assessment include?",
            answer:
              "Our ADHD assessments include a comprehensive clinical interview, review of symptoms across settings, standardized rating scales, history review, diagnostic impressions, and written documentation when needed.",
          },
          {
            question: "Is the ADHD assessment only for children?",
            answer:
              "No. We evaluate children, teens, and adults who struggle with attention, organization, impulsivity, or related concerns at school, work, or in daily life.",
          },
        ],
        ctaLabel: "Schedule an Evaluation",
        ctaUrl: "/contact",
        displayOrder: 0,
        isActive: true,
      },
      {
        tabName: "Animal Support",
        title: "Emotional Support Animal Letters",
        icon: "heart",
        accentColor: "#14b8a6",
        about:
          "For some individuals living with anxiety, depression, PTSD, or other mental health conditions, an emotional support animal may provide comfort and help reduce the impact of symptoms in daily life.\n\nAt Avighna Holistic Care, we offer emotional support animal evaluations in Raleigh, NC to determine whether an Emotional Support Animal (ESA) is clinically appropriate based on your mental health needs and treatment history.\n\nAn ESA letter is not automatic and is only provided when a licensed clinician determines that it is medically appropriate. Our evaluation process is designed to meet ethical and housing-related documentation standards by assessing your symptoms, level of impairment, and the therapeutic role the animal serves.",
        whoItHelps: [
          "Individuals with anxiety, depression, trauma-related symptoms, or other qualifying mental health concerns.",
          "Current or prospective housing tenants requesting a reasonable accommodation for an emotional support animal.",
          "Patients seeking evaluation from a licensed mental health professional who can assess whether ESA documentation is appropriate.",
        ],
        whatsIncluded: [
          "Clinical evaluation with a licensed mental health provider",
          "Review of symptoms, diagnosis, and current functioning",
          "Discussion of housing-related need and whether an ESA is clinically appropriate",
          "Written ESA letter when supported by the evaluation",
          "Guidance on documentation for housing accommodation requests",
        ],
        pricing: [
          {
            label: "ESA evaluation with letter, if clinically appropriate",
            price: "$200–$275",
            note: "self-pay",
          },
          {
            label: "Follow-up renewal or updated letter",
            price: "$75–$150",
            note: "self-pay",
          },
        ],
        image: "/image/image22.webp",
        qa: [
          {
            question: "Is an ESA letter guaranteed?",
            answer:
              "No. An ESA letter is only provided when a licensed clinician determines it is clinically appropriate based on your evaluation.",
          },
          {
            question: "Who can request an ESA evaluation?",
            answer:
              "Individuals with qualifying mental health concerns who may need housing-related documentation for an emotional support animal can request an evaluation.",
          },
        ],
        ctaLabel: "Schedule an Evaluation",
        ctaUrl: "/contact",
        displayOrder: 1,
        isActive: true,
      },
    ],
  },
  {
    slug: "outpatient",
    title: "Outpatient Therapy",
    section: "Comprehensive Therapy",
    templateType: "standard",
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
    templateType: "standard",
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
    templateType: "standard",
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
