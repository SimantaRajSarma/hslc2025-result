import { useState, useEffect } from "react";
import {
  Bell,
  ExternalLink,
  Clock,
  Share2,
  AlertCircle,
  BookOpen,
} from "lucide-react";

type ResultLink = {
  id: number;
  url: string;
  status: string;
};

function App() {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [showNotification, setShowNotification] = useState(false);
  const resultDate = new Date("2025-04-11T10:00:00");
  const [links, setLinks] = useState<ResultLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        import.meta.env.VITE_RESULT_LINKS_URL as string
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: ResultLink[] = await response.json();
      setLinks(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = resultDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Results are out!");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const lastUsedPortal = localStorage.getItem("lastUsedPortal");

  const handlePortalClick = (portalId: number) => {
    localStorage.setItem("lastUsedPortal", portalId.toString());
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "HSLC 2025 Result Link",
          text: "Check out the HSLC 2025 result here!",
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Sharing failed", error));
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* <GraduationCap className="h-8 w-8 text-emerald-400" /> */}
              <div>
                <h1 className="text-2xl font-bold text-white">You Can Learn</h1>
                <p className="text-sm text-gray-400">Assam HSLC Results 2025</p>
              </div>
            </div>
            <button
              className="relative p-2 hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => setShowNotification(!showNotification)}
            >
              <Bell className="h-6 w-6 text-emerald-400" />
              {showNotification && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notification */}
      {showNotification && (
        <div className="bg-gray-800 border-l-4 border-emerald-400 p-4">
          <div className="container mx-auto px-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-emerald-400 mr-2" />
            <p className="text-gray-300">
              SEBA HSLC (Class 10) Results will be declared on April 11th, 2025
              at 10:00 AM. Keep your roll number ready!
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Countdown Timer */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Clock className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-semibold text-white">
              Time Until Results
            </h2>
          </div>
          <div className="text-4xl md:text-6xl font-bold text-emerald-400 tracking-wider animate-pulse">
            {timeLeft}
          </div>
        </div>

        {/* Result Links */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-12">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            Check Your Results
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handlePortalClick(link.id)}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg transition-all duration-300 ${
                  lastUsedPortal === link.id.toString()
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-emerald-500 hover:text-white"
                }`}
              >
                <span className="font-medium">Link {link.id}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-gray-400 text-sm text-center mt-4">
            If a link doesn't work, try the next one
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-semibold text-white">
              How to Check Your Results
            </h2>
          </div>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              Keep your HSLC roll number and registration number ready
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              Click on any of the result links above (try them in order)
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              If a link doesn't respond, try the next one in sequence
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              Still facing issues? Wait for 5-10 minutes and try again as
              servers might be overloaded
            </li>
          </ul>
        </div>

        {/* Social Sharing */}
        <div className="text-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-full hover:bg-emerald-600 transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span>Share with Classmates</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-400">
            © 2025 You Can Learn | SEBA HSLC Results Portal
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
