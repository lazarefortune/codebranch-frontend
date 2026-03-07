"use client";

import { useState } from "react";
import Link from "next/link";
import { GitBranch, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./button";

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <GitBranch className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">
            Code<span className="text-primary">Branch</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-2 sm:flex">
          <Link href="/demo">
            <Button variant="ghost" size="sm">
              Demo
            </Button>
          </Link>
          <Link href="/connexion">
            <Button variant="ghost" size="sm">
              Se connecter
            </Button>
          </Link>
          <Link href="/inscription">
            <Button variant="primary" size="sm">
              Commencer
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu de navigation"
            aria-expanded={isMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isMenuOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border bg-background sm:hidden"
          >
            <nav className="container flex flex-col gap-2 py-4">
              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <Link
                  href="/demo"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full">
                    Demo
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  href="/connexion"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full">
                    Se connecter
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  href="/inscription"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="primary" className="w-full">
                    Commencer
                  </Button>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
