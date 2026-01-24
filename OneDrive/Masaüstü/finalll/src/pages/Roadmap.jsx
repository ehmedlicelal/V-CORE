import React from "react";
import {
  Shield,
  Lock,
  Terminal,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

const RoadmapStep = ({
  number,
  title,
  description,
  icon: Icon,
  color,
  topics,
  align,
}) => {
  const isLeft = align === "left";

  return (
    <div
      className={`relative flex items-center justify-between md:justify-center group mb-12 sm:mb-24 ${
        isLeft ? "flex-row-reverse" : ""
      }`}
    >
      {/* Center Line Dot */}
      <div
        className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-background border-4 border-${color}-500 rounded-full items-center justify-center z-10 shadow-${color}-500/50 group-hover:scale-125 transition-transform duration-500`}
      >
        <div className={`w-3 h-3 bg-${color}-400 rounded-full`} />
      </div>

      {/* Content Card */}
      <div
        className={`w-full md:w-[48%] ${
          isLeft ? "md:pr-10" : "md:pl-12"
        }`}
      >
        <div
          className={`relative bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 group-hover:border-${color}-500/30 overflow-hidden`}
        >
          {/* Glow */}
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 blur-[60px] rounded-full group-hover:bg-${color}-500/20 transition-all`}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <span
                className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-${color}-400 to-white opacity-20`}
              >
                {number}
              </span>
              <div
                className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center text-${color}-400`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {description}
            </p>

            <div className="space-y-3">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-300"
                >
                  <CheckCircle2
                    className={`w-4 h-4 text-${color}-500/50`}
                  />
                  <span>{topic}</span>
                </div>
              ))}
            </div>

            <button
              className={`mt-8 w-full py-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 font-medium text-sm hover:bg-${color}-500/20 transition-all flex items-center justify-center gap-2`}
            >
              <BookOpen className="w-4 h-4" />
              Start Module
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-[48%]" />
    </div>
  );
};

export default function Roadmap() {
  const progress = 35;

  const steps = [
    {
      number: "01",
      title: "Security Fundamentals",
      description:
        "Build a strong foundation in networking, operating systems, and core security concepts.",
      icon: Shield,
      color: "cyan",
      topics: [
        "OSI & TCP/IP Models",
        "Linux Command Line",
        "DNS & HTTP",
        "Virtual Labs",
      ],
      align: "left",
    },
    {
      number: "02",
      title: "Offensive Operations",
      description:
        "Learn ethical hacking techniques used by red teams in real-world attacks.",
      icon: Terminal,
      color: "red",
      topics: [
        "Recon & Enumeration",
        "Vulnerability Scanning",
        "OWASP Top 10",
        "Metasploit & Burp",
      ],
      align: "right",
    },
    {
      number: "03",
      title: "Defensive Tactics",
      description:
        "Detect, analyze, and respond to attacks using blue team strategies.",
      icon: Lock,
      color: "blue",
      topics: [
        "IDS / IPS",
        "SIEM & Logs",
        "Incident Response",
        "System Hardening",
      ],
      align: "left",
    },
    {
      number: "04",
      title: "Advanced Warfare",
      description:
        "Master advanced threats, enterprise security, and cloud defense.",
      icon: CheckCircle2,
      color: "purple",
      topics: [
        "Active Directory",
        "Malware Analysis",
        "Zero Trust",
        "Cloud Security",
      ],
      align: "right",
    },
  ];

  return (
    <div className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-cyan-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-purple-500/5 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Your Learning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Roadmap
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Follow this structured path to master cybersecurity. Each stage
            builds upon the previous one.
          </p>

          {/* Overall Progress */}
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent -translate-x-1/2" />

          {steps.map((step, i) => (
            <RoadmapStep key={i} {...step} />
          ))}
        </div>
      </div>
    </div>
  );
}
