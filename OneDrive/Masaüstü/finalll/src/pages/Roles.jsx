import React from 'react';
import { Sword, Shield, Activity, Target, Zap } from 'lucide-react';

const colorVariants = {
  red: {
    bgGlow: "bg-red-500/20 group-hover:bg-red-500/30",
    bgGlowBottom: "bg-red-500/10 group-hover:bg-red-500/20",
    iconBox: "bg-red-500/10 border-red-500/20 group-hover:border-red-500/50 shadow-red-500/5",
    icon: "text-red-400",
    badge: "text-red-400",
    skill: "bg-red-500/5 border-red-500/10 group-hover:bg-red-500/10 group-hover:border-red-500/30 text-gray-300"
  },
  blue: {
    bgGlow: "bg-blue-500/20 group-hover:bg-blue-500/30",
    bgGlowBottom: "bg-blue-500/10 group-hover:bg-blue-500/20",
    iconBox: "bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/50 shadow-blue-500/5",
    icon: "text-blue-400",
    badge: "text-blue-400",
    skill: "bg-blue-500/5 border-blue-500/10 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 text-gray-300"
  },
  purple: {
    bgGlow: "bg-purple-500/20 group-hover:bg-purple-500/30",
    bgGlowBottom: "bg-purple-500/10 group-hover:bg-purple-500/20",
    iconBox: "bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/50 shadow-purple-500/5",
    icon: "text-purple-400",
    badge: "text-purple-400",
    skill: "bg-purple-500/5 border-purple-500/10 group-hover:bg-purple-500/10 group-hover:border-purple-500/30 text-gray-300"
  }
};

const RoleCard = ({ title, desc, icon: Icon, color, skills, delay }) => {
  const styles = colorVariants[color] || colorVariants.red;

  return (
    <div 
      className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient Background Glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[80px] rounded-full transition-all duration-500 ${styles.bgGlow}`}></div>
      <div className={`absolute -bottom-20 -left-20 w-40 h-40 blur-[80px] rounded-full transition-all duration-500 ${styles.bgGlowBottom}`}></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border shadow-lg ${styles.iconBox}`}>
          <Icon className={`h-8 w-8 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] ${styles.icon}`} />
        </div>
        
        <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-white group-hover:to-white transition-all">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-8 leading-relaxed flex-grow group-hover:text-gray-300 transition-colors">
          {desc}
        </p>
        
        <div>
          <span className={`text-xs font-bold uppercase tracking-widest mb-4 block opacity-80 ${styles.badge}`}>
            Key Competencies
          </span>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span 
                key={i} 
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${styles.skill}`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Roles() {
  const roles = [
    {
      title: "Red Team",
      desc: "Offensive security experts who simulate sophisticated cyberattacks to test organizational defenses.",
      icon: Sword,
      color: "red",
      skills: ["Penetration Testing", "Social Engineering", "Exploit Development", "C2 Infrastructure"],
      delay: 100
    },
    {
      title: "Blue Team",
      desc: "Defensive specialists who monitor, detect, and respond to cyber threats in real-time.",
      icon: Shield,
      color: "blue",
      skills: ["Incident Response", "SIEM & SOAR", "Threat Hunting", "Digital Forensics"],
      delay: 200
    },
    {
      title: "Purple Team",
      desc: "The bridge between offense and defense. They facilitate collaboration to maximize effectiveness.",
      icon: Activity,
      color: "purple",
      skills: ["Adversary Emulation", "Security Architecture", "Communication", "Breach Simulation"],
      delay: 300
    }
  ];

  return (
    <div className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-20 right-[10%] w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">Career Pathways</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Cybersecurity Role</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Whether you want to break, defend, or optimize, there's a specialized path waiting for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pb-16">
          {roles.map((role, index) => (
            <RoleCard key={index} {...role} />
          ))}
        </div>
      </div>
    </div>
  );
}
