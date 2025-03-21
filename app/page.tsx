"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HelpCircle, Sparkles, History, Book, Star, ArrowRight, Home, Info, Menu, X, PenTool } from "lucide-react"
import FileUpload from "@/components/file-upload"
import ToneSelector from "@/components/tone-selector"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import StoryLoadingPage from "./components/StoryLoadingPage"
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()
  // Custom cursor state
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 })
  const [isMoving, setIsMoving] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isOverInteractive, setIsOverInteractive] = useState(false)
  const [inkTrail, setInkTrail] = useState<Array<{ x: number; y: number; id: number; opacity: number }>>([])
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const trailIdCounter = useRef(0)
  
  // State for navigation and loading
  const [showUploadSection, setShowUploadSection] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const aboutRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  
  // Handle cursor movement and ink trail
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!pageRef.current) return
      
      const x = e.clientX
      const y = e.clientY
      
      setCursorPosition({ x, y })
      setIsMoving(true)
      
      // Add ink drop to trail
      if (isHovering && Math.random() > 0.6) { // Only add drops occasionally for a more natural effect
        const newDrop = { 
          x, 
          y, 
          id: trailIdCounter.current++,
          opacity: 0.3 + Math.random() * 0.3 // Random opacity for natural look
        }
        
        setInkTrail(prev => [...prev.slice(-15), newDrop]) // Keep only last 15 drops
      }
      
      // Reset the moving state after a short delay
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current)
      }
      
      moveTimeoutRef.current = setTimeout(() => {
        setIsMoving(false)
      }, 100)
    }
    
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => {
      setIsHovering(false)
      setInkTrail([]) // Clear trail when leaving
    }
    
    // Check for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a')
      
      setIsOverInteractive(!!isInteractive)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    
    const container = pageRef.current
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)
    }
    
    // Clean up ink drops after they fade
    const cleanupInterval = setInterval(() => {
      setInkTrail(prev => prev.filter(drop => drop.opacity > 0.05).map(drop => ({
        ...drop,
        opacity: drop.opacity * 0.85 // Gradually reduce opacity
      })))
    }, 100)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
      
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current)
      }
      
      clearInterval(cleanupInterval)
    }
  }, [isHovering])

  // Handle "Get Started" button click - scroll to upload section
  const handleGetStarted = () => {
    setShowUploadSection(true)
    // Scroll to upload section
    setTimeout(() => {
      const uploadSection = document.getElementById('upload-section')
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }
  
  // Handle "Generate Your Story" button click - show loading page and navigate to book page
  const handleGenerateStory = () => {
    setIsLoading(true)
  }
  
  // Handle loading completion - navigate to book page
  const handleLoadingComplete = () => {
    router.push('/book')
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden flex flex-col cursor-none"
    >
      {/* Transparent Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <PenTool className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-xl font-semibold text-purple-800 font-serif">Ninte Kadha</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors">
                Home
              </Link>
              <button onClick={() => scrollToSection(aboutRef)} className="px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection(featuresRef)} className="px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection(howItWorksRef)} className="px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection(uploadSectionRef)} className="px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors">
                
              </button>
              <Button 
                onClick={handleGetStarted}
                className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
            
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white bg-opacity-90 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors">
                Home
              </Link>
              <button onClick={() => scrollToSection(aboutRef)} className="block px-3 py-2 rounded-md text-base font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection(featuresRef)} className="block px-3 py-2 rounded-md text-base font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection(howItWorksRef)} className="block px-3 py-2 rounded-md text-base font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection(uploadSectionRef)} className="block px-3 py-2 rounded-md text-base font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-100 hover:bg-opacity-50 transition-colors">
                
              </button>
              <Button 
                onClick={handleGetStarted}
                className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>
      
      
      {/* Add padding to the top to account for the fixed navbar */}
      <div className="pt-16">
        {/* Loading page */}
        {isLoading && <StoryLoadingPage onLoadingComplete={handleLoadingComplete} redirectPath="/book" />}
        
      {/* Custom Pen Cursor */}
      {isHovering && (
        <div 
          className={cn(
            "fixed pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2",
            isMoving && "scale-95",
            isOverInteractive && "rotate-[-15deg]"
          )}
          style={{ 
            left: `${cursorPosition.x}px`, 
            top: `${cursorPosition.y}px`,
            transition: isMoving ? 'transform 0.1s ease-out' : 'left 0.05s ease-out, top 0.05s ease-out, transform 0.1s ease-out'
          }}
        >
          {/* Pen cursor */}
          <div className="relative">
            <div className="text-4xl select-none">
              <Image 
              
                src="/images/cursor.png" 
                alt="Cursor" 
                width={40} 
                height={40} 
                className="transform rotate-180 scale-x-[-1] scale-y-[-1]"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Ink Trail */}
      {inkTrail.map((drop) => (
        <div 
          key={drop.id}
          className="fixed pointer-events-none rounded-full blur-[1px]"
          style={{ 
            left: `${drop.x}px`, 
            top: `${drop.y}px`,
            width: `${4 + Math.random() * 4}px`,
            height: `${4 + Math.random() * 4}px`,
            backgroundColor: Math.random() > 0.5 ? 'rgba(147, 51, 234, ' + drop.opacity + ')' : 'rgba(219, 39, 119, ' + drop.opacity + ')',
            transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.5})`,
            opacity: drop.opacity,
            transition: 'opacity 0.5s ease-out'
          }}
        />
      ))}

      {/* Decorative background elements - MOVED TO PAGE LEVEL */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Main background blobs with proper animations */}
        <div className="absolute top-[10%] left-[25%] w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-[5%] right-[25%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30" style={{ animation: 'blob 7s infinite', animationDelay: '2s' }} />
        <div className="absolute bottom-[10%] left-[33%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30" style={{ animation: 'blob 7s infinite', animationDelay: '4s' }} />
        
        {/* Additional blobs with explicit animations */}
        <div className="absolute top-[33%] right-[33%] w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{ animation: 'blob 8s infinite', animationDelay: '3s' }} />
        <div className="absolute bottom-[25%] right-[20%] w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{ animation: 'blob 9s infinite', animationDelay: '5s' }} />
        
        {/* Floating particles with explicit animations */}
        <div className="absolute top-[25%] left-[25%] w-3 h-3 bg-pink-400 rounded-full opacity-60" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
        <div className="absolute top-[33%] right-[25%] w-2 h-2 bg-purple-400 rounded-full opacity-60" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '1s' }} />
        <div className="absolute bottom-[25%] left-[33%] w-2 h-2 bg-blue-400 rounded-full opacity-60" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '1.5s' }} />
        <div className="absolute bottom-[33%] right-[33%] w-3 h-3 bg-pink-400 rounded-full opacity-60" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '2s' }} />
        <div className="absolute top-[66%] left-[20%] w-2 h-2 bg-purple-400 rounded-full opacity-60" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '2.5s' }} />
        <div className="absolute top-[20%] right-[33%] w-3 h-3 bg-blue-400 rounded-full opacity-60" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '3s' }} />
        
        {/* Decorative circles with pulse animations */}
        <div className="absolute top-[5%] left-[5%] w-32 h-32 border-2 border-pink-300 rounded-full opacity-30" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <div className="absolute bottom-[5%] right-[5%] w-40 h-40 border-2 border-purple-300 rounded-full opacity-30" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1s' }} />
        <div className="absolute top-[50%] right-[10%] w-24 h-24 border-2 border-blue-300 rounded-full opacity-30" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '2s' }} />
        <div className="absolute bottom-[33%] left-[10%] w-36 h-36 border-2 border-pink-300 rounded-full opacity-30" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1.5s' }} />
        
        {/* Floating icons with float animations */}
        <div className="absolute top-[25%] right-[16%]" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <Book className="w-8 h-8 text-purple-400 opacity-70 rotate-12" />
        </div>
        
        <div className="absolute bottom-[25%] left-[16%]" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1.5s' }}>
          <Sparkles className="w-8 h-8 text-pink-400 opacity-70" />
        </div>
        
        <div className="absolute top-[66%] right-[25%]" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '2.5s' }}>
          <Star className="w-6 h-6 text-blue-400 opacity-70 rotate-45" />
        </div>
        
        <div className="absolute bottom-[33%] left-[33%]" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '3.5s' }}>
          <Sparkles className="w-7 h-7 text-purple-400 opacity-70 -rotate-12" />
        </div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-6 60c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm32-63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <main className="relative container max-w-6xl mx-auto px-4 py-16 md:py-24 z-10">
        {/* Streamlined Hero Section with larger privacy stamp in pink-purple theme */}
        <div className="flex flex-col items-center justify-center text-center mb-16 relative min-h-[600px] rounded-3xl overflow-hidden">
          {/* Background remains the same */}
          <div className="absolute inset-0 -z-10">
            {/* Base gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" />
            
            {/* Image background with improved overlay */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `url('/entekadha.jpeg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            
            {/* Gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/70" />
            
            {/* Decorative frame */}
            <div className="absolute inset-8 border-2 border-purple-300/50 rounded-2xl" />
          </div>
          
          {/* Keep decorative elements but reduce quantity */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Spotlight effect */}
            <div className="absolute -top-20 left-1/2 w-[150%] h-[150%] bg-gradient-radial from-pink-200/50 to-transparent opacity-80 transform -translate-x-1/2" />
            
            {/* Keep only the most visible animated elements */}
            <div className="absolute top-10 left-10 w-40 h-40 border-2 border-pink-400/60 rounded-full opacity-60 animate-pulse-fast" />
            <div className="absolute bottom-10 right-10 w-48 h-48 border-2 border-purple-400/60 rounded-full opacity-60 animate-pulse-fast" style={{ animationDelay: '1s' }} />
            
            {/* Brighter floating particles - keep only a few */}
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-pink-500 rounded-full opacity-80 animate-ping-bright" />
            <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-purple-500 rounded-full opacity-80 animate-ping-bright" style={{ animationDelay: '1s' }} />
            
            {/* Animated floating icons - keep only the most important */}
            <div className="absolute top-1/4 right-1/6 animate-float">
              <Book className="w-10 h-10 text-purple-500 opacity-80 rotate-12 drop-shadow-md" />
            </div>
            
            <div className="absolute bottom-1/4 left-1/6 animate-float" style={{ animationDelay: '1.5s' }}>
              <Sparkles className="w-10 h-10 text-pink-500 opacity-80 drop-shadow-md" />
            </div>
          </div>
          
          {/* Privacy Stamp in corner - larger with pink-purple theme */}
            <div className="absolute top-6 right-6 z-20 animate-fade-in-rotate transform rotate-6 hover:rotate-0 transition-transform duration-500" style={{ animationDelay: '1s' }}>
              <div className="relative w-32 h-32 md:w-40 md:h-40">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-pink-500/70 animate-slow-spin"></div>
              
              {/* Inner stamp */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md shadow-lg flex flex-col items-center justify-center p-2 border border-purple-200 hover:border-purple-300 transition-all duration-300">
                {/* Lock icon with pink-purple gradient */}
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-full mb-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                
                {/* Text in circular pattern */}
                <div className="text-center">
                    <p className="text-purple-700 text-xs md:text-sm font-bold uppercase tracking-tight">Privacy Assured</p>
                    <p className="text-gray-700 text-[9px] md:text-xs font-medium mt-1 px-2" style={{ fontFamily: "'Caveat', cursive" }}>
                    We don't store, save, or sneak a peek at your files
                  </p>
                </div>
                
                {/* Circular border inside */}
                  <div className="absolute inset-3 rounded-full border border-pink-200/50 animate-pulse-slow hover:border-pink-300/70 transition-colors duration-300"></div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
              </div>
              
              {/* Shine effect */}
                <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-white rounded-full blur-md opacity-50 animate-shine"></div>
              </div>
          </div>
          
          {/* Streamlined content wrapper with less elements */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-8 py-16 px-4 max-w-4xl mx-auto">
            {/* Enhanced main heading */}
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 animate-gradient-text tracking-tight drop-shadow-sm">
                Ninte കഥ
              </h1>
              
              {/* Subtle shadow for 3D effect */}
              <div className="absolute -bottom-2 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-white/80 blur-md -z-10"></div>
            </div>
            
            {/* Simplified tagline */}
            <div className="relative max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="px-4 py-5 bg-white/70 backdrop-blur-md rounded-xl border border-purple-100/50 shadow-lg">
                <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-700 text-center">
                  Transform your search history into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold">beautiful personal story</span>
                </p>
              </div>
            </div>
            
            {/* Call to action button */}
            <div className="mt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center"
              >
                <Sparkles className="mr-2 h-5 w-5" /> 
                Get Started
              </button>
            </div>
          </div>



          {/* Bottom wave decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
            <svg className="absolute bottom-0 w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path 
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                fill="white" 
                fillOpacity="0.3"
                className="animate-wave"
              />
              <path 
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                fill="white" 
                fillOpacity="0.4"
                className="animate-wave-slow"
              />
            </svg>
          </div>
        </div>



        {/* Floating Notification */}
          <div className="fixed bottom-4 right-4 z-50 animate-bounce-subtle">
          <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 cursor-pointer hover:scale-105 transition-transform duration-300 group">
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
              <HelpCircle className="w-6 h-6 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
        </div>
        









        {/* About Section */}
        <section ref={aboutRef} className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-800">
            About
          </h2>
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-purple-200 to-pink-200 rounded-xl border border-purple-300 shadow-lg p-6">
            <p className="text-lg text-purple-900 font-serif mb-4">
              Ninte Kadha is a platform that transforms your digital footprints into meaningful stories. 
              We believe in the power of storytelling and aim to provide a unique experience that combines 
              technology with creativity.
            </p>
            <p className="text-lg text-purple-900 font-serif mb-4">
              Our mission is to help you rediscover your past through personalized narratives that reflect 
              your journey and experiences.
            </p>
            <p className="text-lg text-purple-900 font-serif">
              Join us in this exciting adventure of storytelling and let your history inspire your future!
            </p>
          </div>
        </section>










        {/* Main Story Generator Card */}
          <div id="upload-section" className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-pink-100 transition-all duration-300 hover:shadow-pink-200/20 mb-24">
          <div className="space-y-12">
            <FileUpload />
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Choose Your Story Tone
              </h2>
              <ToneSelector />
            </div>
            <div className="pt-6 flex flex-col items-center space-y-6">
                <Button 
                  onClick={handleGenerateStory}
                  className="w-full max-w-md bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-7 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                <Sparkles className="mr-2 h-5 w-5" /> Generate Your Story
              </Button>
              </div>
          </div>
        </div>











        {/* Features Section */}
        <section ref={featuresRef} className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-800">
            Transform Your Digital Footprint
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <History className="h-8 w-8" />,
                title: "Search History",
                description: "Import your browsing history and watch it transform into a narrative.",
              },
              {
                icon: <Book className="h-8 w-8" />,
                title: "Story Generation",
                description: "AI-powered storytelling that creates unique, personalized narratives.",
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: "Multiple Styles",
                description: "Choose from various tones and styles to match your personality.",
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                  <div className="absolute inset-0 bg-white/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-800 group-hover:text-pink-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>









        
        {/* How It Works Section */}
        <section ref={howItWorksRef} className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-800">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Export History", desc: "Download your search history from Google" },
              { step: "2", title: "Upload File", desc: "Upload the JSON file to our platform" },
              { step: "3", title: "Choose Style", desc: "Select your preferred storytelling tone" },
              { step: "4", title: "Get Story", desc: "Receive your personalized narrative" },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-purple-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
                {i < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-5 w-6 h-6 text-purple-400 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </section>










        {/* Footer Section */}
        <footer className="relative mt-auto border-t border-purple-100">
          <div className="relative z-10 max-w-6xl mx-auto py-8 px-4">
            {/* Main footer content */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              {/* Logo and Description */}
              <div className="max-w-xs">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Ninte Kadha
                </h3>
                <p className="text-gray-600 text-sm">
                  Transform your digital footprints into meaningful stories.
                </p>
                {/* Social Links */}
                <div className="flex gap-3 mt-4">
                  {[
                    { name: 'twitter', icon: 'X' },
                    { name: 'github', icon: 'GH' },
                    { name: 'discord', icon: 'DC' },
                    { name: 'mail', icon: '@' }
                  ].map((social) => (
                    <Link 
                      key={social.name}
                      href="#"
                      className="w-8 h-8 rounded-full bg-purple-50 hover:bg-pink-50 flex items-center justify-center text-sm font-medium text-purple-600 hover:text-pink-600 transition-all duration-300 hover:scale-110"
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex gap-12">
                {/* Quick Links Column */}
                <div>
                  <h4 className="text-sm font-semibold text-purple-800 mb-3">Quick Links</h4>
                  <ul className="space-y-2">
                    {['About', 'Features', 'How it Works', 'Privacy'].map((item) => (
                      <li key={item}>
                        <Link 
                          href={`/${item.toLowerCase().replace(' ', '-')}`}
                          className="text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support Column */}
                <div>
                  <h4 className="text-sm font-semibold text-purple-800 mb-3">Support</h4>
                  <ul className="space-y-2">
                    {['Help Center', 'Contact Us', 'FAQ'].map((item) => (
                      <li key={item}>
                        <Link 
                          href="#"
                          className="text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 mt-6 border-t border-purple-100">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Ninte Kadha. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                {['Terms', 'Privacy', 'Cookies'].map((item) => (
                  <Link 
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Subtle background decoration */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-100 to-transparent rounded-full mix-blend-multiply filter blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-100 to-transparent rounded-full mix-blend-multiply filter blur-2xl" />
          </div>
        </footer>
      </main>
      </div>
    </div>
  )
}

// Keep your existing animations
export const dynamic = 'force-dynamic';

const styles = `
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes wave {
  0% { transform: translateX(0) translateZ(0) scaleY(1); }
  50% { transform: translateX(-25%) translateZ(0) scaleY(0.8); }
  100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
}

@keyframes wave-slow {
  0% { transform: translateX(0) translateZ(0) scaleY(1); }
  50% { transform: translateX(-25%) translateZ(0) scaleY(0.9); }
  100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-wave {
  animation: wave 15s linear infinite;
}

.animate-wave-slow {
  animation: wave-slow 20s linear infinite;
}

@media (max-width: 768px) {
  .text-6xl {
    font-size: 4rem; /* Adjust for smaller screens */
  }
  .text-8xl {
    font-size: 5rem; /* Adjust for smaller screens */
  }
  .px-8 {
    padding-left: 1rem; /* Adjust padding for smaller screens */
    padding-right: 1rem; /* Adjust padding for smaller screens */
  }
  .py-5 {
    padding-top: 1rem; /* Adjust padding for smaller screens */
    padding-bottom: 1rem; /* Adjust padding for smaller screens */
  }
}
`;

