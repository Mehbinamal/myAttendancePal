
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckSquare, Calendar, BarChart, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Welcome: React.FC = () => {
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col overflow-hidden">
      {/* Hero Section with enhanced animations */}
      <motion.div 
        className="container mx-auto px-4 py-16 flex flex-col items-center text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
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
      </motion.div>

      {/* Features Section with card animations */}
      <div className="container mx-auto px-4 py-12">
        <motion.h2 
          className="text-3xl font-semibold text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Key Features
        </motion.h2>
        
        <motion.div
          className="w-20 h-1 bg-gradient-to-r from-primary to-purple-400 mx-auto mb-10 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          viewport={{ once: true }}
        >
          <motion.div variants={cardVariants}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary hover:-translate-y-1">
              <CardHeader>
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  <CheckSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Effortless Attendance Tracking</CardTitle>
                <CardDescription>
                  Mark attendance with a simple click, no more paper registers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our intuitive system makes it easy to record and monitor attendance across multiple subjects.
                  Get a clear view of attendance patterns with minimal effort.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-t-4 border-t-purple-500 hover:-translate-y-1">
              <CardHeader>
                <div className="rounded-full bg-purple-500/10 p-3 w-fit mb-4">
                  <BookOpen className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle>Subject Management</CardTitle>
                <CardDescription>
                  Organize all your classes and courses in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Create and manage subjects, set schedules, and keep track of important course details
                  all within a clean, organized interface.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-t-4 border-t-indigo-500 hover:-translate-y-1">
              <CardHeader>
                <div className="rounded-full bg-indigo-500/10 p-3 w-fit mb-4">
                  <BarChart className="h-8 w-8 text-indigo-500" />
                </div>
                <CardTitle>Insightful Analytics</CardTitle>
                <CardDescription>
                  Visualize attendance data to identify trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Transform raw attendance data into meaningful insights with our analytics dashboard.
                  Monitor participation rates and identify attendance patterns at a glance.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* How It Works Section with animated steps */}
      <motion.div 
        className="container mx-auto px-4 py-12 my-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-secondary/50 to-primary/10 rounded-2xl p-8 shadow-lg">
          <motion.h2 
            className="text-3xl font-semibold text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full hidden md:block" />
            
            {[
              { num: 1, title: "Sign Up", desc: "Create your account in seconds and set up your profile." },
              { num: 2, title: "Add Subjects", desc: "Create your subjects with schedules and important details." },
              { num: 3, title: "Track Attendance", desc: "Start recording attendance and monitoring participation rates." }
            ].map((step, i) => (
              <motion.div 
                className="flex flex-col items-center text-center relative z-10"
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple-500 text-primary-foreground flex items-center justify-center text-xl font-bold mb-4 shadow-md"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {step.num}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* CTA Section */}
      <motion.div 
        className="container mx-auto px-4 py-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 max-w-xl mx-auto">Join thousands of educators who have already simplified their attendance tracking process.</p>
          <Button asChild size="lg" className="gap-2 animate-pulse hover:animate-none">
            <Link to="/signup">
              Start For Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.div>
      
      {/* Footer */}
      <footer className="mt-auto py-8 border-t bg-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">Students</Badge>
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">Teachers</Badge>
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">Schools</Badge>
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">Universities</Badge>
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">Training Centers</Badge>
          </div>
          <p className="text-muted-foreground">&copy; 2025 AttendancePal. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="https://mehbinamal.github.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
              Meet the Creator
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
