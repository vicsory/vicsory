import Image from "next/image";
import Link from "next/link";
import { useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaRegEnvelope, FaTiktok, FaTwitch, FaTwitter, FaYoutube } from "react-icons/fa";
import { BiCalendarCheck } from "react-icons/bi";
import { AiOutlineLink } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, X, Plus, Music, Laugh, Star, Gamepad, Video, PersonStanding, Building, NotebookPen, Code, Paintbrush, Pen,
  ChefHat, Plane, Shirt, Vote, School, Dumbbell, Banknote, Baby, Bitcoin, BookOpen, Briefcase, Camera, Car, Clapperboard,
  DraftingCompass, Gavel, Gift, GraduationCap, Hammer, Home, Joystick, Leaf, Megaphone, Mic, Microscope, PartyPopper,
  PawPrint, Rocket, Sparkles, Store, Sun, BadgeCheck, Play, VolumeX, Volume2, Rewind, FastForward, Repeat, Maximize
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export {
  Image, Link, useContext, useState, useEffect, useRef, usePathname,
  FaFacebook, FaInstagram, FaRegEnvelope, FaTiktok, FaTwitch, FaTwitter, FaYoutube,
  BiCalendarCheck, AiOutlineLink, Badge, Input,
  ArrowLeft, X, Plus, Music, Laugh, Star, Gamepad, Video, PersonStanding, Building, NotebookPen, Code, Paintbrush, Pen,
  ChefHat, Plane, Shirt, Vote, School, Dumbbell, Banknote, Baby, Bitcoin, BookOpen, Briefcase, Camera, Car, Clapperboard,
  DraftingCompass, Gavel, Gift, GraduationCap, Hammer, Home, Joystick, Leaf, Megaphone, Mic, Microscope, PartyPopper,
  PawPrint, Rocket, Sparkles, Store, Sun, BadgeCheck, Play, VolumeX, Volume2, Rewind, FastForward, Repeat, Maximize,
   Tabs, TabsList, TabsTrigger, Avatar, AvatarImage, AvatarFallback, Dialog, DialogContent, DialogHeader, DialogTitle,
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
};