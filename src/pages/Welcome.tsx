
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckSquare, Calendar, BarChart, ChevronRight, ArrowRight, Users, Sparkles } from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const Welcome: React.FC = () => {
  // Refs for scroll-based animations
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Fix the TypeScript errors by removing the threshold option
  const featuresInView = useInView(featuresRef, { once: true });
  const howItWorksInView = useInView(howItWorksRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });
  
  // Parallax effect for the hero section
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.5]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };
  
  // Feature cards with hover effects
  const FeatureCard = ({ icon: Icon, title, color, description }) => (
    <motion.div 
      variants={cardVariants}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      <Card className={`h-full hover:shadow-xl transition-all duration-300 border-t-4 border-t-${color} hover:-translate-y-1 overflow-hidden group`}>
        <CardHeader className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500" />
          <div className={`rounded-full bg-${color}/10 p-3 w-fit mb-4 relative z-10`}>
            <Icon className={`h-8 w-8 text-${color}`} />
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="relative z-10">
            {title === "Effortless Attendance Tracking" && 
              "Our intuitive system makes it easy to record and monitor attendance across multiple subjects. Get a clear view of attendance patterns with minimal effort."}
            {title === "Subject Management" && 
              "Create and manage subjects, set schedules, and keep track of important course details all within a clean, organized interface."}
            {title === "Insightful Analytics" && 
              "Transform raw attendance data into meaningful insights with our analytics dashboard. Monitor participation rates and identify attendance patterns at a glance."}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col overflow-hidden">
      {/* Hero Section with enhanced animations and parallax effect */}
      <motion.div 
        className="container mx-auto px-4 py-16 flex flex-col items-center text-center relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <motion.div 
          className="flex items-center gap-2 mb-6"
          variants={itemVariants}
        >
          <Calendar className="h-12 w-12 text-primary animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            AttendancePal
          </h1>
        </motion.div>
        
        <motion.h2 
          className="text-2xl md:text-4xl font-semibold mb-4 relative"
          variants={itemVariants}
        >
          <span className="relative">
            Simplify Your Attendance Tracking
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-400 rounded-full"></span>
          </span>
        </motion.h2>
        
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
          variants={itemVariants}
        >
          The all-in-one platform for educators and students to manage attendance 
          records, track subjects, and improve classroom participation.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          variants={itemVariants}
        >
          <Button asChild size="lg" className="gap-2 text-lg group relative overflow-hidden">
            <Link to="/login">
              Get Started
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 text-lg hover:bg-secondary/50 transition-all duration-300">
            <Link to="/signup">
              Create Account
              <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
        
        {/* Floating particles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i}
              className={`absolute rounded-full bg-primary/20 ${i % 2 === 0 ? 'w-8 h-8' : 'w-12 h-12'}`}
              initial={{ 
                x: Math.random() * 100 - 50 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0.3
              }}
              animate={{ 
                x: [Math.random() * 100 - 50 + "%", Math.random() * 100 - 50 + "%"],
                y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 10 + i * 5, 
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Features Section with improved card designs and animations */}
      <div 
        className="container mx-auto px-4 py-12" 
        ref={featuresRef}
      >
        <motion.h2 
          className="text-3xl font-semibold text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Key Features
        </motion.h2>
        
        <motion.div
          className="w-20 h-1 bg-gradient-to-r from-primary to-purple-400 mx-auto mb-10 rounded-full"
          initial={{ width: 0 }}
          animate={featuresInView ? { width: 80 } : { width: 0 }}
          transition={{ duration: 0.8 }}
        />
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <FeatureCard 
            icon={CheckSquare} 
            title="Effortless Attendance Tracking" 
            color="primary" 
            description="Mark attendance with a simple click, no more paper registers" 
          />

          <FeatureCard 
            icon={BookOpen} 
            title="Subject Management" 
            color="purple-500" 
            description="Organize all your classes and courses in one place" 
          />

          <FeatureCard 
            icon={BarChart} 
            title="Insightful Analytics" 
            color="indigo-500" 
            description="Visualize attendance data to identify trends" 
          />
        </motion.div>
      </div>

      {/* Simplified "How It Works" Section - removed hover cards and learn more buttons */}
      <motion.div 
        className="container mx-auto px-4 py-20 my-8"
        ref={howItWorksRef}
        style={{ opacity: howItWorksInView ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <div className="relative bg-gradient-to-br from-secondary/30 via-primary/10 to-purple-500/10 rounded-3xl p-10 shadow-xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-56 h-56 bg-primary/20 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
          </div>
          
          <motion.div 
            className="text-center mb-16 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-block"
              initial={{ rotate: -5 }}
              animate={howItWorksInView ? { rotate: 0 } : { rotate: -5 }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <Badge className="mb-4 px-3 py-1 text-base bg-primary/20 hover:bg-primary/30 border-primary/10">
                <Sparkles className="mr-1 h-4 w-4" /> Simple Process
              </Badge>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with AttendancePal in three simple steps
            </p>
          </motion.div>
          
          {/* Steps with simplified designs - removed hover cards and learn more buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Connecting elements for desktop */}
            <div className="absolute top-1/2 left-[25%] right-[25%] h-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full hidden md:block"></div>
            <div className="absolute top-1/2 left-[50%] right-[0%] h-1 bg-gradient-to-r from-purple-500/30 to-primary/30 rounded-full hidden md:block"></div>
            
            {[
              { 
                num: 1, 
                title: "Sign Up", 
                desc: "Create your account in seconds and set up your profile.",
                icon: Users,
                color: "from-primary/70 to-primary/30" 
              },
              { 
                num: 2, 
                title: "Add Subjects", 
                desc: "Create your subjects with schedules and important details.",
                icon: BookOpen,
                color: "from-purple-500/70 to-purple-500/30" 
              },
              { 
                num: 3, 
                title: "Track Attendance", 
                desc: "Start recording attendance and monitoring participation rates.",
                icon: CheckSquare,
                color: "from-indigo-500/70 to-indigo-500/30" 
              }
            ].map((step, i) => (
              <motion.div 
                className="flex flex-col items-center text-center relative"
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br border border-white/10 shadow-lg flex items-center justify-center text-2xl font-bold mb-6 cursor-pointer relative z-20"
                  style={{ 
                    background: `linear-gradient(135deg, ${step.num === 1 ? 'var(--primary)' : step.num === 2 ? '#9061F9' : '#6366F1'} 0%, transparent 100%)`,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                    rotateY: 15,
                    rotateX: -15
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <step.icon className="h-8 w-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-primary text-sm flex items-center justify-center font-bold shadow-md">
                    {step.num}
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Enhanced CTA Section with animation and glassmorphism effect */}
      <motion.div 
        className="container mx-auto px-4 py-12 mb-12 text-center"
        ref={ctaRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={ctaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative bg-gradient-to-br from-primary/10 to-purple-600/20 p-10 rounded-3xl shadow-lg overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={ctaInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-8 md:mb-6 text-muted-foreground">Join the educators who have already simplified their attendance tracking process.</p>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button asChild size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 group">
                  <Link to="/signup">
                    Start For Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Simplified Footer - removed navigation links */}
      <footer className="mt-auto py-8 border-t bg-gradient-to-t from-secondary/30 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold text-primary">AttendancePal</h3>
            </div>
            <p className="text-center text-muted-foreground max-w-md">
              Making attendance tracking simpler, faster, and more reliable for educators everywhere.
            </p>
          </div>
          
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 transition-colors duration-200">Students</Badge>
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 transition-colors duration-200">Teachers</Badge>
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 transition-colors duration-200">Schools</Badge>
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 transition-colors duration-200">Universities</Badge>
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 transition-colors duration-200">Training Centers</Badge>
          </div>
          
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 AttendancePal. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="https://mehbinamal.github.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                Meet the Creator
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
