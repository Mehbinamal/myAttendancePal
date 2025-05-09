
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckSquare, Calendar, BarChart } from "lucide-react";

const Welcome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">AttendancePal</h1>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Simplify Your Attendance Tracking</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          The all-in-one platform for educators and students to manage attendance 
          records, track subjects, and improve classroom participation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="gap-2 text-lg">
            <Link to="/login">
              Get Started
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 text-lg">
            <Link to="/signup">
              Create Account
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-center mb-8">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CheckSquare className="h-8 w-8 text-primary mb-2" />
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

          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
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

          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <BarChart className="h-8 w-8 text-primary mb-2" />
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
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-12 bg-muted/30 rounded-lg my-8">
        <h2 className="text-2xl font-semibold text-center mb-8">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
            <p>Create your account in seconds and set up your profile.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Add Subjects</h3>
            <p>Create your subjects with schedules and important details.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Attendance</h3>
            <p>Start recording attendance and monitoring participation rates.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-8 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 AttendancePal. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="https://mehbinamal.github.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Meet the Creator
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
