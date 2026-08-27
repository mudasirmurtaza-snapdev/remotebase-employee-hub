/* ================================================================
   All editable hub content lives here.
   You do not need to touch any HTML, CSS, or JS to add or change a
   link, a contact, or an FAQ entry - just edit the objects below.

   - Every link needs a "label" and an "href".
   - A contact with href: "#" (or any missing href) renders as a
     plain, non-clickable label. Give it a real href to turn it into
     a button.
   - Add or remove items freely - the page rebuilds itself from this
     file on load.
   ================================================================ */
const HUB_DATA = {
  categories: [
    {
      id: "policies",
      title: "Policies",
      accent: "var(--c-policies)",
      icon: "book",
      blurb: "Company policies and guidelines for working at RemoteBase.",
      links: [
        { label: "Advance Salary Loan", href: "https://docs.google.com/document/d/1D7yvXMGUV-zmL0YcwIjuaNbDLbfe11ASykgDbs4RXqk/edit?usp=sharing" },
        { label: "Wellbeing Allowance", href: "https://docs.google.com/document/d/16O5erqGDivqXLeRq9MOHExbTtSG_JR85yHxeXEde9wM/edit?usp=sharing" },
        { label: "Expense Guideline", href: "https://docs.google.com/document/d/1mHgA9_FoPZVwtqowXcWjE944-iafk6hIzFzkZp81NDg/edit?usp=sharing" },
        { label: "Harassment Policy", href: "https://docs.google.com/document/d/1MkvpSFIC_OvaF-fAPMt09nO_sD5-p3098zrROTvARGk/edit?usp=sharing" },
        { label: "Conflict of Interest - Guideline & Declaration", href: "https://docs.google.com/document/d/1466dpoz-NjlDlmhdF5yp5YWy98y7R8q4nmgxUvGIAHY/edit?usp=sharing" },
        { label: "Overtime Policy & Process", href: "https://docs.google.com/document/d/1-iGjm8qcWggCup4s4q9N5lquMpL4ZnXGNhqNma8g9FU/edit?usp=sharing" },
      ],
    },
    {
      id: "medical",
      title: "Medical Insurance",
      accent: "var(--c-medical)",
      icon: "heart",
      blurb: "Available to all full-time employees based in Pakistan.",
      links: [
        { label: "Medical Insurance Policy", href: "https://docs.google.com/document/d/1deozcwu2mSZ9pnN-V3RBlPCo_8rGGugb5NxxxcJkGZg/edit?usp=sharing" },
        { label: "Medical Insurance Plan", href: "https://docs.google.com/document/d/1FxAYyoJSlz88jve7_fI1-TvVY-506EgCOyhAQfo8Uzw/edit?usp=sharing" },
        { label: "Medical Claim Process", href: "https://docs.google.com/document/d/1kmj8XiRrTDIv_3r7j-u5Mr9ZxRBz43_KL2n7QQv9EjE/edit?usp=sharing" },
      ],
    },
    {
      id: "timeoff",
      title: "Time Off",
      accent: "var(--c-timeoff)",
      icon: "sun",
      blurb: "Apply under the Time Off section of your Workable profile.",
      links: [
        { label: "Annual Paid Time Off", href: "https://docs.google.com/document/d/1sLVxJps6-VqqY-ljl7Ht1j5fuoC2Y_wSaSLYH0qSMNo/edit?usp=sharing" },
        { label: "Marriage Leave", href: "https://docs.google.com/document/d/1QYsT_0wX_NAnRO_7W9SkSfvhmMGPFwJA7b_GzZOtY3M/edit?usp=sharing" },
        { label: "New Baby Leave", href: "https://docs.google.com/document/d/1hZPeagpt3UX-v21XIsmTyGiJiVLN0aK6xFNp3OYRRX0/edit?usp=sharing" },
        { label: "Public Holiday", href: "https://docs.google.com/document/d/1NCAzTJopWk0ajG3ZP7wCEPHXK8iO7TWKcGXWYFsMd2A/edit?usp=sharing" },
        { label: "Sick Leave", href: "https://docs.google.com/document/d/1X82C2bwKGo4WBnmNrvv_am2Gy9--Pw5AbU3_VgSKcUs/edit?usp=sharing" },
      ],
    },
    {
      id: "performance",
      title: "Performance",
      accent: "var(--c-performance)",
      icon: "chart",
      blurb: "High-Agency Values guide the January increment and July bonus cycles.",
      links: [
        { label: "High Agency Performance Review Handbook", href: "https://docs.google.com/presentation/d/1Py8rthl9WfeJ4DV4IzPjS_OV_9mHkJk8T332wvGmPOs/edit?usp=sharing" },
        { label: "Increment / Bonus Tiers Overview", href: "https://docs.google.com/document/d/1hEGIzdLGCZ5gw735beZbwN0pOX7f5vj9NLlFYP7GD50/edit?usp=sharing" },
        { label: "High Agency Values", href: "https://docs.google.com/document/d/1i3X3sOJScGc2mFngB_BiSZqc3boij3AxPdWzvISIEHU/edit?usp=sharing" },
      ],
    },
    {
      id: "people",
      title: "People & Contacts",
      accent: "var(--c-people)",
      icon: "users",
      blurb: "Key directories and who owns what across the company.",
      links: [
        { label: "Important Contacts", href: "https://docs.google.com/document/d/170TP3s32F5hgogwpd71gN_EmlF1E-PGnVeTjcaoCHCc/edit?usp=sharing" },
      ],
    },
    {
      id: "it",
      title: "IT / Equipment",
      accent: "var(--c-it)",
      icon: "laptop",
      blurb: "Laptop or equipment help - open a support case with the People Team.",
      links: [
        { label: "Equipment Support & Laptop Replacement / Return Process", href: "https://docs.google.com/document/d/1Il8qaKFsdNjalCb2J8t0YKBKkX4zqGqF-mSxC6UQJM8/edit?usp=sharing" },
      ],
    },
  ],

  /* Quick chips under the search bar. "label" is what shows on the button;
     "query" is the term it actually searches for - it must appear somewhere
     in a link label, category title, or blurb, or the chip will always show
     "Nothing matches that yet". Search matches on the literal query string,
     so keep queries short and check they hit something before adding one. */
  chips: [
    { label: "Apply for leave", query: "leave" },
    { label: "Claim overtime", query: "overtime" },
    { label: "Insurance", query: "insurance" },
    { label: "Employment letter", query: "people" },
    { label: "Laptop issue", query: "laptop" },
  ],

  /* A contact with href: "#" renders as a plain label (message/DM them directly).
     Give it a real href (mailto:, Slack deep link, etc.) to turn it into a clickable button. */
  contacts: [
    {
      name: "People Team",
      who: "HR, benefits, onboarding & offboarding",
      handles: ["Leave / HR queries", "Benefits & allowances", "Employment letters", "Onboarding & joining", "Company tools & access"],
      cta: "Message People Team",
      href: "#",
    },
    {
      name: "Finance Team",
      who: "Payroll & money matters",
      handles: ["Payroll & salary", "Expense & reimbursements", "Final settlement"],
      cta: "Message Finance Team",
      href: "#",
    },
    {
      name: "Your Manager",
      who: "Ask directly / DM",
      handles: ["Performance & goals", "Work schedule / shifts", "Client & project concerns", "Team / role concerns"],
      cta: "DM your manager",
      href: "#",
    },
    {
      name: "Talent Acquisition",
      who: "Hiring & referrals",
      handles: ["Recruitment & hiring", "Referrals"],
      cta: "Message Talent Team",
      href: "#",
    },
    {
      name: "Office Admin",
      who: "Equipment & IT logistics",
      handles: ["Laptop / equipment", "IT support cases"],
      cta: "Message Office Admin",
      href: "#",
    },
  ],

  faq: [
    { q: "How do I apply for leave?", a: "Submit your leave request through your profile on Workable, under the Time Off section." },
    { q: "Who should I contact about my salary?", a: "For payroll and salary questions, contact the Finance Team." },
    { q: "What should I do if my laptop isn't working?", a: "Contact the People Team to open an equipment support case." },
    { q: "How do I request an employment letter?", a: "Request an Employment Document from the People Team via email or Slack." },
    { q: "How do I access company policies?", a: "All current policies live in the Policies station above." },
    { q: "How do I apply for and claim overtime?", a: "See the Overtime Policy & Process in the Policies station for how to apply and claim." },
  ],

  emails: ["people@remotebase.com", "adil.paracha@remotebase.com", "maria.rehman@remotebase.com"],
};
