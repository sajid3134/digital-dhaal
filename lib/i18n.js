// Tiny bilingual dictionary — no library needed. The language lives in a
// dd_lang cookie ("bn" default, "en" optional) so server components can
// render the right strings on first paint.

export function getLang(cookieStore) {
  return cookieStore.get("dd_lang")?.value === "en" ? "en" : "bn";
}

export const STRINGS = {
  bn: {
    nav: {
      how: "কীভাবে কাজ করে",
      resources: "আইন ও করণীয়",
      about: "আমাদের কথা",
      contact: "যোগাযোগ",
      support: "সাপোর্ট করুন",
      login: "লগইন",
      backToChat: "চ্যাটে ফিরুন",
    },
    hero: {
      badge: "সম্পূর্ণ গোপনীয় · এখন ফ্রি",
      title1: "সাইবার বিপদে,",
      title2: "আপনার পাশে।",
      subtitle:
        "অ্যাকাউন্ট হ্যাক, ছবি নিয়ে ব্ল্যাকমেইল বা ভুয়া প্রোফাইল — লজ্জা বা ভয় না পেয়ে বলুন। বাংলায়, গোপনে, মানুষের সাহায্যে সমাধান।",
      cta: "সাহায্য নিন — এখনই",
      ctaSecondary: "কীভাবে কাজ করে?",
      never: "আমরা কখনোই পাসওয়ার্ড, OTP বা ছবি চাই না।",
      mockUser: "vai amar fb hack hoise, help lagbe",
      mockAgent: "চিন্তা করবেন না, আপনি নিরাপদ জায়গায় এসেছেন। ধীরে ধীরে বলুন কী হয়েছে —",
      stats: ["২৪/৭ গোপনীয় চ্যাট", "শুরুতে সম্পূর্ণ ফ্রি", "মানব ইঞ্জিনিয়ার সমাধান করেন"],
    },
    pillars: {
      heading: "যে তিনটি বিপদে আমরা পাশে আছি",
      items: [
        {
          icon: "🔓",
          title: "অ্যাকাউন্ট হ্যাক",
          text: "ফেসবুক, জিমেইল, ইনস্টাগ্রাম বা স্ন্যাপচ্যাট হ্যাক হলে দ্রুত উদ্ধারে সাহায্য।",
        },
        {
          icon: "🛡️",
          title: "ছবি নিয়ে ব্ল্যাকমেইল",
          text: "ব্যক্তিগত ছবি বা ডিপফেক ছড়ানোর হুমকি? ছবি আপনার ফোন থেকে বাইরে না পাঠিয়েই ব্যবস্থা।",
        },
        {
          icon: "👥",
          title: "ভুয়া প্রোফাইল",
          text: "আপনার নামে ভুয়া অ্যাকাউন্ট খুলে প্রতারণা করছে কেউ? রিপোর্ট ও অপসারণে সাহায্য।",
        },
      ],
    },
    how: {
      heading: "কীভাবে কাজ করে",
      steps: [
        ["চ্যাটে বলুন", "যা ঘটেছে নিজের ভাষায় বলুন — বাংলা, বাংলিশ বা ইংরেজি।"],
        ["কেস তৈরি হয়", "আপনার তথ্য থেকে স্বয়ংক্রিয়ভাবে গোপনীয় কেস ফাইল তৈরি হয়।"],
        ["পরিচয় যাচাই", "ছোট্ট একটি ভিডিও কলে পরিচয় নিশ্চিত করা হয় — ভুয়া রিপোর্ট ঠেকাতে।"],
        ["ইঞ্জিনিয়ার সমাধান করেন", "একজন মানব বিশেষজ্ঞ আপনার সাথে থেকে সমস্যার সমাধান করেন।"],
      ],
    },
    resources: {
      heading: "হ্যাক, স্ক্যাম বা হয়রানি হলে — আইন কী বলে, কী করবেন",
      sub: "বাংলাদেশে সাইবার অপরাধের বিরুদ্ধে আপনার আইনি অধিকার আছে। জেনে রাখুন।",
      cards: [
        {
          icon: "🔓",
          title: "হ্যাক হলে",
          todo: "পাসওয়ার্ড বদলান, প্রমাণ (স্ক্রিনশট) রাখুন, কিছু ডিলিট করবেন না, দ্রুত রিপোর্ট করুন।",
          law: "সাইবার নিরাপত্তা আইন ২০২৩ অনুযায়ী অবৈধ প্রবেশ/হ্যাকিংয়ে জেল-জরিমানা, গুরুত্বপূর্ণ ক্ষেত্রে ১৪ বছর পর্যন্ত কারাদণ্ড হতে পারে।",
        },
        {
          icon: "💸",
          title: "স্ক্যাম / প্রতারণা হলে",
          todo: "লেনদেনের প্রমাণ ও চ্যাট সংরক্ষণ করুন, নম্বর ব্লক করবেন না (প্রমাণ), ব্যাংক/বিকাশকে জানান।",
          law: "ডিজিটাল প্রতারণায় সাইবার নিরাপত্তা আইন ও দণ্ডবিধি ৪২০ ধারায় কয়েক বছর পর্যন্ত জেল ও জরিমানার বিধান আছে।",
        },
        {
          icon: "🚫",
          title: "বুলিং / ছবি ছড়ানো হলে",
          todo: "কনটেন্টের লিংক ও স্ক্রিনশট রাখুন, ব্ল্যাকমেইলারকে টাকা দেবেন না, বিশ্বস্ত কাউকে জানান।",
          law: "পর্নোগ্রাফি নিয়ন্ত্রণ আইন ২০১২-তে ৭ বছর পর্যন্ত কারাদণ্ড; অনলাইন হয়রানি ও মানহানিকর কনটেন্টেও জেল-জরিমানা হয়।",
        },
      ],
      lawNote: "⚖️ এগুলো সাধারণ তথ্য, আইনি পরামর্শ নয়। মামলার জন্য আইনজীবী বা থানার সাহায্য নিন।",
      contactHeading: "সরকারি সাহায্য — কোথায় অভিযোগ করবেন",
      table: [
        ["জাতীয় জরুরি সেবা", "যেকোনো জরুরি বিপদ", "৯৯৯ (ফ্রি)"],
        ["পুলিশ সাইবার সাপোর্ট ফর উইমেন", "নারীদের সাইবার হয়রানি", "01320-000888"],
        ["সিআইডি সাইবার পুলিশ সেন্টার", "হ্যাকিং, অনলাইন প্রতারণা", "cyber@police.gov.bd"],
        ["চাইল্ড হেল্পলাইন", "শিশু-কিশোরদের সুরক্ষা", "১০৯৮ (ফ্রি)"],
        ["সরকারি তথ্য ও সেবা", "সাধারণ দিকনির্দেশনা", "৩৩৩"],
      ],
      tableHead: ["সংস্থা", "যে কাজে", "যোগাযোগ"],
    },
    about: {
      heading: "আমাদের কথা",
      text: "ডিজিটাল ঢাল একটি স্বেচ্ছাসেবী উদ্যোগ। আমরা বিশ্বাস করি — সাইবার বিপদে পড়া মানুষের দরকার ভয়ভীতিহীন, লজ্জাহীন, নিজের ভাষায় সাহায্য। তাই আমাদের সবকিছু বাংলা-ফার্স্ট, গোপনীয়তা-ফার্স্ট। AI দ্রুত তথ্য গুছিয়ে দেয়, কিন্তু সিদ্ধান্ত নেন ও সমাধান করেন একজন মানুষ — প্রশিক্ষিত ইঞ্জিনিয়ার।",
    },
    contact: {
      heading: "যোগাযোগ",
      text: "যেকোনো প্রশ্ন, পরামর্শ বা সহযোগিতার জন্য লিখুন:",
      emailLabel: "ইমেইল",
    },
    promise: {
      heading: "আমাদের প্রতিশ্রুতি",
      items: [
        "পাসওয়ার্ড, OTP বা PIN কখনো চাওয়া হবে না",
        "কোনো ছবি বা ভিডিও পাঠাতে বলা হবে না",
        "আপনার তথ্য শুধু নিযুক্ত ইঞ্জিনিয়ার দেখেন",
        "কাজ শুরুর আগে কোনো টাকা নয় — এখন সবকিছু ফ্রি",
      ],
    },
    footer: {
      tagline: "বাংলা-ফার্স্ট সাইবার ইনসিডেন্ট রেসপন্স",
      quick: "লিংক",
      emergency: "জরুরি হেল্পলাইন",
      emergencyLines: ["জাতীয় জরুরি সেবা: ৯৯৯", "চাইল্ড হেল্পলাইন: ১০৯৮", "মানসিক সহায়তা: কান পেতে রই"],
      disclaimer:
        "জীবন-হুমকির পরিস্থিতিতে আগে ৯৯৯-এ কল করুন। Digital Dhaal জরুরি সেবার বিকল্প নয়।",
    },
  },

  en: {
    nav: {
      how: "How it works",
      resources: "Laws & help",
      about: "About us",
      contact: "Contact",
      support: "Support us",
      login: "Log in",
      backToChat: "Back to chat",
    },
    hero: {
      badge: "Fully confidential · Free for now",
      title1: "In cyber danger,",
      title2: "we stand with you.",
      subtitle:
        "Hacked account, image blackmail, or a fake profile — speak up without shame or fear. Help in Bangla, in private, resolved by real humans.",
      cta: "Get help — now",
      ctaSecondary: "How does it work?",
      never: "We will NEVER ask for your password, OTP, or photos.",
      mockUser: "bro my fb got hacked, need help",
      mockAgent: "Don't worry — you're in a safe place. Take your time and tell me what happened —",
      stats: ["24/7 confidential chat", "Completely free to start", "Human engineers resolve it"],
    },
    pillars: {
      heading: "Three dangers we protect you from",
      items: [
        {
          icon: "🔓",
          title: "Account takeover",
          text: "Facebook, Gmail, Instagram, or Snapchat hacked? We help you recover it fast.",
        },
        {
          icon: "🛡️",
          title: "Image blackmail",
          text: "Threats to spread private photos or deepfakes? Action without your images ever leaving your phone.",
        },
        {
          icon: "👥",
          title: "Fake profiles",
          text: "Someone impersonating you to scam people? We help report and take it down.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        ["Tell us in chat", "Describe what happened in your own words — Bangla, Banglish, or English."],
        ["A case is created", "A confidential case file is built automatically from your story."],
        ["Identity check", "A short video call verifies you — this blocks fake reports."],
        ["An engineer resolves it", "A trained human expert works with you until it's fixed."],
      ],
    },
    resources: {
      heading: "Hacked, scammed, or harassed — the law and what to do",
      sub: "You have legal rights against cybercrime in Bangladesh. Know them.",
      cards: [
        {
          icon: "🔓",
          title: "If you're hacked",
          todo: "Change passwords, keep evidence (screenshots), delete nothing, report fast.",
          law: "Under the Cyber Security Act 2023, unauthorized access carries jail and fines — up to 14 years for critical systems.",
        },
        {
          icon: "💸",
          title: "If you're scammed",
          todo: "Save transaction proof and chats, don't block the number (evidence), notify your bank/bKash.",
          law: "Digital fraud is punishable with years of imprisonment under the Cyber Security Act and Penal Code s.420.",
        },
        {
          icon: "🚫",
          title: "If bullied / images leaked",
          todo: "Keep links and screenshots, never pay blackmailers, tell someone you trust.",
          law: "The Pornography Control Act 2012 carries up to 7 years in prison; online harassment and defamation are also punishable.",
        },
      ],
      lawNote: "⚖️ General information only, not legal advice. Consult a lawyer or your local police station for a case.",
      contactHeading: "Government help — where to complain",
      table: [
        ["National Emergency Service", "Any urgent danger", "999 (free)"],
        ["Police Cyber Support for Women", "Cyber harassment of women", "01320-000888"],
        ["CID Cyber Police Centre", "Hacking, online fraud", "cyber@police.gov.bd"],
        ["Child Helpline", "Protection of minors", "1098 (free)"],
        ["Govt Info & Services", "General guidance", "333"],
      ],
      tableHead: ["Organization", "For", "Contact"],
    },
    about: {
      heading: "About us",
      text: "Digital Dhaal is a volunteer initiative. We believe people facing cyber threats deserve help without fear, without shame, in their own language. Everything we build is Bangla-first and privacy-first. AI organizes the facts quickly — but a trained human engineer makes the decisions and solves the problem.",
    },
    contact: {
      heading: "Contact",
      text: "Questions, suggestions, or want to collaborate? Write to us:",
      emailLabel: "Email",
    },
    promise: {
      heading: "Our promise",
      items: [
        "We never ask for passwords, OTPs, or PINs",
        "We never ask you to send photos or videos",
        "Only your assigned engineer sees your case",
        "No money before work starts — everything is free right now",
      ],
    },
    footer: {
      tagline: "Bangla-first cyber incident response",
      quick: "Links",
      emergency: "Emergency helplines",
      emergencyLines: ["National emergency: 999", "Child helpline: 1098", "Emotional support: Kaan Pete Roi"],
      disclaimer:
        "In life-threatening situations call 999 first. Digital Dhaal is not a substitute for emergency services.",
    },
  },
};
