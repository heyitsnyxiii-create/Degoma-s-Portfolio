import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Facebook, 
  Instagram, 
  Eye, 
  BookOpen, 
  Award, 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  ExternalLink, 
  FolderOpen, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  FileCheck,
  FileSpreadsheet,
  Compass,
  Lightbulb,
  HeartHandshake,
  Camera,
  Trash2,
  Maximize2,
  Sparkles,
  RefreshCw,
  Share2,
  Copy,
  Check,
  Database
} from 'lucide-react';

import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { db, auth, OperationType, handleFirestoreError } from './firebase';

import { Navigation } from './components/Navigation';
import { InteractiveReferences } from './components/InteractiveReferences';
import { 
  MsuIitLogo, 
  DiceIcon, 
  Dice3D, 
  HanddrawnQuizSheet, 
  ZipgradeSheet, 
  StudentAvatar 
} from './components/Skins';
import { 
  SOCIAL_LINKS, 
  COURSE_INFO, 
  UNIT_OUTPUTS, 
  DIGITAL_PRESENTATION_LINK, 
  REFERENCES_LINKS, 
  QUIZZES_DATA, 
  EXAMS_DATA, 
  SCHOOL_PROFILE, 
  PHILOSOPHY_PILLARS, 
  ACKNOWLEDGMENTS, 
  REFLECTION_TEXT 
} from './data';

const defaultProfilePic = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="20" fill="%23FCFAF5"/><rect width="112" height="112" x="4" y="4" rx="16" fill="%23EAE8E0" stroke="%231A1A1A" stroke-width="3"/><circle cx="60" cy="50" r="18" fill="%23801b1b" stroke="%231A1A1A" stroke-width="2"/><path d="M28 95C28 80 42 70 60 70C78 70 92 80 92 95" stroke="%231a1a1a" stroke-width="4.5" stroke-linecap="round" fill="none"/></svg>`;
import msuIitGymBg from './assets/images/msu_iit_gym_1780456562894.png';
import classroomDesksBg from './assets/images/classroom_desks_1780461794697.png';
import activeClassroomBg from './assets/images/active_classroom_1780462857200.png';
import teamInfographicDesign from './assets/images/team_infographic_design_1780474384640.png';
import participatingDemoTeaching from './assets/images/participating_demo_teaching_1780474402082.png';
import presentingInfographic from './assets/images/presenting_infographic_1780474417572.png';
import demoTeachingSession1 from './assets/images/demo_teaching_session_1_1780474432013.png';
import demoTeachingSession2 from './assets/images/demo_teaching_session_2_1780474445775.png';
import demoTeachingSession3 from './assets/images/demo_teaching_session_3_1780474461763.png';
import msuIitCedPhoto from './assets/images/msu_iit_ced_1780481118572.png';
import { compressBase64, compressImageFile } from './utils/imageCompressor';
import { 
  FadeInText,
  TypewriterScrollText, 
  ParallaxFloat, 
  ScrollRevealBox, 
  FloatingCellBiology, 
  FloatingDnaStrand, 
  FloatingHanddrawnLeaf 
} from './components/ParallaxEffects';

const getEmbedUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
  }
  if (url.includes('docs.google.com/document') || url.includes('drive.google.com')) {
    const parts = url.split('/edit')[0].split('/view')[0];
    return `${parts}/preview`;
  }
  return url;
};

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Me' },
  { id: 'acknowledgment', label: 'Acknowledgment' },
  { id: 'school-profile', label: 'School Profile' },
  { id: 'philosophy', label: 'Teaching Philosophy' },
  { id: 'outputs', label: 'Outputs' },
  { id: 'documentation', label: 'Documentation' },
  { id: 'references', label: 'References' }
];

// Configuration object where uploaded images can be pasted or merged.
// If you generate a code payload from the "Sync Config" panel, paste the keys inside this object
// to permanently bake them into the code so they appear for all public/shared viewers!
const BAKE_CONFIG: Record<string, string> = {
  // BAKE_HERE
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSyncMessage, setCloudSyncMessage] = useState<string | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [importPayloadText, setImportPayloadText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [homeProfileImage, setHomeProfileImage] = useState<string | null>(() => {
    try {
      return BAKE_CONFIG['portfolio_home_profile'] || BAKE_CONFIG['precious_lara_saved_photo_home'] || localStorage.getItem('portfolio_home_profile') || localStorage.getItem('precious_lara_saved_photo_home') || defaultProfilePic;
    } catch {
      return defaultProfilePic;
    }
  });
  const [aboutProfileImage, setAboutProfileImage] = useState<string | null>(() => {
    try {
      return BAKE_CONFIG['portfolio_about_profile'] || BAKE_CONFIG['precious_lara_saved_photo_about'] || localStorage.getItem('portfolio_about_profile') || localStorage.getItem('precious_lara_saved_photo_about') || defaultProfilePic;
    } catch {
      return defaultProfilePic;
    }
  });

  const [midtermZipgradePhoto, setMidtermZipgradePhoto] = useState<string | null>(() => {
    try {
      return BAKE_CONFIG['zipgrade_photo_midterm'] || localStorage.getItem('zipgrade_photo_midterm');
    } catch {
      return null;
    }
  });

  const [finalZipgradePhoto, setFinalZipgradePhoto] = useState<string | null>(() => {
    try {
      return BAKE_CONFIG['zipgrade_photo_final'] || localStorage.getItem('zipgrade_photo_final');
    } catch {
      return null;
    }
  });

  const handleHomeProfileChange = async (src: string) => {
    if (currentUser?.email !== 'heyitsnyxiii@gmail.com') return;
    setHomeProfileImage(src);
    try {
      const compressed = await compressBase64(src, 800, 800, 0.85);
      setHomeProfileImage(compressed);
      localStorage.setItem('portfolio_home_profile', compressed);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAboutProfileChange = async (src: string) => {
    if (currentUser?.email !== 'heyitsnyxiii@gmail.com') return;
    setAboutProfileImage(src);
    try {
      const compressed = await compressBase64(src, 800, 800, 0.85);
      setAboutProfileImage(compressed);
      localStorage.setItem('portfolio_about_profile', compressed);
    } catch (e) {
      console.error(e);
    }
  };

  const defaultDocImages = {
    doc1: teamInfographicDesign,
    doc2: participatingDemoTeaching,
    doc3: presentingInfographic,
    doc4: demoTeachingSession1,
    doc5: demoTeachingSession2,
    doc6: demoTeachingSession3,
  };

  const [docImages, setDocImages] = useState<Record<string, string>>(() => {
    try {
      return {
        doc1: BAKE_CONFIG['portfolio_doc_img_1'] || localStorage.getItem('portfolio_doc_img_1') || defaultDocImages.doc1,
        doc2: BAKE_CONFIG['portfolio_doc_img_2'] || localStorage.getItem('portfolio_doc_img_2') || defaultDocImages.doc2,
        doc3: BAKE_CONFIG['portfolio_doc_img_3'] || localStorage.getItem('portfolio_doc_img_3') || defaultDocImages.doc3,
        doc4: BAKE_CONFIG['portfolio_doc_img_4'] || localStorage.getItem('portfolio_doc_img_4') || defaultDocImages.doc4,
        doc5: BAKE_CONFIG['portfolio_doc_img_5'] || localStorage.getItem('portfolio_doc_img_5') || defaultDocImages.doc5,
        doc6: BAKE_CONFIG['portfolio_doc_img_6'] || localStorage.getItem('portfolio_doc_img_6') || defaultDocImages.doc6,
      };
    } catch {
      return defaultDocImages;
    }
  });

  const [cardZIndex, setCardZIndex] = useState<Record<string, number>>({
    doc1: 10,
    doc2: 11,
    doc3: 12,
    doc4: 13,
  });

  const [zoomImg, setZoomImg] = useState<{ id: string; src: string; title: string } | null>(null);

  const pinboardRef = React.useRef<HTMLDivElement>(null);

  const bringToFront = (id: string) => {
    setCardZIndex(prev => {
      const values = Object.values(prev) as number[];
      const maxZ = Math.max(...values);
      if (prev[id] === maxZ) return prev;
      return { ...prev, [id]: maxZ + 1 };
    });
  };

  const [scatterPositions, setScatterPositions] = useState<Record<string, { x: number; y: number; rotate: number }>>({
    doc1: { x: -160, y: -90, rotate: -6 },
    doc2: { x: 160, y: -100, rotate: 5 },
    doc3: { x: -150, y: 110, rotate: -4 },
    doc4: { x: 150, y: 120, rotate: 8 },
  });

  const scatterMemories = () => {
    setScatterPositions({
      doc1: { x: -180 + Math.random() * 80, y: -110 + Math.random() * 40, rotate: -15 + Math.random() * 12 },
      doc2: { x: 100 + Math.random() * 80, y: -120 + Math.random() * 40, rotate: -4 + Math.random() * 15 },
      doc3: { x: -190 + Math.random() * 80, y: 70 + Math.random() * 60, rotate: -12 + Math.random() * 12 },
      doc4: { x: 90 + Math.random() * 80, y: 80 + Math.random() * 60, rotate: -2 + Math.random() * 16 },
    });
  };

  const [activeChangingDocId, setActiveChangingDocId] = useState<string | null>(null);
  const docFileInputRef = React.useRef<HTMLInputElement>(null);
  const cedFileInputRef = React.useRef<HTMLInputElement>(null);
  const [pinboardViewActive, setPinboardViewActive] = useState<boolean>(true);
  
  const handleCedFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentUser?.email !== 'heyitsnyxiii@gmail.com') return;
    if (e.target.files && e.target.files[0]) {
      try {
        const compressed = await compressImageFile(e.target.files[0], 500, 350, 0.7);
        handleCedPhotoChange(compressed);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDocImageChange = (id: string) => {
    if (currentUser?.email !== 'heyitsnyxiii@gmail.com') return;
    setActiveChangingDocId(id);
    setTimeout(() => {
      docFileInputRef.current?.click();
    }, 50);
  };

  const handleDocFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentUser?.email !== 'heyitsnyxiii@gmail.com') return;
    if (e.target.files && e.target.files[0] && activeChangingDocId) {
      try {
        const compressed = await compressImageFile(e.target.files[0], 500, 500, 0.7);
        setDocImages(prev => {
          const updated = { ...prev, [activeChangingDocId]: compressed };
          try {
            localStorage.setItem(`portfolio_doc_img_${activeChangingDocId.replace('doc', '')}`, compressed);
          } catch (err) {
            console.error(err);
          }
          return updated;
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const resetDocImage = (id: string) => {
    if (currentUser?.email !== 'heyitsnyxiii@gmail.com') return;
    const keyNum = id.replace('doc', '');
    setDocImages(prev => {
      const updated = { ...prev, [id]: (defaultDocImages as any)[id] };
      try {
        localStorage.removeItem(`portfolio_doc_img_${keyNum}`);
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [cedImage, setCedImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem('precious_lara_ced_image') || null;
    } catch {
      return null;
    }
  });
  const [reflectionExpanded, setReflectionExpanded] = useState<boolean>(true);
  const [activeUnitDetail, setActiveUnitDetail] = useState<number | null>(null);
  const [homeShowcaseTab, setHomeShowcaseTab] = useState<'educator' | 'course' | 'milestones'>('educator');
  const [profileSubTab, setProfileSubTab] = useState<'about' | 'college' | 'vmgo' | 'milestones'>('about');

  const [activeAckId, setActiveAckId] = useState<'mentor' | 'family' | 'community'>('mentor');

  // Interactive binder sub-selection state variables
  const [selectedOutputUnit, setSelectedOutputUnit] = useState<number>(1);
  const [assessmentType, setAssessmentType] = useState<'quizzes' | 'examinations'>('quizzes');
  const [activeQuizQuestionComment, setActiveQuizQuestionComment] = useState<number>(5);

  const [direction, setDirection] = useState<number>(0);
  const [prevTab, setPrevTab] = useState<string>(activeTab);

  useEffect(() => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    const prevIndex = TABS.findIndex((t) => t.id === prevTab);
    if (currentIndex !== prevIndex) {
      setDirection(currentIndex > prevIndex ? 1 : -1);
      setPrevTab(activeTab);
    }
  }, [activeTab, prevTab]);

  // Master custom page transition variants to create high-fidelity, creative tactile "wow" effects
  const homeVariants = {
    initial: (dir: number) => ({
      scale: 1.05,
      y: dir * 40,
      rotateX: dir * 8,
      opacity: 0,
      filter: 'blur(8px)',
    }),
    animate: {
      scale: 1,
      y: 0,
      rotateX: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 140,
        damping: 18,
        mass: 1,
      },
    },
    exit: (dir: number) => ({
      scale: 0.96,
      y: dir * -40,
      rotateX: dir * -8,
      opacity: 0,
      filter: 'blur(8px)',
      transition: {
        duration: 0.25,
        ease: 'easeInOut',
      },
    }),
  };

  const aboutVariants = {
    initial: (dir: number) => ({
      x: dir * 180,
      opacity: 0,
      scale: 0.95,
      rotateY: dir * -20,
      filter: 'blur(6px)',
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 20,
      },
    },
    exit: (dir: number) => ({
      x: dir * -180,
      opacity: 0,
      scale: 0.95,
      rotateY: dir * 20,
      filter: 'blur(6px)',
      transition: {
        duration: 0.25,
      },
    }),
  };

  const acknowledgmentVariants = {
    initial: {
      scale: 0.92,
      opacity: 0,
      filter: 'blur(12px)',
      y: 50,
    },
    animate: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 160,
        damping: 22,
      },
    },
    exit: {
      scale: 0.92,
      opacity: 0,
      filter: 'blur(12px)',
      y: -50,
      transition: {
        duration: 0.25,
      },
    },
  };

  const schoolProfileVariants = {
    initial: (dir: number) => ({
      x: dir * 120,
      opacity: 0,
      scaleX: 0.9,
      skewX: dir * -4,
      filter: 'blur(6px)',
    }),
    animate: {
      x: 0,
      opacity: 1,
      scaleX: 1,
      skewX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 130,
        damping: 18,
      },
    },
    exit: (dir: number) => ({
      x: dir * -120,
      opacity: 0,
      scaleX: 0.9,
      skewX: dir * 4,
      filter: 'blur(6px)',
      transition: {
        duration: 0.25,
      },
    }),
  };

  const philosophyVariants = {
    initial: (dir: number) => ({
      rotateY: dir * -45,
      scale: 0.92,
      opacity: 0,
      filter: 'blur(6px)',
      transformOrigin: dir > 0 ? 'right center' : 'left center',
    }),
    animate: {
      rotateY: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 18,
      },
    },
    exit: (dir: number) => ({
      rotateY: dir * 45,
      scale: 0.92,
      opacity: 0,
      filter: 'blur(6px)',
      transformOrigin: dir > 0 ? 'left center' : 'right center',
      transition: {
        duration: 0.25,
      },
    }),
  };

  const outputsVariants = {
    initial: (dir: number) => ({
      x: dir * 160,
      y: dir * -60,
      opacity: 0,
      scale: 0.97,
      filter: 'blur(6px)',
    }),
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 20,
      },
    },
    exit: (dir: number) => ({
      x: dir * -160,
      y: dir * 60,
      opacity: 0,
      scale: 0.97,
      filter: 'blur(6px)',
      transition: {
        duration: 0.25,
      },
    }),
  };

  const documentationVariants = {
    initial: (dir: number) => ({
      y: dir * 180,
      opacity: 0,
      scaleY: 0.96,
      filter: 'blur(5px)',
    }),
    animate: {
      y: 0,
      opacity: 1,
      scaleY: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 160,
        damping: 22,
      },
    },
    exit: (dir: number) => ({
      y: dir * -180,
      opacity: 0,
      scaleY: 0.96,
      filter: 'blur(5px)',
      transition: {
        duration: 0.22,
      },
    }),
  };

  const referencesVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      scale: 0.9,
      rotateZ: dir * 4,
      y: 40,
      filter: 'blur(10px)',
    }),
    animate: {
      opacity: 1,
      scale: 1,
      rotateZ: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 140,
        damping: 18,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.9,
      rotateZ: dir * -4,
      y: -40,
      filter: 'blur(10px)',
      transition: {
        duration: 0.25,
      },
    }),
  };

  // Load persisted custom photo if any
  useEffect(() => {
    // 1. Trace authenticating session
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // 2. Load local persistence as initial instant render fallback/cache
    const savedHome = BAKE_CONFIG['portfolio_home_profile'] || BAKE_CONFIG['precious_lara_saved_photo_home'] || localStorage.getItem('portfolio_home_profile') || localStorage.getItem('precious_lara_saved_photo_home') || localStorage.getItem('precious_lara_saved_photo_v2');
    const savedAbout = BAKE_CONFIG['portfolio_about_profile'] || BAKE_CONFIG['precious_lara_saved_photo_about'] || localStorage.getItem('portfolio_about_profile') || localStorage.getItem('precious_lara_saved_photo_about') || localStorage.getItem('precious_lara_saved_photo_v2');
    if (savedHome) {
      setHomeProfileImage(savedHome);
    }
    if (savedAbout) {
      setAboutProfileImage(savedAbout);
    }
    const savedLogo = BAKE_CONFIG['precious_lara_school_logo'] || localStorage.getItem('precious_lara_school_logo');
    if (savedLogo) {
      setSchoolLogo(savedLogo);
    }
    const savedCed = BAKE_CONFIG['precious_lara_ced_image'] || localStorage.getItem('precious_lara_ced_image');
    if (savedCed) {
      setCedImage(savedCed);
    }
    const savedMidterm = BAKE_CONFIG['zipgrade_photo_midterm'] || localStorage.getItem('zipgrade_photo_midterm');
    if (savedMidterm) {
      setMidtermZipgradePhoto(savedMidterm);
    }
    const savedFinal = BAKE_CONFIG['zipgrade_photo_final'] || localStorage.getItem('zipgrade_photo_final');
    if (savedFinal) {
      setFinalZipgradePhoto(savedFinal);
    }

    // 3. Fetch premium cloud assets from Google Cloud Firestore
    const fetchGlobalAssets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'portfolio_assets'));
        const cloudData: Record<string, string> = {};
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data) {
            if (typeof data.val === 'string' && data.val.startsWith('data:image')) {
              cloudData[docSnap.id] = data.val;
            } else if (docSnap.id === 'global_config') {
              // Backward compatibility for old single multi-megabyte document representation
              Object.entries(data).forEach(([k, v]) => {
                if (typeof v === 'string' && v.startsWith('data:image')) {
                  cloudData[k] = v;
                }
              });
            }
          }
        });

        if (Object.keys(cloudData).length > 0) {
          const safeSaveLocal = (key: string, value: string) => {
            try {
              localStorage.setItem(key, value);
            } catch (err) {
              console.warn(`Local storage write failed for key ${key}:`, err);
            }
          };

          if (cloudData.portfolio_home_profile) {
            setHomeProfileImage(cloudData.portfolio_home_profile);
            safeSaveLocal('portfolio_home_profile', cloudData.portfolio_home_profile);
          }
          if (cloudData.portfolio_about_profile) {
            setAboutProfileImage(cloudData.portfolio_about_profile);
            safeSaveLocal('portfolio_about_profile', cloudData.portfolio_about_profile);
          }
          if (cloudData.precious_lara_saved_photo_home) {
            setHomeProfileImage(cloudData.precious_lara_saved_photo_home);
            safeSaveLocal('precious_lara_saved_photo_home', cloudData.precious_lara_saved_photo_home);
          }
          if (cloudData.precious_lara_saved_photo_about) {
            setAboutProfileImage(cloudData.precious_lara_saved_photo_about);
            safeSaveLocal('precious_lara_saved_photo_about', cloudData.precious_lara_saved_photo_about);
          }
          if (cloudData.precious_lara_school_logo) {
            setSchoolLogo(cloudData.precious_lara_school_logo);
            safeSaveLocal('precious_lara_school_logo', cloudData.precious_lara_school_logo);
          }
          if (cloudData.precious_lara_ced_image) {
            setCedImage(cloudData.precious_lara_ced_image);
            safeSaveLocal('precious_lara_ced_image', cloudData.precious_lara_ced_image);
          }
          if (cloudData.zipgrade_photo_midterm) {
            setMidtermZipgradePhoto(cloudData.zipgrade_photo_midterm);
            safeSaveLocal('zipgrade_photo_midterm', cloudData.zipgrade_photo_midterm);
          }
          if (cloudData.zipgrade_photo_final) {
            setFinalZipgradePhoto(cloudData.zipgrade_photo_final);
            safeSaveLocal('zipgrade_photo_final', cloudData.zipgrade_photo_final);
          }
          
          // Load document images as well
          setDocImages(prev => {
            const updated = { ...prev };
            let changed = false;
            for (let i = 1; i <= 6; i++) {
              const key = `portfolio_doc_img_${i}`;
              if (cloudData[key]) {
                updated[`doc${i}`] = cloudData[key];
                safeSaveLocal(key, cloudData[key]);
                changed = true;
              }
            }
            return changed ? updated : prev;
          });
        }
      } catch (err) {
        console.warn('Firestore fallback: loading locally', err);
      }
    };

    fetchGlobalAssets();

    return () => unsubscribe();
  }, []);

  const handleHomePhotoChange = async (newSrc: string) => {
    if (currentUser?.email !== 'heyitsnyxiii@gmail.com') return;
    setHomeProfileImage(newSrc);
    try {
      const compressed = await compressBase64(newSrc, 800, 800, 0.85);
      setHomeProfileImage(compressed);
      localStorage.setItem('precious_lara_saved_photo_home', compressed);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAboutPhotoChange = async (newSrc: string) => {
    if (currentUser?.email !== 'heyitsnyxiii@gmail.com') return;
    setAboutProfileImage(newSrc);
    try {
      const compressed = await compressBase64(newSrc, 800, 800, 0.85);
      setAboutProfileImage(compressed);
      localStorage.setItem('precious_lara_saved_photo_about', compressed);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSchoolLogoChange = async (newSrc: string) => {
    if (currentUser?.email !== 'heyitsnyxiii@gmail.com') return;
    setSchoolLogo(newSrc);
    try {
      const compressed = await compressBase64(newSrc, 200, 200, 0.75);
      setSchoolLogo(compressed);
      localStorage.setItem('precious_lara_school_logo', compressed);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCedPhotoChange = async (newSrc: string) => {
    if (currentUser?.email !== 'heyitsnyxiii@gmail.com') return;
    setCedImage(newSrc);
    try {
      const compressed = await compressBase64(newSrc, 500, 350, 0.7);
      setCedImage(compressed);
      localStorage.setItem('precious_lara_ced_image', compressed);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      alert("Sign in failed: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePushToCloud = async () => {
    if (!auth.currentUser || auth.currentUser.email !== 'heyitsnyxiii@gmail.com') {
      alert("Unauthorized: Only the portfolio administrator can sync assets globally.");
      return;
    }
    
    setIsCloudSyncing(true);
    setCloudSyncMessage(null);
    try {
      const keys = [
        'portfolio_home_profile',
        'portfolio_about_profile',
        'portfolio_doc_img_1',
        'portfolio_doc_img_2',
        'portfolio_doc_img_3',
        'portfolio_doc_img_4',
        'portfolio_doc_img_5',
        'portfolio_doc_img_6',
        'precious_lara_ced_image',
        'precious_lara_saved_photo_home',
        'precious_lara_saved_photo_about',
        'precious_lara_school_logo',
        'zipgrade_photo_midterm',
        'zipgrade_photo_final'
      ];
      
      let uploadCount = 0;
      for (const k of keys) {
        try {
          const val = localStorage.getItem(k);
          if (val && val.startsWith('data:image')) {
            const docRef = doc(db, 'portfolio_assets', k);
            await setDoc(docRef, { val });
            uploadCount++;
          }
        } catch (e) {
          console.error(`Failed to push key ${k}:`, e);
        }
      }

      if (uploadCount === 0) {
        setCloudSyncMessage("⚠️ No custom uploaded images found in your browser cache to sync.");
      } else {
        setCloudSyncMessage(`✓ Successfully saved ${uploadCount} uploaded image(s) to real Firebase Cloud Database! Anyone visiting your portfolio will see these images instantly.`);
      }
    } catch (err) {
      console.error(err);
      try {
        handleFirestoreError(err, OperationType.WRITE, 'portfolio_assets');
      } catch (e: any) {
        setCloudSyncMessage(`⚠️ Sync failed: ${e.message}`);
      }
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Keyboard navigation for binder-flipping feel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % TABS.length;
        setActiveTab(TABS[nextIndex].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        setActiveTab(TABS[prevIndex].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const handleNextSection = () => {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
    const nextIndex = (currentIndex + 1) % TABS.length;
    setActiveTab(TABS[nextIndex].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevSection = () => {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab);
    const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    setActiveTab(TABS[prevIndex].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clean Minimalism design parameters
  const getThemeStyles = () => {
    return {
      bg: 'bg-[#F7F5F0]', // Alabaster warm cream base
      panelBg: 'bg-[#EAE8E0]', // Earthy grey highlight blocks
      itemBg: 'bg-[#F0EEE6]', // Intermediate warm grey
      text: 'text-[#2C2C2C]', // Charcoal body
      heading: 'text-[#1A1A1A] font-serif', // Dark carbon serif
      accent: 'text-[#5A5A40]', // Sage olive accent
      lineColor: 'border-[#2C2C2C]/10', // Fine thin minimal border
      cardBg: 'bg-[#FDFCF9] border border-[#2C2C2C]/10 shadow-[0_1px_3px_rgba(0,0,0,0.02)]' // Soft crisp cards
    };
  };

  const theme = getThemeStyles();

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans transition-colors duration-400 flex flex-col justify-between`}>
      {/* Top persistent navigation bar */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tabs={TABS} 
        schoolLogo={schoolLogo}
        onSchoolLogoChange={handleSchoolLogoChange}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-10 overflow-hidden relative" style={{ perspective: '1200px' }}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {/* ================= HOME TAB ================= */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              custom={direction}
              variants={homeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6 md:space-y-10 w-full relative"
            >
              {/* Floating Parallax Biology Elements in the Margins for interactive feel */}
              <div className="absolute inset-y-0 w-full pointer-events-none hidden xl:block overflow-visible select-none z-0">
                <FloatingDnaStrand speed={0.4} className="left-[-110px] top-[260px]" />
                <FloatingHanddrawnLeaf speed={-0.3} className="right-[-120px] top-[550px]" />
                <FloatingCellBiology speed={0.5} className="left-[-130px] top-[950px]" />
              </div>

            {/* Massive Brand-Styled Editorial MSU-IIT Header (Burnt Burgundy & Campus Line Art Articulation) */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#4F0E16] via-[#2F060A] to-[#120001] border-2 border-[#5A0C12]/35 py-24 md:py-32 px-6 text-center text-white shadow-xl group transition-all duration-500">
              {/* Authentic Diagonal Highlight Stripes Overlay from the MSU-IIT brand design */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] bg-[size:60px_60px] pointer-events-none transition-transform duration-[10s] group-hover:bg-[size:50px_50px]" />

              {/* High Fidelity Responsive Campus Blueprint Outline Wireframes (Left & Right Sides) */}
              <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none select-none z-0">
                <svg className="absolute bottom-0 left-0 w-full h-32 md:h-44 xl:h-48 opacity-25 group-hover:opacity-40 transition-opacity duration-700" viewBox="0 0 1000 160" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  {/* Left Side Campus Outline */}
                  <g stroke="#ffffff" strokeWidth="1" opacity="0.8">
                    {/* Science Tower */}
                    <rect x="25" y="60" width="35" height="100" rx="1" strokeWidth="1.2" />
                    <line x1="42" y1="60" x2="42" y2="160" strokeWidth="0.8" />
                    <line x1="25" y1="80" x2="60" y2="80" strokeWidth="0.5" />
                    <line x1="25" y1="100" x2="60" y2="100" strokeWidth="0.5" />
                    <line x1="25" y1="120" x2="60" y2="120" strokeWidth="0.5" />
                    <line x1="25" y1="140" x2="60" y2="140" strokeWidth="0.5" />
                    
                    {/* Center Dome Building 1 */}
                    <path d="M 68 160 L 68 90 A 20 20 0 0 1 108 90 L 108 160 Z" strokeWidth="1.2" />
                    <line x1="69" y1="105" x2="107" y2="105" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                    <line x1="69" y1="120" x2="107" y2="120" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                    <line x1="69" y1="135" x2="107" y2="135" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                    <line x1="88" y1="92" x2="88" y2="160" strokeWidth="0.8" />

                    {/* Integrated Double Helix Pillar representing Biology & Life Science Education */}
                    <line x1="120" y1="160" x2="120" y2="40" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="132" y1="160" x2="132" y2="40" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 115 40 L 137 40" strokeWidth="2" strokeLinecap="round" />
                    {/* Helix Nodes */}
                    <path d="M 120 50 Q 126 45 132 50" strokeWidth="1.2" />
                    <path d="M 120 65 Q 126 70 132 65" strokeWidth="1.2" />
                    <path d="M 120 80 Q 126 75 132 80" strokeWidth="1.2" />
                    <path d="M 120 95 Q 126 100 132 95" strokeWidth="1.2" />
                    <path d="M 120 110 Q 126 105 132 110" strokeWidth="1.2" />
                    <path d="M 120 125 Q 126 130 132 125" strokeWidth="1.2" />
                    <path d="M 120 140 Q 126 135 132 140" strokeWidth="1.2" />
                    <circle cx="120" cy="50" r="2" fill="#ffffff" />
                    <circle cx="132" cy="50" r="2" fill="#ffffff" />
                    <circle cx="120" cy="80" r="2" fill="#ffffff" />
                    <circle cx="132" cy="80" r="2" fill="#ffffff" />
                    <circle cx="120" cy="110" r="2" fill="#ffffff" />
                    <circle cx="132" cy="110" r="2" fill="#ffffff" />
                    <circle cx="120" cy="140" r="2" fill="#ffffff" />
                    <circle cx="132" cy="140" r="2" fill="#ffffff" />

                    {/* Labs and Research Blocks */}
                    <rect x="145" y="100" width="60" height="60" rx="1" strokeWidth="1" />
                    <line x1="145" y1="115" x2="205" y2="115" strokeWidth="0.5" />
                    <line x1="145" y1="130" x2="205" y2="130" strokeWidth="0.5" />
                    <line x1="145" y1="145" x2="205" y2="145" strokeWidth="0.5" />
                    <line x1="165" y1="100" x2="165" y2="160" strokeWidth="0.5" />
                    <line x1="185" y1="100" x2="185" y2="160" strokeWidth="0.5" />
                  </g>

                  {/* Right Side Campus Outline */}
                  <g stroke="#ffffff" strokeWidth="1" opacity="0.8">
                    {/* Academic Center Block */}
                    <rect x="780" y="70" width="80" height="90" rx="2" strokeWidth="1.2" />
                    <line x1="780" y1="85" x2="860" y2="85" strokeWidth="0.5" />
                    <line x1="780" y1="100" x2="860" y2="100" strokeWidth="0.5" />
                    <line x1="780" y1="115" x2="860" y2="115" strokeWidth="0.5" />
                    <line x1="780" y1="130" x2="860" y2="130" strokeWidth="0.5" />
                    <line x1="780" y1="145" x2="860" y2="145" strokeWidth="0.5" />
                    <line x1="800" y1="70" x2="800" y2="160" strokeWidth="0.5" />
                    <line x1="820" y1="70" x2="820" y2="160" strokeWidth="0.5" />
                    <line x1="840" y1="70" x2="840" y2="160" strokeWidth="0.5" />

                    {/* Classic angled roof pavilion */}
                    <path d="M 870 160 L 870 90 L 935 55 L 935 160 Z" strokeWidth="1.2" />
                    <line x1="870" y1="105" x2="935" y2="105" strokeWidth="0.5" />
                    <line x1="870" y1="125" x2="935" y2="125" strokeWidth="0.5" />
                    <line x1="870" y1="145" x2="935" y2="145" strokeWidth="0.5" />
                    <line x1="902" y1="72" x2="902" y2="160" strokeWidth="0.8" />

                    {/* Right-most science tower segment */}
                    <path d="M 945 160 L 945 110 L 975 90 L 975 160 Z" strokeWidth="1.1" />
                    <circle cx="960" cy="115" r="3" stroke="#ffffff" strokeWidth="0.8" />
                  </g>
                </svg>
              </div>

              {/* Main Content Area centered gracefully */}
              <div className="relative max-w-3xl mx-auto space-y-6 z-10 pt-8 pb-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)]">
                  <TypewriterScrollText 
                    text="Technology for Teaching and Learning Portfolio" 
                    delay={0.15}
                  />
                </h1>
                <p className="text-stone-200/90 font-sans text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  A collection of digital projects, instructional materials, and educational technologies developed throughout my journey as a Biology Education student.
                </p>
              </div>
            </div>

            {/* Elegant supportive statement block - sized submissively to avoid competing with main title */}
            <ScrollRevealBox yOffset={20} delay={0.1}>
              <div className="bg-[#FDFCF9] border border-[#2C2C2C]/10 rounded-xl py-6 px-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                <div className="max-w-xl mx-auto space-y-1.5">
                  <span className="text-[#5A5A40] font-mono text-[10px] tracking-[0.25em] uppercase font-bold">The Educator's Core Motto</span>
                  <p className="text-[#1A1A1A] font-serif text-xl md:text-2xl font-extrabold italic tracking-tight leading-snug">
                    "Making Science Click—Together."
                  </p>
                  <div className="flex justify-center items-center space-x-2 pt-1">
                    <div className="w-8 h-[1px] bg-[#5A5A40]/20"></div>
                    <span className="text-[#5A5A40] font-sans text-[10px] font-semibold tracking-wider uppercase">Interactive • Accessible • Inspiring</span>
                    <div className="w-8 h-[1px] bg-[#5A5A40]/20"></div>
                  </div>
                </div>
              </div>
            </ScrollRevealBox>

            {/* Master Introduction Profile Area (Clean Minimalist Grid) */}
            <ScrollRevealBox yOffset={25}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#FDFCF9] p-6 md:p-8 rounded-xl border border-[#2C2C2C]/10 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                {/* Left Bio Column */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-8 py-2">
                  <div className="space-y-6">
                    <div className="space-y-3 border-b border-[#2C2C2C]/10 pb-5">
                      <span className="text-[#5A5A40] font-mono text-xs md:text-sm tracking-[0.25em] uppercase font-bold">Future Science Educator</span>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-serif text-[#1A1A1A] leading-tight">
                        <TypewriterScrollText text="Hello, I'm Precious Lara!" delay={0.2} />
                      </h2>
                    </div>
                    <FadeInText 
                      className="text-[#2C2C2C]/90 font-sans text-base md:text-lg lg:text-xl leading-relaxed md:leading-loose tracking-wide"
                      text="I am a Biology Education student at MSU-IIT with a passion for creating learning experiences that spark curiosity rather than rely on memorization. I am particularly interested in how technology can make science more interactive, meaningful, and accessible to students."
                    />
                    <FadeInText 
                      className="text-[#2C2C2C]/90 font-sans text-base md:text-lg lg:text-xl leading-relaxed md:leading-loose tracking-wide"
                      text="This portfolio showcases digital projects, instructional materials, and collaborative outputs developed throughout my academic journey. Through these works, I aim to create engaging and meaningful learning experiences that make science more accessible to students."
                    />
                  </div>
                  
                  <div className="pt-2">
                    {/* Quick-Access Clean Minimalist Navigation CTAs */}
                    <div className="flex flex-wrap gap-3.5">
                      <button
                        onClick={() => {
                          setActiveTab('outputs');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-[#F7F5F0] border border-[#2C2C2C]/10 text-xs md:text-sm font-sans font-bold rounded-lg shadow-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-95 group"
                      >
                        <span>Explore Outputs</span>
                        <ArrowRight className="w-4 h-4 text-amber-400 transition-transform group-hover:translate-x-0.5" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('philosophy');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 bg-[#F0EEE6] hover:bg-[#EAE8E0] text-[#1A1A1A] border border-[#2C2C2C]/10 text-xs md:text-sm font-sans font-bold rounded-lg shadow-sm transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                      >
                        <span>Read My Teaching Philosophy</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Portrait Image Column */}
                <div className="lg:col-span-4 flex justify-center lg:justify-start items-stretch lg:pl-4">
                  <div className="relative p-3 bg-[#F0EEE6] rounded-xl border border-[#2C2C2C]/10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] w-full max-w-[420px] lg:max-w-full text-center flex flex-col justify-stretch">
                    <StudentAvatar 
                      imageSrc={homeProfileImage} 
                      onImageChange={handleHomeProfileChange}
                      editable={currentUser?.email === 'heyitsnyxiii@gmail.com'}
                      className="w-full h-full min-h-[320px] lg:min-h-full rounded-lg block"
                    />
                  </div>
                </div>
              </div>
            </ScrollRevealBox>
          </motion.div>
        )}
        {/* ================= ABOUT ME TAB ================= */}
        {activeTab === 'about' && (
          <motion.div
            key="about"
            custom={direction}
            variants={aboutVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8 text-[#2C2C2C] w-full max-w-5xl mx-auto relative"
          >
            {/* Margin floaters for interactive parallax scrolling */}
            <div className="absolute inset-y-0 w-full pointer-events-none hidden xl:block overflow-visible select-none z-0">
              <FloatingHanddrawnLeaf speed={0.5} className="right-[-125px] top-[140px]" />
              <FloatingCellBiology speed={-0.3} className="left-[-135px] top-[480px]" />
            </div>

            {/* Header bar matching Clean Minimalism */}
            <div className="bg-[#F0EEE6] text-[#1A1A1A] py-5 px-6 rounded-lg text-center border border-[#2C2C2C]/10 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <h2 className="text-xs sm:text-sm md:text-md lg:text-[15px] font-sans tracking-[0.16em] uppercase font-bold text-[#5A5A40] leading-relaxed">
                <TypewriterScrollText 
                  text="CREATING NEW WAYS TO TEACH BIOLOGY WITH MODERN CLASSROOM TECHNOLOGY" 
                  highlightWords={["Biology", "Technology"]}
                />
              </h2>
            </div>

            {/* Main Details Grid */}
            <ScrollRevealBox yOffset={25}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
              {/* Left details pane */}
              <div className="lg:col-span-5 bg-[#FDFCF9] p-6 lg:p-8 rounded-xl border border-[#2C2C2C]/10 shadow-sm flex flex-col items-center justify-between space-y-6">
                <div className="flex flex-col items-center justify-center w-full flex-grow pb-2">
                  <StudentAvatar 
                    imageSrc={aboutProfileImage} 
                    onImageChange={handleAboutProfileChange}
                    editable={currentUser?.email === 'heyitsnyxiii@gmail.com'}
                    className="w-full aspect-square max-w-[340px] rounded-xl shadow-sm border border-[#2C2C2C]/15 transition-transform hover:scale-[1.01]"
                  />
                </div>

                <div className="text-center w-full pb-2">
                  <h3 className="font-serif font-black text-xl md:text-2xl text-[#1A1A1A]">Precious Lara L. Degoma</h3>
                  <p className="text-xs md:text-sm font-mono tracking-widest text-[#5A5A40] uppercase font-bold mt-1">BSED BIOLOGY STUDENT</p>
                </div>

                <div className="w-full flex flex-col space-y-4">
                  {/* Google Drive CV Link Button */}
                  <a
                    href={SOCIAL_LINKS.cv}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-5 bg-[#1A1A1A] hover:bg-[#2C2C2C] text-[#F7F5F0] text-sm md:text-base font-sans font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FolderOpen className="w-5 h-5 text-[#F7F5F0]" />
                    <span>View Full CV</span>
                  </a>

                  {/* Connect with me section */}
                  <div className="w-full border-t border-[#2C2C2C]/10 pt-4 flex flex-col items-center space-y-3">
                    <span className="text-sm md:text-base font-mono tracking-widest uppercase font-bold text-[#5A5A40]">Connect with me:</span>
                    <div className="flex justify-center space-x-4">
                      <a
                        href={SOCIAL_LINKS.email}
                        target="_blank"
                        rel="noreferrer"
                        className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#F0EEE6] text-[#2C2C2C] flex items-center justify-center hover:bg-[#2C2C2C] hover:text-[#F7F5F0] transition-colors border border-[#2C2C2C]/10"
                        title="Send Email"
                      >
                        <Mail className="w-5 h-5 md:w-5.5 md:h-5.5" />
                      </a>
                      <a
                        href={SOCIAL_LINKS.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#F0EEE6] text-[#2C2C2C] flex items-center justify-center hover:bg-[#2C2C2C] hover:text-[#F7F5F0] transition-colors border border-[#2C2C2C]/10"
                        title="Visit Facebook Profile"
                      >
                        <Facebook className="w-5 h-5 md:w-5.5 md:h-5.5" />
                      </a>
                      <a
                        href={SOCIAL_LINKS.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#F0EEE6] text-[#2C2C2C] flex items-center justify-center hover:bg-[#2C2C2C] hover:text-[#F7F5F0] transition-colors border border-[#2C2C2C]/10"
                        title="Visit Instagram Profile"
                      >
                        <Instagram className="w-5 h-5 md:w-5.5 md:h-5.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right text Statement pane */}
              <div className="lg:col-span-7 bg-[#FDFCF9] p-6 md:p-8 rounded-xl border border-[#2C2C2C]/10 shadow-[0_1px_3px_rgba(0,0,0,0.01)] leading-relaxed space-y-6">
                <div className="border-b border-[#2C2C2C]/15 pb-2 text-center">
                  <h3 className="font-serif text-[#1A1A1A] font-extrabold text-2xl md:text-3xl lg:text-4xl tracking-wider uppercase leading-relaxed max-w-2xl mx-auto">
                    About me
                  </h3>
                </div>
                
                {/* Paragraph 1 */}
                <FadeInText text="I’ve always believed that science should be experienced, not just memorized. My time at MSU-IIT has been focused on finding ways to take complex biology concepts out of textbooks and turn them into interactive, hands-on lessons. I want to use technology to make sure every student, regardless of how they learn, feels capable of discovery." className="font-serif text-[#2C2C2C] text-sm md:text-base leading-relaxed text-justify" />

                {/* Paragraph 2 */}
                <FadeInText text="While maintaining consistent honors keeps me grounded in lab work and theory, my real-world education happened in our family's retail business. Balancing school while helping run a business taught me practical discipline, fast problem-solving, and how to connect with people from all walks of life—skills I carry directly into my training as a future teacher." className="font-serif text-[#2C2C2C] text-sm md:text-base leading-relaxed text-justify" />

                {/* Paragraph 3 */}
                <FadeInText text="As an aspiring educator, I live for the moment when a difficult concept finally 'clicks' for a student. My ultimate goal is to create inclusive classrooms where scientific inquiry feels natural, exciting, and accessible to everyone." className="font-serif text-[#2C2C2C] text-sm md:text-base leading-relaxed text-justify" />

                {/* Biology core badges */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px] text-[#2C2C2C]/80">
                  <a
                    href="https://docs.google.com/document/d/18bpeyPSyfFxUh7Qumxvp26hnziRMuE5deW8b3vYrFOo/edit?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#F0EEE6] hover:bg-[#EAE8E0] hover:border-[#5A5A40]/40 p-2.5 rounded border border-[#2C2C2C]/10 flex items-center justify-center space-x-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-center transition-all duration-200 group/badge"
                  >
                    <CheckCircle className="w-4 h-4 text-[#5A5A40] flex-shrink-0" />
                    <span className="font-serif font-semibold text-xs md:text-sm text-[#1A1A1A] group-hover/badge:underline decoration-[#5A5A40]/55">Interactive Lessons</span>
                    <ExternalLink className="w-3 h-3 text-[#5A5A40]/60 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                  </a>

                  <button
                    onClick={() => {
                      setActiveTab('documentation');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-[#F0EEE6] hover:bg-[#EAE8E0] hover:border-[#1A1A1A]/30 p-2.5 rounded border border-[#2C2C2C]/10 flex items-center justify-center space-x-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-center transition-all duration-200 cursor-pointer group/badge"
                  >
                    <CheckCircle className="w-4 h-4 text-[#5A5A40] flex-shrink-0" />
                    <span className="font-serif font-semibold text-xs md:text-sm text-[#1A1A1A] group-hover/badge:underline decoration-[#1A1A1A]/40">Welcoming Classrooms</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1A1A1A]/60 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                  </button>

                  <a
                    href="https://docs.google.com/document/d/1t0mbimx9iPXieHJIHNyK73X3l3ikF9DMciZX7XOUrp0/edit?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#F0EEE6] hover:bg-[#EAE8E0] hover:border-[#5A5A40]/40 p-2.5 rounded border border-[#2C2C2C]/10 flex items-center justify-center space-x-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-center transition-all duration-200 group/badge"
                  >
                    <CheckCircle className="w-4 h-4 text-[#5A5A40] flex-shrink-0" />
                    <span className="font-serif font-semibold text-xs md:text-sm text-[#1A1A1A] group-hover/badge:underline decoration-[#5A5A40]/55">Digital Tools</span>
                    <ExternalLink className="w-3 h-3 text-[#5A5A40]/60 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>
            </ScrollRevealBox>
          </motion.div>
        )}

        {/* ================= ACKNOWLEDGMENT TAB ================= */}
        {activeTab === 'acknowledgment' && (
          <motion.div
            key="acknowledgment"
            custom={direction}
            variants={acknowledgmentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-12 text-[#2C2C2C] w-full relative"
          >
            {/* Margin floaters for interactive parallax scrolling */}
            <div className="absolute inset-y-0 w-full pointer-events-none hidden xl:block overflow-visible select-none z-0">
              <FloatingDnaStrand speed={0.4} className="left-[-125px] top-[220px]" />
              <FloatingHanddrawnLeaf speed={-0.3} className="right-[-120px] top-[600px]" />
            </div>

            {/* Elegant Header Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-950 py-20 px-6 text-center text-white border border-stone-800 shadow-lg min-h-[280px] flex items-center justify-center">
              <img 
                src={msuIitGymBg} 
                alt="MSU-IIT Gymnasium Stage" 
                className="absolute inset-0 object-cover w-full h-full opacity-65"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/60"></div>
              <div className="relative max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center justify-center p-2.5 bg-black/50 backdrop-blur-xs rounded-full border border-white/10 mb-2">
                  <GraduationCap className="w-8 h-8 text-amber-300" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-white uppercase drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                  <TypewriterScrollText text="Acknowledgments of Gratitude" delay={0.1} />
                </h2>
                <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full shadow-sm"></div>
              </div>
            </div>

            {/* Interactive Gratitude Experience */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Vertical Interactive Tributes Navigation */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#FDFCF9] rounded-2xl border border-[#2C2C2C]/10 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] space-y-3">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#5A5A40] uppercase block mb-2">Dedications</span>
                  
                  {/* Selector 1: Mentor */}
                  <button
                    onClick={() => setActiveAckId('mentor')}
                    className={`w-full text-left p-4 rounded-xl border flex items-center space-x-3.5 transition-all duration-300 group cursor-pointer ${
                      activeAckId === 'mentor'
                        ? 'bg-amber-50/70 border-[#5A5A40] shadow-[0_2px_4px_rgba(245,158,11,0.05)] font-semibold'
                        : 'border-[#2C2C2C]/10 hover:border-[#5A5A40]/40 hover:bg-[#FDFCF9]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                      activeAckId === 'mentor' ? 'bg-[#5A5A40] text-white' : 'bg-[#F0EEE6] text-[#5A5A40]'
                    } group-hover:scale-105`}>
                      <Award className="w-5 h-5 flex-shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">My Direct Mentor</h4>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">Prof. Rizalina G. Gomez</p>
                    </div>
                  </button>

                  {/* Selector 2: Family */}
                  <button
                    onClick={() => setActiveAckId('family')}
                    className={`w-full text-left p-4 rounded-xl border flex items-center space-x-3.5 transition-all duration-300 group cursor-pointer ${
                      activeAckId === 'family'
                        ? 'bg-amber-50/70 border-[#5A5A40] shadow-[0_2px_4px_rgba(245,158,11,0.05)] font-semibold'
                        : 'border-[#2C2C2C]/10 hover:border-[#5A5A40]/40 hover:bg-[#FDFCF9]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                      activeAckId === 'family' ? 'bg-[#5A5A40] text-white' : 'bg-[#F0EEE6] text-[#5A5A40]'
                    } group-hover:scale-105`}>
                      <HeartHandshake className="w-5 h-5 flex-shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">My Beloved Family</h4>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">My Constant Support</p>
                    </div>
                  </button>

                  {/* Selector 3: Community */}
                  <button
                    onClick={() => setActiveAckId('community')}
                    className={`w-full text-left p-4 rounded-xl border flex items-center space-x-3.5 transition-all duration-300 group cursor-pointer ${
                      activeAckId === 'community'
                        ? 'bg-amber-50/70 border-[#5A5A40] shadow-[0_2px_4px_rgba(245,158,11,0.05)] font-semibold'
                        : 'border-[#2C2C2C]/10 hover:border-[#5A5A40]/40 hover:bg-[#FDFCF9]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                      activeAckId === 'community' ? 'bg-[#5A5A40] text-white' : 'bg-[#F0EEE6] text-[#5A5A40]'
                    } group-hover:scale-105`}>
                      <Compass className="w-5 h-5 flex-shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">Community & Almighty</h4>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">MSU-IIT & Divine Grace</p>
                    </div>
                  </button>
                </div>

                {/* What they inspired block */}
                <div className="bg-[#FAF9F5] rounded-2xl border border-[#2C2C2C]/8 p-5 space-y-4">
                  <h4 className="font-serif font-bold text-xs tracking-wider uppercase text-stone-600">The Power of Tribute</h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Teaching is a deeply human, collaborative endeavor. These dedicated sections honor the brilliant scaffolding, persistent work ethics, and lifelong spiritual guidance that powered my development as a 2nd year BSEd Biology student.
                  </p>
                </div>
              </div>

              {/* Right Column: Heartfelt Dedication Letter Box */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeAckId}
                    initial={{ opacity: 0, x: 25, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -25, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#FFFDF9] border border-[#2C2C2C]/10 rounded-2xl p-6 md:p-10 shadow-[0_4px_16px_rgba(0,0,0,0.02)] relative overflow-hidden space-y-6"
                  >
                    {/* Artistic watermark element */}
                    <div className="absolute top-0 right-0 w-36 h-36 bg-[#EAE8E0]/20 rounded-bl-full pointer-events-none -mr-4 -mt-4"></div>
                    
                    {/* Header segment of letter */}
                    <div className="border-b border-[#2C2C2C]/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#5A5A40] font-bold block">GRATITUDE DEDICATION</span>
                        <h3 className="font-serif font-black text-xl md:text-2xl text-[#1A1A1A] tracking-tight mt-1">
                          {activeAckId === 'mentor' && 'DEDICATION TO MY ACADEMIC MENTOR'}
                          {activeAckId === 'family' && 'TRIBUTE TO MY BELOVED FAMILY'}
                          {activeAckId === 'community' && 'GRATITUDE TO THE COMMUNITY & DIVINE GRACE'}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-1.5 self-start md:self-auto bg-stone-150 py-1 px-3 rounded-full font-mono text-[10px] tracking-wider text-stone-600 border border-stone-250">
                        <span>Dedicated to:</span>
                        <strong className="text-stone-800">
                          {activeAckId === 'mentor' && 'Prof. Rizalina G. Gomez'}
                          {activeAckId === 'family' && 'My Parents & Kin'}
                          {activeAckId === 'community' && 'MSU-IIT & the Lord'}
                        </strong>
                      </div>
                    </div>

                    {/* Detailed message body */}
                    <div className="space-y-5">
                      {activeAckId === 'mentor' && (
                        <div className="space-y-6 text-[#2C2C2C] italic font-serif text-sm md:text-base leading-relaxed">
                          <FadeInText text={`To my professor and portfolio adviser, ${ACKNOWLEDGMENTS.mentor.name} — thank you for showing me how biology and technology can join together. You taught us to look beyond simple lectures and push our boundaries as future educators.`} className="indent-8 text-stone-750" />
                          <FadeInText text="This technology portfolio is the direct result of all those discussions in class, your feedback, and the standards you set for us. Under your guidance, I learned how to build lessons that actually keep high schoolers curious." className="indent-8 text-stone-750" />
                          <FadeInText text="Your lessons on patience and thorough preparation have been our best anchor. I'll carry these practices with me to my future classrooms. Thank you for your guidance." className="indent-8 text-stone-750" />
                        </div>
                      )}

                      {activeAckId === 'family' && (
                        <div className="space-y-6 text-[#2C2C2C] italic font-serif text-sm md:text-base leading-relaxed">
                          <FadeInText text="To my parents and family, who never doubted me once—thank you for being my constant foundation." className="indent-8 text-stone-750" />
                          <FadeInText text="Helping out with our family business and retail duties taught me more about endurance, hard work, and dealing with challenges than any schoolbook. You showed me what genuine dedication looks like in real time, day after day." className="indent-8 text-stone-750" />
                          <FadeInText text="Thank you for accepting my schedule, the continuous encouragement, and the quiet support when university life felt completely overwhelming. This milestone is yours as much as it is mine." className="indent-8 text-stone-750" />
                        </div>
                      )}

                      {activeAckId === 'community' && (
                        <div className="space-y-6 text-[#2C2C2C] italic font-serif text-sm md:text-base leading-relaxed">
                          <FadeInText text="To my fellow classmates in the 2nd Year BSEd Biology program at MSU-IIT — thank you for the shared slide decks, the quick review sessions, the laughs, and for keeping each other sane during stressful weeks." className="indent-8 text-stone-750" />
                          <FadeInText text="I am also incredibly grateful to the Almighty, who gave me strength and peace of mind when my resources ran thin. This portfolio is a small prayer of thanks for the grace that saw me through." className="indent-8 text-stone-750" />
                        </div>
                      )}
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

          </motion.div>
        )}

        {/* ================= SCHOOL PROFILE TAB ================= */}
        {activeTab === 'school-profile' && (
          <motion.div
            key="school-profile"
            custom={direction}
            variants={schoolProfileVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-12 text-[#2C2C2C] w-full max-w-6xl mx-auto relative"
          >
            {/* Margin floaters for interactive parallax scrolling */}
            <div className="absolute inset-y-0 w-full pointer-events-none hidden xl:block overflow-visible select-none z-0">
              <FloatingCellBiology speed={0.4} className="left-[-125px] top-[220px]" />
              <FloatingDnaStrand speed={-0.3} className="right-[-120px] top-[700px]" />
            </div>

            {/* Header banner matching Clean Minimalism */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#801b1b] via-[#6b1414] to-[#4F0E16] py-16 text-center border-2 border-[#5A0C12]/30 shadow-lg group">
              {/* Subtle background overlay */}
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.06)_50%,rgba(255,255,255,0.06)_75%,transparent_75%,transparent)] bg-[size:40px_40px] pointer-events-none" />
              <div className="relative space-y-3 z-10">
                <MsuIitLogo 
                  className="w-18 h-18 mx-auto mb-1 transition-transform group-hover:scale-105" 
                  imageSrc={schoolLogo}
                  onImageChange={handleSchoolLogoChange}
                  editable={currentUser?.email === 'heyitsnyxiii@gmail.com'}
                />
                <h2 className="text-3xl md:text-5xl font-black font-serif text-white tracking-tight drop-shadow-sm">
                  <TypewriterScrollText text="School Profile" delay={0.1} />
                </h2>
                <p className="text-sm md:text-base font-serif italic text-amber-200/95 tracking-wide font-medium max-w-2xl mx-auto">
                  Mindanao State University - Iligan Institute of Technology
                </p>
              </div>
            </div>

            {/* Grid 1: Broad Institutional Showcase (PAMANTASAN & FACULTY VANGUARD) */}
            <ScrollRevealBox yOffset={25}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Campus Fast-Facts & Crest Accent */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-[#FAF9F5] p-6 rounded-2xl border border-[#2C2C2C]/10 shadow-xs">
                <div className="space-y-4">
                  <div className="border-b border-[#2C2C2C]/10 pb-3 flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A5A40] font-bold">
                      Campus Statistics
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#801b1b] animate-pulse"></span>
                  </div>
                  
                  {/* Metric Chips */}
                  <div className="space-y-3">
                    <div className="bg-[#FDFCF9] p-4 rounded-xl border border-[#2C2C2C]/8">
                      <span className="block text-[9px] font-mono uppercase text-[#5A5A40]/70 tracking-wider">FOUNDED</span>
                      <span className="font-serif font-black text-base text-stone-850">July 12, 1968</span>
                      <p className="text-[10px] text-stone-500 mt-0.5 font-sans">Under Republic Act 5363</p>
                    </div>

                    <div className="bg-[#FDFCF9] p-4 rounded-xl border border-[#2C2C2C]/8">
                      <span className="block text-[9px] font-mono uppercase text-[#5A5A40]/70 tracking-wider">CAMPUS STATUS</span>
                      <span className="font-serif font-black text-base text-stone-850">Dakilang Pamantasan</span>
                      <p className="text-[10px] text-stone-500 mt-0.5 font-sans">Premier National State University</p>
                    </div>

                    <div className="bg-[#FDFCF9] p-4 rounded-xl border border-[#2C2C2C]/8">
                      <span className="block text-[9px] font-mono uppercase text-[#5A5A40]/70 tracking-wider">LOCALIZATION</span>
                      <span className="font-serif font-black text-base text-stone-850">Iligan City, Lanao del Norte</span>
                      <p className="text-[10px] text-stone-500 mt-0.5 font-sans">Mindanao, Philippines</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Dignity History/About Narrative */}
              <div className="lg:col-span-8 bg-[#FDFCF9] p-6 md:p-8 rounded-2xl border border-[#2C2C2C]/10 shadow-[0_1px_3px_rgba(0,0,0,0.015)] flex flex-col justify-between">
                <div className="space-y-5">
                  {/* Elegant editorial about format */}
                  <p className="font-serif text-[#2C2C2C]/90 text-base md:text-[17px] leading-relaxed md:leading-loose text-justify">
                    <span className="float-left text-5xl font-serif font-black mr-3 mt-1.5 text-[#801b1b] leading-none">M</span>
                    {SCHOOL_PROFILE.about}
                  </p>
                </div>

                {/* Bottom decorative anchor */}
                <div className="pt-4 border-t border-[#2C2C2C]/8 flex items-center justify-between text-[11px] font-mono text-[#5A5A40] mt-6">
                  <span>© 1968 - 2026 MSU-IIT</span>
                  <span className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#801b1b]"></span>
                    <span>Recognized Research University</span>
                  </span>
                </div>
              </div>
            </div>
            </ScrollRevealBox>

            {/* Strategic Spot: CED wide horizontal container */}
            <ScrollRevealBox yOffset={30}>
            <div className="bg-[#FDFCF9] border border-[#2C2C2C]/10 rounded-2xl p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.015)] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#5A5A40] font-bold block">THE TRAINING GROUND</span>
                    <h3 className="text-xl md:text-2xl font-serif font-black text-[#1A1A1A] tracking-tight">
                      College of Education (CED)
                    </h3>
                  </div>
                </div>

                <p className="font-serif text-stone-700 text-sm md:text-base leading-relaxed md:leading-loose text-justify">
                  {SCHOOL_PROFILE.college}
                </p>
              </div>

              {/* Outstanding Badges grid on right side */}
              <div className="md:col-span-4 space-y-4">
                {/* Polaroid Photo Frame */}
                <div 
                  onClick={() => {
                    if (currentUser?.email === 'heyitsnyxiii@gmail.com') {
                      cedFileInputRef.current?.click();
                    }
                  }}
                  className={`bg-[#FFFDF9] p-3 pb-5 rounded-xl border border-stone-300/80 shadow-md transform rotate-1 hover:rotate-0 hover:scale-[1.02] transition-all duration-300 relative ${currentUser?.email === 'heyitsnyxiii@gmail.com' ? 'cursor-pointer group' : ''}`}
                  title={currentUser?.email === 'heyitsnyxiii@gmail.com' ? "Click to upload custom picture" : ""}
                >
                  <input
                    type="file"
                    ref={cedFileInputRef}
                    onChange={handleCedFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {/* Image wrapper */}
                  <div className="relative aspect-[3/2] rounded-sm overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center">
                    <img 
                      src={cedImage || msuIitCedPhoto} 
                      alt="College of Education" 
                      className="w-full h-full object-cover filter contrast-[1.01] brightness-[0.99]"
                      referrerPolicy="no-referrer"
                    />
                    {currentUser?.email === 'heyitsnyxiii@gmail.com' && (
                      <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/45 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 text-[#1A1A1A] px-3 py-1.5 rounded-lg border border-black/10 text-[10px] font-mono font-bold shadow-sm flex items-center space-x-1.5">
                          <Camera className="w-3.5 h-3.5 text-[#801b1b]" />
                          <span>Change Photo</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Polaroid caption */}
                  <div className="mt-3 text-center px-1">
                    <p className="font-serif italic font-bold text-stone-850 text-xs text-[#801b1b] leading-tight">
                      College of Education Building
                    </p>
                  </div>

                  {cedImage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCedImage(null);
                        localStorage.removeItem('precious_lara_ced_image');
                      }}
                      className="absolute top-2 right-2 bg-white/95 hover:bg-white text-stone-700 p-1 rounded-full border border-stone-200 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xs hover:text-red-600 active:scale-90"
                      title="Reset to default image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Minimalist Accreditations Indicators */}
                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                  <div className="px-2 py-1.5 bg-[#FAF9F5] border border-stone-200/85 rounded-lg" title="Center of Excellence">
                    <span className="text-[9px] font-mono font-bold text-amber-700 tracking-wider block bg-amber-500/10 px-1 py-0.5 rounded leading-none mb-1">COE</span>
                    <span className="text-[9px] font-serif italic text-stone-600 leading-tight block">CHED Center of Excellence</span>
                  </div>
                  <div className="px-2 py-1.5 bg-[#FAF9F5] border border-stone-200/85 rounded-lg" title="Transformative Educators">
                    <span className="text-[9px] font-mono font-bold text-emerald-850 tracking-wider block bg-emerald-500/10 px-1 py-0.5 rounded leading-none mb-1">SDG</span>
                    <span className="text-[9px] font-serif italic text-stone-600 leading-tight block">Transformative Faculty</span>
                  </div>
                </div>
              </div>
            </div>
            </ScrollRevealBox>

            {/* Strategic Blueprint Layout: Quad-Grid showing VMGO (Vision, Mission, Philosophy & Values) */}
            <ScrollRevealBox yOffset={30}>
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[#5A5A40] font-mono text-xs tracking-[0.2em] uppercase font-bold block">The Strategic Charter</span>
                <h3 className="text-2xl md:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
                  Vision, Mission & Core Values
                </h3>
                <div className="w-12 h-0.5 bg-[#5A5A40]/30 mx-auto rounded"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vision Box */}
                <div className="bg-[#FDFCF9] border border-[#2C2C2C]/10 p-6 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded">
                      INSTITUTIONAL VISION
                    </span>
                    <FadeInText text={SCHOOL_PROFILE.vmgo.vision} className="font-serif italic text-stone-750 font-normal leading-relaxed text-sm md:text-base text-stone-800" />
                  </div>
                  <div className="text-[10px] font-mono text-stone-400">Determined Pursuits</div>
                </div>

                {/* Mission Box */}
                <div className="bg-[#FDFCF9] border border-[#2C2C2C]/10 p-6 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-blue-700 bg-blue-500/10 px-2.5 py-1 rounded">
                      CORE MISSION
                    </span>
                    <FadeInText text={SCHOOL_PROFILE.vmgo.mission} className="font-serif italic text-stone-750 font-normal leading-relaxed text-sm md:text-base text-stone-800" />
                  </div>
                  <div className="text-[10px] font-mono text-stone-400">Empowering Communities</div>
                </div>

                {/* Educational Philosophy Box */}
                <div className="bg-[#FDFCF9] border border-[#2C2C2C]/10 p-6 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between md:col-span-2 lg:col-span-1">
                  <div className="space-y-3">
                    <span className="inline-flex items-center text-[9px] font-mono font-bold tracking-wider text-[#5A5A40] bg-[#5A5A40]/10 px-2.5 py-1 rounded">
                      EDUCATIONAL PHILOSOPHY
                    </span>
                    <FadeInText text={SCHOOL_PROFILE.vmgo.philosophy} className="font-serif text-stone-700 text-sm leading-relaxed text-stone-800 text-justify" />
                  </div>
                  <div className="text-[10px] font-mono text-stone-400">Multicultural Learning</div>
                </div>

                {/* Core Institutional Values displayed as elegant chips */}
                <div className="bg-[#FDFCF9] border border-[#2C2C2C]/10 p-6 rounded-2xl shadow-xs md:col-span-2 lg:col-span-3 space-y-4">
                  <div className="border-b border-[#2C2C2C]/8 pb-2.5 text-center sm:text-left">
                    <span className="text-[9px] font-mono tracking-widest text-[#5A5A40] uppercase font-bold">
                      Core Institutional values
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3.5 justify-center sm:justify-start">
                    {[
                      { word: 'Honor', colorBg: 'bg-rose-50 text-rose-800 border-rose-200' },
                      { word: 'Excellence', colorBg: 'bg-amber-50 text-amber-800 border-amber-200' },
                      { word: 'Service', colorBg: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
                      { word: 'Compassion', colorBg: 'bg-purple-50 text-purple-800 border-purple-200 text-center' },
                      { word: 'Resilience', colorBg: 'bg-teal-50 text-teal-800 border-teal-200' },
                      { word: 'Innovation', colorBg: 'bg-sky-50 text-sky-800 border-sky-200' }
                    ].map((item, index) => (
                      <div 
                        key={index} 
                        className={`px-4.5 py-2 rounded-xl text-sm font-serif font-black tracking-wide border shadow-[0_1px_2px_rgba(0,0,0,0.015)] ${item.colorBg}`}
                      >
                        {item.word}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Global Milestones Display (Grid representation with custom beautiful typography) */}
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[#5A5A40] font-mono text-xs tracking-[0.2em] uppercase font-bold block">Accolades & Recognition</span>
                <h3 className="text-2xl md:text-3xl font-serif font-black text-[#1A1A1A] tracking-tight">
                  Global Milestones & Standing
                </h3>
                <div className="w-12 h-0.5 bg-[#5A5A40]/30 mx-auto rounded"></div>
              </div>

              {/* Display milestones directly as an elegant list layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                {SCHOOL_PROFILE.milestones.map((ms, idx) => {
                  // Choose icons representing each milestone type
                  let BulletIcon = Award;
                  if (idx === 0) BulletIcon = Compass;
                  if (idx === 1) BulletIcon = Lightbulb;
                  if (idx === 2) BulletIcon = GraduationCap;
                  if (idx === 4) BulletIcon = FileSpreadsheet;

                  const cardContent = (
                    <>
                      <div className="p-3 bg-[#FAF9F5] rounded-xl text-[#801b1b] border border-stone-200/50 shrink-0 shadow-5xs">
                        <BulletIcon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4 className="font-serif font-black text-stone-900 text-sm md:text-base leading-snug flex items-center justify-between gap-2">
                          <span>{ms.title}</span>
                          {'link' in ms && <ExternalLink className="w-3.5 h-3.5 text-[#801b1b]/60 group-hover:text-[#801b1b] shrink-0 transition-colors" />}
                        </h4>
                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed text-justify">
                          {ms.description}
                        </p>
                        {'link' in ms && (
                          <div className="pt-1.5">
                            <span className="inline-flex items-center text-[10px] font-mono text-[#801b1b] font-bold tracking-wider hover:underline">
                              READ NEWS ARTICLE &rarr;
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  );

                  if ('link' in ms && ms.link) {
                    return (
                      <a 
                        key={idx}
                        href={ms.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start space-x-4 p-5 rounded-2xl border border-stone-200 bg-[#FDFCF9] hover:bg-[#FAF9F5] hover:border-[#801b1b]/40 transition-colors shadow-5xs cursor-pointer text-left"
                      >
                        {cardContent}
                      </a>
                    );
                  }

                  return (
                    <div 
                      key={idx} 
                      className="flex items-start space-x-4 p-5 rounded-2xl border border-stone-200 bg-[#FDFCF9] hover:bg-[#FAF9F5] hover:border-amber-400/40 transition-colors shadow-5xs"
                    >
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </div>
            </ScrollRevealBox>

          </motion.div>
        )}

        {/* ================= TEACHING PHILOSOPHY TAB ================= */}
        {activeTab === 'philosophy' && (
          <motion.div
            key="philosophy"
            custom={direction}
            variants={philosophyVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-12 text-[#2C2C2C] w-full max-w-6xl mx-auto relative"
          >
            {/* Margin floaters for interactive parallax scrolling */}
            <div className="absolute inset-y-0 w-full pointer-events-none hidden xl:block overflow-visible select-none z-0">
              <FloatingHanddrawnLeaf speed={0.4} className="right-[-125px] top-[200px]" />
              <FloatingCellBiology speed={-0.3} className="left-[-135px] top-[480px]" />
            </div>

            {/* Split Composition: visual story on left, elegant beliefs on right */}
            <ScrollRevealBox yOffset={25}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              
              {/* Left Plate: Immersive visual snapshot & personal quote */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-8">
                
                {/* Polaroid Frame for Class Desk Image */}
                <div className="bg-[#FFFDF9] p-4 pb-6 rounded-xl border border-stone-300/60 shadow-xl transform hover:rotate-1 hover:scale-[1.01] transition-all duration-300 cursor-pointer">
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-stone-200">
                    <img 
                      src={activeClassroomBg} 
                      alt="Active Learning Classroom" 
                      className="w-full h-full object-cover filter contrast-[1.02] brightness-[0.98]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-stone-900/5 mix-blend-multiply pointer-events-none"></div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-serif italic font-semibold text-stone-700 text-sm">
                      A Glimpse of My Future Classroom &mdash; Nurturing Minds through Active Inquiry
                    </p>
                    <span className="text-[10px] font-mono text-[#801b1b] font-bold tracking-wider">
                      DESIGNED TO INSPIRE DESIRE, INTEGRITY, AND SCIENTIFIC GROWTH
                    </span>
                  </div>
                </div>

                {/* Hand-signed educator's manifesto citation */}
                <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#2C2C2C]/10 space-y-4 flex-1 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 text-[#801b1b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#801b1b]"></span>
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">EDUCATOR'S MANIFESTO</span>
                  </div>
                  <FadeInText text="My mission is to transform the classroom into an active, breathing habitat. Science should never be a catalog of static facts to memorize, but a continuous journey of active discovery and inquiry based research. Through curiosity and hands on learning, we build understanding together." className="font-serif italic text-stone-700 text-sm leading-relaxed text-justify" />
                </div>

              </div>

              {/* Right Plate: Staggered Open Journal of Pillars */}
              <div className="lg:col-span-7 bg-[#FDFCF9] rounded-2xl border border-[#2C2C2C]/10 p-6 md:p-10 shadow-[0_4px_16px_rgba(0,0,0,0.015)] space-y-8">
                
                <div className="space-y-2 border-b border-stone-200 pb-5">
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.15em] text-[#5A5A40]">Pedagogical Foundation</span>
                  <h3 className="text-21px md:text-3xl lg:text-[32px] font-serif font-black text-stone-900 tracking-tight leading-tight">
                    <TypewriterScrollText text="Inquiry-Driven Teaching Beliefs" highlightWords={["Inquiry-Driven"]} />
                  </h3>
                </div>

                {/* The Pillars in a structured journal layout */}
                <div className="space-y-8">
                  {PHILOSOPHY_PILLARS.map((pillar) => {
                    return (
                      <div 
                        key={pillar.num} 
                        className="group relative pl-4 border-l-2 border-[#5A5A40]/20 hover:border-[#801b1b] transition-all duration-300 space-y-3"
                      >
                        {/* Interactive floating indicator */}
                        <div className="absolute top-0.5 -left-[7px] w-3 h-3 rounded-full bg-stone-100 border-2 border-[#5A5A40]/40 group-hover:bg-[#801b1b] group-hover:border-[#801b1b] transition-all" />
                        
                        <div className="space-y-1">
                          <h4 className="font-serif font-black text-[#1A1A1A] text-lg md:text-xl tracking-tight transition-colors group-hover:text-[#801b1b]">
                            {pillar.title}
                          </h4>
                        </div>

                        <FadeInText text={pillar.text} className="text-stone-700 font-serif text-sm md:text-base leading-relaxed text-justify italic pl-2 border-l border-stone-200/50" />
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
            </ScrollRevealBox>
          </motion.div>
        )}

        {/* ================= OUTPUTS TAB ================= */}
        {activeTab === 'outputs' && (
          <motion.div
            key="outputs"
            custom={direction}
            variants={outputsVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-10 text-[#2C2C2C] w-full relative"
          >
            {/* Margin floaters for interactive parallax scrolling */}
            <div className="absolute inset-y-0 w-full pointer-events-none hidden xl:block overflow-visible select-none z-0">
              <FloatingDnaStrand speed={0.5} className="left-[-125px] top-[260px]" />
              <FloatingCellBiology speed={-0.3} className="right-[-120px] top-[680px]" />
            </div>

            {/* Top Board Banner */}
            <div className="relative overflow-hidden bg-[#EAE8E0] py-8 px-6 rounded-2xl text-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center min-h-[120px]">
              {/* Background Image Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.24] grayscale contrast-200 brightness-[0.40] mix-blend-multiply" 
                style={{ backgroundImage: `url(${classroomDesksBg})` }}
              />
              
              {/* Soft Warm Tint Overlay */}
              <div className="absolute inset-0 bg-[#EAE8E0]/40 pointer-events-none" />

              {/* Title Text (Prominent & z-indexed) */}
              <h2 className="relative z-10 text-xl md:text-3xl font-serif font-black tracking-tight text-[#1A1A1A] leading-snug">
                <TypewriterScrollText text="Activity Outputs" delay={0.1} />
              </h2>
            </div>

            {/* Tactile Manila Index Folder Tabs Selector */}
            <div className="space-y-0 relative">
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start border-b border-[#2C2C2C]/12 pb-[1px] relative z-20 overflow-x-auto scrollbar-none">
                {[
                  { id: 1, label: 'Unit 1', short: 'U1' },
                  { id: 2, label: 'Unit 2', short: 'U2' },
                  { id: 3, label: 'Unit 3', short: 'U3' },
                  { id: 4, label: 'Unit 4', short: 'U4' },
                  { id: 5, label: 'Unit 5', short: 'U5' },
                  { id: 6, label: 'Unit 6', short: 'U6' },
                  { id: 7, label: 'Presentation', short: 'PPT' }
                ].map((item) => {
                  const isActive = selectedOutputUnit === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedOutputUnit(item.id)}
                      className={`relative px-4 py-3 text-xs md:text-sm font-mono tracking-widest uppercase rounded-t-xl transition-all duration-300 font-bold border-t border-x cursor-pointer select-none active:scale-95 flex items-center space-x-1.5
                        ${isActive 
                          ? 'bg-[#FFFDF9] border-[#2C2C2C]/15 text-[#1A1A1A] translate-y-[2px] shadow-[0_-2px_10px_rgba(0,0,0,0.035)] relative z-30' 
                          : 'bg-[#EAE8E0]/45 border-transparent text-[#2C2C2C]/45 hover:text-[#1A1A1A] hover:bg-[#EAE8E0]'
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isActive ? '#5A5A40' : '#cabfa8' }} />
                      <span className="hidden sm:inline">{item.id === 7 ? 'Digital Presentation' : item.label}</span>
                      <span className="sm:hidden">{item.short}</span>
                    </button>
                  );
                })}
              </div>

              {/* Binder Paper Sheet Core */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedOutputUnit}
                  initial={{ opacity: 0, y: 12, rotateX: -1 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -12, rotateX: 1 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="bg-[#FFFDF9] border border-[#2C2C2C]/12 rounded-b-2xl rounded-tr-none md:rounded-tr-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)] relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 z-10"
                >
                  {/* Left Column: Interactive Document Preview (picture-sized, similar to the major exams cards) */}
                  <motion.div 
                    whileHover={{ scale: 1.015, y: -2 }}
                    className="lg:col-span-5 bg-[#FAF9F5] p-5 rounded-xl border-2 border-black flex flex-col justify-start items-center space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative min-h-[380px]"
                  >
                    <div className="w-full flex justify-between items-center border-b border-stone-200 pb-2 z-10">
                      <span className="text-[10px] font-mono tracking-widest text-[#5A5A40] uppercase font-black">
                        Interactive Preview
                      </span>
                    </div>

                    <div className="w-full bg-white rounded-lg border border-stone-300 overflow-hidden shadow-inner h-[280px] relative p-1 hover:shadow-md transition-all duration-300">
                      {(() => {
                        const docUrl = selectedOutputUnit === 7 
                          ? DIGITAL_PRESENTATION_LINK 
                          : UNIT_OUTPUTS.find((u) => u.id === selectedOutputUnit)?.links[0];
                        const embedUrl = getEmbedUrl(docUrl);
                        
                        return embedUrl ? (
                           <iframe 
                             src={embedUrl}
                             className="w-full h-full border-0 animate-fade-in rounded-md"
                             title={`Unit ${selectedOutputUnit} Document Preview`}
                             loading="lazy"
                           />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-stone-400">
                            Preview not available for this resource.
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>

                  {/* Document and Media Linkage side (columns = 7) */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
                        <div>
                          <h3 className="font-serif font-black text-stone-900 text-xl md:text-2xl tracking-tight leading-snug">
                            {selectedOutputUnit === 1 && "Introduction To Technology for Teaching and Learning"}
                            {selectedOutputUnit === 2 && "Theories And Principles in the Use and Design of Technology-Driven Lessons"}
                            {selectedOutputUnit === 3 && "ICT and Conventional Learning Materials to Enhance Teaching & Learning"}
                            {selectedOutputUnit === 4 && "Innovative Technologies for Assessment Tasks in Teaching and Learning"}
                            {selectedOutputUnit === 5 && "Flexible Learning Environment"}
                            {selectedOutputUnit === 6 && "Instructional Design Models"}
                            {selectedOutputUnit === 7 && "Digital Portfolio Presentation"}
                          </h3>
                        </div>
                        <span className="font-mono text-2xl font-black text-[#5A5A40]/15 select-none hidden sm:inline">
                          0{selectedOutputUnit}
                        </span>
                      </div>

                      <div className="space-y-4 leading-8">
                        <div className="font-serif text-[#2C2C2C]/85 text-xs sm:text-sm md:text-base leading-relaxed text-justify">
                          {selectedOutputUnit === 1 && <FadeInText text="As our first collaborative activity, this was a truly rewarding experience! I was so impressed by how Karyl Cañete coordinated everything to keep us on track. Since we were juggling two different tasks that day, Karyl assigned specific roles so we could meet our deadlines. It felt wonderful to contribute meaningfully, and seeing how beautifully our infographic turned out really strengthened my trust in our teamwork! 🙂" />}
                          {selectedOutputUnit === 2 && <FadeInText text="In this essay, I share my understanding of how we can use educational principles and standards to design lesson plans that integrate technology. My goal is to demonstrate how these methods enrich the learning experience, keep students engaged, and support academic success." />}
                          {selectedOutputUnit === 3 && <FadeInText text="Formulating hands-on learning ecosystems. This collaborative laboratory resulted in visual student study guides and detailed cell biology instructional videos." />}
                          {selectedOutputUnit === 4 && <FadeInText text="This activity introduced me to the ASSURE model using NotebookLM, and even though I was just watching the process, I had so much fun! We also used various technology tools like Kahoot, Google Forms, Plickers, ZipGrade, Quizizz, and Hot Potatoes, which made learning incredibly dynamic. Once again, technology and AI completely amazed me with their capabilities. It feels like these tools never stop evolving—just when you think you have seen everything, a new innovation appears. Seeing AI create an entire ASSURE model in seconds was incredible, making academic tasks feel so much easier and faster. I definitely plan to use NotebookLM in the future, as it is so important for future teachers to master these modern tools." />}
                          {selectedOutputUnit === 5 && <FadeInText text="My teammate Karyl Cañete did an absolutely amazing job on this project! He is incredibly skilled, and the final output turned out wonderful. I found the infographic extremely helpful because it broke down complex social networking platforms in a simple, clear, and engaging way that was easy to learn from. I am so glad to have such a talented teammate and I really appreciate all of his hard work! 🙂" />}
                          {selectedOutputUnit === 6 && <FadeInText text="I want to express my deepest gratitude to Faith Calunod for creating such an exceptional lesson plan—it was incredibly detailed and followed the official format to perfection. While reviewing it, I learned something entirely new about the assignment section: I used to think homework was always mandatory, but now I know it can be optional depending on the context and selected learning objectives. This experience showed me how critical an organized plan is for guiding future educators. A clear structure ensures students master their skills, and I am so grateful to Faith for her dedication! 🩷🩷" />}
                          {selectedOutputUnit === 7 && <FadeInText text="Presenting my digital portfolio was a nerve-wracking experience. I felt overwhelmed and wished I had more time to practice. Even though the task was straightforward, speaking in front of an audience added a lot of pressure, and I worried my nerves got the best of me. Still, I am incredibly proud of myself for being brave, staying resilient, and not giving up. Even when time ran short and some classmates suggested I wrap it up early, I stayed determined to finish presenting my work. I will definitely be more mindful of time limits next time! I am also deeply grateful for Ma'am Rizalina's constructive feedback. Since her advice focused on my presentation style rather than the contents, it reassured me that I did a wonderful job with the portfolio itself. This experience taught me so much, and I am truly thankful for the opportunity to grow." />}
                        </div>
                      </div>
                    </div>

                    {/* Action Clips Panel */}
                    <div className="space-y-3 pt-4 border-t border-stone-200">
                      <span className="block text-[10px] font-mono tracking-widest text-[#5A5A40] uppercase font-bold">
                        Access Documents & Media:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Render links for selected Unit */}
                        {selectedOutputUnit === 7 ? (
                          <a
                            href={DIGITAL_PRESENTATION_LINK}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#1A1A1A] hover:bg-[#2C2C2C] text-[#FFFDF9] p-4 rounded-xl border border-[#2C2C2C]/10 flex items-center justify-between group shadow-xs transition-all duration-300 sm:col-span-2 cursor-pointer transform hover:scale-[1.01]"
                          >
                            <div className="flex items-center space-x-3.5">
                              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg">
                                <FolderOpen className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <h5 className="font-serif font-black text-xs sm:text-sm text-stone-100 group-hover:underline">View Document</h5>
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-amber-500 transition-transform group-hover:translate-x-0.5" />
                          </a>
                        ) : (
                          UNIT_OUTPUTS.find((u) => u.id === selectedOutputUnit)?.links.map((link, idx) => {
                            const unitData = UNIT_OUTPUTS.find((u) => u.id === selectedOutputUnit);
                            const label = unitData?.linkLabels?.[idx] || "View Document";
                            const isVideo = link.includes('youtube.com') || link.includes('youtu.be');

                            return (
                              <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className={`p-4 rounded-xl border flex items-center justify-between group shadow-xs transition-all duration-300 cursor-pointer transform hover:scale-[1.01] ${
                                  unitData?.links.length === 1 ? 'sm:col-span-2' : ''
                                } ${
                                  isVideo 
                                    ? 'bg-rose-50/50 hover:bg-rose-50 border-rose-200' 
                                    : 'bg-stone-50/50 hover:bg-stone-50 border-stone-200 hover:border-stone-300'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2.5 rounded-lg shrink-0 ${
                                    isVideo ? 'bg-rose-600 text-white' : 'bg-stone-200/70 text-[#5A5A40]'
                                  }`}>
                                    {isVideo ? <Lightbulb className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                  </div>
                                  <div className="text-left leading-tight truncate">
                                    <h5 className="font-serif font-bold text-xs text-stone-900 group-hover:underline truncate max-w-[170px] sm:max-w-[210px]">
                                      {label}
                                    </h5>
                                    <span className="text-[9px] text-stone-500 font-mono block mt-0.5">
                                      {isVideo ? 'Educational Video Link' : 'Google Drive Doc'}
                                    </span>
                                  </div>
                                </div>
                                <ExternalLink className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 shrink-0 ${
                                  isVideo ? 'text-rose-600' : 'text-stone-500'
                                }`} />
                              </a>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
             {/* Assessment Deck Classroom Terminal Console (Interactive Switcher) */}
            <div className="bg-[#FAF9F5] border border-[#2C2C2C]/10 rounded-2xl p-6 md:p-8 shadow-xs space-y-8">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-5 gap-4">
                <div>
                  <h3 className="font-serif font-black text-stone-900 text-xl md:text-2xl mt-0.5 tracking-tight">
                    Assessment Evaluation Deck
                  </h3>
                </div>

                {/* Classic slide switcher tab bar */}
                <div className="inline-flex bg-[#EAE8E0]/70 p-1 rounded-xl border border-stone-200/80 self-start md:self-auto select-none">
                  <button
                    onClick={() => setAssessmentType('quizzes')}
                    className={`px-4.5 py-2 rounded-lg font-mono text-[10px] md:text-xs tracking-widest uppercase font-black transition-all cursor-pointer border-none
                      ${assessmentType === 'quizzes'
                        ? 'bg-[#1A1A1A] text-white shadow-sm'
                        : 'text-stone-500 hover:text-stone-800'
                      }`}
                  >
                    Quizzes
                  </button>
                  <button
                    onClick={() => setAssessmentType('examinations')}
                    className={`px-4.5 py-2 rounded-lg font-mono text-[10px] md:text-xs tracking-widest uppercase font-black transition-all cursor-pointer border-none
                      ${assessmentType === 'examinations'
                        ? 'bg-[#1A1A1A] text-white shadow-sm'
                        : 'text-stone-500 hover:text-stone-800'
                      }`}
                  >
                    Major Examinations
                  </button>
                </div>
              </div>

              {/* Assessment Type Rendering panels */}
              <AnimatePresence mode="wait">
                {assessmentType === 'quizzes' ? (
                  <motion.div
                    key="qui-panel"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22 }}
                    className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14"
                  >
                    {QUIZZES_DATA.map((quiz, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-2.5 w-full max-w-sm">
                        <HanddrawnQuizSheet 
                          title={quiz.title} 
                          score={quiz.score} 
                          studentName={quiz.studentName} 
                          className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
                        />
                        <span className="text-[10px] font-mono tracking-wider text-stone-500 uppercase font-bold">
                          {idx === 0 ? "Quiz #1" : "Quiz #2"}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="exam-panel"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-14 w-full"
                  >
                    {EXAMS_DATA.map((exam, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-2.5 w-full max-w-sm">
                        <ZipgradeSheet 
                          title={exam.title} 
                          score={exam.score} 
                          isFirst={idx === 0} 
                          photo={idx === 0 ? midtermZipgradePhoto : finalZipgradePhoto}
                          onPhotoChange={idx === 0 ? setMidtermZipgradePhoto : setFinalZipgradePhoto}
                          editable={currentUser?.email === 'heyitsnyxiii@gmail.com'}
                          className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl"
                        />
                        <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest font-bold">
                          {idx === 0 ? "1st Examination" : "2nd Examination"}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>



          </motion.div>
        )}

        {/* ================= DOCUMENTATION TAB ================= */}
        {activeTab === 'documentation' && (
          <motion.div
            key="documentation"
            custom={direction}
            variants={documentationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-5xl mx-auto space-y-6 relative"
          >
            {/* Margin floaters for interactive parallax scrolling */}
            <div className="absolute inset-y-0 w-full pointer-events-none hidden xl:block overflow-visible select-none z-0">
              <FloatingCellBiology speed={0.4} className="left-[-125px] top-[140px]" />
              <FloatingHanddrawnLeaf speed={-0.3} className="right-[-120px] top-[550px]" />
            </div>

            {/* Elegant Warm Academics Light Gallery Container */}
            <div className="bg-[#F8F6F0] text-[#1A1A1A] p-4 md:p-10 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] space-y-6 md:space-y-10 animate-fade-in">
              
              {/* Introduction Caption Text */}
              <div className="text-center font-serif italic text-[#2C2C2C]/85 text-sm md:text-base max-w-3xl mx-auto leading-relaxed border-b border-[#2C2C2C]/10 pb-4 md:pb-6">
                <TypewriterScrollText 
                  text="This page features some of the activities I have done in class. While I participated in many demo-teaching sessions, only a few were documented with photos." 
                  highlightWords={["demo-teaching", "photos", "activities"]}
                  delay={0.1}
                />
              </div>

              {/* View toggle Controls & Magic scatter buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-4xl mx-auto px-1">
                {/* Mode Indicator & Toggles */}
                <div className="flex items-center gap-2 bg-[#EAE8E0] p-1 rounded-xl border border-[#2C2C2C]/15 shadow-xs">
                  <button
                    onClick={() => setPinboardViewActive(true)}
                    className={`px-4 py-2 font-serif text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      pinboardViewActive 
                        ? 'bg-[#1A1A1A] text-[#F7F5F0] shadow-sm' 
                        : 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5'
                    }`}
                  >
                    📌 Interactive Desk Board
                  </button>
                  <button
                    onClick={() => setPinboardViewActive(false)}
                    className={`px-4 py-2 font-serif text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      !pinboardViewActive 
                        ? 'bg-[#1A1A1A] text-[#F7F5F0] shadow-sm' 
                        : 'text-[#2C2C2C] hover:bg-[#2C2C2C]/5'
                    }`}
                  >
                    🔲 Neat Grid View
                  </button>
                </div>

                {/* Auxiliary interactive actions */}
                {pinboardViewActive && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={scatterMemories}
                      title="Scatter polaroids in random spots"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FFFDF9] hover:bg-[#FAF6FF] text-[#1A1A1A] text-xs font-mono font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                      <span>Scatter memories</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Hidden file selector for documentation photos */}
              <input
                type="file"
                ref={docFileInputRef}
                onChange={handleDocFileInputChange}
                accept="image/*"
                className="hidden"
              />

              {/* MAIN CONTENT AREA */}
              <AnimatePresence mode="wait">
                {pinboardViewActive ? (
                  /* ================= INTERACTIVE PINBOARD VIEW ================= */
                  <motion.div
                    key="pinboard-workspace"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    ref={pinboardRef}
                    className="relative w-full h-[620px] bg-[#FAF8F3] border-2 md:border-3 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-4 select-none"
                    style={{
                      backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 1.5px, transparent 1.5px)',
                      backgroundSize: '24px 24px',
                    }}
                  >
                    {/* Simulated cork/wood frame inside border */}
                    <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none border border-black/5 rounded-2xl"></div>

                    {/* Guidelines and instructions in the center background */}
                    <div className="absolute pointer-events-none opacity-20 text-center select-none space-y-1">
                      <p className="font-serif italic font-bold text-sm text-[#1A1A1A]">Virtual Classroom Pinboard</p>
                      <p className="font-mono text-[9px] text-[#2C2C2C]/80 uppercase tracking-wider">Drag items to rearrange &bull; Double click to zoom</p>
                    </div>

                    {/* Floating Polaroids */}
                    {[
                      { id: 'doc1', title: 'Working with the team to design an infographic', src: docImages.doc1 },
                      { id: 'doc2', title: 'Participating in a demo-teaching session', src: docImages.doc2 },
                      { id: 'doc3', title: 'Presenting our Flipchart', src: docImages.doc3 },
                      { id: 'doc4', title: 'Demo-teaching Session', src: docImages.doc4 },
                    ].map((card) => {
                      const pos = scatterPositions[card.id] || { x: 0, y: 0, rotate: 0 };
                      const zIndex = cardZIndex[card.id] || 10;
                      
                      return (
                        <motion.div
                          key={card.id}
                          drag
                          dragConstraints={pinboardRef}
                          dragElastic={0.08}
                          dragMomentum={false}
                          onDragStart={() => bringToFront(card.id)}
                          onTap={() => bringToFront(card.id)}
                          onDoubleClick={() => setZoomImg({ id: card.id, src: card.src, title: card.title })}
                          animate={{
                            x: pos.x,
                            y: pos.y,
                            rotate: pos.rotate,
                            zIndex: zIndex,
                          }}
                          whileHover={{ scale: 1.03, rotate: 0, transition: { duration: 0.15 } }}
                          whileDrag={{ scale: 1.08, rotate: 2, zIndex: 100, transition: { duration: 0.05 } }}
                          className="absolute w-[210px] md:w-[245px] bg-[#FCFAF5] p-3.5 pb-6 border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:shadow-[12px_12px_0px_rgba(0,0,0,1)] active:cursor-grabbing cursor-grab transition-shadow duration-150 select-none"
                        >
                          {/* Pin / Peg Decoration */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 pointer-events-none z-20 flex items-center justify-center">
                            {/* Pin / Peg Head */}
                            <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-black shadow-[1px_1.5px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-white/50"></div>
                            </div>
                          </div>

                          {/* Translucent washi tape overlay */}
                          <div className="absolute -top-2 left-1/4 w-12 h-4 bg-amber-200/30 border-l border-r border-[#2C2C2C]/5 rotate-[3deg] z-15 backdrop-blur-[0.5px]"></div>

                          {/* Image Box */}
                          <div className="relative w-full aspect-square rounded-lg border-2 border-black overflow-hidden bg-white shadow-inner">
                            <img
                              src={card.src}
                              alt={card.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover pointer-events-none"
                            />

                            {/* Floating controls overlay triggered on hover */}
                            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center space-y-1.5 p-2 pointer-events-auto">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setZoomImg({ id: card.id, src: card.src, title: card.title });
                                }}
                                className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 text-[10px] font-mono font-bold rounded border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center space-x-1 cursor-pointer active:scale-95 transition-all w-3/4 justify-center"
                              >
                                <Maximize2 className="w-3 h-3" />
                                <span>Zoom View</span>
                              </button>
                              
                              {currentUser?.email === 'heyitsnyxiii@gmail.com' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDocImageChange(card.id);
                                  }}
                                  className="px-3 py-1.5 bg-[#5A5A40] text-white hover:bg-[#737352] text-[10px] font-mono font-bold rounded border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center space-x-1 cursor-pointer active:scale-95 transition-all w-3/4 justify-center"
                                >
                                  <Camera className="w-3 h-3" />
                                  <span>Change Image</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Fine Card Label Divider & Text */}
                          <div className="w-6 h-[1px] bg-black/15 mx-auto mt-3 mb-2.5"></div>
                          <p className="text-center text-[10px] md:text-xs font-serif italic text-stone-850 font-bold px-1 select-none pointer-events-none leading-tight line-clamp-2">
                            {card.title}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  /* ================= NEAT NEOBRUTALIST GRID VIEW ================= */
                  <motion.div
                    key="grid-workspace"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.22 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                  >
                    {[
                      { id: 'doc1', title: 'Working with the team to design an infographic', src: docImages.doc1, rotate: -0.6 },
                      { id: 'doc2', title: 'Participating in a demo-teaching session', src: docImages.doc2, rotate: 0.6 },
                      { id: 'doc3', title: 'Presenting our Flipchart', src: docImages.doc3, rotate: -0.4 },
                      { id: 'doc4', title: 'Demo-teaching Session', src: docImages.doc4, rotate: 0.4 },
                    ].map((card) => (
                      <div key={card.id} className="flex flex-col items-center relative group select-none">
                        <div 
                          style={{ transform: `rotate(${card.rotate}deg)` }}
                          className="bg-[#FCFAF5] p-4 pb-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-1 w-full"
                        >
                          <div className="relative w-full aspect-square rounded-lg border-2 border-black overflow-hidden bg-white shadow-inner mb-4">
                            <img
                              src={card.src}
                              alt={card.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                            
                            {/* Frosted Glass Hover Overlay */}
                            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col items-center justify-center space-y-2.5 z-10 p-4">
                              <button
                                onClick={() => setZoomImg({ id: card.id, src: card.src, title: card.title })}
                                className="px-4 py-2 bg-white text-black hover:bg-neutral-100 text-xs font-mono font-bold rounded-lg shadow-md flex items-center space-x-1.5 border-2 border-black cursor-pointer active:scale-95 transition-all w-48 justify-center"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>Preview Photo</span>
                              </button>

                              {currentUser?.email === 'heyitsnyxiii@gmail.com' && (
                                <>
                                  <button
                                    onClick={() => handleDocImageChange(card.id)}
                                    className="px-4 py-2 bg-[#5A5A40] hover:bg-[#737352] text-white text-xs font-mono font-bold rounded-lg shadow-md flex items-center space-x-1.5 border-2 border-black cursor-pointer active:scale-95 transition-all w-48 justify-center"
                                    title="Click to change photo"
                                  >
                                    <Camera className="w-3.5 h-3.5" />
                                    <span>Change Photo</span>
                                  </button>

                                  {card.src !== defaultDocImages[card.id as keyof typeof defaultDocImages] && (
                                    <button
                                      onClick={() => resetDocImage(card.id)}
                                      className="px-4.5 py-1.5 bg-red-800/90 hover:bg-red-700 text-white text-[10px] font-mono font-bold rounded-lg shadow flex items-center space-x-1 cursor-pointer active:scale-95 transition-all border-2 border-black w-48 justify-center"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>Reset Default</span>
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          
                          {/* Fine Card Subtitle Divider */}
                          <div className="w-8 h-[1px] bg-black/15 mx-auto mb-3"></div>
                          <p className="text-center text-xs md:text-sm font-serif italic text-stone-900 font-bold px-2 leading-relaxed">
                            {card.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}

        {/* ================= REFERENCES TAB ================= */}
        {activeTab === 'references' && (
          <motion.div
            key="references"
            custom={direction}
            variants={referencesVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8 text-[#2C2C2C] w-full"
          >
            <ScrollRevealBox yOffset={25}>
              <InteractiveReferences 
                imagesFolder={REFERENCES_LINKS.imagesFolder}
                citationsFolder={REFERENCES_LINKS.citationsFolder}
              />

              {/* Presentation details segment */}
              <div className="mt-8 max-w-4xl mx-auto space-y-4 animate-fade-in text-[#2C2C2C]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border-2 border-black rounded-xl p-4 md:p-5 hover:border-[#5A5A40]/30 hover:bg-[#FAF8F3] transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <span className="block text-[9px] uppercase font-mono tracking-wider text-[#5A5A40] font-bold">Presented To</span>
                    <span className="font-serif text-[#1A1A1A] font-black text-sm">Prof. Rizalina G. Gomez</span>
                  </div>
                  <div className="bg-white border-2 border-black rounded-xl p-4 md:p-5 hover:border-[#5A5A40]/30 hover:bg-[#FAF8F3] transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <span className="block text-[9px] uppercase font-mono tracking-wider text-[#5A5A40] font-bold">Presented By</span>
                    <span className="font-serif text-[#1A1A1A] font-black text-sm">Precious Lara L. Degoma</span>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl text-center text-xs font-mono text-[#5A5A40] border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] space-y-1">
                  <div>
                    <span className="font-bold text-[#2C2C2C] uppercase mr-1.5">Course and Section:</span> 
                    Technology for Teaching and Learning 1 Laboratory - T78
                  </div>
                  <div className="text-[11px] text-[#2C2C2C]/70 font-serif italic font-semibold text-stone-600">
                    Mindanao State University - Iligan Institute of Technology
                  </div>
                </div>
              </div>
            </ScrollRevealBox>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* ================= DESCRIPTIVE FLIP BOOK FOOTER ================= */}
      <footer className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 mt-8 border-t border-[#2C2C2C]/10 font-serif">
        <div className="flex items-center justify-between text-[#2C2C2C]/70 font-mono text-[10px] md:text-xs">
          {/* Previous section indicator */}
          <button
            onClick={handlePrevSection}
            className="flex items-center space-x-1.5 hover:bg-[#EAE8E0]/60 hover:text-[#1A1A1A] border border-[#2C2C2C]/10 rounded transition-all py-1.5 px-3 uppercase text-[10px] tracking-wider cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#2C2C2C]/50" />
            <span className="hidden sm:inline">Prev Slide</span>
          </button>

          {/* Current index fraction indicator */}
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-[#1A1A1A]">
              {(TABS.findIndex((t) => t.id === activeTab) + 1).toString().padStart(2, '0')}
            </span>
            <span className="text-[#2C2C2C]/20">/</span>
            <span>{TABS.length.toString().padStart(2, '0')}</span>
            <span className="text-[#2C2C2C]/20">|</span>
            <span className="uppercase text-[9px] text-[#5A5A40] tracking-[0.1em] font-bold">
              {TABS.find((t) => t.id === activeTab)?.label}
            </span>
          </div>

          {/* Next section indicator */}
          <button
            onClick={handleNextSection}
            className="flex items-center space-x-1.5 hover:bg-[#EAE8E0]/60 hover:text-[#1A1A1A] border border-[#2C2C2C]/10 rounded transition-all py-1.5 px-3 uppercase text-[10px] tracking-wider cursor-pointer"
          >
            <span className="hidden sm:inline">Next Slide</span>
            <ChevronRight className="w-4 h-4 text-[#2C2C2C]/50" />
          </button>
        </div>

        {/* Dynamic keyboard aid */}
        <div className="text-center text-[8px] md:text-[9px] text-[#2C2C2C]/40 font-mono tracking-widest uppercase mt-4 flex flex-wrap items-center justify-center gap-2">
          <span>Press <kbd className="bg-[#EAE8E0] text-[#1A1A1A] px-1.5 py-0.5 rounded font-mono font-bold text-[8px] mx-1 border border-[#2C2C2C]/10">←</kbd> or <kbd className="bg-[#EAE8E0] text-[#1A1A1A] px-1.5 py-0.5 rounded font-mono font-bold text-[8px] mx-1 border border-[#2C2C2C]/10">→</kbd> keys to flip portfolio binder.</span>
          <span className="text-[#2C2C2C]/20 hidden sm:inline">|</span>
          <button
            onClick={() => {
              setIsSyncModalOpen(true);
              setImportStatus('idle');
            }}
            className="hover:text-[#801b1b] text-stone-500 font-bold transition-colors cursor-pointer inline-flex items-center space-x-1 uppercase text-[8px] tracking-normal"
            title="Database Configuration & Sync Tool"
          >
            <Database className="w-2.5 h-2.5" />
            <span>Database Sync</span>
          </button>
        </div>
      </footer>

      {/* ================= LIGHTBOX ZOOM MODAL ================= */}
      <AnimatePresence>
        {zoomImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImg(null)}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#FCFAF5] p-5 pb-8 rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setZoomImg(null)}
                className="absolute top-4 right-4 bg-white text-black hover:bg-neutral-100 p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] cursor-pointer active:scale-95 transition-all z-10"
                title="Close overlay"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>

              {/* Polaroid Photo Frame inside Lightbox */}
              <div className="flex-1 overflow-hidden rounded-xl border-2 border-black bg-white shadow-inner relative flex justify-center items-center p-2 min-h-[300px]">
                <img
                  src={zoomImg.src}
                  alt={zoomImg.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[50vh] object-contain w-full rounded border border-black/5"
                />
              </div>

              {/* Title & Upload Controller */}
              <div className="mt-5 text-center space-y-3">
                <p className="font-serif italic text-stone-900 text-sm md:text-base font-black leading-relaxed px-4">
                  {zoomImg.title}
                </p>
                
                {/* Actions bottom alignment */}
                {currentUser?.email === 'heyitsnyxiii@gmail.com' && (
                  <div className="flex justify-center items-center gap-3 pt-1">
                    <button
                      onClick={() => {
                        handleDocImageChange(zoomImg.id);
                        setZoomImg(null); // Close to trigger file upload
                      }}
                      className="px-4 py-2 bg-[#5A5A40] hover:bg-[#737352] text-white text-xs font-mono font-bold rounded-lg shadow-md border-2 border-black flex items-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Memory</span>
                    </button>
                    
                    {zoomImg.src !== defaultDocImages[zoomImg.id as keyof typeof defaultDocImages] && (
                      <button
                        onClick={() => {
                          resetDocImage(zoomImg.id);
                          setZoomImg(null); // Close to trigger reset
                        }}
                        className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-mono font-bold rounded-lg shadow-md border-2 border-black flex items-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Reset Standard</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* ================= CONFIG/SHARE SYNCHRONIZER MODAL ================= */}
      <AnimatePresence>
        {isSyncModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSyncModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FCFAF5] p-5 md:p-7 rounded-2xl border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] max-w-xl w-full text-stone-900 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-[#801b1b]" />
                  <h3 className="text-lg md:text-xl font-serif font-black tracking-tight text-stone-900">Image Sync & Sharing Tool</h3>
                </div>
                <button
                  onClick={() => setIsSyncModalOpen(false)}
                  className="p-1 rounded bg-white hover:bg-stone-100 border border-black/10 cursor-pointer shadow-sm active:scale-95 transition-all text-xs font-bold px-2.5 py-1 text-stone-700"
                >
                  ✕ Close
                </button>
              </div>

              {/* Informative description */}
              <p className="text-xs md:text-xs font-sans text-stone-700 leading-relaxed bg-stone-100 p-3 rounded-lg border border-stone-200">
                When you change/upload images (profile pictures, school logo, CED banner, etc.), they reside as compressed data inside your current browser's local memory.
                <strong className="block mt-1 text-[#801b1b] font-serif italic text-xs">To make sure anyone opening your shared portfolio link can see the images you uploaded:</strong>
              </p>

              {/* Cloud Synchronization Section */}
              <div className="bg-[#EEFAF4]/70 p-4 rounded-xl border border-emerald-200/60 space-y-3 shadow-inner">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-700" />
                  <span className="text-[10px] font-mono tracking-wider text-emerald-800 uppercase font-bold">☁️ Real-Time Cloud Database (Firestore)</span>
                </div>
                
                {currentUser ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-white/75 p-2 rounded border border-emerald-100 font-mono text-[11px]">
                      <div>
                        <span className="text-stone-500">Signed in:</span> <span className="text-stone-900 font-bold">{currentUser.displayName || 'Contributor'}</span>
                        <span className="block text-[10px] text-stone-500 italic font-normal">{currentUser.email}</span>
                      </div>
                      <button
                        onClick={handleGoogleSignOut}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded text-[10px] cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>

                    {currentUser.email === 'heyitsnyxiii@gmail.com' ? (
                      <div className="space-y-2 text-stone-700">
                        <p className="text-[11px] leading-relaxed">
                          Identified as <strong className="text-emerald-800">Portfolio Owner</strong>. Click the button below to push all your browser's locally customized images directly to the Firebase Cloud database. Guest viewers will then see these immediately upon load!
                        </p>
                        <button
                          onClick={handlePushToCloud}
                          disabled={isCloudSyncing}
                          className="w-full flex items-center justify-center space-x-2 py-2 bg-emerald-600 hover:bg-emerald-750 text-white font-mono text-xs font-bold rounded-lg border-2 border-black shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                        >
                          <Database className="w-3.5 h-3.5" />
                          <span>{isCloudSyncing ? 'Syncing...' : '☁️ Push Local Uploads to Cloud Database'}</span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-600 italic bg-white/50 p-2 rounded border border-stone-200">
                        Welcome! You are viewing this portfolio in Guest/Viewer Mode. Any changes you make locally in your browser will remain transient. Only the authorized owner can sync global cloud assets.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-emerald-800 leading-normal">
                      Are you the owner? Sign in with your Google Account to synchronize your uploaded profile, logo, and memory pictures straight into the real cloud database so everyone can see them!
                    </p>
                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center space-x-2 py-2 bg-white hover:bg-stone-50 text-stone-900 border-2 border-black font-mono text-xs font-bold rounded-lg shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <span>🔑 Sign In with Google</span>
                    </button>
                  </div>
                )}

                {cloudSyncMessage && (
                  <div className={`p-2.5 rounded text-[11px] font-sans border ${cloudSyncMessage.startsWith('✓') ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    {cloudSyncMessage}
                  </div>
                )}
              </div>

              {/* Step 1: Export Payload */}
              <div className="bg-white p-3.5 rounded-lg border border-stone-200 space-y-2 shadow-sm">
                <span className="text-[10px] font-mono tracking-wider text-[#5A5A40] uppercase font-bold">Step 1: Get Code Payload</span>
                <p className="text-[11px] text-stone-600 leading-normal">
                  Click the button below to bundle your active uploaded images into a secure backup payload, then copy it to your clipboard.
                </p>
                <button
                  onClick={() => {
                    const keys = [
                      'portfolio_home_profile',
                      'portfolio_about_profile',
                      'portfolio_doc_img_1',
                      'portfolio_doc_img_2',
                      'portfolio_doc_img_3',
                      'portfolio_doc_img_4',
                      'portfolio_doc_img_5',
                      'portfolio_doc_img_6',
                      'precious_lara_ced_image',
                      'precious_lara_saved_photo_home',
                      'precious_lara_saved_photo_about',
                      'precious_lara_school_logo',
                      'zipgrade_photo_midterm',
                      'zipgrade_photo_final'
                    ];
                    const payload: Record<string, string> = {};
                    let count = 0;
                    keys.forEach(k => {
                      try {
                        const val = localStorage.getItem(k);
                        if (val && val.startsWith('data:image')) {
                          payload[k] = val;
                          count++;
                        }
                      } catch {}
                    });
                    
                    if (count === 0) {
                      alert("It looks like you haven't uploaded any custom images in this browser yet! Upload some pictures first, then bundle them.");
                      return;
                    }

                    const jsonStr = JSON.stringify(payload);
                    navigator.clipboard.writeText(jsonStr)
                      .then(() => {
                        setCopiedPayload(true);
                        setTimeout(() => setCopiedPayload(false), 3000);
                      })
                      .catch((err) => {
                        console.error('Failed to copy', err);
                        alert('Could not copy automatically. The JSON configuration is:\n' + jsonStr);
                      });
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-stone-900 border-2 border-black hover:bg-stone-850 text-white font-mono text-xs font-bold rounded-lg shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                >
                  {copiedPayload ? <Check className="w-4 h-4 text-green-400 animate-bounce" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPayload ? "Copied to Clipboard! ✓" : "📋 Bundle & Copy Uploaded Images"}</span>
                </button>
              </div>

              {/* Step 2: Send block */}
              <div className="bg-[#FAF7F0] p-3.5 rounded-lg border border-[#5A5A40]/20 space-y-1.5">
                <span className="text-[10px] font-mono tracking-wider text-[#5A5A40] uppercase font-bold">Step 2: Bake Into Link</span>
                <p className="text-[11px] text-stone-700 leading-relaxed">
                  Simply **paste** this copied backup payload directly to me (your AI Coding assistant here in the chat panel) and say: 
                  <span className="block bg-white p-2 text-[#801b1b] font-mono border border-stone-200 mt-1 rounded text-center text-[10px] font-bold select-all select-none">
                    "Please bake these uploaded portfolio images permanently into the code!"
                  </span>
                  I will write them straight into the codebase so they load instantly for any visitor opening your shared link!
                </p>
              </div>

              {/* Back up Panel: Paste Existing config to quickly restore */}
              <div className="border-t border-stone-200 pt-3.5 space-y-2">
                <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold">Restore / Import Images manually</span>
                <p className="text-[10px] text-stone-500 leading-normal">
                  Paste a previously copied payload below to load those images onto this machine:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={importPayloadText}
                    onChange={(e) => setImportPayloadText(e.target.value)}
                    placeholder='{"portfolio_home_profile": "data:image..."}'
                    className="flex-1 bg-white border border-stone-300 rounded px-2.5 py-1 text-[10px] font-mono"
                  />
                  <button
                    onClick={() => {
                      if (!importPayloadText.trim()) return;
                      try {
                        const parsed = JSON.parse(importPayloadText.trim());
                        if (typeof parsed !== 'object' || parsed === null) {
                          throw new Error('Not an object');
                        }
                        
                        Object.entries(parsed).forEach(([key, val]) => {
                          if (typeof val === 'string' && val.startsWith('data:image')) {
                            localStorage.setItem(key, val);
                          }
                        });
                        setImportStatus('success');
                        setTimeout(() => window.location.reload(), 1500);
                      } catch {
                        setImportStatus('error');
                      }
                    }}
                    className="px-3.5 py-1 bg-[#801b1b] hover:bg-[#912323] text-white border-2 border-black rounded font-mono text-xs font-bold shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] cursor-pointer active:scale-95 transition-all"
                  >
                    Apply
                  </button>
                </div>
                {importStatus === 'success' && <p className="text-green-600 font-mono text-[9px] text-center font-bold">✓ Applied! Reloading page to present your images...</p>}
                {importStatus === 'error' && <p className="text-red-600 font-mono text-[9px] text-center font-bold">⚠️ Invalid payload string. Make sure you copied the entire text.</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
