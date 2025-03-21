"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, Download, Facebook, Twitter, Linkedin, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookPageContent from "@/components/book-page";
import StoryLoadingPage from '../components/StoryLoadingPage';
import { cn } from "@/lib/utils";

export default function BookPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [bookData, setBookData] = useState<{ title: string; pages: { content: string; pageNumber: number }[] } | null>(null);
  const bookContentRef = useRef<HTMLDivElement>(null);

  // Fetch data from localStorage on component mount
  useEffect(() => {
    const savedStory = localStorage.getItem("autobiography");
    if (savedStory) {
      try {
        // Split the content into 4 equal parts
        const contentLength = savedStory.length;
        const pageLength = Math.ceil(contentLength / 4);
        const pages = [
          savedStory.slice(0, pageLength),
          savedStory.slice(pageLength, pageLength * 2),
          savedStory.slice(pageLength * 2, pageLength * 3),
          savedStory.slice(pageLength * 3),
        ].map((content, index) => ({
          content,
          pageNumber: index + 1,
        }));

        setBookData({
          title: "Your Digital Journey",
          pages,
        });
      } catch (error) {
        console.error("Failed to parse saved story:", error);
      }
    }
  }, []);

  // Handle share button click - show share menu
  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  // Handle download button click - create a downloadable text file
  const handleDownload = () => {
    if (!bookData) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            try {
              // Combine all pages into a single string
              const fullContent = bookData.pages.map(page => `Page ${page.pageNumber}:\n${page.content}`).join("\n\n");

              // Create a downloadable text file
              const blob = new Blob([fullContent], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${bookData.title.replace(/\s+/g, "_")}.txt`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

              setIsDownloading(false);
            } catch (error) {
              console.error("Error creating file:", error);
              alert("Failed to generate file. Please try again.");
              setIsDownloading(false);
            }
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Handle social media sharing
  const handleSocialShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out my personalized story: ${bookData?.title || 'My Story'}`;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
    setShowShareMenu(false);
  };

  // Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
      });
  };

  // Function to show loading page and then return to home
  const handleGenerateStory = () => {
    setIsLoading(true);
  };

  // Handle loading completion - navigate back to home
  const handleLoadingComplete = () => {
    router.push("/");
  };

  if (!bookData) {
    return <StoryLoadingPage onLoadingComplete={handleLoadingComplete} redirectPath="/" />;
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8">
      {isLoading && (
        <StoryLoadingPage onLoadingComplete={handleLoadingComplete} redirectPath="/" />
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="flex items-center text-purple-700 hover:text-purple-900 transition-colors">
            <ArrowLeft className="mr-2" size={20} />
            <span>Back to Home</span>
          </Link>

          <div className="flex space-x-2">
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="relative"
              >
                <Share2 className="mr-2" size={16} />
                Share
              </Button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 overflow-hidden">
                  <div className="py-1">
                    <button 
                      onClick={() => handleSocialShare("facebook")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      <Facebook className="mr-2 text-blue-600" size={16} />
                      Share on Facebook
                    </button>
                    <button 
                      onClick={() => handleSocialShare("twitter")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      <Twitter className="mr-2 text-blue-400" size={16} />
                      Share on Twitter
                    </button>
                    <button 
                      onClick={() => handleSocialShare("linkedin")}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      <Linkedin className="mr-2 text-blue-700" size={16} />
                      Share on LinkedIn
                    </button>
                    <button 
                      onClick={handleCopyLink}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      {copied ? (
                        <Check className="mr-2 text-green-500" size={16} />
                      ) : (
                        <Copy className="mr-2 text-gray-500" size={16} />
                      )}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Button 
              id="download-button"
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="mr-2" size={16} />
              {isDownloading ? `Downloading ${downloadProgress}%` : "Download"}
            </Button>
          </div>
        </div>

        {isDownloading && (
          <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200 ease-out"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        )}

        {bookData && (
          <div ref={bookContentRef}>
            <BookPageContent 
              content={bookData.pages.map(page => page.content)} 
              title={bookData.title} 
              author="Based on Your Digital Journey"
            />
          </div>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={handleGenerateStory}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            Create Another Story
          </Button>
        </div>
      </div>
    </div>
  );
}