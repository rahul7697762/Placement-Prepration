"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PatternCardProps {
  title: string;
  description: string;
  slug: string;
  count: number;
  index: number;
}

export function PatternCard({ title, description, slug, count, index }: PatternCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/patterns/${slug}`} className="block h-full group">
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:border-primary/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <Badge variant="secondary" className="bg-secondary/50 backdrop-blur-md">
                {count} Questions
              </Badge>
            </div>
            <CardDescription className="line-clamp-3 text-muted-foreground/80">
              {description}
            </CardDescription>
            <div className="mt-4 flex items-center text-sm text-primary font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Start Solving <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
}
