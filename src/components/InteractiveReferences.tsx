import React from 'react';
import { ExternalLink, FolderOpen, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollRevealBox } from './ParallaxEffects';

interface InteractiveReferencesProps {
  imagesFolder: string;
  citationsFolder: string;
}

export function InteractiveReferences({ imagesFolder, citationsFolder }: InteractiveReferencesProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Title block with Cloud Drive folder linkages */}
      <ScrollRevealBox yOffset={20}>
        <div className="bg-[#FCFAF5] p-6 md:p-8 border-4 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center space-y-4">
          <h2 className="text-2xl md:text-3.5xl font-serif font-black text-stone-900 tracking-tight">
            References
          </h2>

          {/* Dynamic Drive Folder Actions side-by-side */}
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <motion.a
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={imagesFolder}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#FAF8F3] text-black text-xs font-mono font-bold rounded-lg border-2 border-black shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Open Portfolio Media Folder</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={citationsFolder}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#FAF8F3] text-black text-xs font-mono font-bold rounded-lg border-2 border-black shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Open Citations Drive Folder</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </motion.a>
          </div>
        </div>
      </ScrollRevealBox>

    </div>
  );
}
