import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-700 mt-10 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} <span className="font-semibold">Marketverse</span>. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
