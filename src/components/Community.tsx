import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Send,
  Smile, 
  Paperclip, 
  Video, 
  Image as ImageIcon,
  Users, 
  Hash, 
  Bell,
  Settings, 
  Search, 
  ArrowLeft, 
  Volume2, 
  Maximize2, 
  X, 
  Camera, 
  Gift,
  Ticket, 
  Crown, 
  MapPin,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  MessageSquare,
  User,
  CheckCircle,
  Info,
  ShoppingBag,
  Music,
  ChevronLeft,
  ChevronRight,
  Activity,
  Film,
  Phone,
  MoreVertical,
  BarChart3,
  Bookmark,
  Lightbulb,
  Shield
} from 'lucide-react';
import { getUserAvatar } from '../utils/imageUtils';
import Feed from './Feed';
import { useTheme } from './ThemeContext';
import useIsMobile from '../hooks/useIsMobile';
import { comprehensiveCommunityData, type RealCommunityItem } from '../data/comprehensiveCommunityData';
import OptimizedImage from './OptimizedImage';
import { getSpotifyArtistData } from '../data/spotifyArtistImages';
import './CommunityGenZ.css';
import DecryptedText from './TextAnimations/DecryptedText/DecryptedText';
import Typewriter from './Typewriter';

// TypeScript interfaces for message types
interface BaseMessage {
  id: number;
  user: string;
  message: string;
  time: string;
  avatar: string;
  likes: number;
  reactions: string[];
  mentions: string[];
}

interface RegularMessage extends BaseMessage {
  isOfficial?: boolean;
  isBot?: boolean;
  pollData?: undefined;
  pollResults?: undefined;
  isReply?: boolean;
  replyTo?: number;
  eventData?: undefined;
}

interface BotMessage extends BaseMessage {
  isBot: true;
  pollData?: {
    question: string;
    options: string[];
    votes: Record<string, number>;
    userVote?: string;
  };
  pollResults?: {
    question: string;
    results: Record<string, number>;
  };
  eventData?: {
    title: string;
    date: string;
    description: string;
    time?: string;
    location?: string;
    attendees?: string[];
    maxAttendees?: number;
  };
  announcementData?: {
    title: string;
    content: string;
    priority?: string;
    category?: string;
  };
  isOfficial?: boolean;
  isReply?: boolean;
  replyTo?: number;
}

interface OfficialMessage extends BaseMessage {
  isOfficial: true;
  isBot?: boolean;
  pollData?: undefined;
  pollResults?: undefined;
  isReply?: boolean;
  replyTo?: number;
  eventData?: undefined;
}

type ChatMessage = RegularMessage | BotMessage | OfficialMessage;

// Mobile-only CSS styles
const mobileStyles = `
  @media (max-width: 768px) {
    .community-container {
      padding-left: 0 !important;
      padding-right: 0 !important;
      max-width: 100% !important;
      margin-top: 3rem !important;
      padding-top: 1rem !important;
    }
    
    .community-header {
      margin-bottom: 1rem !important;
      padding: 0.5rem !important;
      margin-top: 0 !important;
      position: relative !important;
      z-index: 10 !important;
    }
    
    .community-title {
      font-size: 2rem !important;
      margin-bottom: 0.5rem !important;
      line-height: 1.2 !important;
    }
    
    .community-subtitle {
      font-size: 0.875rem !important;
      max-width: 100% !important;
      padding: 0 0.5rem !important;
      margin-bottom: 0 !important;
    }
    
    .category-header {
      margin-bottom: 1rem !important;
      margin-top: 0.5rem !important;
      padding: 0.5rem !important;
    }
    
    .category-title {
      font-size: 1.5rem !important;
      margin-bottom: 0.5rem !important;
      line-height: 1.2 !important;
    }
    
    .category-subtitle {
      font-size: 0.75rem !important;
      padding: 0 0.5rem !important;
      margin-bottom: 0 !important;
    }
    
    .category-selector {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 1rem !important;
      overflow-x: visible !important;
      padding: 1rem !important;
      max-width: 100% !important;
    }
    
    .category-selector > div {
      justify-self: center !important;
    }
    
    .mobile-grid {
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 0.75rem !important;
    }
    
    .mobile-card {
      max-width: 80px !important;
    }
    
    .mobile-title {
      font-size: 0.75rem !important;
      max-width: 70px !important;
    }
    
    .mobile-description {
      font-size: 0.75rem !important;
    }
    
    .mobile-followers {
      font-size: 0.75rem !important;
    }
    
    .mobile-icon {
      width: 0.75rem !important;
      height: 0.75rem !important;
    }
    
    /* Force mobile layout for headers */
    .community-page .text-center.mb-8 {
      margin-bottom: 1rem !important;
    }
    
    .community-page .text-center.mb-8.mt-12 {
      margin-top: 0.5rem !important;
      margin-bottom: 1rem !important;
    }
    
    .community-page h1.text-4xl.md\\:text-5xl {
      font-size: 2rem !important;
    }
    
    .community-page h2.feed-title.text-5xl {
      font-size: 1.5rem !important;
    }
    
    .community-page p.text-gray-400.text-lg {
      font-size: 0.875rem !important;
    }
    
    .community-page p.text-gray-400.text-xl {
      font-size: 0.75rem !important;
    }
    
    /* Mobile Tab Navigation */
    .tab-navigation {
      margin-bottom: 1rem !important;
      padding: 0 0.25rem !important;
    }
    
    .tab-container {
      padding: 0.125rem !important;
      border-radius: 0.75rem !important;
      width: 100% !important;
    }
    
    .tab-list {
      gap: 0.0625rem !important;
      flex-wrap: nowrap !important;
      justify-content: space-between !important;
      width: 100% !important;
    }
    
    .tab-button {
      padding: 0.25rem 0.125rem !important;
      border-radius: 0.5rem !important;
      font-size: 0.625rem !important;
      min-width: 0 !important;
      flex: 1 !important;
      max-width: none !important;
    }
    
    .tab-content {
      gap: 0.125rem !important;
      justify-content: center !important;
    }
    
    .tab-icon {
      width: 0.75rem !important;
      height: 0.75rem !important;
    }
    
    .tab-label {
      font-size: 0.625rem !important;
      font-weight: 500 !important;
      white-space: nowrap !important;
    }
    
    /* Fix top navigation overlap */
    .community-page {
      padding-top: 2.5rem !important;
    }
    
    /* Ensure header is above navigation */
    .community-page .community-container {
      position: relative !important;
      z-index: 5 !important;
    }
    
    /* Mobile Channels Left Side - Subtle and Minimalistic */
    .channels-left-side {
      background: rgba(255, 255, 255, 0.02) !important;
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
    }
    
    .channels-header {
      padding: 0.5rem !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    }
    
    .channels-title {
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      opacity: 0.8 !important;
    }
    
    .channels-subtitle {
      font-size: 0.625rem !important;
      opacity: 0.5 !important;
    }
    
    .channels-actions {
      gap: 0.25rem !important;
    }
    
    .channels-actions button {
      padding: 0.25rem !important;
      opacity: 0.6 !important;
    }
    
    .channels-actions button svg {
      width: 0.875rem !important;
      height: 0.875rem !important;
    }
    
    .channels-categories {
      gap: 0.25rem !important;
      margin-bottom: 0.5rem !important;
    }
    
    .category-button {
      padding: 0.25rem 0.5rem !important;
      font-size: 0.625rem !important;
      opacity: 0.7 !important;
      border-radius: 0.5rem !important;
    }
    
    .channels-list {
      padding: 0.25rem !important;
    }
    
    .channel-item {
      padding: 0.5rem !important;
      margin-bottom: 0.25rem !important;
      border-radius: 0.5rem !important;
      background: transparent !important;
      border: 1px solid transparent !important;
    }
    
    .channel-item:hover {
      background: rgba(255, 255, 255, 0.02) !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    
    .channel-item.bg-purple-500\\/10 {
      background: rgba(147, 51, 234, 0.05) !important;
      border-color: rgba(147, 51, 234, 0.2) !important;
    }
    
    /* Hide most channel data on mobile for minimalistic look */
    .channel-item .text-xs {
      display: none !important;
    }
    
    .channel-item .text-gray-400,
    .channel-item .text-gray-500 {
      display: none !important;
    }
    
    /* Keep only essential elements */
    .channel-item .w-10,
    .channel-item .w-8 {
      width: 1.5rem !important;
      height: 1.5rem !important;
      font-size: 0.75rem !important;
    }
    
    .channel-item h3 {
      font-size: 0.75rem !important;
      font-weight: 500 !important;
      opacity: 0.9 !important;
    }
    
    .channel-item .text-blue-400,
    .channel-item .text-yellow-400 {
      font-size: 0.625rem !important;
    }
    
    .channel-item .bg-purple-500 {
      padding: 0.125rem 0.25rem !important;
      font-size: 0.5rem !important;
    }
    
    .channel-item .w-2,
    .channel-item .w-1\\.5 {
      width: 0.5rem !important;
      height: 0.5rem !important;
    }
    
    /* Hide filter options and channel header info on mobile */
    .mobile-hidden {
      display: none !important;
    }
    
    /* Hide channel header info on mobile */
    .chat-header .channel-stats,
    .chat-header .channel-description {
      display: none !important;
    }
    
    .chat-header {
      padding: 0.5rem !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    }
    
    .chat-header-info {
      gap: 0.5rem !important;
    }
    
    .channel-icon {
      width: 1.5rem !important;
      height: 1.5rem !important;
      font-size: 0.75rem !important;
    }
    
    .channel-name {
      font-size: 0.875rem !important;
      font-weight: 500 !important;
    }
    
    .chat-header-actions {
      gap: 0.25rem !important;
    }
    
    .chat-header-actions button {
      padding: 0.25rem !important;
    }
    
    .chat-header-actions button svg {
      width: 0.875rem !important;
      height: 0.875rem !important;
    }
    
    /* Slimmer message input on mobile */
    .message-input-container {
      margin: 0.5rem !important;
    }
    
    .message-input {
      padding: 0.375rem 0.75rem !important;
      font-size: 0.875rem !important;
      border-radius: 0.75rem !important;
    }
    
    .character-count {
      font-size: 0.625rem !important;
      right: 0.5rem !important;
    }
    
    .send-button {
      padding: 0.375rem 0.75rem !important;
      font-size: 0.875rem !important;
      border-radius: 0.75rem !important;
      margin: 0.5rem !important;
    }
    
    .send-button svg {
      width: 0.875rem !important;
      height: 0.875rem !important;
    }
    
    /* Experience Zone Mobile Styles */
    .channel-statistics {
      display: none !important;
    }
    
    .exp-message-input-container {
      padding: 0.5rem !important;
      gap: 0.5rem !important;
    }
    
    .exp-input-group {
      gap: 0.25rem !important;
    }
    
    .exp-input-btn {
      padding: 0.25rem !important;
    }
    
    .exp-input-btn svg {
      width: 0.75rem !important;
      height: 0.75rem !important;
    }
    
    .exp-message-input {
      padding: 0.375rem 0.75rem !important;
      font-size: 0.875rem !important;
      border-radius: 0.75rem !important;
    }
    
    .exp-send-button {
      padding: 0.375rem 0.75rem !important;
      font-size: 0.875rem !important;
      border-radius: 0.75rem !important;
    }
    
    .exp-send-button svg {
      width: 0.875rem !important;
      height: 0.875rem !important;
    }
    
    /* Hide regular channel statistics on mobile */
    .regular-channel-statistics {
      display: none !important;
    }
    
    /* Make right side channel container fonts smaller on mobile */
    .channel-name {
      font-size: 0.875rem !important;
    }
    
    .channel-stats {
      font-size: 0.75rem !important;
    }
    
    .channel-description {
      font-size: 0.75rem !important;
    }
    
    /* Make chat messages smaller on mobile */
    .chat-header .channel-name,
    .chat-header .channel-stats,
    .chat-header .channel-description {
      font-size: 0.75rem !important;
    }
    
    /* Make message text smaller on mobile */
    .flex-1.min-w-0 .text-sm {
      font-size: 0.75rem !important;
    }
    
    .flex-1.min-w-0 .text-xs {
      font-size: 0.625rem !important;
    }
    
    /* Hide filter options and channel data in experience zone on mobile */
    .exp-filter-options {
      display: none !important;
    }
    
    .exp-channel-data {
      display: none !important;
    }
    
    /* Hide extra channel info on mobile - keep only channel names */
    .channel-extra-info {
      display: none !important;
    }
    
    /* Fix mobile layout for right container - prevent send button cutoff */
    .message-input-container,
    .mobile-message-input {
      min-width: 0 !important;
      flex-shrink: 1 !important;
      overflow: hidden !important;
    }
    
    .send-button,
    .mobile-send-button {
      flex-shrink: 0 !important;
      min-width: fit-content !important;
      white-space: nowrap !important;
    }
    
    /* Ensure proper spacing on mobile */
    .flex.gap-3.p-4.pb-6 {
      gap: 0.5rem !important;
      padding: 1rem !important;
      padding-bottom: 1.5rem !important;
    }
    
    /* Make attachment buttons smaller on mobile */
    .flex.items-center.gap-1 button {
      padding: 0.25rem !important;
    }
    
    .flex.items-center.gap-1 button svg {
      width: 0.875rem !important;
      height: 0.875rem !important;
    }
    
    /* Mobile Friends Tab Fixes - Outside Experience Zone */
    .friends-left-side {
      padding: 1rem !important;
    }
    
    .friends-left-side h3 {
      font-size: 1rem !important;
      margin-bottom: 0.5rem !important;
    }
    
    .friends-left-side p {
      font-size: 0.75rem !important;
    }
    
    .friend-item {
      padding: 0.75rem !important;
    }
    
    .friend-item .flex.items-center.gap-3 {
      gap: 0.75rem !important;
    }
    
    .friend-item img {
      width: 2.5rem !important;
      height: 2.5rem !important;
    }
    
    .friend-item h3 {
      font-size: 0.875rem !important;
    }
    
    .friend-item p {
      font-size: 0.625rem !important;
    }
    
    /* Friends Right Side Mobile Fixes */
    .friends-chat-header {
      padding: 1rem !important;
    }
    
    .friends-chat-header img {
      width: 2.5rem !important;
      height: 2.5rem !important;
    }
    
    .friends-chat-header h3 {
      font-size: 1rem !important;
    }
    
    .friends-chat-header p {
      font-size: 0.75rem !important;
    }
    
    .friends-chat-messages {
      padding: 1rem !important;
      height: calc(100% - 140px) !important;
    }
    
    .friends-message-input {
      padding: 1rem !important;
      padding-bottom: 1rem !important;
      gap: 0.5rem !important;
    }
    
    .friends-message-input input {
      padding: 0.75rem 1rem !important;
      font-size: 0.875rem !important;
    }
    
    .friends-message-input button {
      padding: 0.75rem 1rem !important;
      font-size: 0.875rem !important;
    }
    
    .friends-message-input button svg {
      width: 1rem !important;
      height: 1rem !important;
    }
    
    /* Mobile Friends Experience Zone Fixes */
    .exp-friends-left-side {
      padding: 0.75rem !important;
    }
    
    .exp-friends-left-side h3 {
      font-size: 0.875rem !important;
      margin-bottom: 0.25rem !important;
    }
    
    .exp-friends-left-side p {
      font-size: 0.625rem !important;
    }
    
    .exp-friend-item {
      padding: 0.5rem !important;
    }
    
    .exp-friend-item .flex.items-center.gap-2 {
      gap: 0.5rem !important;
    }
    
    .exp-friend-item img {
      width: 2rem !important;
      height: 2rem !important;
    }
    
    .exp-friend-item h3 {
      font-size: 0.75rem !important;
    }
    
    .exp-friend-item p {
      font-size: 0.5rem !important;
    }
    
    /* Experience Zone Friends Chat Fixes */
    .exp-friends-chat-header {
      padding: 0.75rem !important;
    }
    
    .exp-friends-chat-header img {
      width: 2rem !important;
      height: 2rem !important;
    }
    
    .exp-friends-chat-header h3 {
      font-size: 0.875rem !important;
    }
    
    .exp-friends-chat-header p {
      font-size: 0.625rem !important;
    }
    
    .exp-friends-chat-messages {
      padding: 0.75rem !important;
      height: calc(100% - 120px) !important;
    }
    
    .exp-friends-message-input {
      padding: 0.75rem !important;
      gap: 0.5rem !important;
    }
    
    .exp-friends-message-input input {
      padding: 0.5rem 0.75rem !important;
      font-size: 0.75rem !important;
    }
    
    .exp-friends-message-input button {
      padding: 0.5rem 0.75rem !important;
      font-size: 0.75rem !important;
    }
    
    .exp-friends-message-input button svg {
      width: 0.875rem !important;
      height: 0.875rem !important;
    }
    
    /* Additional mobile fixes for friends outside experience zone */
    .friends-left-side .p-8 {
      padding: 1rem !important;
    }
    
    .friends-left-side .p-8 h3 {
      font-size: 1rem !important;
      margin-bottom: 0.5rem !important;
    }
    
    .friends-left-side .p-8 p {
      font-size: 0.75rem !important;
    }
    
    .friend-item .w-12.h-12 {
      width: 2.5rem !important;
      height: 2.5rem !important;
    }
    
    .friend-item .w-4.h-4 {
      width: 0.75rem !important;
      height: 0.75rem !important;
    }
    
    .friends-chat-header .w-12.h-12 {
      width: 2.5rem !important;
      height: 2.5rem !important;
    }
    
    .friends-chat-header .w-4.h-4 {
      width: 1rem !important;
      height: 1rem !important;
    }
    
    .friends-chat-header h3 {
      font-size: 1rem !important;
    }
    
    .friends-chat-header p {
      font-size: 0.75rem !important;
    }
    
    .friends-chat-messages .p-8 {
      padding: 1rem !important;
    }
    
    .friends-chat-messages .space-y-5 {
      gap: 1rem !important;
    }
    
    .friends-message-input .p-8 {
      padding: 1rem !important;
    }
    
    .friends-message-input .pb-40 {
      padding-bottom: 1rem !important;
    }
    
    .friends-message-input .gap-4 {
      gap: 0.5rem !important;
    }
    
    .friends-message-input input {
      padding: 0.75rem 1rem !important;
      font-size: 0.875rem !important;
    }
    
    .friends-message-input button {
      padding: 0.75rem 1rem !important;
      font-size: 0.875rem !important;
    }
    
    .friends-message-input button svg {
      width: 1rem !important;
      height: 1rem !important;
    }
    
    /* Fix message bubble sizes on mobile */
    .friends-chat-messages .max-w-[70%] {
      max-width: 85% !important;
    }
    
    .friends-chat-messages .p-3 {
      padding: 0.75rem !important;
    }
    
    .friends-chat-messages .text-sm {
      font-size: 0.875rem !important;
    }
    
    .friends-chat-messages .text-xs {
      font-size: 0.625rem !important;
    }
    
    .friends-chat-messages .w-6.h-6 {
      width: 1.5rem !important;
      height: 1.5rem !important;
    }
    
    /* Specific fixes for friends outside experience zone - mobile only */
    .friends-left-side {
      padding: 0.75rem !important;
    }
    
    .friends-left-side .p-8 {
      padding: 0.75rem !important;
    }
    
    .friends-left-side .p-8 h3 {
      font-size: 0.875rem !important;
      margin-bottom: 0.25rem !important;
    }
    
    .friends-left-side .p-8 p {
      font-size: 0.625rem !important;
    }
    
    .friend-item {
      padding: 0.5rem !important;
    }
    
    .friend-item .flex.items-center.gap-3 {
      gap: 0.5rem !important;
    }
    
    .friend-item .w-12.h-12 {
      width: 2rem !important;
      height: 2rem !important;
    }
    
    .friend-item .w-4.h-4 {
      width: 0.5rem !important;
      height: 0.5rem !important;
    }
    
    .friend-item h3 {
      font-size: 0.75rem !important;
    }
    
    .friend-item p {
      font-size: 0.5rem !important;
    }
    
    /* Friends chat header fixes */
    .friends-chat-header {
      padding: 0.75rem !important;
    }
    
    .friends-chat-header .w-12.h-12 {
      width: 2rem !important;
      height: 2rem !important;
    }
    
    .friends-chat-header .w-4.h-4 {
      width: 0.875rem !important;
      height: 0.875rem !important;
    }
    
    .friends-chat-header h3 {
      font-size: 0.875rem !important;
    }
    
    .friends-chat-header p {
      font-size: 0.625rem !important;
    }
    
    /* Friends chat messages fixes */
    .friends-chat-messages {
      padding: 0.75rem !important;
      height: calc(100% - 120px) !important;
    }
    
    .friends-chat-messages .p-8 {
      padding: 0.75rem !important;
    }
    
    .friends-chat-messages .space-y-5 {
      gap: 0.75rem !important;
    }
    
    /* Friends message input fixes - prevent cutoff */
    .friends-message-input {
      padding: 0.75rem !important;
      padding-bottom: 0.75rem !important;
      gap: 0.5rem !important;
      flex-wrap: nowrap !important;
    }
    
    .friends-message-input .p-8 {
      padding: 0.75rem !important;
    }
    
    .friends-message-input .pb-40 {
      padding-bottom: 0.75rem !important;
    }
    
    .friends-message-input .gap-4 {
      gap: 0.5rem !important;
    }
    
    .friends-message-input input {
      padding: 0.5rem 0.75rem !important;
      font-size: 0.75rem !important;
      min-width: 0 !important;
      flex-shrink: 1 !important;
    }
    
    .friends-message-input button {
      padding: 0.5rem 0.75rem !important;
      font-size: 0.75rem !important;
      flex-shrink: 0 !important;
      white-space: nowrap !important;
    }
    
    .friends-message-input button svg {
      width: 0.875rem !important;
      height: 0.875rem !important;
    }
    
    /* Message bubble fixes */
    .friends-chat-messages .max-w-[70%] {
      max-width: 90% !important;
    }
    
    .friends-chat-messages .p-3 {
      padding: 0.5rem !important;
    }
    
    .friends-chat-messages .text-sm {
      font-size: 0.75rem !important;
    }
    
    .friends-chat-messages .text-xs {
      font-size: 0.5rem !important;
    }
    
    .friends-chat-messages .w-6.h-6 {
      width: 1rem !important;
      height: 1rem !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleId = 'community-mobile-styles';
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = mobileStyles;
  document.head.appendChild(style);
}

/**
 * 🎯 Enter Circles - The Ultimate Community Experience
 * @description Where creators, investors, and fans unite in the most vibrant entertainment community
 */
const Community: React.FC = () => {
  // Comprehensive Community Data - Memoized to prevent re-creation with lazy loading
  const communityData = useMemo(() => {
    // Only load first 100 items per category for better performance
    const limit = 100;
    return {
      movies: comprehensiveCommunityData.movies.slice(0, limit),
      actors: comprehensiveCommunityData.actors.slice(0, limit),
      actresses: comprehensiveCommunityData.actresses.slice(0, limit),
      directors: comprehensiveCommunityData.directors.slice(0, limit),
      productionHouses: comprehensiveCommunityData.productionHouses.slice(0, limit),
      musicArtists: comprehensiveCommunityData.musicArtists.slice(0, limit)
    };
  }, []);

  // Hierarchical community state
  const [selectedCategory, setSelectedCategory] = useState<'productionHouse' | 'movie' | 'director' | 'actor' | 'actress' | 'musicArtist'>('movie');
  const [selectedItem, setSelectedItem] = useState<RealCommunityItem | null>(null);
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [transitioningItemId, setTransitioningItemId] = useState<string | null>(null);

  // Check for selected item from Dashboard navigation
  useEffect(() => {
    const selectedCommunityItem = localStorage.getItem('selectedCommunityItem');
    if (selectedCommunityItem) {
      try {
        const { item, category } = JSON.parse(selectedCommunityItem);
        setSelectedItem(item);
        setSelectedCategory(category);
        setIsItemSelected(true);
        // Clear the localStorage after using it
        localStorage.removeItem('selectedCommunityItem');
      } catch (error) {
        console.error('Error parsing selected community item:', error);
        localStorage.removeItem('selectedCommunityItem');
      }
    }
  }, []);
  
  // Static data integration - no API calls
  const [mergedMusicArtists, setMergedMusicArtists] = useState<RealCommunityItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  
  // Original state for when item is selected - Community Hub as default
  const [activeTab, setActiveTab] = useState<'feed' | 'hub' | 'channels' | 'friends' | 'media' | 'perks' | 'merch'>('hub');

  // Community Hub State - Cleaned up unused code

  // Initial chat messages - moved to constant for better performance
  const initialHubChatMessages: ChatMessage[] = [
    { id: 1, user: 'FilmFan_2024', message: 'Latest trailer dekh liya! 🔥 Kya mast hai yaar!', time: '2:30 PM', avatar: '🎬', likes: 12, reactions: ['❤️', '🔥'], mentions: ['@CinemaLover'] },
    { id: 2, user: 'CinemaLover', message: 'Action sequences toh bilkul zabardast hai! VFX team ne kaam kar diya!', time: '2:32 PM', avatar: '🎥', likes: 8, reactions: ['👏', '🎯'], mentions: [] },
    { id: 3, user: 'MovieBuff', message: '🚨 BREAKING: New trailer kal 12 PM IST pe aa raha hai! 🚨 Sab ready ho jao!', time: '3:15 PM', avatar: '🍿', likes: 25, reactions: ['🚨', '🔥', '💯'], mentions: [], isOfficial: true },
    { id: 4, user: 'ArtDirector', message: 'Finally! Main toh bas yahi wait kar rahi thi 😭 Ab toh excitement control nahi ho raha!', time: '3:16 PM', avatar: '🎨', likes: 15, reactions: ['😭', '❤️'], mentions: [] },
    { id: 5, user: 'TechGuru', message: 'Q3 numbers are looking exceptionally strong! 📈 The market response has been phenomenal.', time: '3:20 PM', avatar: '💻', likes: 7, reactions: ['📈', '💎'], mentions: [] },
    { id: 6, user: 'InvestorPro', message: 'The international market response has been absolutely phenomenal 🌍 We\'ve achieved remarkable global reach.', time: '3:25 PM', avatar: '💰', likes: 9, reactions: ['🌍', '🏆'], mentions: [] },
    { id: 7, user: 'CreatorHub', message: 'Streaming platforms mein diversify karna chahiye kya? 🤔 Netflix, Amazon sab mein ja sakte hain!', time: '3:30 PM', avatar: '🎭', likes: 11, reactions: ['🤔', '💭'], mentions: [] },
    { id: 8, user: 'FilmFan_2024', message: 'Netflix deal almost final ho gaya hai! 🎬 Ab toh international audience bhi milegi!', time: '3:35 PM', avatar: '🎬', likes: 18, reactions: ['🎬', '🌍', '💯'], mentions: [] },
    { id: 9, user: 'CinemaLover', message: 'Bhai log, low light scenes mein color grading mein problem aa rahi hai kya? 🎨 Koi solution batao!', time: '3:40 PM', avatar: '🎥', likes: 6, reactions: ['🎨', '🤔'], mentions: [] },
    { id: 10, user: 'MovieBuff', message: 'I recommend using a warmer LUT and slightly increasing the shadows. This should provide the perfect balance.', time: '3:42 PM', avatar: '🍿', likes: 4, reactions: ['💡', '👌'], mentions: [] },
    { id: 11, user: 'Community Bot', message: '📊 POLL: Agle genre mein kya explore karein?\nA) Sci-Fi Thriller 🚀\nB) Romantic Comedy 💕\nC) Historical Drama 🏛️\nD) Horror Mystery 👻\n\nReact karke vote karo!', time: '3:45 PM', avatar: '🤖', likes: 0, reactions: [], mentions: [], isBot: true, pollData: { question: 'Agle genre mein kya explore karein?', options: ['Sci-Fi Thriller 🚀', 'Romantic Comedy 💕', 'Historical Drama 🏛️', 'Horror Mystery 👻'], votes: { 'A': 45, 'B': 23, 'C': 18, 'D': 14 } } },
    { id: 12, user: 'VFXMaster', message: 'New RED camera footage toh bilkul insane hai! 📹 Quality dekh ke hi pata chalta hai!', time: '3:50 PM', avatar: '🎬', likes: 14, reactions: ['📹', '🔥'], mentions: [] },
    { id: 13, user: 'SoundDesigner', message: 'I still prefer film grain over digital noise 🎞️ It provides a more authentic cinematic feel.', time: '3:52 PM', avatar: '🎵', likes: 9, reactions: ['🎞️', '🎭'], mentions: [] },
    { id: 14, user: 'FanGirl_2024', message: 'IS ANYONE ELSE COMPLETELY SHOCKED BY THAT ENDING?! 😭😭😭 I\'m still processing what just happened!', time: '3:55 PM', avatar: '💖', likes: 22, reactions: ['😭', '🤯', '💔'], mentions: [] },
    { id: 15, user: 'PlotTwistLover', message: 'Plot twist ne toh mujhe bilkul SHOOK kar diya! 🤯 Kya direction thi yaar!', time: '3:57 PM', avatar: '🎭', likes: 19, reactions: ['🤯', '👏', '🎯'], mentions: [] },
    { id: 16, user: 'CinematographyFan', message: 'Cinematography ke baare mein baat karein? 🤌✨ Kya shots the yaar!', time: '4:00 PM', avatar: '📸', likes: 16, reactions: ['🤌', '✨', '📸'], mentions: [] },
    { id: 17, user: 'RewatchKing', message: 'Main toh second watch plan kar raha hun! 🍿 Pehli baar miss ho gaya kuch!', time: '4:02 PM', avatar: '👑', likes: 12, reactions: ['🍿', '🔄'], mentions: [] },
    { id: 18, user: 'VFXTeam', message: 'The VFX team deserves all the awards! 🏆 Their work was absolutely outstanding.', time: '4:05 PM', avatar: '🎬', likes: 28, reactions: ['🏆', '👏', '💯'], mentions: [], isOfficial: true },
    { id: 19, user: 'FitnessMotivator', message: 'Action sequences mein hero ka body transformation dekh ke motivation mil gaya! 💪 Gym jana padega!', time: '4:08 PM', avatar: '💪', likes: 15, reactions: ['💪', '🔥', '💯'], mentions: [] },
    { id: 20, user: 'Community Bot', message: '📊 POLL RESULTS: Best Movie Snack?\n🍿 Popcorn - 67%\n🍫 Chocolate - 18%\n🥤 Soda - 10%\n🍕 Pizza - 5%\n\nPopcorn jeet gaya! 🎉', time: '4:10 PM', avatar: '🤖', likes: 0, reactions: [], mentions: [], isBot: true, pollResults: { question: 'Best Movie Snack?', results: { '🍿 Popcorn': 67, '🍫 Chocolate': 18, '🥤 Soda': 10, '🍕 Pizza': 5 } } }
  ];

  const [hubChatMessages, setHubChatMessages] = useState<ChatMessage[]>(initialHubChatMessages);


  const [hubChatInput, setHubChatInput] = useState('');
  
  // Detailed Window Chat State
  const [detailedWindowChatMessages, setDetailedWindowChatMessages] = useState<ChatMessage[]>([
    { id: 1, user: 'Fan_2024', message: 'Amazing performance! 🔥', time: '2:30 PM', avatar: '🎬', likes: 12, reactions: ['❤️', '🔥'], mentions: [] },
    { id: 2, user: 'MovieLover', message: 'Can\'t wait for your next project!', time: '2:32 PM', avatar: '🎥', likes: 8, reactions: ['👏', '🎯'], mentions: [] },
    { id: 3, user: 'Community Bot', message: '📊 POLL: What genre should we explore next?\nA) Action Thriller 🚀\nB) Romantic Drama 💕\nC) Comedy 🎭\nD) Mystery 🔍\n\nVote by reacting!', time: '3:15 PM', avatar: '🤖', likes: 0, reactions: [], mentions: [], isBot: true, pollData: { question: 'What genre should we explore next?', options: ['Action Thriller 🚀', 'Romantic Drama 💕', 'Comedy 🎭', 'Mystery 🔍'], votes: { 'A': 25, 'B': 18, 'C': 12, 'D': 8 } } },
    { id: 4, user: 'CinemaFan', message: 'Your acting skills are incredible! 👏', time: '3:20 PM', avatar: '🍿', likes: 15, reactions: ['👏', '❤️'], mentions: [] },
    { id: 5, user: 'FilmBuff', message: 'Looking forward to the next release! 🎬', time: '3:25 PM', avatar: '🎭', likes: 9, reactions: ['🎬', '🔥'], mentions: [] }
  ]);
  const [detailedWindowChatInput, setDetailedWindowChatInput] = useState('');
  const detailedWindowChatRef = useRef<HTMLDivElement>(null);
  
  // Widget states
  const [showWidgets, setShowWidgets] = useState(true);
  const [widgetPage, setWidgetPage] = useState(0);
  const [userCreatedPolls, setUserCreatedPolls] = useState<Array<{
    id: string;
    question: string;
    options: string[];
    votes: Record<string, number>;
    duration: string;
    allowMultipleVotes: boolean;
    anonymous: boolean;
    createdAt: string;
  }>>([]);
  const [userCreatedEvents, setUserCreatedEvents] = useState<Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    maxAttendees: number;
    location: string;
    attendees: string[];
    createdAt: string;
  }>>([]);
  const [userCreatedAnnouncements, setUserCreatedAnnouncements] = useState<Array<{
    id: string;
    title: string;
    content: string;
    priority: string;
    category: string;
    createdAt: string;
  }>>([]);
  
  // Sample news and announcements data
  const [communityNews] = useState([
    {
      id: 1,
      title: "New Feature: Enhanced Chat Experience",
      content: "We've launched an improved chat system with better emoji support and file sharing capabilities.",
      date: "2 hours ago",
      category: "Feature Update",
      priority: "normal"
    },
    {
      id: 2,
      title: "Community Milestone: 50K Members!",
      content: "Our community has reached an incredible milestone of 50,000 active members. Thank you all!",
      date: "1 day ago",
      category: "Milestone",
      priority: "high"
    },
    {
      id: 3,
      title: "Upcoming Live Q&A Session",
      content: "Join us this Friday for a live Q&A session with our development team. Ask anything!",
      date: "3 days ago",
      category: "Event",
      priority: "normal"
    }
  ]);

  const [communityAnnouncements] = useState([
    {
      id: 1,
      title: "Important: Server Maintenance",
      content: "Scheduled maintenance on Sunday 2-4 AM. Some features may be temporarily unavailable.",
      date: "5 hours ago",
      category: "Maintenance",
      priority: "urgent"
    },
    {
      id: 2,
      title: "New Community Guidelines",
      content: "We've updated our community guidelines to ensure a better experience for everyone.",
      date: "1 day ago",
      category: "Policy",
      priority: "high"
    },
    {
      id: 3,
      title: "Welcome New Moderators",
      content: "Please welcome our new community moderators who will help maintain a positive environment.",
      date: "2 days ago",
      category: "Community",
      priority: "normal"
    }
  ]);
  
  // Modal states for interactive features
  const [showPollModal, setShowPollModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  
  // Poll creation form state
  const [pollForm, setPollForm] = useState({
    question: '',
    options: ['', '', '', ''],
    duration: '24h', // 1h, 6h, 24h, 7d
    allowMultipleVotes: false,
    anonymous: false
  });
  
  // Event creation form state
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    maxAttendees: 50,
    location: 'Online'
  });
  
  // Announcement creation form state
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal', // low, normal, high, urgent
    category: 'general' // general, update, news, alert
  });
  // Static data - moved to constants for better performance
  const communityStats = {
    totalMembers: 15420,
    onlineMembers: 234,
    totalPosts: 8920,
    totalPolls: 156,
    activeEvents: 8,
    trendingTopics: ['#NewTrailer', '#BehindTheScenes', '#VFXMagic', '#Cinematography']
  };
  
  const recentActivities = [
    { id: 1, user: 'FilmFan_2024', action: 'voted on poll', target: 'Best Movie Genre', time: '2 min ago' },
    { id: 2, user: 'CinemaLover', action: 'joined event', target: 'Behind the Scenes Tour', time: '5 min ago' },
    { id: 3, user: 'MovieBuff', action: 'created poll', target: 'Favorite Director', time: '8 min ago' },
    { id: 4, user: 'ArtDirector', action: 'shared announcement', target: 'New Project Launch', time: '12 min ago' },
    { id: 5, user: 'TechGuru', action: 'reacted to message', target: 'VFX Discussion', time: '15 min ago' }
  ];
  
  const upcomingEvents = [
    { id: 1, title: 'Behind the Scenes Tour', date: '2024-01-15', time: '2:00 PM', attendees: 45, maxAttendees: 50 },
    { id: 2, title: 'VFX Workshop', date: '2024-01-18', time: '4:00 PM', attendees: 23, maxAttendees: 30 },
    { id: 3, title: 'Director Q&A Session', date: '2024-01-20', time: '7:00 PM', attendees: 67, maxAttendees: 100 },
    { id: 4, title: 'Community Meetup', date: '2024-01-22', time: '6:00 PM', attendees: 34, maxAttendees: 50 }
  ];
  
  const activePolls = [
    { id: 1, question: 'Best Movie Genre for Next Project?', options: ['Sci-Fi', 'Romance', 'Action', 'Drama'], votes: [45, 23, 18, 14], totalVotes: 100 },
    { id: 2, question: 'Favorite Director?', options: ['Christopher Nolan', 'Quentin Tarantino', 'Martin Scorsese', 'Steven Spielberg'], votes: [67, 23, 8, 2], totalVotes: 100 },
    { id: 3, question: 'Best Movie Snack?', options: ['Popcorn', 'Nachos', 'Candy', 'Hot Dog'], votes: [78, 12, 8, 2], totalVotes: 100 }
  ];

  // Community Hub Functions - Cleaned up unused functions

  const handleHubChatSend = () => {
    if (!hubChatInput.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      user: 'You',
      message: hubChatInput,
      time: 'Just now',
      avatar: getUserAvatar('You'),
      likes: 0,
      reactions: [] as string[],
      mentions: extractMentions(hubChatInput)
    };
    
    setHubChatMessages(prev => [...prev, newMessage]);
    setHubChatInput('');
    
    // Auto-scroll to bottom after sending message
    setTimeout(() => {
      const chatContainer = document.querySelector('.hub-chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  };

  const handleHubChatLike = (messageId: number) => {
    setHubChatMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, likes: msg.likes + 1 }
        : msg
    ));
  };

  const handleHubChatReaction = (messageId: number, reaction: string) => {
    setHubChatMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            reactions: msg.reactions ? [...msg.reactions, reaction] : [reaction]
          }
        : msg
    ));
  };

  // const handleHubChatReply = (messageId: number, replyText: string) => {
  //   const newReply = {
  //     id: Date.now(),
  //     user: 'You',
  //     message: replyText,
  //     time: 'Just now',
  //     avatar: getUserAvatar('You'),
  //     likes: 0,
  //     reactions: [] as string[],
  //     mentions: extractMentions(replyText),
  //     isReply: true,
  //     replyTo: messageId
  //   };
    
  //   setHubChatMessages(prev => [...prev, newReply]);
  //   setHubChatInput('');
    
  //   // Auto-scroll to bottom after sending reply
  //   setTimeout(() => {
  //     const chatContainer = document.querySelector('.hub-chat-messages');
  //     if (chatContainer) {
  //       chatContainer.scrollTop = chatContainer.scrollHeight;
  //     }
  //   }, 100);
  // };

  const handlePollVote = (messageId: number, option: string) => {
    setHubChatMessages(prev => prev.map(msg => 
      msg.id === messageId && msg.pollData
        ? { 
            ...msg, 
            pollData: {
              ...msg.pollData,
              votes: {
                ...msg.pollData.votes,
                [option]: (msg.pollData.votes[option] || 0) + 1
              },
              userVote: option // Track user's vote
            }
          }
        : msg
    ));
  };

  // Detailed Window Chat Functions
  const handleDetailedWindowChatSend = () => {
    if (detailedWindowChatInput.trim()) {
      setDetailedWindowChatMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          user: 'You',
          message: detailedWindowChatInput,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: '👤',
          likes: 0,
          reactions: [],
          mentions: extractMentions(detailedWindowChatInput)
        }
      ]);
      setDetailedWindowChatInput('');
      scrollToBottomDelayed(detailedWindowChatRef, 100);
    }
  };

  const handleDetailedWindowChatLike = (messageId: number) => {
    setDetailedWindowChatMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, likes: msg.likes + 1 }
          : msg
      )
    );
  };

  const handleDetailedWindowChatReaction = (messageId: number, reaction: string) => {
    setDetailedWindowChatMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
          : msg
      )
    );
  };

  const handleDetailedWindowChatReply = (messageId: number, replyText: string) => {
    setDetailedWindowChatMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        user: 'You',
        message: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: '👤',
        likes: 0,
        reactions: [],
        mentions: extractMentions(replyText),
        isReply: true,
        replyTo: messageId
      }
    ]);
    scrollToBottomDelayed(detailedWindowChatRef, 100);
  };

  const handleDetailedWindowPollVote = (messageId: number, option: string) => {
    setDetailedWindowChatMessages(prev => 
      prev.map(msg => 
        msg.id === messageId && msg.pollData
          ? { 
              ...msg, 
              pollData: {
                ...msg.pollData,
                votes: {
                  ...msg.pollData.votes,
                  [option]: (msg.pollData.votes[option] || 0) + 1
                }
              }
            }
          : msg
      )
    );
  };

  // Add more interactive functions
  // const createPoll = (question: string, options: string[]) => {
  //   const newPoll: BotMessage = {
  //     id: Date.now(),
  //     user: 'Community Bot',
  //     message: `📊 POLL: ${question}\n${options.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join('\n')}\n\nReact karke vote karo!`,
  //     time: 'Just now',
  //     avatar: '🤖',
  //     likes: 0,
  //     reactions: [],
  //     mentions: [],
  //     isBot: true,
  //     pollData: { 
  //       question, 
  //       options, 
  //       votes: { A: 0, B: 0, C: 0, D: 0 },
  //       userVote: undefined
  //     }
  //   };
    
  //   setHubChatMessages(prev => [...prev, newPoll]);
  // };

  // const createEvent = (title: string, date: string, description: string) => {
  //   const newEvent: BotMessage = {
  //     id: Date.now(),
  //     user: 'Community Bot',
  //     message: `📅 EVENT: ${title}\n📆 Date: ${date}\n📝 ${description}\n\nInterested? React with 👍`,
  //     time: 'Just now',
  //     avatar: '🤖',
  //     likes: 0,
  //     reactions: [],
  //     mentions: [],
  //     isBot: true,
  //     eventData: { title, date, description }
  //   };
    
  //   setHubChatMessages(prev => [...prev, newEvent]);
  // };

  // const createAnnouncement = (title: string, content: string) => {
  //   const newAnnouncement: BotMessage = {
  //     id: Date.now(),
  //     user: 'Community Bot',
  //     message: `📢 ANNOUNCEMENT: ${title}\n\n${content}`,
  //     time: 'Just now',
  //     avatar: '🤖',
  //     likes: 0,
  //     reactions: [],
  //     mentions: [],
  //     isBot: true,
  //     isOfficial: true
  //   };
    
  //   setHubChatMessages(prev => [...prev, newAnnouncement]);
  // };

  // Enhanced form handlers
  const handlePollSubmit = () => {
    if (!pollForm.question.trim() || pollForm.options.filter(opt => opt.trim()).length < 2) {
      return; // Don't submit if question is empty or less than 2 options
    }
    
    const validOptions = pollForm.options.filter(opt => opt.trim());
    const newPoll: BotMessage = {
      id: Date.now(),
      user: 'You',
      message: `📊 POLL: ${pollForm.question}\n${validOptions.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join('\n')}\n\nReact karke vote karo!`,
      time: 'Just now',
      avatar: getUserAvatar('You'),
      likes: 0,
      reactions: [],
      mentions: [],
      isBot: true, // This makes it render as a proper poll
      pollData: { 
        question: pollForm.question,
        options: validOptions,
        votes: Object.fromEntries(validOptions.map((_, idx) => [String.fromCharCode(65 + idx), 0])),
        userVote: undefined
      }
    };
    
    setHubChatMessages(prev => [...prev, newPoll]);
    setUserCreatedPolls((prev) => [{
      id: newPoll.id.toString(),
      question: pollForm.question,
      options: validOptions,
      votes: Object.fromEntries(validOptions.map((_, idx) => [String.fromCharCode(65 + idx), 0])),
      duration: pollForm.duration,
      allowMultipleVotes: pollForm.allowMultipleVotes,
      anonymous: pollForm.anonymous,
      createdAt: new Date().toISOString()
    }, ...prev]); // Add to user polls widget
    setShowPollModal(false);
    setPollForm({ question: '', options: ['', '', '', ''], duration: '24h', allowMultipleVotes: false, anonymous: false });
    
    // Auto-scroll to bottom
    setTimeout(() => {
      const chatContainer = document.querySelector('.hub-chat-messages');
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  };

  const handleEventSubmit = () => {
    if (!eventForm.title.trim() || !eventForm.date || !eventForm.description.trim()) {
      return;
    }
    
    const newEvent: BotMessage = {
      id: Date.now(),
      user: 'You',
      message: `📅 EVENT: ${eventForm.title}\n📆 Date: ${eventForm.date} at ${eventForm.time}\n📍 Location: ${eventForm.location}\n📝 ${eventForm.description}\n\nInterested? React with 👍`,
      time: 'Just now',
      avatar: getUserAvatar('You'),
      likes: 0,
      reactions: [],
      mentions: [],
      isBot: true, // This makes it render in special format
      eventData: { 
        title: eventForm.title, 
        date: eventForm.date, 
        description: eventForm.description
      }
    };
    
    setHubChatMessages(prev => [...prev, newEvent]);
    setUserCreatedEvents((prev) => [{
      id: newEvent.id.toString(),
      title: eventForm.title,
      date: eventForm.date,
      time: eventForm.time,
      description: eventForm.description,
      maxAttendees: eventForm.maxAttendees,
      location: eventForm.location,
      attendees: [],
      createdAt: new Date().toISOString()
    }, ...prev]); // Add to user events widget
    setShowEventModal(false);
    setEventForm({ title: '', date: '', time: '', description: '', maxAttendees: 50, location: 'Online' });
    
    // Auto-scroll to bottom
    setTimeout(() => {
      const chatContainer = document.querySelector('.hub-chat-messages');
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  };

  const handleAnnouncementSubmit = () => {
    if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
      return;
    }
    
    const priorityEmoji = {
      low: '📢',
      normal: '📢',
      high: '🚨',
      urgent: '🚨🚨'
    };
    
    const newAnnouncement: BotMessage = {
      id: Date.now(),
      user: 'You',
      message: `${priorityEmoji[announcementForm.priority as keyof typeof priorityEmoji]} ANNOUNCEMENT: ${announcementForm.title}\n\n${announcementForm.content}`,
      time: 'Just now',
      avatar: getUserAvatar('You'),
      likes: 0,
      reactions: [],
      mentions: [],
      isBot: true, // This makes it render in special format
      isOfficial: true,
      announcementData: { 
        title: announcementForm.title, 
        content: announcementForm.content,
        priority: announcementForm.priority,
        category: announcementForm.category
      }
    };
    
    setHubChatMessages(prev => [...prev, newAnnouncement]);
    setUserCreatedAnnouncements((prev) => [{
      id: newAnnouncement.id.toString(),
      title: announcementForm.title,
      content: announcementForm.content,
      priority: announcementForm.priority,
      category: announcementForm.category,
      createdAt: new Date().toISOString()
    }, ...prev]); // Add to user announcements widget
    setShowAnnouncementModal(false);
    setAnnouncementForm({ title: '', content: '', priority: 'normal', category: 'general' });
    
    // Auto-scroll to bottom
    setTimeout(() => {
      const chatContainer = document.querySelector('.hub-chat-messages');
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  };

  const addPollOption = () => {
    if (pollForm.options.length < 8) { // Max 8 options
      setPollForm(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removePollOption = (index: number) => {
    if (pollForm.options.length > 2) { // Min 2 options
      setPollForm(prev => ({
        ...prev,
        options: prev.options.filter((_, idx) => idx !== index)
      }));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    setPollForm(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => idx === index ? value : opt)
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };



  const [selectedChannel, setSelectedChannel] = useState<string>('announcements');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, {
    user: string; 
    message: string; 
    time: string; 
    avatar: string;
    isUser?: boolean;
    reactions?: string[];
    mentions?: string[];
    isOfficial?: boolean;
    isBot?: boolean;
  }[]>>({
    announcements: [
      { user: 'Alok Tripathy', message: 'Bhai, latest behind-the-scenes footage dekh liya! 🔥 Kya mast hai yaar!', time: '2:30 PM', avatar: getUserAvatar('Alok Tripathy') },
      { user: 'Ankit Singh', message: 'Action sequences toh bilkul zabardast hai! VFX team ne kaam kar diya!', time: '2:32 PM', avatar: getUserAvatar('Ankit Singh') },
      { user: 'Biren Dora', message: '🚨 BREAKING: New trailer kal 12 PM IST pe aa raha hai! 🚨 Sab ready ho jao!', time: '3:15 PM', avatar: getUserAvatar('Biren Dora') },
      { user: 'Adya Rath', message: 'Finally! Main toh bas yahi wait kar rahi thi 😭 Ab toh excitement control nahi ho raha!', time: '3:16 PM', avatar: getUserAvatar('Adya Rath') }
    ],
    'investor-hall': [
      { user: 'Soham Bardhan', message: 'Q3 numbers are looking exceptionally strong! 📈 The market response has been phenomenal across all segments.', time: '1:45 PM', avatar: getUserAvatar('Soham Bardhan') },
      { user: 'Praveen Dehury', message: 'The international market response has been absolutely phenomenal 🌍 We\'ve achieved remarkable global reach.', time: '1:47 PM', avatar: getUserAvatar('Praveen Dehury') },
      { user: 'Kamlesh Biswal', message: 'Streaming platforms mein diversify karna chahiye kya? 🤔 Netflix, Amazon sab mein ja sakte hain!', time: '2:10 PM', avatar: getUserAvatar('Kamlesh Biswal') },
      { user: 'Alok Tripathy', message: 'Netflix deal almost final ho gaya hai! 🎬 Ab toh international audience bhi milegi!', time: '2:12 PM', avatar: getUserAvatar('Alok Tripathy') }
    ],
    'creator-talks': [
      { user: 'Ankit Singh', message: 'Bhai log, low light scenes mein color grading mein problem aa rahi hai kya? 🎨 Koi solution batao!', time: '11:30 AM', avatar: getUserAvatar('Ankit Singh') },
      { user: 'Biren Dora', message: 'I recommend using a warmer LUT and slightly increasing the shadows. This should provide the perfect balance for low light scenarios.', time: '11:32 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'Adya Rath', message: 'New RED camera footage toh bilkul insane hai! 📹 Quality dekh ke hi pata chalta hai!', time: '12:15 PM', avatar: getUserAvatar('Adya Rath') },
              { user: 'Soham Bardhan', message: 'I still prefer film grain over digital noise 🎞️ It provides a more authentic cinematic feel.', time: '12:17 PM', avatar: getUserAvatar('Soham Bardhan') }
    ],
    'fan-zone': [
      { user: 'Praveen Dehury', message: 'IS ANYONE ELSE COMPLETELY SHOCKED BY THAT ENDING?! 😭😭😭 I\'m still processing what just happened!', time: '10:45 AM', avatar: getUserAvatar('Praveen Dehury') },
      { user: 'Kamlesh Biswal', message: 'Plot twist ne toh mujhe bilkul SHOOK kar diya! 🤯 Kya direction thi yaar!', time: '10:47 AM', avatar: getUserAvatar('Kamlesh Biswal') },
      { user: 'Alok Tripathy', message: 'Cinematography ke baare mein baat karein? 🤌✨ Kya shots the yaar!', time: '11:00 AM', avatar: getUserAvatar('Alok Tripathy') },
              { user: 'Ankit Singh', message: 'Main toh second watch plan kar raha hun! 🍿 Pehli baar miss ho gaya kuch!', time: '11:02 AM', avatar: getUserAvatar('Ankit Singh') },
      { user: 'Biren Dora', message: 'The VFX team deserves all the awards! 🏆 Their work was absolutely outstanding.', time: '11:30 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'Ipsit Tripathy', message: 'Action sequences mein hero ka body transformation dekh ke motivation mil gaya! 💪 Gym jana padega!', time: '11:45 AM', avatar: getUserAvatar('Ipsit Tripathy') }
    ],
    polls: [
      { user: 'Community Bot', message: '📊 POLL: Agle genre mein kya explore karein?\nA) Sci-Fi Thriller 🚀\nB) Romantic Comedy 💕\nC) Historical Drama 🏛️\nD) Horror Mystery 👻\n\nReact karke vote karo!', time: '9:00 AM', avatar: getUserAvatar('Community Bot') },
      { user: 'Adya Rath', message: 'Definitely Sci-Fi! 🚀 Space mein kuch different karna chahiye!', time: '9:15 AM', avatar: getUserAvatar('Adya Rath') },
      { user: 'Soham Bardhan', message: 'Horror Mystery sounds quite intriguing 👻 The suspense element would be excellent.', time: '9:20 AM', avatar: getUserAvatar('Soham Bardhan') },
      { user: 'Community Bot', message: '📊 POLL RESULTS: Best Movie Snack?\n🍿 Popcorn - 67%\n🍫 Chocolate - 18%\n🥤 Soda - 10%\n🍕 Pizza - 5%\n\nPopcorn jeet gaya! 🎉', time: '2:00 PM', avatar: getUserAvatar('Community Bot') },
      { user: 'Praveen Dehury', message: 'Pizza gang is absolutely devastated 😂🍕 Popcorn supremacy reigns supreme!', time: '2:05 PM', avatar: getUserAvatar('Praveen Dehury') }
    ],
    'behind-scenes': [
      { user: 'Kamlesh Biswal', message: 'Set pe 4 AM ka scene kaisa hota hai, yeh dekho ☕😴 Coffee toh zaroori hai!', time: '4:00 AM', avatar: getUserAvatar('Kamlesh Biswal') },
      { user: 'Alok Tripathy', message: 'Makeup team abhi magic kar rahi hai ✨💄 Transformation dekh ke hi pata chalta hai!', time: '5:30 AM', avatar: getUserAvatar('Alok Tripathy') },
              { user: 'Ankit Singh', message: 'Stunt sequence perfect ho gaya! 🎬🔥 Kya coordination thi!', time: '6:45 AM', avatar: getUserAvatar('Ankit Singh') },
      { user: 'Biren Dora', message: 'The catering truck has arrived! 🚚🍕 This should provide much-needed energy for the crew.', time: '7:00 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'Adya Rath', message: 'Golden hour shots bilkul incredible lag rahe hain 🌅 Natural lighting best hai!', time: '7:15 AM', avatar: getUserAvatar('Adya Rath') },
      { user: 'Ipsit Tripathy', message: 'Stunt doubles ko proper warm-up karwana chahiye! 💪 Flexibility aur strength dono important hai!', time: '7:30 AM', avatar: getUserAvatar('Ipsit Tripathy') }
    ],
    'general-chat': [
      { user: 'Adya Rath', message: 'Good morning everyone! ☀️ How\'s your day going so far?', time: '9:00 AM', avatar: getUserAvatar('Adya Rath') },
      { user: 'Soham Bardhan', message: 'Morning! Just finished my coffee and ready to tackle the day! ☕', time: '9:02 AM', avatar: getUserAvatar('Soham Bardhan') },
      { user: 'Praveen Dehury', message: 'Anyone watching any good shows these days? Need recommendations! 📺', time: '9:05 AM', avatar: getUserAvatar('Praveen Dehury') },
      { user: 'Alok Tripathy', message: 'I just started watching this new series on Netflix. It\'s absolutely mind-blowing! 🤯', time: '9:08 AM', avatar: getUserAvatar('Alok Tripathy') },
      { user: 'Biren Dora', message: 'What\'s everyone\'s weekend plans? Any exciting projects? 🎬', time: '9:10 AM', avatar: getUserAvatar('Biren Dora') }
    ],
    'tech-talk': [
      { user: 'Ankit Singh', message: 'Just got the new iPhone 15 Pro! The camera quality is insane! 📱📸', time: '10:30 AM', avatar: getUserAvatar('Ankit Singh') },
      { user: 'Kamlesh Biswal', message: 'Anyone tried the new AI tools for video editing? They\'re game-changing! 🤖✂️', time: '10:35 AM', avatar: getUserAvatar('Kamlesh Biswal') },
      { user: 'Ipsit Tripathy', message: 'The new MacBook Pro with M3 chip is absolutely blazing fast! 💻⚡', time: '10:40 AM', avatar: getUserAvatar('Ipsit Tripathy') },
      { user: 'Biren Dora', message: 'What\'s your take on the future of VR in entertainment? 🥽🎮', time: '10:45 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'Adya Rath', message: 'Just discovered this amazing app for music production! 🎵🎧', time: '10:50 AM', avatar: getUserAvatar('Adya Rath') }
    ]
  });


  const friendsList = [
    { id: 'alok', name: 'Alok Tripathy', avatar: getUserAvatar('Alok Tripathy'), online: true },
    { id: 'ankit', name: 'Ankit Singh', avatar: getUserAvatar('Ankit Singh'), online: true },
    { id: 'biren', name: 'Biren Dora', avatar: getUserAvatar('Biren Dora'), online: false },
    { id: 'adya', name: 'Adya Rath', avatar: getUserAvatar('Adya Rath'), online: true },
    { id: 'soham', name: 'Soham Bardhan', avatar: getUserAvatar('Soham Bardhan'), online: false },
    { id: 'praveen', name: 'Praveen Dehury', avatar: getUserAvatar('Praveen Dehury'), online: true },
    { id: 'ipsit', name: 'Ipsit Tripathy', avatar: getUserAvatar('Ipsit Tripathy'), online: true },
    { id: 'kamlesh', name: 'Kamlesh Biswal', avatar: getUserAvatar('Kamlesh Biswal'), online: true }
  ];
  const [selectedFriend, setSelectedFriend] = useState<string>(friendsList[0].id);
  // const [previewFriend, setPreviewFriend] = useState<string | null>(null);
  const [friendInput, setFriendInput] = useState('');
  const [friendTyping, setFriendTyping] = useState(false);
  const [channelTyping, setChannelTyping] = useState<string[]>([]);
  
  // Swipe functionality state

  
  // Full experience view functionality
  const [isExperienceView, setIsExperienceView] = useState(false);
  const [wasExperienceViewClosed, setWasExperienceViewClosed] = useState(false);
  const channelsHeaderRef = useRef<HTMLDivElement>(null);
  const friendsHeaderRef = useRef<HTMLDivElement>(null);
  const feedHeaderRef = useRef<HTMLDivElement>(null);
  const hubHeaderRef = useRef<HTMLDivElement>(null);
  
  // Refs for auto-scrolling
  const channelMessagesRef = useRef<HTMLDivElement>(null);
  const friendMessagesRef = useRef<HTMLDivElement>(null);
  const expChannelMessagesRef = useRef<HTMLDivElement>(null);
  const expFriendMessagesRef = useRef<HTMLDivElement>(null);
  
  // Prevent body scrolling when experience view is active
  useEffect(() => {
    if (isExperienceView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isExperienceView]);
  
  // Auto-scroll functions
  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  const scrollToBottomDelayed = useCallback((ref: React.RefObject<HTMLDivElement>, delay: number = 100) => {
    setTimeout(() => {
      scrollToBottom(ref);
    }, delay);
  }, []);
  
  const [friendChats, setFriendChats] = useState<Record<string, {
    user: string; 
    message: string; 
    time: string; 
    avatar?: string;
    isUser?: boolean;
    reactions?: string[];
    mentions?: string[];
  }[]>>({
    alok: [
      { user: 'Alok Tripathy', message: 'Bhai, new Marvel trailer dekha kya?! 🤯 Kya mast hai yaar!', time: '10:30 AM', avatar: getUserAvatar('Alok Tripathy') },
      { user: 'You', message: 'Haan bhai! Multiverse toh bilkul crazy ho gaya hai 😱 Kya direction hai!', time: '10:32 AM', avatar: getUserAvatar('You') },
      { user: 'Alok Tripathy', message: 'Spider-Man ko dekh ke main toh chillaya tha! 🕷️ Neighbors ko laga kya hua hai!', time: '10:33 AM', avatar: getUserAvatar('Alok Tripathy') },
      { user: 'You', message: 'Same yaar! Main bhi excited ho gaya tha 😂 Premiere mein saath chalenge?', time: '10:35 AM', avatar: getUserAvatar('You') },
      { user: 'Alok Tripathy', message: 'Bilkul bhai! Tickets book kar deta hun 🎬 First day first show!', time: '10:36 AM', avatar: getUserAvatar('Alok Tripathy') },
      { user: 'You', message: 'Perfect! Popcorn aur excitement dono ready rahenge 🎫', time: '10:37 AM', avatar: getUserAvatar('You') }
    ],
          ankit: [
        { user: 'Ankit Singh', message: 'Yaar, new camera setup dekh liya?! 📸 Bilkul professional level ka hai!', time: '2:15 PM', avatar: getUserAvatar('Ankit Singh') },
        { user: 'You', message: 'Dikha dikha! 👀 Kya mast equipment hai!', time: '2:16 PM', avatar: getUserAvatar('You') },
        { user: 'Ankit Singh', message: 'DM mein pics bhej deta hun 📱 Quality dekh ke hi pata chalega!', time: '2:17 PM', avatar: getUserAvatar('Ankit Singh') },
        { user: 'You', message: 'Bhai, yeh toh Hollywood level ka setup hai! 🔥 Kya investment hai!', time: '2:20 PM', avatar: getUserAvatar('You') },
        { user: 'Ankit Singh', message: 'Haan na! Ab YouTube channel start karna padega 📹 Content toh ready hai!', time: '2:21 PM', avatar: getUserAvatar('Ankit Singh') },
        { user: 'You', message: 'Main toh subscribe kar raha hun! 😂 Success guaranteed hai!', time: '2:22 PM', avatar: getUserAvatar('You') }
      ],
    biren: [
      { user: 'Biren Dora', message: 'Hello! It\'s been quite a while since we last spoke 👋 How have you been?', time: '9:45 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'You', message: 'Biren! New job kaisa chal raha hai? Sab badhiya?', time: '9:50 AM', avatar: getUserAvatar('You') },
      { user: 'Biren Dora', message: 'It\'s been excellent! Working on some fascinating projects 💼 The learning curve has been quite steep.', time: '9:52 AM', avatar: getUserAvatar('Biren Dora') },
      { user: 'You', message: 'That\'s awesome! Jaldi milte hain ☕ Coffee toh banti hai!', time: '9:55 AM', avatar: getUserAvatar('You') },
      { user: 'Biren Dora', message: 'Absolutely! How about this weekend? We can discuss everything in detail.', time: '9:56 AM', avatar: getUserAvatar('Biren Dora') }
    ],
    adya: [
      { user: 'Adya Rath', message: 'GIRL! Show mein kya hua tha, dekh liya kya?! 😱 Kya drama tha!', time: '8:30 PM', avatar: getUserAvatar('Adya Rath') },
      { user: 'You', message: 'NOOO! Spoiler mat de! Main episode 3 pe hun 😭', time: '8:32 PM', avatar: getUserAvatar('You') },
              { user: 'Adya Rath', message: 'Oops sorry! But OMG, tum toh ride pe ho! 🎢 Kya twist hai!', time: '8:33 PM', avatar: getUserAvatar('Adya Rath') },
      { user: 'You', message: 'Ab toh scared aur excited dono ho gaya hun 😅', time: '8:35 PM', avatar: getUserAvatar('You') },
              { user: 'Adya Rath', message: 'Trust me, aaj raat ke liye schedule clear kar lo 📺 Worth it hai!', time: '8:36 PM', avatar: getUserAvatar('Adya Rath') }
    ],
    soham: [
      { user: 'Soham Bardhan', message: 'Remember that stunt sequence from yesterday? 🤸‍♂️ The one where we almost fell off the building?', time: '6:00 PM', avatar: getUserAvatar('Soham Bardhan') },
              { user: 'You', message: 'Kaise bhool sakta hun! Mummy abhi bhi gusse mein hai 😅', time: '6:02 PM', avatar: getUserAvatar('You') },
              { user: 'Soham Bardhan', message: 'It was calculated! Well, mostly... 😅 Sometimes you have to take risks for the perfect shot.', time: '6:03 PM', avatar: getUserAvatar('Soham Bardhan') },
        { user: 'You', message: 'Calculated my foot! 😂 Tu toh pagal hai!', time: '6:05 PM', avatar: getUserAvatar('You') },
        { user: 'Soham Bardhan', message: 'What they don\'t know won\'t hurt them 🤫 Your mother doesn\'t need to know everything.', time: '6:06 PM', avatar: getUserAvatar('Soham Bardhan') }
    ],
          praveen: [
        { user: 'Praveen Dehury', message: 'Portfolio returns dekh ke toh khushi ka thikana nahi raha! 🚀', time: '7:00 AM', avatar: getUserAvatar('Praveen Dehury') },
        { user: 'You', message: 'Bhai, ab toh treat banta hai! 🥳', time: '7:02 AM', avatar: getUserAvatar('You') },
        { user: 'Praveen Dehury', message: 'Jaldi milte hain! Coffee on me ☕', time: '7:03 AM', avatar: getUserAvatar('Praveen Dehury') }
      ],
    ipsit: [
              { user: 'Ipsit Tripathy', message: 'Bhai! Gym mein new PR banaya! 💪 Deadlift 200kg touch kar liya! Feeling absolutely pumped!', time: '6:30 AM', avatar: getUserAvatar('Ipsit Tripathy') },
              { user: 'You', message: 'Wah bhai! Kya beast ban gaya hai! 🔥 Protein shake zaroor piya hoga!', time: '6:32 AM', avatar: getUserAvatar('You') },
              { user: 'Ipsit Tripathy', message: 'Haan yaar! Whey protein + banana smoothie! 🥛🍌 Abhi bhi energy level peak pe hai!', time: '6:33 AM', avatar: getUserAvatar('Ipsit Tripathy') },
        { user: 'You', message: 'Mujhe bhi gym join karna chahiye! Motivation de do! 💪', time: '6:35 AM', avatar: getUserAvatar('You') },
        { user: 'Ipsit Tripathy', message: 'Bilkul bhai! Kal saath chalenge! 🏋️‍♂️ Chest day hai! Bench press karenge!', time: '6:36 AM', avatar: getUserAvatar('Ipsit Tripathy') },
        { user: 'You', message: 'Deal! But pehle proper form sikhana padega! 😅', time: '6:38 AM', avatar: getUserAvatar('You') },
        { user: 'Ipsit Tripathy', message: 'No worries! Main proper trainer hun! 🎯 Form over weight, always! Safety first!', time: '6:40 AM', avatar: getUserAvatar('Ipsit Tripathy') }
    ],
          kamlesh: [
        { user: 'Kamlesh Biswal', message: 'Bhai! New project mil gaya! 🎬 Production house ne contact kiya hai!', time: '5:30 PM', avatar: getUserAvatar('Kamlesh Biswal') },
        { user: 'You', message: 'Wah! Kya project hai? Details bata! 🎉', time: '5:32 PM', avatar: getUserAvatar('You') },
        { user: 'Kamlesh Biswal', message: 'Web series hai! 10 episodes! Budget bhi decent hai! 💰', time: '5:33 PM', avatar: getUserAvatar('Kamlesh Biswal') },
        { user: 'You', message: 'Congratulations! 🎊 Party toh banti hai!', time: '5:35 PM', avatar: getUserAvatar('You') },
        { user: 'Kamlesh Biswal', message: 'Bilkul! Weekend pe sab milenge! 🍕 Pizza aur success celebration!', time: '5:36 PM', avatar: getUserAvatar('Kamlesh Biswal') }
      ]
  });

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages[selectedChannel]) {
      scrollToBottomDelayed(channelMessagesRef, 100);
      scrollToBottomDelayed(expChannelMessagesRef, 100);
    }
  }, [messages, selectedChannel, scrollToBottomDelayed]);

  // Auto-scroll when friend chats change
  useEffect(() => {
    if (friendChats[selectedFriend]) {
      scrollToBottomDelayed(friendMessagesRef, 100);
      scrollToBottomDelayed(expFriendMessagesRef, 100);
    }
  }, [friendChats, selectedFriend, scrollToBottomDelayed]);

  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Use TMDB community data with Spotify for music artists
  // Memoized community data to prevent unnecessary recalculations
  const getCommunityData = useCallback((): Record<string, RealCommunityItem[]> => {
    return {
      productionHouse: communityData.productionHouses,
      movie: communityData.movies,
      director: communityData.directors,
      actor: communityData.actors,
      actress: communityData.actresses,
      musicArtist: mergedMusicArtists.length > 0 ? mergedMusicArtists : communityData.musicArtists
    };
  }, [communityData, mergedMusicArtists]);

  const [currentPage, setCurrentPage] = useState(0);

  // Optimized pagination data with lazy loading and virtual scrolling
  const paginationData = useMemo(() => {
    const currentCategoryItems = getCommunityData()[selectedCategory] || [];
                    const itemsPerPage = isMobile ? 9 : 12; // 3×3 for mobile, 2×6 for desktop
    const totalPages = Math.ceil(currentCategoryItems.length / itemsPerPage);
    const paginatedItems = currentCategoryItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return {
      currentCategoryItems,
      itemsPerPage,
      totalPages,
      paginatedItems
    };
  }, [getCommunityData, selectedCategory, currentPage, isMobile]);

  const { totalPages, paginatedItems } = paginationData;

  // Mobile swipe navigation state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Mobile swipe navigation handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (isRightSwipe && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, currentPage, totalPages]);

  // Optimized music artist data processing - memoized to prevent unnecessary re-processing
  const processedMusicArtists = useMemo(() => {
    if (communityData.musicArtists.length === 0) return [];
    
    // Only process first 50 artists for better performance
    const artistsToProcess = communityData.musicArtists.slice(0, 50);
    
    // Cache Spotify data lookups to avoid repeated function calls
    const spotifyDataCache = new Map();
    
    return artistsToProcess.map(artist => {
      // Check cache first
      let spotifyData = spotifyDataCache.get(artist.name);
      if (!spotifyData) {
        spotifyData = getSpotifyArtistData(artist.name);
        spotifyDataCache.set(artist.name, spotifyData);
      }
      
      if (spotifyData) {
        // Use saved Spotify data if available
        return {
          ...artist,
          avatar: spotifyData.imageUrl,
          cover: spotifyData.imageUrl,
          description: spotifyData.genres?.slice(0, 3).join(', ') || artist.description,
          followers: spotifyData.followers || artist.followers,
          verified: spotifyData.verified,
          rating: (spotifyData.popularity || 50) / 10,
          knownFor: spotifyData.genres?.slice(0, 3) || artist.knownFor
        };
      } else {
        // Use high-quality placeholder images for artists not found in Spotify
        return {
          ...artist,
          avatar: artist.avatar.includes('tmdb.org') || artist.avatar.includes('placeholder') || !artist.avatar
            ? `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=face&auto=format&q=80`
            : artist.avatar,
          cover: artist.cover.includes('tmdb.org') || artist.cover.includes('placeholder') || !artist.cover
            ? `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&auto=format&q=80`
            : artist.cover
        };
      }
    });
  }, [communityData.musicArtists]);

  // Update merged music artists when processed data changes
  useEffect(() => {
    setMergedMusicArtists(processedMusicArtists);
    setIsDataLoaded(true);
  }, [processedMusicArtists]);

  // Reset page when category changes with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0);
    }, 100); // Small delay to prevent rapid re-renders
    
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Define tabs for navigation
  const tabs = [
    { id: 'hub', label: 'Community Hub', icon: MessageSquare },
    { id: 'feed', label: 'Feed', icon: MessageCircle },
    { id: 'channels', label: 'Channels', icon: Hash },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'media', label: 'Media', icon: Camera },
    { id: 'perks', label: 'Perks', icon: Gift },
    { id: 'merch', label: 'Merch', icon: ShoppingBag }
  ];

  // Send message to selected channel
  const sendChannelMessage = () => {
    if (!newMessage.trim()) return;
    try { 
      navigator.vibrate?.(30); 
    } catch {
      // Vibration not supported or failed
    }
    
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create user message
    const userMsg = {
      user: 'You',
      message: newMessage,
      time: currentTime,
      avatar: getUserAvatar('You'),
      isUser: true,
      reactions: [],
      mentions: extractMentions(newMessage)
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedChannel]: [...(prev[selectedChannel] || []), userMsg]
    }));
    
    const sentMessage = newMessage;
    setNewMessage('');
    
    // Auto-scroll to bottom after sending message
    scrollToBottomDelayed(channelMessagesRef, 50);
    scrollToBottomDelayed(expChannelMessagesRef, 50);
    
    // Show typing indicator
    setChannelTyping(prev => [...prev, 'Community']);
    
    // Generate contextual responses based on channel and message content
    setTimeout(() => {
      const responses = generateChannelResponses(selectedChannel, sentMessage);
      responses.forEach((response, index) => {
        setTimeout(() => {
      setMessages(prev => ({
        ...prev,
            [selectedChannel]: [...(prev[selectedChannel] || []), response]
          }));
        }, index * 1500); // Stagger responses
      });
      
      // Hide typing indicator after responses
      setTimeout(() => {
        setChannelTyping(prev => prev.filter(user => user !== 'Community'));
      }, responses.length * 1500 + 1000);
    }, 2000);
  };

  // Extract mentions from message
  const extractMentions = (message: string) => {
    const mentions = message.match(/@(\w+)/g);
    return mentions ? mentions.map(mention => mention.slice(1)) : [];
  };

  // Handle message reactions
  const handleReaction = (messageIndex: number, reaction: string) => {
    try { 
      navigator.vibrate?.(20); 
    } catch {
      // Vibration not supported or failed
    }
    
    setMessages(prev => {
      const channelMessages = [...(prev[selectedChannel] || [])];
      if (channelMessages[messageIndex]) {
        const message = { ...channelMessages[messageIndex] };
        if (!message.reactions) message.reactions = [];
        
        // Toggle reaction
        const reactionIndex = message.reactions.indexOf(reaction);
        if (reactionIndex > -1) {
          message.reactions.splice(reactionIndex, 1);
        } else {
          message.reactions.push(reaction);
        }
        
        channelMessages[messageIndex] = message;
        return {
          ...prev,
          [selectedChannel]: channelMessages
        };
      }
      return prev;
    });
  };

  // Generate contextual channel responses
  const generateChannelResponses = (channelId: string, userMessage: string) => {
    const responses = [];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
          // Get channel info
      // const channel = channels.find(c => c.id === channelId);
      // const channelMembers = channel?.members || 1000;
    
    // Generate responses based on channel type and message content
    if (channelId === 'announcements') {
      if (userMessage.toLowerCase().includes('question') || userMessage.includes('?')) {
        responses.push({
          user: 'Community Manager',
          message: 'Great question! I\'ll get back to you with an official response soon. 📋',
          time: currentTime,
          avatar: getUserAvatar('Community Manager'),
          isUser: false,
          reactions: [],
          isOfficial: true
        });
      } else {
        responses.push({
          user: 'Alok Tripathy',
          message: 'Thanks for sharing this with the community! 🙏',
          time: currentTime,
          avatar: getUserAvatar('Alok Tripathy'),
          isUser: false,
          reactions: ['👍', '❤️']
        });
      }
    } else if (channelId === 'investor-hall') {
      if (userMessage.toLowerCase().includes('investment') || userMessage.toLowerCase().includes('fund')) {
        responses.push({
          user: 'Soham Bardhan',
          message: 'Interesting perspective on the investment strategy! 📈 What\'s your take on the market trends?',
          time: currentTime,
          avatar: getUserAvatar('Soham Bardhan'),
          isUser: false,
          reactions: ['📈', '💼']
        });
      } else {
        responses.push({
          user: 'Praveen Dehury',
          message: 'The numbers look promising! Let\'s discuss this further in our next investor call. 📊',
          time: currentTime,
          avatar: getUserAvatar('Praveen Dehury'),
          isUser: false,
          reactions: ['📊', '👍']
        });
      }
    } else if (channelId === 'creator-talks') {
      if (userMessage.toLowerCase().includes('camera') || userMessage.toLowerCase().includes('equipment')) {
        responses.push({
          user: 'Biren Dora',
          message: 'For that setup, I\'d recommend the RED Komodo 6K. Perfect for indie projects! 🎬',
          time: currentTime,
          avatar: getUserAvatar('Biren Dora'),
          isUser: false,
          reactions: ['🎬', '📹']
        });
      } else {
        responses.push({
          user: 'Ankit Singh',
          message: 'Love the creative direction! Let\'s collaborate on this project! ✨',
          time: currentTime,
          avatar: getUserAvatar('Ankit Singh'),
          isUser: false,
          reactions: ['✨', '🤝']
        });
      }
    } else if (channelId === 'fan-zone') {
      responses.push({
        user: 'Adya Rath',
        message: 'OMG YES! I totally agree with you! This is exactly what I was thinking! 😍',
        time: currentTime,
        avatar: getUserAvatar('Adya Rath'),
        isUser: false,
        reactions: ['😍', '🔥', '💯']
      });
      
      if (Math.random() > 0.5) {
        responses.push({
          user: 'Ipsit Tripathy',
          message: 'Can\'t wait to see more content like this! You guys are amazing! 🎉',
          time: currentTime,
          avatar: getUserAvatar('Ipsit Tripathy'),
          isUser: false,
          reactions: ['🎉', '👏']
        });
      }
    } else if (channelId === 'polls') {
      responses.push({
        user: 'Community Bot',
        message: '📊 Your response has been recorded! Current poll results will be updated shortly.',
        time: currentTime,
        avatar: getUserAvatar('Community Bot'),
        isUser: false,
        reactions: ['📊'],
        isBot: true
      });
    } else if (channelId === 'behind-scenes') {
      responses.push({
        user: 'Kamlesh Biswal',
        message: 'The behind-the-scenes content is always the best! Love seeing the magic happen! ✨',
        time: currentTime,
        avatar: getUserAvatar('Kamlesh Biswal'),
        isUser: false,
        reactions: ['✨', '🎭']
      });
    } else if (channelId === 'general-chat') {
      responses.push({
        user: 'Adya Rath',
        message: 'Love the energy in this chat! Everyone is so supportive! 💕',
        time: currentTime,
        avatar: getUserAvatar('Adya Rath'),
        isUser: false,
        reactions: ['💕', '👏']
      });
      
      if (Math.random() > 0.5) {
        responses.push({
          user: 'Soham Bardhan',
          message: 'This community is amazing! So many creative minds in one place! 🌟',
          time: currentTime,
          avatar: getUserAvatar('Soham Bardhan'),
          isUser: false,
          reactions: ['🌟', '🤝']
        });
      }
    } else if (channelId === 'tech-talk') {
      if (userMessage.toLowerCase().includes('ai') || userMessage.toLowerCase().includes('artificial intelligence')) {
        responses.push({
          user: 'Kamlesh Biswal',
          message: 'AI is revolutionizing every industry! The possibilities are endless! 🤖',
          time: currentTime,
          avatar: getUserAvatar('Kamlesh Biswal'),
          isUser: false,
          reactions: ['🤖', '🚀']
        });
      } else {
        responses.push({
          user: 'Ankit Singh',
          message: 'Technology moves so fast these days! Always something new to learn! 📱',
          time: currentTime,
          avatar: getUserAvatar('Ankit Singh'),
          isUser: false,
          reactions: ['📱', '💻']
        });
      }
    } else {
      // Default response for other channels
      const randomUsers = ['Alok Tripathy', 'Ankit Singh', 'Biren Dora', 'Adya Rath', 'Soham Bardhan'];
      const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      
      responses.push({
        user: randomUser,
        message: 'Thanks for sharing! This adds great value to our community discussion! 🙌',
        time: currentTime,
        avatar: getUserAvatar(randomUser),
        isUser: false,
        reactions: ['🙌', '👍']
      });
    }
    
    return responses;
  };

  // Send message to selected friend
  const sendFriendMessage = () => {
    if (!friendInput.trim()) return;
    try { 
      navigator.vibrate?.(30); 
    } catch {
      // Vibration not supported or failed
    }
    const msg = {
      user: 'You',
      message: friendInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: getUserAvatar('You')
    };
    setFriendChats(prev => ({
      ...prev,
      [selectedFriend]: [...(prev[selectedFriend] || []), msg]
    }));
    setFriendInput('');
    setFriendTyping(true);
    
    // Auto-scroll to bottom after sending message
    scrollToBottomDelayed(friendMessagesRef, 50);
    scrollToBottomDelayed(expFriendMessagesRef, 50);
    setTimeout(() => {
      const friend = friendsList.find(f => f.id === selectedFriend);
      if (friend) {
        const reply = {
          user: friend.name,
          message: 'Auto reply!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: friend.avatar
        };
        setFriendChats(prev => ({
          ...prev,
          [selectedFriend]: [...(prev[selectedFriend] || []), reply]
        }));
      }
      setFriendTyping(false);
    }, 2000);
  };









  // Scroll detection for experience view - for channels, friends, feed, and hub tabs
  useEffect(() => {
    const handleScroll = () => {
      // Don't trigger experience view if it was recently closed
      if (wasExperienceViewClosed) {
        return;
      }
      
      // Check for experience view based on current active tab
      let headerRef = null;
      
      if (activeTab === 'feed' && feedHeaderRef.current) {
        headerRef = feedHeaderRef.current;
      } else if (activeTab === 'hub' && hubHeaderRef.current) {
        headerRef = hubHeaderRef.current;
      } else if (activeTab === 'channels' && channelsHeaderRef.current) {
        headerRef = channelsHeaderRef.current;
      } else if (activeTab === 'friends' && friendsHeaderRef.current) {
        headerRef = friendsHeaderRef.current;
      }
      
      // Only check for experience view if we have a valid header reference
      if (headerRef) {
        const headerRect = headerRef.getBoundingClientRect();
        // const viewportHeight = window.innerHeight;
        
        // Only trigger experience view when:
        // 1. The header has scrolled up past the top of the viewport
        // 2. The section is still visible in the viewport
        // 3. User has scrolled down significantly (at least 200px from top)
        if (headerRect.top <= 0 && 
            headerRect.bottom > 0 && 
            window.scrollY > 200 && 
            !isExperienceView) {
          // Add entrance effects with a small delay for better UX
          const experienceTimer = setTimeout(() => {
            setIsExperienceView(true);
          }, 100);
          
          // Store timer for cleanup
          return () => clearTimeout(experienceTimer);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExperienceView, activeTab, wasExperienceViewClosed]);

  // Handle closing experience view
  const closeExperienceView = () => {
    setIsExperienceView(false);
    setWasExperienceViewClosed(true);
    // Scroll back to a safe position to prevent immediate re-triggering
    setTimeout(() => {
      window.scrollTo({
        top: Math.max(0, window.scrollY - 100),
        behavior: 'smooth'
      });
    }, 100);
    // Reset the flag after 10 seconds to allow normal scrolling again
    setTimeout(() => {
      setWasExperienceViewClosed(false);
    }, 10000);
  };

  // Prevent page scroll when experience view is active
  useEffect(() => {
    if (isExperienceView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isExperienceView]);

  // Auto-trigger experience view for channels and hub tabs
  useEffect(() => {
    if ((activeTab === 'channels' || activeTab === 'hub') && !isExperienceView && !wasExperienceViewClosed) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        setIsExperienceView(true);
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
  }, [activeTab, isExperienceView, wasExperienceViewClosed]);

  // Experience zone trigger cooldown
  const [experienceTriggerCooldown, setExperienceTriggerCooldown] = useState<{ [key: string]: number }>({});

  // Check if experience zone can be triggered (3-second cooldown)
  const canTriggerExperience = (tabId: string) => {
    const lastTrigger = experienceTriggerCooldown[tabId] || 0;
    return Date.now() - lastTrigger >= 3000; // 3 second cooldown
  };

  // Trigger experience zone with cooldown
  const triggerExperienceZone = (tabId: string) => {
    if (canTriggerExperience(tabId) && !isExperienceView && !wasExperienceViewClosed) {
      setIsExperienceView(true);
      setExperienceTriggerCooldown(prev => ({
        ...prev,
        [tabId]: Date.now()
      }));
    }
  };

  const channels = [
    { 
      id: 'announcements', 
      name: 'announcements', 
      icon: '📢', 
      unread: 3,
      members: 15420,
      online: 234,
      description: 'Official announcements and updates from the team',
      category: 'Official',
      lastActivity: '2 minutes ago',
      pinned: true,
      verified: true,
      activityLevel: 'high',
      rules: ['No spam', 'Official updates only', 'Respectful communication']
    },
    { 
      id: 'investor-hall', 
      name: 'investor-hall', 
      icon: '💰', 
      unread: 8,
      members: 8920,
      online: 156,
      description: 'Investment discussions, market analysis, and financial insights',
      category: 'Business',
      lastActivity: '5 minutes ago',
      pinned: false,
      verified: true,
      activityLevel: 'high',
      rules: ['Professional discussions only', 'No financial advice', 'Respect privacy']
    },
    { 
      id: 'creator-talks', 
      name: 'creator-talks', 
      icon: '🎬', 
      unread: 2,
      members: 12340,
      online: 89,
      description: 'Behind-the-scenes discussions with creators and filmmakers',
      category: 'Creative',
      lastActivity: '15 minutes ago',
      pinned: false,
      verified: true,
      activityLevel: 'medium',
      rules: ['Share creative insights', 'No spoilers', 'Support fellow creators']
    },
    { 
      id: 'fan-zone', 
      name: 'fan-zone', 
      icon: '🎉', 
      unread: 15,
      members: 25670,
      online: 445,
      description: 'Fan discussions, theories, and community bonding',
      category: 'Community',
      lastActivity: '1 minute ago',
      pinned: false,
      verified: false,
      activityLevel: 'very-high',
      rules: ['Be respectful', 'No hate speech', 'Share your passion']
    },
    { 
      id: 'polls', 
      name: 'polls', 
      icon: '📊', 
      unread: 1,
      members: 18750,
      online: 123,
      description: 'Community polls and voting on important decisions',
      category: 'Community',
      lastActivity: '30 minutes ago',
      pinned: true,
      verified: true,
      activityLevel: 'medium',
      rules: ['One vote per person', 'Respect results', 'Constructive feedback']
    },
    { 
      id: 'behind-scenes', 
      name: 'behind-the-scenes', 
      icon: '🎭', 
      unread: 5,
      members: 9870,
      online: 67,
      description: 'Exclusive behind-the-scenes content and production insights',
      category: 'Exclusive',
      lastActivity: '10 minutes ago',
      pinned: false,
      verified: true,
      activityLevel: 'medium',
      rules: ['Exclusive content only', 'No sharing outside', 'Respect NDA']
    },
    { 
      id: 'tech-support', 
      name: 'tech-support', 
      icon: '🔧', 
      unread: 0,
      members: 5430,
      online: 23,
      description: 'Technical support and platform assistance',
      category: 'Support',
      lastActivity: '1 hour ago',
      pinned: false,
      verified: true,
      activityLevel: 'low',
      rules: ['Be patient', 'Provide clear details', 'Follow guidelines']
    },
    { 
      id: 'marketplace', 
      name: 'marketplace', 
      icon: '🛍️', 
      unread: 12,
      members: 11230,
      online: 78,
      description: 'Buy, sell, and trade merchandise and collectibles',
      category: 'Commerce',
      lastActivity: '3 minutes ago',
      pinned: false,
      verified: false,
      activityLevel: 'high',
      rules: ['Safe transactions only', 'No scams', 'Fair pricing']
    },
    { 
      id: 'events', 
      name: 'events', 
      icon: '🎪', 
      unread: 7,
      members: 15670,
      online: 234,
      description: 'Event announcements, meetups, and community gatherings',
      category: 'Events',
      lastActivity: '8 minutes ago',
      pinned: true,
      verified: true,
      activityLevel: 'high',
      rules: ['Event-related only', 'No spam', 'Follow event guidelines']
    },
    { 
      id: 'feedback', 
      name: 'feedback', 
      icon: '💭', 
      unread: 0,
      members: 8230,
      online: 45,
      description: 'Platform feedback, suggestions, and improvement ideas',
      category: 'Feedback',
      lastActivity: '2 hours ago',
      pinned: false,
      verified: true,
      activityLevel: 'low',
      rules: ['Constructive feedback only', 'Be specific', 'Respectful tone']
    },
    { 
      id: 'general-chat', 
      name: 'general-chat', 
      icon: '💬', 
      unread: 8,
      members: 45670,
      online: 1234,
      description: 'General discussions about entertainment, life, and everything in between',
      category: 'Community',
      lastActivity: '30 seconds ago',
      pinned: false,
      verified: false,
      activityLevel: 'very-high',
      rules: ['Be respectful', 'No spam', 'Stay on topic', 'Have fun!']
    },
    { 
      id: 'tech-talk', 
      name: 'tech-talk', 
      icon: '💻', 
      unread: 3,
      members: 15670,
      online: 234,
      description: 'Technology discussions, gadgets, and digital trends',
      category: 'Technology',
      lastActivity: '5 minutes ago',
      pinned: false,
      verified: true,
      activityLevel: 'high',
      rules: ['Tech-related topics only', 'Share knowledge', 'No piracy discussion']
    }
  ];



  // Temporarily disabled floating emojis to prevent crashes
  // const [floatingEmojis, setFloatingEmojis] = useState<Array<{id:number, emoji:string, left:number, size:number, duration:number}>>([]);
  // const emojiIdRef = useRef(0);
  
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFloatingEmojis((prev) => [
  //       ...prev,
  //       {
  //         id: emojiIdRef.current++,
  //         emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  //         left: Math.random() * 90 + 5, // 5% to 95%
  //         size: Math.random() * 1.5 + 1, // 1rem to 2.5rem
  //         duration: Math.random() * 4 + 6 // 6s to 10s
  //       }
  //     ].slice(-20)); // keep max 20
  //   }, 900);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="community-page relative min-h-screen w-full bg-black text-white border-0">
      {/* Clean Instagram-style background */}
      <div className="absolute inset-0 bg-black"></div>

      {/* Black overlay for navigation area - only on Community page */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-black z-40"></div>

      <div className="w-full px-6 py-8 relative z-10 pl-20 lg:pl-24 pr-20 lg:pr-24 max-w-7xl mx-auto mt-8 md:mt-12 lg:mt-16 border-0 community-container">
        
        {/* Main Header */}
        <div className="text-center mb-8 community-header">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-main community-title">
            Community
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto community-subtitle">
            Connect, share, and grow with fellow creators, investors, and fans
          </p>
        </div>

        {/* Category Selector - Full Width */}
        <div className="mb-8">
          <div className="text-center mb-8 mt-12 category-header">
            <h2 className="feed-title text-5xl font-bold mb-4 category-title">
                Explore Your Circles
              </h2>
            <p className="text-gray-400 text-xl category-subtitle">
              Dive into exclusive communities of creators, investors, and fans
            </p>
          </div>
          
          <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory justify-center w-full max-w-6xl mx-auto px-4 category-selector">
            {[
              { id: 'movie', label: 'Movies', icon: '🎬', categoryClass: 'movies-category', shape: 'square' },
              { id: 'productionHouse', label: 'Studios', icon: '🏢', categoryClass: 'studios-category', shape: 'square' },
              { id: 'director', label: 'Directors', icon: '🎥', categoryClass: 'directors-category', shape: 'round' },
              { id: 'actor', label: 'Actors', icon: '👨‍🎭', categoryClass: 'actors-category', shape: 'round' },
              { id: 'actress', label: 'Actresses', icon: '👩‍🎭', categoryClass: 'actresses-category', shape: 'round' },
              { id: 'musicArtist', label: 'Music Artists', icon: '🎤', categoryClass: 'music-category', shape: 'round' }
            ].map((category) => {
              const isSelected = selectedCategory === category.id;
              const isPerson = category.shape === 'round';
              
              return (
                <div
                  key={category.id}
                  className="flex flex-col items-center gap-3 snap-center"
                >
              <button
                    onClick={() => {
                      setSelectedCategory(category.id as 'movie' | 'productionHouse' | 'director' | 'actor' | 'actress' | 'musicArtist');
                      setSelectedItem(null);
                      setIsItemSelected(false);
                    }}
                    className={`category-button relative w-24 h-24 p-1 transition-all duration-300 group overflow-hidden ${
                      isPerson ? 'rounded-full' : 'rounded-2xl'
                    } ${
                      isSelected
                        ? `${category.categoryClass} shadow-2xl`
                        : 'bg-gray-900/80 border-2 border-gray-700 hover:border-gray-500 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {/* Instagram-style gradient ring for selected state */}
                    {isSelected && (
        <motion.div
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`absolute inset-0 ${category.categoryClass} ${
                          isPerson ? 'rounded-full' : 'rounded-2xl'
                        } p-0.5 z-10`}
                      >
                        <div className={`w-full h-full ${
                          theme === 'light' ? 'bg-white' : 'bg-slate-900'
                        } ${isPerson ? 'rounded-full' : 'rounded-xl'}`} />
        </motion.div>
                    )}
                    
                    {/* Shimmer Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
                      isPerson ? 'rounded-full' : 'rounded-2xl'
                    }`} />
                    
                    {/* Icon Container */}
                    <div className={`w-full h-full flex items-center justify-center relative z-20 ${
                      isPerson ? 'rounded-full' : 'rounded-xl'
                    } ${
                      isSelected 
                        ? 'bg-gradient-to-br from-white/20 to-white/5' 
                        : 'bg-gradient-to-br from-gray-800 to-gray-900'
                    }`}>
                      <span className={`text-3xl transition-all duration-300 ${
                        isSelected 
                          ? 'filter drop-shadow-lg scale-110 animate-pulse' 
                          : 'group-hover:scale-110'
                      }`}>{category.icon}</span>
                    </div>
                    
                    {/* Active indicator dot */}
                    {isSelected && (
        <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg z-30"
                      />
                    )}
                  </button>
                  
                  {/* Category Label */}
                  <span 
                    className={`text-base font-bold transition-all duration-300 ${
                      isSelected 
                        ? 'text-white drop-shadow-lg scale-110' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {category.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Grid - Full Width */}
        {!isItemSelected && (
        <div className="mb-8">
            <div className="text-center mb-8 max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold mb-4 text-white">
                {selectedCategory === 'movie' && 'Popular Movies'}
                {selectedCategory === 'productionHouse' && 'Production Houses'}
                {selectedCategory === 'director' && 'Famous Directors'}
                {selectedCategory === 'actor' && 'Leading Actors'}
                {selectedCategory === 'actress' && 'Leading Actresses'}
                {selectedCategory === 'musicArtist' && (
                  <div className="flex items-center justify-center gap-2">
                    <Music className="w-6 h-6 text-green-500" />
                    <span>Music Artists</span>
                    {isLoadingSpotifyArtists && (
                      <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                )}
              </h3>
              <p className="text-gray-400 text-lg">
                {selectedCategory === 'musicArtist' ? (
                  <div className="flex flex-col items-center gap-2">
                    <span>Curated collection with real Spotify data</span>
                    {isLoadingSpotifyArtists && (
                      <span className="text-blue-500 text-xs">(Processing music artists...)</span>
                    )}
                    {!isLoadingSpotifyArtists && (
                      <span className="text-green-500 text-xs">✓ Real Spotify images loaded</span>
                    )}
                  </div>
                ) : (
                  'Tap to join a community'
                )}
              </p>
            </div>
                        {/* Carousel-style Arrow Navigation + Data Grid Wrapper */}
            <div className="relative max-w-6xl mx-auto">
              {/* Left Arrow - Hidden on mobile */}
              <motion.button
                onClick={() => setCurrentPage((p) => p === 0 ? totalPages - 1 : p - 1)}
                disabled={totalPages === 1}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className={`hidden md:block absolute -left-16 top-[150px] md:top-[180px] lg:top-[200px] z-10 group p-4 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xl ${
                  totalPages === 1
                    ? 'opacity-50 cursor-not-allowed bg-gray-200/50 dark:bg-gray-700/50 border-gray-300/50 dark:border-gray-600/50'
                    : 'bg-gradient-to-r from-black/80 via-gray-900/70 to-black/80 hover:from-black/90 hover:via-gray-800/80 hover:to-black/90 border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/20'
                }`}
              >
                <motion.div
                  animate={currentPage === 0 ? {} : { x: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronLeft className={`w-7 h-7 ${
                    currentPage === 0 
                      ? 'text-gray-400 dark:text-gray-500' 
                      : 'text-white/80 group-hover:text-white'
                  }`} />
        </motion.div>
                {currentPage !== 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                  />
                )}
              </motion.button>

              {/* Right Arrow - Hidden on mobile */}
              <motion.button
                onClick={() => setCurrentPage((p) => p === totalPages - 1 ? 0 : p + 1)}
                disabled={totalPages === 1}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`hidden md:block absolute -right-16 top-[150px] md:top-[180px] lg:top-[200px] z-10 group p-4 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xl ${
                  totalPages === 1
                    ? 'opacity-50 cursor-not-allowed bg-gray-200/50 dark:bg-gray-700/50 border-gray-300/50 dark:border-gray-600/50'
                    : 'bg-gradient-to-l from-black/80 via-gray-900/70 to-black/80 hover:from-black/90 hover:via-gray-800/80 hover:to-black/90 border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-pink-500/20'
                }`}
              >
        <motion.div
                  animate={currentPage >= totalPages - 1 ? {} : { x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronRight className={`w-7 h-7 ${
                    currentPage >= totalPages - 1 
                      ? 'text-gray-400 dark:text-gray-500' 
                      : 'text-white/80 group-hover:text-white'
                  }`} />
                </motion.div>
                {currentPage < totalPages - 1 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                  />
                )}
              </motion.button>

              {/* Data Grid with Smooth Transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                                     className={`grid grid-cols-3 md:grid-cols-6 gap-6 min-h-[400px] justify-items-center mobile-grid`}
                                     onTouchStart={isMobile ? handleTouchStart : undefined}
                                     onTouchMove={isMobile ? handleTouchMove : undefined}
                                     onTouchEnd={isMobile ? handleTouchEnd : undefined}
                >
                  {/* Loading state - only show if no items available */}
                  {selectedCategory === 'musicArtist' && isLoadingSpotifyArtists && paginatedItems.length === 0 && (
                    Array.from({ length: isMobile ? 9 : 12 }).map((_, _index) => (
                      <div key={`loading-${_index}`} className="flex flex-col items-center justify-center gap-3 min-h-[200px] md:min-h-[300px]">
                        <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-r from-gray-700 to-gray-600 animate-pulse" />
                        <div className="w-20 h-4 bg-gray-700 rounded animate-pulse" />
                        <div className="w-16 h-3 bg-gray-700 rounded animate-pulse" />
                      </div>
                    ))
                  )}

                  {/* General loading state for empty categories */}
                  {paginatedItems.length === 0 && !isLoadingSpotifyArtists && (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 min-h-[300px] md:min-h-[400px]">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-300">
                          Loading {selectedCategory}...
                        </p>
                        <p className="text-sm text-gray-400">
                          Please wait while we fetch the data
                        </p>
                      </div>
                    </div>
                  )}
                  

                  
                  {/* Regular items - always show if available */}
                  {paginatedItems.map((item, index) => {
                    const isPerson = selectedCategory === 'director' || selectedCategory === 'actor' || selectedCategory === 'actress' || selectedCategory === 'musicArtist';
                    const itemKey = `${item.id}-${selectedCategory}-${index}`;
                    return (
                      <div
                        key={itemKey}
                        className="flex flex-col items-center gap-3"
                      >
                        <div 
                          onClick={() => {
                            // For Spotify music artists, open Spotify link if available
                            if (selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') && item.spotifyUrl) {
                              window.open(item.spotifyUrl, '_blank');
                              return;
                            }
                            
                            // Start transition effect for this specific item
                            setTransitioningItemId(item.id);
                            
                            // After 1 second, open the element
                            setTimeout(() => {
                              setSelectedItem(item);
                              setIsItemSelected(true);
                              setTransitioningItemId(null);
                            }, 1000);
                          }}
                          title={selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') ? 'Click to open Spotify profile' : 'Click to view details'}
                          className={`community-card p-2 cursor-pointer ${
                            isPerson ? 'rounded-full' : 'rounded-2xl'
                          } ${
                            selectedCategory === 'movie' ? 'movie-card' :
                            selectedCategory === 'productionHouse' ? 'studio-card' :
                            selectedCategory === 'director' ? 'director-card' :
                            selectedCategory === 'actor' ? 'actor-card' :
                            selectedCategory === 'actress' ? 'actress-card' :
                            selectedCategory === 'musicArtist' ? 'music-card' : ''
                          } ${transitioningItemId === item.id ? 'transitioning' : ''}`}
                        >
                          <div className={`group relative aspect-square w-full max-w-[180px] overflow-hidden transition-all duration-300 mobile-card ${
                            isPerson 
                              ? 'rounded-full' 
                              : 'rounded-2xl'
                          } ${isMobile ? 'touch-manipulation' : ''}`}
                          >
                          {/* Instagram-style gradient border for active users */}
                          {item.isActive && (
                            <div className={`absolute inset-0 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-teal-500/30 ${
                              isPerson ? 'rounded-full' : 'rounded-2xl'
                            } p-0.5 z-10`}>
                              <div className={`w-full h-full ${
                                theme === 'light' ? 'bg-white' : 'bg-slate-800'
                              } ${isPerson ? 'rounded-full' : 'rounded-xl'}`} />
                            </div>
                          )}
                          
                          {/* Background Image */}
                          <OptimizedImage 
                            src={item.avatar || getUserAvatar('Community Bot')}
                            alt={item.name}
                            width={120}
                            height={120}
                            className={`w-full h-full object-cover transition-transform duration-300 relative z-20 ${
                              isPerson ? 'rounded-full' : 'rounded-2xl'
                            } ${item.isActive ? 'p-0.5' : ''}`}
                            priority={index < 8} // Only prioritize first 8 images
                          />
                          
                          {/* Overlay for non-person items */}
                          {!isPerson && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-30 rounded-2xl" />
                          )}
                          
                          {/* Verified Badge */}
                          {item.verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                          
                          {/* Spotify Badge for Music Artists */}
                          {selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') && (
                            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                              <Music className="w-3 h-3 text-white" />
                            </div>
                          )}
                          
                          {/* Active Status Indicator */}
                          {item.isActive && (
                            <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg z-40" />
                          )}
                          
                          {/* Content overlay for movies/studios */}
                          {!isPerson && (
                            <div className="absolute bottom-0 left-0 right-0 p-3 z-30">
                              <div className="flex items-center gap-2 mb-1">
                                <Users className="w-3 h-3 text-gray-300" />
                                <span className="text-gray-300 text-xs">{item.followers?.toLocaleString()}</span>
          </div>
                            </div>
                          )}
                        </div>
                        </div>
                        
                        {/* Item Info */}
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-2">
                            <h4 className="text-base font-semibold truncate max-w-[120px] text-white mobile-title">
                              {item.name}
                            </h4>
                            {item.verified && !isPerson && (
                              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mobile-description">
                            {item.description}
                          </p>
                                                      {isPerson && (
                              <div className="flex items-center justify-center gap-1 text-sm mobile-followers">
                                <Users className="w-4 h-4 text-gray-500 mobile-icon" />
                                <span className="text-gray-500">
                                  {item.followers?.toLocaleString()}
                                </span>
                              </div>
                            )}
                          
                          {/* Spotify Link for Music Artists */}
                                                      {selectedCategory === 'musicArtist' && item.id.startsWith('spotify-') && (
                              <div className="flex items-center justify-center gap-1 text-sm">
                                <Music className="w-4 h-4 text-green-400" />
                                <span className="text-green-400">
                                  Spotify
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
        </motion.div>
              </AnimatePresence>
              {/* Page Counter with Mobile Swipe Indicator */}
              <div className="w-full flex flex-col items-center mt-2 gap-1">
                <span className="text-sm text-gray-400 font-medium">
                  {currentPage + 1} / {totalPages}
                </span>
                {isMobile && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Swipe left/right to change pages</span>
                                          <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
        

        {/* Selected Item Community Display */}
        {isItemSelected && selectedItem && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gray-900/80 border border-gray-700 mb-12 group"
          >
            {/* Cover Image with Parallax Effect */}
            <div className="relative h-64 overflow-hidden">
              <OptimizedImage 
                src={selectedItem.cover || selectedItem.avatar || getUserAvatar('Community Bot')}
                alt={selectedItem.name}
                width={400}
                height={256}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Back Button */}
              <motion.button
                onClick={() => {
                  setSelectedItem(null);
                  setIsItemSelected(false);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              
              {/* Floating Social Icons */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 right-4 flex gap-2"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <MessageCircle className="w-5 h-5 text-white" />
              </div>
              </motion.div>
              
              {/* Item Info Overlay - Two Column Layout */}
              <div className="absolute bottom-8 left-8 right-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-8 items-center mb-6"
                >
                  {/* Left Column - Image */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <OptimizedImage 
                        src={selectedItem.avatar || getUserAvatar('Community Bot')}
                        alt={selectedItem.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-2xl"
                      />
                      {selectedItem.verified && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      />
                    </div>
                    <div>
                      <h2 className="text-white text-2xl font-black mb-2 drop-shadow-lg">{selectedItem.name}</h2>
                      <p className="text-gray-200 text-sm leading-relaxed">{selectedItem.description}</p>
                    </div>
                  </div>
                  
                  {/* Right Column - Magical Handwritten Animation */}
                  <div className="flex items-center justify-center w-full h-full min-h-[120px]">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="magical-handwriting-container w-full h-full flex items-center justify-center"
                    >
                      <div className="magical-handwriting magical-typewriter">
                        {selectedItem.name}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* Enhanced Stats */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-8 text-sm"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                  >
                    <Users className="w-5 h-5 text-purple-300" />
                    <span className="text-white font-semibold">{selectedItem.followers?.toLocaleString()} followers</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                  >
                    <Activity className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">{selectedItem.projects?.length || 0} projects</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                  >
                    <Clock className="w-5 h-5 text-blue-300" />
                    <span className="text-white font-semibold">Active now</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                  >
                    {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}
                  </motion.div>
                </motion.div>
            </div>
          </div>

          {/* Enhanced Community Features & Content */}
          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column - Community Engagement */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Live Community Chat */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      Live Community Chat
                </h3>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400 font-medium">Live</span>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500">
                    {[
                      { user: 'FilmFan_2024', message: `Just watched ${selectedItem.name}'s latest project! Absolutely mind-blowing! 🔥`, time: '2 min ago', avatar: '🎬' },
                      { user: 'CinemaLover', message: 'The cinematography in their work is always top-notch! 📹', time: '5 min ago', avatar: '🎥' },
                      { user: 'MovieBuff', message: 'Can\'t wait for their next release! Any teasers coming soon? 🤔', time: '8 min ago', avatar: '🍿' },
                      { user: 'ArtDirector', message: 'The visual effects team did an incredible job! 👏', time: '12 min ago', avatar: '🎨' },
                      { user: 'FilmStudent', message: 'Studying their techniques for my thesis. Pure genius! 📚', time: '15 min ago', avatar: '🎓' }
                    ].map((msg, index) => (
                    <motion.div
                        key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center text-lg">
                          {msg.avatar}
                          </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-purple-300">{msg.user}</span>
                            <span className="text-xs text-gray-400">{msg.time}</span>
                        </div>
                          <p className="text-sm text-gray-200">{msg.message}</p>
                        </div>
                      </motion.div>
                    ))}
                      </div>
                  
                  {/* Chat Input */}
                  <div className="mt-4 flex gap-3">
                    <input
                      type="text"
                      placeholder="Join the conversation..."
                      className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-purple-500/50"
                    />
                        <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    >
                      Send
                        </motion.button>
                    </div>
                </motion.div>

                {/* Recent Activity & Updates */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-2xl p-6 border border-blue-500/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      Recent Activity
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { type: 'project', title: 'New Project Announced', desc: 'Upcoming collaboration with major studio', time: '1 hour ago', icon: '🎬' },
                      { type: 'award', title: 'Award Nomination', desc: 'Nominated for Best Director at Film Awards', time: '3 hours ago', icon: '🏆' },
                      { type: 'interview', title: 'Exclusive Interview', desc: 'Featured in Cinema Weekly Magazine', time: '1 day ago', icon: '📰' },
                      { type: 'behind-scenes', title: 'Behind the Scenes', desc: 'New BTS footage released', time: '2 days ago', icon: '🎥' }
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center text-lg">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-blue-300">{activity.title}</h4>
                          <p className="text-xs text-gray-400">{activity.desc}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
                </motion.div>

                {/* Community Polls & Surveys */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-6 border border-green-500/20"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      Community Poll
                    </h3>
              </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-green-300">What would you like to see next from {selectedItem.name}?</h4>
                    {[
                      { option: 'Action Thriller', votes: 45, color: 'from-red-500 to-orange-500' },
                      { option: 'Romantic Drama', votes: 32, color: 'from-pink-500 to-rose-500' },
                      { option: 'Sci-Fi Adventure', votes: 28, color: 'from-blue-500 to-cyan-500' },
                      { option: 'Comedy', votes: 15, color: 'from-yellow-500 to-orange-500' }
                    ].map((poll, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className="group cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-200">{poll.option}</span>
                          <span className="text-sm font-bold text-green-400">{poll.votes}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${poll.votes}%` }}
                            transition={{ delay: 1.2 + index * 0.1, duration: 1 }}
                            className={`h-full bg-gradient-to-r ${poll.color} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                    >
                      Vote Now
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Quick Actions & Stats */}
              <div className="space-y-6">
                
                {/* News & Announcements */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/20"
                >
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    📰 News & Announcements
                  </h3>
                  
                  {/* Community News */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Latest News
                    </h4>
                    <div className="space-y-2 max-h-24 overflow-y-auto">
                      {communityNews.slice(0, 2).map((news) => (
                        <motion.div
                          key={news.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs border-l-2 border-blue-500/30 pl-2 bg-white/5 rounded-lg p-2"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              news.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                              news.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                              news.priority === 'normal' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {news.category}
                            </span>
                            <span className="text-gray-500">{news.date}</span>
                          </div>
                          <p className="text-white font-medium mb-1">{news.title}</p>
                          <p className="text-gray-400 leading-relaxed line-clamp-2">{news.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Community Announcements */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Announcements
                    </h4>
                    <div className="space-y-2 max-h-24 overflow-y-auto">
                      {communityAnnouncements.slice(0, 2).map((announcement) => (
                        <motion.div
                          key={announcement.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs border-l-2 border-orange-500/30 pl-2 bg-white/5 rounded-lg p-2"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              announcement.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                              announcement.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                              announcement.priority === 'normal' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {announcement.priority.toUpperCase()}
                            </span>
                            <span className="text-gray-500">{announcement.date}</span>
                          </div>
                          <p className="text-white font-medium mb-1">{announcement.title}</p>
                          <p className="text-gray-400 leading-relaxed line-clamp-2">{announcement.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-2xl p-6 border border-blue-500/20"
                >
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Community Stats
                </h3>
                <div className="space-y-4">
                  {[
                      { label: 'Total Followers', value: selectedItem.followers?.toLocaleString() || '0', icon: Users, color: 'from-purple-500 to-pink-500' },
                      { label: 'Active Projects', value: selectedItem.projects?.length || 0, icon: Film, color: 'from-blue-500 to-cyan-500' },
                      { label: 'Awards Won', value: Math.floor(Math.random() * 15) + 5, icon: Award, color: 'from-yellow-500 to-orange-500' },
                      { label: 'Years Active', value: Math.floor(Math.random() * 20) + 5, icon: Clock, color: 'from-green-500 to-emerald-500' },
                      { label: 'Verified Status', value: selectedItem.verified ? 'Verified' : 'Not Verified', icon: CheckCircle, color: selectedItem.verified ? 'from-green-500 to-emerald-500' : 'from-gray-500 to-gray-600' },
                      { label: 'Online Status', value: selectedItem.isActive ? 'Online' : 'Offline', icon: Activity, color: selectedItem.isActive ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                    >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center`}>
                            <stat.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-300">{stat.label}</span>
                        </div>
                        <span className="text-sm font-bold text-white">{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-6 border border-green-500/20"
                >
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Upcoming Events
                  </h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Live Q&A Session', date: 'Tomorrow, 8 PM', icon: '🎤' },
                      { title: 'Behind the Scenes', date: 'This Weekend', icon: '🎬' },
                      { title: 'Fan Meet & Greet', date: 'Next Week', icon: '🤝' },
                      { title: 'Project Announcement', date: 'Coming Soon', icon: '📢' }
                    ].map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center text-lg">
                          {event.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-green-300">{event.title}</h4>
                          <p className="text-xs text-gray-400">{event.date}</p>
                    </div>
                    </motion.div>
                  ))}
                </div>
                </motion.div>

                {/* Chat Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-2xl p-6 border border-indigo-500/20"
                >
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    💬 Chat with Community
                  </h3>
                  
                  {/* Chat Messages */}
                  <div 
                    ref={detailedWindowChatRef}
                    className="h-64 overflow-y-auto mb-4 space-y-3 chat-messages"
                  >
                    {detailedWindowChatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.user === 'You' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {message.avatar}
                        </div>
                        <div className={`flex-1 max-w-[80%] ${message.user === 'You' ? 'text-right' : ''}`}>
                          <div className={`inline-block p-3 rounded-2xl ${
                            message.user === 'You' 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                              : 'bg-white/10 text-gray-200'
                          }`}>
                            {message.isReply && (
                              <div className="text-xs text-gray-400 mb-1">
                                Replying to message
                              </div>
                            )}
                            <div className="text-sm font-medium mb-1">{message.user}</div>
                            <div className="text-sm whitespace-pre-wrap">{message.message}</div>
                            
                            {/* Poll Display */}
                            {message.pollData && (
                              <div className="mt-3 space-y-2">
                                <div className="text-sm font-medium">{message.pollData.question}</div>
                                {message.pollData?.options.map((option, idx) => {
                                  const optionKey = String.fromCharCode(65 + idx);
                                  const votes = message.pollData?.votes[optionKey] || 0;
                                  const totalVotes = Object.values(message.pollData?.votes || {}).reduce((a, b) => a + b, 0);
                                  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                                  
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => handleDetailedWindowPollVote(message.id, optionKey)}
                                      className="w-full text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm">{option}</span>
                                        <span className="text-xs text-gray-400">{votes} votes</span>
                                      </div>
                                      <div className="w-full bg-white/20 rounded-full h-2">
                                        <div 
                                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                          style={{ width: `${percentage}%` }}
                                        />
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          
                          {/* Message Actions */}
                          <div className={`flex items-center gap-2 mt-2 ${message.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs text-gray-500">{message.time}</span>
                            <button
                              onClick={() => handleDetailedWindowChatLike(message.id)}
                              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                            >
                              ❤️ {message.likes}
                            </button>
                            <div className="flex gap-1">
                              {['❤️', '🔥', '👏', '🎯'].map((reaction) => (
                                <button
                                  key={reaction}
                                  onClick={() => handleDetailedWindowChatReaction(message.id, reaction)}
                                  className="text-xs hover:scale-110 transition-transform"
                                >
                                  {reaction}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => {
                                const replyText = prompt('Reply to this message:');
                                if (replyText) handleDetailedWindowChatReply(message.id, replyText);
                              }}
                              className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={detailedWindowChatInput}
                      onChange={(e) => setDetailedWindowChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleDetailedWindowChatSend()}
                      placeholder="Type your message..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                    />
                    <button
                      onClick={handleDetailedWindowChatSend}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
                    >
                      Send
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Redesigned Tab Navigation */}
        <div className="mb-8 tab-navigation">
          <div className="flex justify-center">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl tab-container">
              <div className="flex gap-1 tab-list">
          {tabs.map((tab) => (
                  <motion.button
              key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'feed' | 'hub' | 'channels' | 'friends' | 'media' | 'perks' | 'merch')}
                    onMouseEnter={() => triggerExperienceZone(tab.id)}
                    className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 tab-button ${
                activeTab === tab.id
                        ? 'text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeTab === tab.id && (
            <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2 tab-content">
                      <tab.icon className={`w-4 h-4 transition-all duration-300 tab-icon ${
                        activeTab === tab.id ? 'text-white' : 'text-gray-400'
                      }`} />
                      <span className="font-medium tab-label">{tab.label}</span>
                  </div>
                  </motion.button>
                      ))}
                    </div>
                      </div>
                    </div>
              </div>

        {/* Tab Content */}
        <div className="transition-all duration-500">
          <AnimatePresence mode="wait">

          {/* Feed Tab - Instagram Style */}
          {activeTab === 'feed' && (
              <motion.div
              key="feed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              className="w-full max-w-6xl mx-auto"
              >
              {/* Feed header for experience view detection */}
              <div ref={feedHeaderRef} className="feed-header relative">
                                        <h1 className="feed-title">Community Feed</h1>
                <div className="feed-actions">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 font-medium">Experience Zone</span>
                    <button 
                      className="action-btn bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      onClick={() => setIsExperienceView(true)}
                      title="Enter Full Experience View"
                    >
                      <Maximize2 size={24} />
                    </button>
                  </div>
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
              {!isDataLoaded ? (
                <div className="w-full">
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                      <p className="text-gray-400 text-sm">Loading community data...</p>
                    </div>
                  </div>
                  {/* Loading skeleton */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Feed isExperienceView={false} />
              )}
            </motion.div>
          )}

          {/* Community Hub Tab - Consolidated Experience View */}
          {activeTab === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-7xl mx-auto"
            >
              {/* Hub Header */}
              <div ref={hubHeaderRef} className="feed-header relative mb-8">
                <h1 
                  className="feed-title cursor-pointer" 
                  onMouseEnter={() => triggerExperienceZone('hub')}
                  title="Hover to enter Community Hub Experience Zone"
                >
                  Community Hub
                </h1>
                <div className="feed-actions">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 font-medium">Experience Zone</span>
                    <button 
                      className="action-btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      onClick={() => setIsExperienceView(true)}
                      title="Enter Full Experience View"
                    >
                      <Maximize2 size={24} />
                    </button>
                  </div>
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Community Hub Layout - Full Chat Window with Mobile-Friendly Widgets */}
              <div className="w-full h-[calc(100vh-200px)] bg-black rounded-2xl overflow-hidden">

                {/* Full Chat Window with Mobile-Friendly Layout */}
                <div className={`bg-black h-full ${isMobile ? 'flex flex-col' : 'flex gap-6'}`}>
                  {/* Main Chat Area */}
                  <div className={`${isMobile ? 'flex-1' : 'flex-1'} bg-black flex flex-col`}>
                    
                    {/* Chat Header */}
                    <div className="p-2 bg-black border-b border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <h3 className="text-xs font-medium text-white">Community Chat</h3>
                          <span className="text-xs text-green-400 font-medium">Live</span>
                        </div>
                        
                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setShowPollModal(true)}
                            className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-xs text-purple-300"
                            title="Create Poll"
                          >
                            📊 Poll
                          </button>
                          <button 
                            onClick={() => setShowEventModal(true)}
                            className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-xs text-green-300"
                            title="Create Event"
                          >
                            📅 Event
                          </button>
                          <button 
                            onClick={() => setShowAnnouncementModal(true)}
                            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-xs text-blue-300"
                            title="Create Announcement"
                          >
                            📢 Announce
                          </button>
                        </div>
                        
                        {/* Chat Settings Menu */}
                        <div className="flex items-center gap-3">

                          {/* Chat Settings Menu */}
                          <button className="p-3 rounded-lg hover:bg-white/5 transition-colors group relative">
                            <MoreHorizontal className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            
                            {/* Expanded Chat Options */}
                            <div className="absolute right-0 top-full mt-2 w-56 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                              <div className="p-3 space-y-2">
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
                                  <Users className="w-4 h-4" />
                                  <span>View Members</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
                                  <Settings className="w-4 h-4" />
                                  <span>Chat Settings</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
                                  <Search className="w-4 h-4" />
                                  <span>Search Messages</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
                                  <Volume2 className="w-4 h-4" />
                                  <span>Mute Notifications</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
                                  <Bookmark className="w-4 h-4" />
                                  <span>Saved Messages</span>
                                </button>
                              </div>
                            </div>
                          </button>
                          
                          {/* Members List */}
                          <button className="p-3 rounded-lg hover:bg-white/5 transition-colors group relative">
                            <Users className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            
                            {/* Expanded Member List */}
                            <div className="absolute right-0 top-full mt-2 w-72 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                              <div className="p-4">
                                <h4 className="text-sm font-medium text-white mb-4">Online Members (12)</h4>
                                <div className="space-y-3">
                                  {[
                                    { name: 'FilmFan_2024', status: 'online', avatar: '🎬', role: 'Moderator' },
                                    { name: 'CinemaLover', status: 'online', avatar: '🎥', role: 'Member' },
                                    { name: 'MovieBuff', status: 'online', avatar: '🍿', role: 'Member' },
                                    { name: 'ArtDirector', status: 'away', avatar: '🎨', role: 'Creator' },
                                    { name: 'FilmStudent', status: 'online', avatar: '🎓', role: 'Member' }
                                  ].map((member, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center text-sm">
                                        {member.avatar}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                          <span className="text-sm text-gray-300 truncate">{member.name}</span>
                                          <span className="text-sm text-gray-500">• {member.role}</span>
                                        </div>
                                      </div>
                                      <div className={`w-3 h-3 rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="hub-chat-messages h-[calc(100vh-200px)] overflow-y-auto p-6 pb-24 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                    {hubChatMessages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group ${msg.isOfficial ? 'border-l-4 border-purple-500' : ''} ${msg.isBot ? 'border-l-4 border-blue-500' : ''}`}
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center text-lg overflow-hidden">
                          {msg.user === 'You' ? (
                            <img 
                              src={msg.avatar} 
                              alt="Your avatar" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = '👤';
                              }}
                            />
                          ) : (
                            <span>{msg.avatar}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-sm font-medium ${msg.isOfficial ? 'text-purple-300' : msg.isBot ? 'text-blue-300' : 'text-purple-300'}`}>
                              {msg.user}
                              {msg.isOfficial && <span className="ml-1 text-purple-400">✓</span>}
                              {msg.isBot && <span className="ml-1 text-blue-400">🤖</span>}
                            </span>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                          </div>
                          
                          {/* Message Content */}
                          <div className="mb-3">
                            {msg.isBot && msg.pollData ? (
                              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm text-gray-300 mb-3 font-medium">{msg.pollData.question}</p>
                                <div className="space-y-2">
                                  {msg.pollData?.options.map((option, idx) => {
                                    const optionKey = String.fromCharCode(65 + idx);
                                    const votes = msg.pollData?.votes[optionKey] || 0;
                                    const totalVotes = Object.values(msg.pollData?.votes || {}).reduce((a, b) => a + b, 0);
                                    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => handlePollVote(msg.id, optionKey)}
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                                      >
                                        <span className="text-sm text-gray-300">{option}</span>
                                        <div className="flex items-center gap-2">
                                          <div className="w-20 bg-white/10 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                          </div>
                                          <span className="text-xs text-gray-400">{percentage}%</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : msg.isBot && msg.eventData ? (
                              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                                <div className="flex items-center gap-2 mb-3">
                                  <Calendar className="w-5 h-5 text-green-400" />
                                  <h3 className="text-lg font-semibold text-green-300">{msg.eventData.title}</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-300">{msg.eventData.date} at {msg.eventData.time || 'TBD'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-300">{msg.eventData.location || 'Location TBD'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-green-400" />
                                    <span className="text-gray-300">{(msg.eventData.attendees?.length || 0)}/{msg.eventData.maxAttendees || '∞'} attending</span>
                                  </div>
                                  <p className="text-gray-300 mt-3 leading-relaxed">{msg.eventData.description}</p>
                                  <div className="flex gap-2 mt-4">
                                    <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 text-sm font-medium transition-colors">
                                      👍 Interested
                                    </button>
                                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm transition-colors">
                                      📅 Add to Calendar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : msg.isBot && 'announcementData' in msg && msg.announcementData ? (
                              <div className={`rounded-lg p-4 border ${
                                msg.announcementData.priority === 'urgent' ? 'bg-red-500/10 border-red-500/30' :
                                msg.announcementData.priority === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                                msg.announcementData.priority === 'normal' ? 'bg-blue-500/10 border-blue-500/30' :
                                'bg-gray-500/10 border-gray-500/30'
                              }`}>
                                <div className="flex items-center gap-2 mb-3">
                                  <div className={`p-2 rounded-full ${
                                    msg.announcementData.priority === 'urgent' ? 'bg-red-500/20' :
                                    msg.announcementData.priority === 'high' ? 'bg-orange-500/20' :
                                    msg.announcementData.priority === 'normal' ? 'bg-blue-500/20' :
                                    'bg-gray-500/20'
                                  }`}>
                                    <Bell className={`w-4 h-4 ${
                                      msg.announcementData.priority === 'urgent' ? 'text-red-400' :
                                      msg.announcementData.priority === 'high' ? 'text-orange-400' :
                                      msg.announcementData.priority === 'normal' ? 'text-blue-400' :
                                      'text-gray-400'
                                    }`} />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-white">{msg.announcementData.title}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        msg.announcementData.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                                        msg.announcementData.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                        msg.announcementData.priority === 'normal' ? 'bg-blue-500/20 text-blue-300' :
                                        'bg-gray-500/20 text-gray-300'
                                      }`}>
                                        {msg.announcementData.priority?.toUpperCase() || 'NORMAL'}
                                      </span>
                                      <span className="text-xs text-gray-400">{msg.announcementData.category || 'General'}</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-300 leading-relaxed">{msg.announcementData.content}</p>
                                <div className="flex gap-2 mt-4">
                                  <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 text-xs transition-colors">
                                    📌 Pin
                                  </button>
                                  <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 text-xs transition-colors">
                                    🔔 Subscribe
                                  </button>
                                </div>
                              </div>
                            ) : msg.isBot && msg.pollResults ? (
                              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm text-gray-300 mb-3 font-medium">{msg.pollResults.question}</p>
                                <div className="space-y-2">
                                  {Object.entries(msg.pollResults.results).map(([option, percentage]) => (
                                    <div key={option} className="flex items-center justify-between">
                                      <span className="text-sm text-gray-300">{option}</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-20 bg-white/10 rounded-full h-2">
                                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <span className="text-xs text-gray-400">{percentage}%</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-300 leading-relaxed">
                                {msg.message}
                                {msg.mentions && msg.mentions.map((mention, idx) => (
                                  <span key={idx} className="text-blue-400 font-medium">{mention} </span>
                                ))}
                              </p>
                            )}
                          </div>
                          
                          {/* Reactions */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="flex items-center gap-1 mb-2">
                              {msg.reactions.slice(0, 5).map((reaction, idx) => (
                                <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                                  {reaction}
                                </span>
                              ))}
                              {msg.reactions.length > 5 && (
                                <span className="text-xs text-gray-500">+{msg.reactions.length - 5}</span>
                              )}
                            </div>
                          )}
                          
                          {/* Message Actions */}
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => handleHubChatLike(msg.id)}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <Heart className="w-3 h-3" />
                              <span>{msg.likes}</span>
                            </button>
                            
                            {/* Reaction Picker */}
                            <div className="relative group/reactions">
                              <button className="text-xs text-gray-500 hover:text-yellow-400 transition-colors">
                                😀
                              </button>
                              <div className="absolute bottom-full left-0 mb-2 bg-black/90 backdrop-blur-xl rounded-lg p-2 opacity-0 invisible group-hover/reactions:opacity-100 group-hover/reactions:visible transition-all duration-300 z-50">
                                <div className="flex gap-1">
                                  {['❤️', '🔥', '👏', '🎯', '💯', '🚀', '🏆', '✨'].map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => handleHubChatReaction(msg.id, emoji)}
                                      className="p-1 hover:bg-white/10 rounded transition-colors"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <button className="text-xs text-gray-500 hover:text-blue-400 transition-colors">Reply</button>
                            <button className="text-xs text-gray-500 hover:text-green-400 transition-colors">Share</button>
                            <button className="text-xs text-gray-500 hover:text-yellow-400 transition-colors">Bookmark</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="absolute bottom-0 left-0 right-0 p-0">
                    <div className="flex gap-3 justify-center p-4">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={hubChatInput}
                        onChange={(e) => setHubChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleHubChatSend()}
                        className="flex-1 bg-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/8 max-w-lg"
                      />
                      <button
                        onClick={handleHubChatSend}
                        disabled={!hubChatInput.trim()}
                        className="px-8 py-4 bg-purple-500 rounded-2xl text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Widgets Sidebar */}
              {!isMobile && (
                <div className="w-80 bg-white/2 rounded-2xl overflow-hidden">
                  <div className="p-4 space-y-4">
                    {/* Widget Toggle */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">Community Widgets</h3>
                      <button 
                        onClick={() => setShowWidgets(!showWidgets)}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        {showWidgets ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                    
                    {showWidgets && (
                      <div className="space-y-4">
                        {/* Widget Navigation */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setWidgetPage(Math.max(0, widgetPage - 1))}
                              disabled={widgetPage === 0}
                              className="p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                            >
                              <ChevronLeft className="w-4 h-4 text-gray-400" />
                            </button>
                            <span className="text-xs text-gray-400">
                              {widgetPage + 1} / 4
                            </span>
                            <button 
                              onClick={() => setWidgetPage(Math.min(3, widgetPage + 1))}
                              disabled={widgetPage === 3}
                              className="p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                            >
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        {/* Page 0: Community Stats & Recent Activities */}
                        {widgetPage === 0 && (
                          <div className="space-y-4">
                            {/* Community Stats Widget */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Community Stats
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Total Members</span>
                                  <span className="text-white font-medium">{formatNumber(communityStats.totalMembers)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Online Now</span>
                                  <span className="text-green-400 font-medium">{formatNumber(communityStats.onlineMembers)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Total Posts</span>
                                  <span className="text-white font-medium">{formatNumber(communityStats.totalPosts)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Active Polls</span>
                                  <span className="text-purple-400 font-medium">{formatNumber(communityStats.totalPolls)}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Recent Activities Widget */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Recent Activities
                              </h4>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {recentActivities.map((activity) => (
                                  <div key={activity.id} className="text-xs text-gray-400">
                                    <span className="text-white font-medium">{activity.user}</span> {activity.action} <span className="text-purple-400">{activity.target}</span>
                                    <div className="text-gray-500">{activity.time}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Page 1: Your Created Content */}
                        {widgetPage === 1 && (
                          <div className="space-y-4">
                            {/* Your Polls Widget */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Your Polls ({userCreatedPolls.length})
                              </h4>
                              <div className="space-y-3">
                                {userCreatedPolls.length > 0 ? (
                                  userCreatedPolls.slice(0, 3).map((poll) => (
                                    <div key={poll.id} className="text-xs">
                                      <p className="text-gray-300 mb-2">{poll.question || 'Poll'}</p>
                                      <div className="flex items-center gap-2 text-gray-400">
                                        <span>👥 {poll.totalVotes} votes</span>
                                        <span>⏰ {poll.options.length} options</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-gray-500">No polls created yet</p>
                                )}
                              </div>
                            </div>
                            
                            {/* Your Events Widget */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Your Events ({userCreatedEvents.length})
                              </h4>
                              <div className="space-y-2">
                                {userCreatedEvents.length > 0 ? (
                                  userCreatedEvents.slice(0, 3).map((event) => (
                                    <div key={event.id} className="text-xs">
                                      <p className="text-white font-medium">{event.eventData?.title || 'Event'}</p>
                                      <p className="text-gray-400">{event.eventData?.date} at {event.eventData?.time}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 bg-white/10 rounded-full h-1">
                                          <div className="bg-green-500 h-1 rounded-full" style={{ width: `${Math.min(100, ((event.eventData?.attendees?.length || 0) / (event.eventData?.maxAttendees || 1)) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-gray-500 text-xs">{(event.eventData?.attendees?.length || 0)}/{event.eventData?.maxAttendees || '∞'}</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-gray-500">No events created yet</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Page 2: Upcoming Events */}
                        {widgetPage === 2 && (
                          <div className="space-y-4">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Upcoming Events
                              </h4>
                              <div className="space-y-3">
                                {upcomingEvents.length > 0 ? (
                                  upcomingEvents.slice(0, 3).map((event) => (
                                    <div key={event.id} className="text-xs">
                                      <p className="text-white font-medium">{event.title}</p>
                                      <p className="text-gray-400">{event.date} at {event.time}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 bg-white/10 rounded-full h-1">
                                          <div className="bg-green-500 h-1 rounded-full" style={{ width: `${Math.min(100, (event.attendees / event.maxAttendees) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-gray-500 text-xs">{event.attendees}/{event.maxAttendees}</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-gray-500">No upcoming events</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Page 3: Active Polls */}
                        {widgetPage === 3 && (
                          <div className="space-y-4">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Active Polls
                              </h4>
                              <div className="space-y-3">
                                {activePolls.length > 0 ? (
                                  activePolls.slice(0, 3).map((poll) => (
                                    <div key={poll.id} className="text-xs">
                                      <p className="text-gray-300 mb-2">{poll.question || 'Poll'}</p>
                                      <div className="flex items-center gap-2 text-gray-400">
                                        <span>👥 {poll.totalVotes} votes</span>
                                        <span>⏰ {poll.options.length} options</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-gray-500">No active polls</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Widgets Sidebar for Desktop */}
              {!isMobile && (
                <div className="w-80 bg-white/2 rounded-2xl overflow-hidden">
                  <div className="p-4 space-y-4">
                    {/* Widget Toggle */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">Community Widgets</h3>
                      <button
                        onClick={() => setShowWidgets(!showWidgets)}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        {showWidgets ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>

                    {showWidgets && (
                      <div className="space-y-4">
                        {/* Widget Navigation */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setWidgetPage(Math.max(0, widgetPage - 1))}
                              disabled={widgetPage === 0}
                              className="p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                            >
                              <ChevronLeft className="w-4 h-4 text-gray-400" />
                            </button>
                            <span className="text-xs text-gray-400">
                              {widgetPage + 1} / 4
                            </span>
                            <button
                              onClick={() => setWidgetPage(Math.min(3, widgetPage + 1))}
                              disabled={widgetPage === 3}
                              className="p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                            >
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        {/* Page 0: Community Stats & Recent Activities */}
                        {widgetPage === 0 && (
                          <div className="space-y-4">
                            {/* Community Stats Widget */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Community Stats
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Total Members</span>
                                  <span className="text-white font-medium">{formatNumber(communityStats.totalMembers)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Online Members</span>
                                  <span className="text-white font-medium">{formatNumber(communityStats.onlineMembers)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Total Posts</span>
                                  <span className="text-white font-medium">{formatNumber(communityStats.totalPosts)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Active Polls</span>
                                  <span className="text-white font-medium">{formatNumber(communityStats.totalPolls)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Recent Activities Widget */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Recent Activities
                              </h4>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {recentActivities.slice(0, 4).map((activity) => (
                                  <div key={activity.id} className="text-xs text-gray-400">
                                    <span className="text-white font-medium">{activity.user}</span> {activity.action}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Page 1: Your Content */}
                        {widgetPage === 1 && (
                          <div className="space-y-4">
                            {/* Your Polls Widget */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Your Polls ({userCreatedPolls.length})
                              </h4>
                              <div className="space-y-3">
                                {userCreatedPolls.length > 0 ? (
                                  userCreatedPolls.slice(0, 3).map((poll) => (
                                    <div key={poll.id} className="text-xs">
                                      <p className="text-gray-300 mb-2">{poll.question || 'Poll'}</p>
                                      <div className="flex items-center gap-2 text-gray-400">
                                        <span>👥 {poll.totalVotes} votes</span>
                                        <span>⏰ {poll.options.length} options</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-gray-500">No polls created yet</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Page 2: Upcoming Events */}
                        {widgetPage === 2 && (
                          <div className="space-y-4">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Upcoming Events
                              </h4>
                              <div className="space-y-3">
                                {upcomingEvents.length > 0 ? (
                                  upcomingEvents.slice(0, 3).map((event) => (
                                    <div key={event.id} className="text-xs">
                                      <p className="text-white font-medium">{event.title}</p>
                                      <p className="text-gray-400">{event.date} at {event.time}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 bg-white/10 rounded-full h-1">
                                          <div className="bg-green-500 h-1 rounded-full" style={{ width: `${Math.min(100, (event.attendees / event.maxAttendees) * 100)}%` }}></div>
                                        </div>
                                        <span className="text-gray-500 text-xs">{event.attendees}/{event.maxAttendees}</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-gray-500">No upcoming events</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Page 3: Active Polls */}
                        {widgetPage === 3 && (
                          <div className="space-y-4">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Active Polls
                              </h4>
                              <div className="space-y-3">
                                {activePolls.length > 0 ? (
                                  activePolls.slice(0, 3).map((poll) => (
                                    <div key={poll.id} className="text-xs">
                                      <p className="text-gray-300 mb-2">{poll.question || 'Poll'}</p>
                                      <div className="flex items-center gap-2 text-gray-400">
                                        <span>👥 {poll.totalVotes} votes</span>
                                        <span>⏰ {poll.options.length} options</span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-gray-500">No active polls</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile-Friendly Widgets Section */}
              {isMobile && (
                <div className="p-4 bg-white/5 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-white">Community Widgets</h4>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((page) => (
                        <button
                          key={page}
                          onClick={() => setWidgetPage(page)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            widgetPage === page ? 'bg-purple-500' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Page 0: Community Stats */}
                    {widgetPage === 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-purple-400">{formatNumber(communityStats.totalMembers)}</div>
                          <div className="text-xs text-gray-400">Members</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-green-400">{formatNumber(communityStats.onlineMembers)}</div>
                          <div className="text-xs text-gray-400">Online</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-blue-400">{formatNumber(communityStats.totalPosts)}</div>
                          <div className="text-xs text-gray-400">Posts</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-orange-400">{formatNumber(communityStats.totalPolls)}</div>
                          <div className="text-xs text-gray-400">Polls</div>
                        </div>
                      </div>
                    )}

                    {/* Page 1: Recent Activities */}
                    {widgetPage === 1 && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-white mb-2">Recent Activities</h5>
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {recentActivities.slice(0, 3).map((activity) => (
                            <div key={activity.id} className="text-xs text-gray-400">
                              <span className="text-white font-medium">{activity.user}</span> {activity.action}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Page 2: Upcoming Events */}
                    {widgetPage === 2 && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-white mb-2">Upcoming Events</h5>
                        <div className="space-y-2">
                          {upcomingEvents.slice(0, 2).map((event) => (
                            <div key={event.id} className="text-xs">
                              <p className="text-white font-medium">{event.title}</p>
                              <p className="text-gray-400">{event.date}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Page 3: Active Polls */}
                    {widgetPage === 3 && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <h5 className="text-sm font-medium text-white mb-2">Active Polls</h5>
                        <div className="space-y-2">
                          {activePolls.slice(0, 2).map((poll) => (
                            <div key={poll.id} className="text-xs">
                              <p className="text-gray-300">{poll.question || 'Poll'}</p>
                              <p className="text-gray-400">{poll.totalVotes} votes</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                              )}
              </div>
          </motion.div>
        )}

          {/* Channels Tab - Instagram Style */}
          {activeTab === 'channels' && (
            <motion.div
              key="channels"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Feed-style Header */}
              <div ref={channelsHeaderRef} className="feed-header relative">
                <h1 className="feed-title">Channels</h1>
                <div className="feed-actions">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 font-medium">Experience Zone</span>
                    <button 
                      className="action-btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      onClick={() => setIsExperienceView(true)}
                      title="Enter Full Experience View"
                    >
                      <Maximize2 size={24} />
                    </button>
                  </div>
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Split Layout: Channels List + Chat */}
              <div className="flex gap-8 h-[calc(100vh-200px)] ${
                isMobile ? '!flex-col' : ''
              }">
                {/* Left Side: Channels List */}
                <div className="w-1/3 bg-white/2 rounded-2xl overflow-hidden channels-left-side ${
                  isMobile ? '!w-full !h-1/3' : ''
                }">
                                      <div className="p-8 channels-header ${
                                        isMobile ? '!p-4' : ''
                                      }">
                      <div className="flex items-center justify-between mb-4 channels-header-content ${
                        isMobile ? '!mb-2' : ''
                      }">
                      <div className="channels-title-section">
                          <h3 className="font-medium text-white text-xl mb-1 channels-title ${
                            isMobile ? '!text-lg' : ''
                          }">Channels</h3>
                    <p className="text-gray-400 text-sm channels-subtitle ${
                      isMobile ? '!text-xs' : ''
                    }">{channels.length} channels available</p>
                      </div>
                      <div className="flex items-center gap-2 channels-actions">
                        {/* Removed filter buttons for cleaner look */}
                      </div>
                    </div>
                    
                    {/* Removed channel categories for cleaner look */}
                            </div>
                  
                  <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300 channels-list">
                    {channels.map((channel, index) => (
              <motion.div
                      key={channel.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-6 cursor-pointer transition-all duration-300 hover:bg-white/5 channel-item ${
                        selectedChannel === channel.id
                            ? 'bg-purple-500/10' 
                            : ''
                        } ${
                          isMobile ? '!p-3' : ''
                        }"
                        onClick={() => setSelectedChannel(channel.id)}
                      >
                        <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm ${
                              isMobile ? '!w-8 !h-8 !text-xs' : ''
                            }">
                              {channel.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                              <h3 className="font-medium text-white text-base ${
                                isMobile ? '!text-sm' : ''
                              }">#{channel.name}</h3>
                                {channel.verified && (
                                  <span className="text-blue-400 text-xs">✓</span>
                                )}
                                {channel.pinned && (
                                  <span className="text-yellow-400 text-xs">📌</span>
                                )}
                            </div>
                              {/* Removed extra channel data for cleaner look */}
                      </div>
                      </div>
                      <div className="flex items-center gap-2">
                      {channel.unread > 0 && (
                            <span className="px-2 py-1 bg-purple-500 rounded-full text-white text-xs font-medium ${
                              isMobile ? '!px-1 !py-0.5' : ''
                            }">
                          {channel.unread}
                        </span>
                      )}
                        <div className="w-2 h-2 rounded-full ${
                          channel.activityLevel === 'very-high' ? 'bg-green-500' :
                          channel.activityLevel === 'high' ? 'bg-blue-500' :
                          channel.activityLevel === 'medium' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        } ${
                          isMobile ? '!w-1.5 !h-1.5' : ''
                        }" />
                        </div>
                        </div>
                        {!isMobile && (
                          <>
                        <div className="text-xs text-gray-400 mb-2">
                          {channel.description}
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">{channel.lastActivity}</span>
                          <span className="text-xs text-gray-500">{channel.category}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>📊 {channel.members.toLocaleString()}</span>
                          <span>🟢 {channel.online}</span>
                          <span>💬 {Math.floor(channel.members * 0.1)}</span>
                        </div>
                          </>
                        )}
                      </motion.div>
                  ))}
                </div>
              </div>

                {/* Right Side: Chat Interface */}
                <div className="flex-1 bg-white/2 rounded-2xl overflow-hidden flex flex-col ${
                  isMobile ? '!h-2/3' : ''
                }">
                  {selectedChannel ? (
                    <>
                      {/* Chat Header */}
                      <div className="flex items-center justify-between p-8 flex-shrink-0 chat-header ${
                        isMobile ? '!p-4' : ''
                      }">
                        <div className="flex items-center gap-3 chat-header-info">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm channel-icon">
                            {channels.find(c => c.id === selectedChannel)?.icon}
                          </div>
                          <div className="channel-info">
                            <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-white channel-name">
                              #<DecryptedText 
                                text={selectedChannel} 
                                speed={30} 
                                maxIterations={8} 
                                sequential={true} 
                                revealDirection="start"
                                animateOn="hover"
                                className="text-white"
                                encryptedClassName="text-purple-400"
                              />
                  </h3>
                              {channels.find(c => c.id === selectedChannel)?.verified && (
                                <span className="text-blue-400 text-xs">✓</span>
                              )}
                              {channels.find(c => c.id === selectedChannel)?.pinned && (
                                <span className="text-yellow-400 text-xs">📌</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 channel-stats">
                              {channels.find(c => c.id === selectedChannel)?.members.toLocaleString()} members • {channels.find(c => c.id === selectedChannel)?.online} online • {channels.find(c => c.id === selectedChannel)?.category}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 channel-description">
                              {channels.find(c => c.id === selectedChannel)?.description}
                            </p>
                          </div>
                        </div>
                  <div className="flex items-center gap-2 chat-header-actions">
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Channel notifications">
                            <Bell className="w-4 h-4 text-gray-400" />
                    </button>
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Channel settings">
                            <Settings className="w-4 h-4 text-gray-400" />
                    </button>
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Channel info">
                            <Info className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>



                {/* Chat Messages */}
                <AnimatePresence mode="wait" key={selectedChannel}>
                  <motion.div
                    key={selectedChannel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    ref={channelMessagesRef}
                          className="p-8 space-y-5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300 ${
                            isMobile ? '!p-4' : ''
                          }"
                  >
                    {(messages[selectedChannel] || []).map((msg, index) => (
                      <div key={index} className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors">
                        <img
                          src={msg.avatar || getUserAvatar(msg.user)}
                          alt={msg.user}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                              <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-white text-sm">{msg.user}</span>
                                  <span className="text-xs text-gray-400">{msg.time}</span>
                            {msg.isOfficial && (
                              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">Official</span>
                            )}
                            {msg.isBot && (
                              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">Bot</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-300 mb-2">
                            {msg.message}
                            {msg.mentions && msg.mentions.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {msg.mentions.map((mention, idx) => (
                                  <span key={idx} className="text-blue-400 bg-blue-500/10 px-1 rounded text-xs">
                                    @{mention}
                                  </span>
                                ))}
                        </div>
                            )}
                      </div>
                          
                          {/* Message Reactions */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className="flex items-center gap-1 mb-2">
                              {msg.reactions.map((reaction, idx) => (
                                <button
                                  key={idx}
                                  className="px-2 py-1 bg-white/10 rounded-full text-xs hover:bg-white/20 transition-colors"
                                  onClick={() => handleReaction(index, reaction)}
                                >
                                  {reaction}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          {/* Message Actions */}
                          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-xs text-gray-400 hover:text-white transition-colors">
                              React
                            </button>
                            <button className="text-xs text-gray-400 hover:text-white transition-colors">
                              Reply
                            </button>
                            <button className="text-xs text-gray-400 hover:text-white transition-colors">
                              Share
                            </button>
                            <button className="text-xs text-gray-400 hover:text-white transition-colors">
                              More
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {channelTyping.includes(selectedChannel) && (
                      <div className="flex items-start gap-3">
                        <img
                          src={getUserAvatar('Community')}
                          alt="Community"
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">Community</span>
                            <span className="text-xs text-gray-400">typing...</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Channel Statistics */}
                <div className="px-8 py-4 border-t border-white/10 flex-shrink-0 regular-channel-statistics">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <span>📊 {channels.find(c => c.id === selectedChannel)?.members.toLocaleString()} members</span>
                      <span>🟢 {channels.find(c => c.id === selectedChannel)?.online} online</span>
                      <span>💬 {Math.floor((channels.find(c => c.id === selectedChannel)?.members || 0) * 0.1)} messages today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Activity: {channels.find(c => c.id === selectedChannel)?.activityLevel}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        channels.find(c => c.id === selectedChannel)?.activityLevel === 'very-high' ? 'bg-green-500' :
                        channels.find(c => c.id === selectedChannel)?.activityLevel === 'high' ? 'bg-blue-500' :
                        channels.find(c => c.id === selectedChannel)?.activityLevel === 'medium' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                      <div className="flex gap-3 p-4 pb-6">
                        {/* Attachment and Emoji Buttons */}
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Attach file">
                            <Paperclip className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Add emoji">
                            <Smile className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Add image">
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Quick reactions">
                            <span className="text-gray-400 text-xs">😊</span>
                          </button>
                        </div>
                        
                        {/* Message Input */}
                        <div className="flex-1 relative message-input-container mobile-message-input">
                  <input
                    type="text"
                          placeholder={`Message #${selectedChannel}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChannelMessage();
                      }
                    }}
                            className="w-full bg-white/5 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/8 pr-16 message-input"
                          />
                          {/* Character count */}
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 character-count">
                            {newMessage.length}/500
                          </div>
                        </div>
                        
                        {/* Send Button */}
                  <button
                    onClick={sendChannelMessage}
                    disabled={!newMessage.trim()}
                          className="px-4 py-2 bg-purple-500 rounded-xl text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 send-button mobile-send-button"
                  >
                          <Send className="w-3 h-3" />
                          Send
                  </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-white font-medium mb-2">Select a Channel</h3>
                        <p className="text-gray-400 text-sm">Choose a channel from the list to start chatting</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

                    {/* Friends Tab - Instagram Style */}
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-6xl mx-auto"
            >
                                          {/* Feed-style Header */}
              <div ref={friendsHeaderRef} className="feed-header relative">
                <h1 className="feed-title">Friends</h1>
                <div className="feed-actions">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 font-medium">Experience Zone</span>
                    <button 
                      className="action-btn bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                      onClick={() => setIsExperienceView(true)}
                      title="Enter Full Experience View"
                    >
                      <Maximize2 size={24} />
                    </button>
                  </div>
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
                </div>

              {/* Split Layout: Friends List + Chat */}
              <div className="flex gap-8 h-[calc(100vh-80px)]">
                {/* Left Side: Friends List */}
                <div className="w-1/3 bg-white/2 rounded-2xl overflow-hidden friends-left-side">
                  <div className="p-8">
                    <h3 className="font-medium text-white text-xl mb-2">Friends</h3>
                    <p className="text-sm text-gray-400">{friendsList.length} friends online</p>
                </div>

                  <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300">
                    {friendsList.map((friend, index) => (
                      <motion.div
                      key={friend.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`p-6 cursor-pointer transition-all duration-300 hover:bg-white/5 friend-item ${
                        selectedFriend === friend.id
                            ? 'bg-purple-500/10' 
                            : ''
                        }`}
                        onClick={() => setSelectedFriend(friend.id)}
                      >
                        <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                  src={friend.avatar || getUserAvatar(friend.name || '')} 
                  alt={friend.name} 
                              className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getUserAvatar(friend.name || '');
                  }}
                />
                        {friend.online && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                        )}
                      </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white text-sm">
                              <Typewriter 
                                text={friend.name} 
                                speed={80}
                                className="text-white"
                              />
                            </h3>
                            <p className={`text-xs ${friend.online ? 'text-green-400' : 'text-gray-400'}`}>
                          {friend.online ? 'Online' : 'Offline'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {(friendChats[friend.id] || []).length} messages
                            </p>
                        </div>
                      </div>
                      </motion.div>
                  ))}
                </div>
              </div>

                {/* Right Side: Chat Interface */}
                <div className="flex-1 bg-white/2 rounded-2xl overflow-hidden">
                  {selectedFriend ? (
                    <>
                {/* Chat Header */}
                      <div className="flex items-center justify-between p-8 friends-chat-header">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={friendsList.find(f => f.id === selectedFriend)?.avatar || getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '')} 
                        alt={friendsList.find(f => f.id === selectedFriend)?.name}
                              className="w-12 h-12 rounded-full object-cover" 
                      />
                      {friendsList.find(f => f.id === selectedFriend)?.online && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                      )}
                    </div>
                    <div>
                            <h3 className="font-medium text-white text-lg">
                              <Typewriter 
                                text={friendsList.find(f => f.id === selectedFriend)?.name || ''} 
                                speed={80}
                                className="text-white"
                              />
                      </h3>
                            <p className={`text-sm ${friendsList.find(f => f.id === selectedFriend)?.online ? 'text-green-400' : 'text-gray-400'}`}>
                        {friendsList.find(f => f.id === selectedFriend)?.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Chat Actions */}
                  <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Phone className="w-4 h-4 text-gray-400" />
                    </button>
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <Video className="w-4 h-4 text-gray-400" />
                    </button>
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <AnimatePresence mode="wait" key={selectedFriend}>
                  <motion.div
                    key={selectedFriend}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    ref={friendMessagesRef}
                          className="p-8 space-y-5 overflow-y-auto h-[calc(100%-200px)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300 friends-chat-messages"
                  >
                    {(friendChats[selectedFriend] || []).map((msg, index) => (
                            <div key={index} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] ${msg.user === 'You' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white'} rounded-lg p-3`}>
                                {msg.user !== 'You' && (
                                  <div className="flex items-center gap-2 mb-2">
                        <img 
                  src={msg.avatar || getUserAvatar(msg.user || '')} 
                  alt={msg.user} 
                                      className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getUserAvatar(msg.user || '');
                  }}
                />
                                    <span className="font-medium text-xs">{msg.user}</span>
                                    <span className="text-xs opacity-60">{msg.time}</span>
                          </div>
                                )}
                                <div className="text-sm">{msg.message}</div>
                        </div>
                      </div>
                    ))}
                    {friendTyping && (
                            <div className="flex justify-start">
                              <div className="bg-white/10 text-white rounded-lg p-3">
                                <div className="flex items-center gap-2">
                        <img 
                  src={friendsList.find(f => f.id === selectedFriend)?.avatar || getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '')} 
                                    className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '');
                  }}
                />
                                  <div className="text-sm italic opacity-60">Typing...</div>
                                </div>
                              </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Message Input */}
                      <div className="flex gap-4 p-8 pb-40 friends-message-input">
                        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <Paperclip className="w-5 h-5 text-gray-400" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={friendInput}
                    onChange={(e) => setFriendInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        sendFriendMessage();
                      }
                    }}
                          className="flex-1 bg-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/8"
                  />
                  <button
                    onClick={sendFriendMessage}
                    disabled={!friendInput.trim()}
                          className="px-8 py-4 bg-purple-500 rounded-2xl text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-white font-medium mb-2">Select a Friend</h3>
                        <p className="text-gray-400 text-sm">Choose a friend from the list to start chatting</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Media Tab - Instagram Style */}
          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Feed-style Header */}
              <div className="feed-header">
                <h1 className="feed-title">Media</h1>
                <div className="feed-actions">
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Instagram-style Filters */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {['All', 'Behind Scenes', 'Actor Portraits', 'Production', 'Locations', 'Technical', 'Cast & Crew'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                      filter === 'All'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Instagram-style Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  // Behind the Scenes - Film Production
                  { url: 'https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-64', category: 'Behind Scenes', likes: 1234, comments: 89, description: 'Camera setup on location' },
                  { url: 'https://images.pexels.com/photos/3807756/pexels-photo-3807756.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-80', category: 'Behind Scenes', likes: 2156, comments: 156, description: 'Director reviewing footage' },
                  { url: 'https://images.pexels.com/photos/3807757/pexels-photo-3807757.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-72', category: 'Behind Scenes', likes: 1890, comments: 134, description: 'Lighting setup on set' },
                  
                  // Actor Portraits & Promotional
                  { url: 'https://images.pexels.com/photos/3807758/pexels-photo-3807758.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-96', category: 'Actor Portraits', likes: 3456, comments: 234, description: 'Lead actor in character' },
                  { url: 'https://images.pexels.com/photos/3807759/pexels-photo-3807759.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-56', category: 'Actor Portraits', likes: 2789, comments: 189, description: 'Supporting cast photo' },
                  { url: 'https://images.pexels.com/photos/3807760/pexels-photo-3807760.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-88', category: 'Actor Portraits', likes: 4123, comments: 298, description: 'Character transformation' },
                  
                  // Production House Content
                  { url: 'https://images.pexels.com/photos/3807761/pexels-photo-3807761.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-64', category: 'Production', likes: 1567, comments: 78, description: 'Studio lot tour' },
                  { url: 'https://images.pexels.com/photos/3807762/pexels-photo-3807762.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-80', category: 'Production', likes: 2345, comments: 145, description: 'Costume fitting session' },
                  { url: 'https://images.pexels.com/photos/3807763/pexels-photo-3807763.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-72', category: 'Production', likes: 1987, comments: 112, description: 'Makeup and hair team' },
                  
                  // Set Locations & Scenes
                  { url: 'https://images.pexels.com/photos/3807764/pexels-photo-3807764.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-96', category: 'Locations', likes: 2987, comments: 167, description: 'Exotic location shoot' },
                  { url: 'https://images.pexels.com/photos/3807765/pexels-photo-3807765.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-56', category: 'Locations', likes: 1876, comments: 98, description: 'Urban city backdrop' },
                  { url: 'https://images.pexels.com/photos/3807766/pexels-photo-3807766.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-88', category: 'Locations', likes: 3245, comments: 201, description: 'Period set construction' },
                  
                  // Equipment & Technical
                  { url: 'https://images.pexels.com/photos/3807767/pexels-photo-3807767.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-64', category: 'Technical', likes: 1456, comments: 67, description: 'Camera equipment setup' },
                  { url: 'https://images.pexels.com/photos/3807768/pexels-photo-3807768.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-80', category: 'Technical', likes: 2234, comments: 134, description: 'Sound recording setup' },
                  { url: 'https://images.pexels.com/photos/3807769/pexels-photo-3807769.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-72', category: 'Technical', likes: 1789, comments: 89, description: 'Special effects preparation' },
                  
                  // Cast & Crew
                  { url: 'https://images.pexels.com/photos/3807770/pexels-photo-3807770.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-96', category: 'Cast & Crew', likes: 4567, comments: 312, description: 'Full cast photo' },
                  { url: 'https://images.pexels.com/photos/3807771/pexels-photo-3807771.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-56', category: 'Cast & Crew', likes: 2345, comments: 167, description: 'Crew lunch break' },
                  { url: 'https://images.pexels.com/photos/3807772/pexels-photo-3807772.jpeg?auto=compress&cs=tinysrgb&w=800', height: 'h-88', category: 'Cast & Crew', likes: 3456, comments: 245, description: 'Director with cast' }
                ].map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative ${image.height} rounded-xl overflow-hidden group cursor-pointer bg-gray-800`}
                  >
                    <img 
                      src={image.url}
                      alt={`${image.category} ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{
                        filter: 'grayscale(30%) contrast(110%) brightness(90%)'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex items-center justify-between text-white">
                        <div>
                          <div className="text-sm font-medium">{image.category}</div>
                          <div className="text-xs text-gray-300 mb-1">{image.description}</div>
                          <div className="text-xs text-gray-300">{image.likes} likes • {image.comments} comments</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300">
                            <Heart className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Perks Tab - Instagram Style */}
          {activeTab === 'perks' && (
            <motion.div
              key="perks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Feed-style Header */}
              <div className="feed-header">
                <h1 className="feed-title">Perks</h1>
                <div className="feed-actions">
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Instagram-style Perks Grid */}
              <div className="grid md:grid-cols-2 gap-6">
              {[
                  { title: 'Premiere Screening Access', description: 'VIP access to the movie premiere', status: 'Available', type: 'event', icon: Ticket, color: 'from-purple-500 to-pink-500' },
                  { title: 'Signed Poster Collection', description: 'Limited edition signed posters', status: 'Claimed', type: 'merchandise', icon: Gift, color: 'from-green-500 to-blue-500' },
                  { title: 'Behind-the-Scenes Footage', description: 'Exclusive BTS content access', status: 'Available', type: 'content', icon: Camera, color: 'from-orange-500 to-red-500' },
                  { title: 'Producer Credit', description: 'Your name in the end credits', status: 'Active', type: 'credit', icon: Crown, color: 'from-yellow-500 to-orange-500' },
                  { title: 'Set Visit Experience', description: 'Visit the movie set during filming', status: 'Upcoming', type: 'experience', icon: MapPin, color: 'from-blue-500 to-purple-500' },
                  { title: 'Cast Meet & Greet', description: 'Personal meeting with the cast', status: 'Available', type: 'experience', icon: Users, color: 'from-pink-500 to-red-500' }
              ].map((perk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative p-6 rounded-2xl bg-white/10 border border-white/20 hover:border-white/30 transition-all duration-300 overflow-hidden group"
                  >
                    {/* Instagram-style gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${perk.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${perk.color} bg-opacity-20`}>
                        <perk.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg text-white">
                          {perk.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          perk.status === 'Available' ? 'bg-green-500/20 text-green-400' :
                          perk.status === 'Claimed' ? 'bg-purple-500/20 text-purple-400' :
                          perk.status === 'Active' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {perk.status}
                        </span>
                      </div>
                        <p className="text-sm mb-4 text-gray-300">
                        {perk.description}
                      </p>
                      {perk.status === 'Available' && (
                          <button className={`px-4 py-2 bg-gradient-to-r ${perk.color} rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all duration-300`}>
                          Claim Perk
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            </motion.div>
          )}

          {/* Merch Tab - Instagram Style */}
          {activeTab === 'merch' && (
            <motion.div
              key="merch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Feed-style Header */}
              <div className="feed-header">
                <h1 className="feed-title">Merch</h1>
                <div className="feed-actions">
                  <button className="action-btn">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Instagram-style Merch Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Circles Premium Cotton T-Shirt', price: '₹1,299', image: 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Apparel', likes: 234, description: 'Premium cotton t-shirt with embroidered Circles logo' },
                  { name: 'Designer Silk Dress', price: '₹8,999', image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Apparel', likes: 456, description: 'Elegant silk dress with modern design' },
                  { name: 'Circles Premium Hoodie', price: '₹2,199', image: 'https://images.pexels.com/photos/1884582/pexels-photo-1884582.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Apparel', likes: 789, description: 'Premium hoodie for Circles platform investors' },
                  { name: 'Casual Denim Jacket', price: '₹3,299', image: 'https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Apparel', likes: 123, description: 'Classic denim jacket with modern styling' },
                  { name: 'Diamond Pendant Necklace', price: '₹15,999', image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Jewelry', likes: 567, description: 'Exclusive diamond pendant necklace' },
                  { name: 'Gold Bracelet Set', price: 'FREE', image: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Jewelry', likes: 890, description: 'Free gold bracelet set for premium investors' },
                  { name: 'Leather Crossbody Bag', price: '₹899', image: 'https://images.pexels.com/photos/404168/pexels-photo-404168.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Accessories', likes: 345, description: 'Premium leather crossbody bag with Circles branding' },
                  { name: 'Silver Ring Collection', price: '₹2,499', image: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Jewelry', likes: 678, description: 'Limited edition silver ring collection' },
                  { name: 'Ceramic Coffee Mug', price: '₹799', image: 'https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Accessories', likes: 234, description: 'Premium ceramic coffee mug with Circles logo' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative bg-white/10 rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300">
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <span className="text-green-400 font-bold">{item.price}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">{item.category}</span>
                        <span className="text-sm text-gray-400">{item.likes} likes</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{item.description}</p>
                      <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-300">
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
              </div>
      </div>
      
      {/* Full Experience View Overlay */}
      <AnimatePresence>
        {isExperienceView && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            className="fixed inset-0 bg-black z-50 overflow-hidden"
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden'
            }}
          >
            {/* Experience Header */}
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute top-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-b border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="feed-title text-xl">
                    {activeTab === 'channels' ? (
                      <Typewriter 
                        text="Channels" 
                        speed={100}
                        className="text-white"
                      />
                    ) : activeTab === 'friends' ? (
                      <Typewriter 
                        text="Friends" 
                        speed={100}
                        className="text-white"
                      />
                    ) : activeTab === 'hub' ? (
                      <Typewriter 
                        text="Community Hub" 
                        speed={100}
                        className="text-white"
                      />
                    ) : (
                      <Typewriter 
                        text="Community Feed" 
                        speed={100}
                        className="text-white"
                      />
                    )}
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">Scroll left/right to navigate</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Quick Navigation Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex items-center gap-2"
                  >
                    {activeTab === 'feed' && (
                      <>
                        <motion.button
                          onClick={() => setActiveTab('hub')}
                          className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Community Hub"
                        >
                          <MessageSquare className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('channels')}
                          className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Channels"
                        >
                          <Hash className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('friends')}
                          className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Friends"
                        >
                          <Users className="w-4 h-4 text-white" />
                        </motion.button>
                      </>
                    )}
                    {activeTab === 'channels' && (
                      <>
                        <motion.button
                          onClick={() => setActiveTab('feed')}
                          className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Feed"
                        >
                          <MessageCircle className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('hub')}
                          className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Community Hub"
                        >
                          <MessageSquare className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('friends')}
                          className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Friends"
                        >
                          <Users className="w-4 h-4 text-white" />
                        </motion.button>
                      </>
                    )}
                    {activeTab === 'friends' && (
                      <>
                        <motion.button
                          onClick={() => setActiveTab('feed')}
                          className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Feed"
                        >
                          <MessageCircle className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('hub')}
                          className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Community Hub"
                        >
                          <MessageSquare className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('channels')}
                          className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Channels"
                        >
                          <Hash className="w-4 h-4 text-white" />
                        </motion.button>
                      </>
                    )}
                    {activeTab === 'hub' && (
                      <>
                        <motion.button
                          onClick={() => setActiveTab('feed')}
                          className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Feed"
                        >
                          <MessageCircle className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('channels')}
                          className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Channels"
                        >
                          <Hash className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveTab('friends')}
                          className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Friends"
                        >
                          <Users className="w-4 h-4 text-white" />
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                  <p className="text-sm text-gray-400">Click X to close</p>
                  <motion.button
                    onClick={closeExperienceView}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Experience Content */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="pt-16 h-full overflow-hidden"
            >
              {activeTab === 'channels' && (
                <div className="flex gap-4 h-full p-4">
                  {/* Left Side: Channels List */}
                  <div className="w-1/5 bg-white/2 rounded-2xl overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-white text-base mb-1">Channels</h3>
                          <p className="text-xs text-gray-400">{channels.length} channels available</p>
                        </div>
                        <div className="flex items-center gap-2 exp-filter-options">
                          {/* Removed filter buttons for cleaner look */}
                        </div>
                    </div>
                    
                      {/* Removed channel categories for cleaner look */}
                    </div>
                    
                    <div className="overflow-y-auto h-[calc(100%-120px)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300">
                      {channels.map((channel, index) => (
                        <motion.div
                          key={channel.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`p-4 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
                            selectedChannel === channel.id ? 'bg-purple-500/10' : ''
                          }`}
                          onClick={() => setSelectedChannel(channel.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs">
                                {channel.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <h3 className="font-medium text-white text-xs">
                                  #<DecryptedText 
                                    text={channel.name} 
                                    speed={30} 
                                    maxIterations={8} 
                                    sequential={true} 
                                    revealDirection="start"
                                    animateOn="hover"
                                    className="text-white"
                                    encryptedClassName="text-purple-400"
                                  />
                                </h3>
                                  {channel.verified && (
                                    <span className="text-blue-400 text-xs">✓</span>
                                  )}
                                  {channel.pinned && (
                                    <span className="text-yellow-400 text-xs">📌</span>
                                  )}
                              </div>
                                {/* Removed extra channel data for cleaner look */}
                            </div>
                            </div>
                            <div className="flex items-center gap-2">
                            {channel.unread > 0 && (
                              <span className="px-2 py-1 bg-purple-500 rounded-full text-white text-xs font-medium">
                                {channel.unread}
                              </span>
                            )}
                              <div className={`w-2 h-2 rounded-full ${
                                channel.activityLevel === 'very-high' ? 'bg-green-500' :
                                channel.activityLevel === 'high' ? 'bg-blue-500' :
                                channel.activityLevel === 'medium' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`} />
                          </div>
                          </div>
                          {/* Removed extra channel data for cleaner look */}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Chat Interface */}
                  <div className="flex-1 bg-white/2 rounded-2xl overflow-hidden flex flex-col">
                    {selectedChannel ? (
                      <>
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs">
                              {channels.find(c => c.id === selectedChannel)?.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <h3 className="font-medium text-white text-sm">
                                  #<DecryptedText 
                                    text={selectedChannel} 
                                    speed={30} 
                                    maxIterations={8} 
                                    sequential={true} 
                                    revealDirection="start"
                                    animateOn="hover"
                                    className="text-white"
                                    encryptedClassName="text-purple-400"
                                  />
                                </h3>
                                {channels.find(c => c.id === selectedChannel)?.verified && (
                                  <span className="text-blue-400 text-xs">✓</span>
                                )}
                                {channels.find(c => c.id === selectedChannel)?.pinned && (
                                  <span className="text-yellow-400 text-xs">📌</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 exp-channel-data">
                                {channels.find(c => c.id === selectedChannel)?.members.toLocaleString()} members • {channels.find(c => c.id === selectedChannel)?.online} online • {channels.find(c => c.id === selectedChannel)?.category}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 exp-channel-data">
                                {channels.find(c => c.id === selectedChannel)?.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Channel notifications">
                              <Bell className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Channel settings">
                              <Settings className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Channel info">
                              <Info className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>



                        {/* Chat Messages */}
                        <AnimatePresence mode="wait" key={selectedChannel}>
                          <motion.div
                            key={selectedChannel}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            ref={expChannelMessagesRef}
                            className="p-4 space-y-3 overflow-y-auto h-[calc(100%-140px)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300"
                          >
                            {(messages[selectedChannel] || []).map((msg, index) => (
                              <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className={`flex items-start gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                              >
                                {!msg.isUser && (
                                <img
                                  src={msg.avatar || getUserAvatar(msg.user)}
                                  alt={msg.user}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                )}
                                <div className={`flex-1 min-w-0 max-w-[80%] ${msg.isUser ? 'order-first' : ''}`}>
                                  <div className={`flex items-center gap-2 mb-1 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                    {msg.isOfficial && (
                                      <span className="text-blue-400 text-xs">👑</span>
                                    )}
                                    {msg.isBot && (
                                      <span className="text-purple-400 text-xs">🤖</span>
                                    )}
                                    <span className={`font-medium text-sm ${msg.isUser ? 'text-purple-300' : 'text-white'}`}>
                                      {msg.user}
                                    </span>
                                    <span className="text-xs text-gray-400">{msg.time}</span>
                                  </div>
                                  <div className={`text-sm rounded-lg p-3 ${
                                    msg.isUser 
                                      ? 'bg-purple-500 text-white' 
                                      : msg.isOfficial 
                                        ? 'bg-blue-500/20 text-white border border-blue-500/30'
                                        : msg.isBot
                                          ? 'bg-purple-500/20 text-white border border-purple-500/30'
                                          : 'bg-white/10 text-gray-300'
                                  }`}>
                                    {/* Process mentions */}
                                    {msg.mentions && msg.mentions.length > 0 ? (
                                      <div className="mb-2">
                                        {msg.mentions.map((mention, idx) => (
                                          <span key={idx} className="inline-block bg-purple-500/30 text-purple-300 px-2 py-1 rounded text-xs mr-1 mb-1">
                                            @{mention}
                                          </span>
                                        ))}
                                </div>
                                    ) : null}
                                    <div className="text-sm">{msg.message}</div>
                              </div>
                                  
                                  {/* Reactions */}
                                  {msg.reactions && msg.reactions.length > 0 && (
                                    <div className="flex items-center gap-1 mt-2">
                                      {msg.reactions.map((reaction, idx) => (
                                        <button
                                          key={idx}
                                          className="px-2 py-1 bg-white/10 rounded-full text-xs hover:bg-white/20 transition-colors"
                                          onClick={() => handleReaction(index, reaction)}
                                        >
                                          {reaction}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {msg.isUser && (
                                  <img
                                    src={msg.avatar || getUserAvatar(msg.user)}
                                    alt={msg.user}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                  />
                                )}
                              </motion.div>
                            ))}
                            
                            {/* Typing Indicator */}
                            {channelTyping.length > 0 && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-3"
                              >
                                <img
                                  src={getUserAvatar('Community')}
                                  alt="Community"
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-white text-sm">Community</span>
                                    <span className="text-xs text-gray-400">typing...</span>
                                  </div>
                                  <div className="bg-white/10 text-gray-300 rounded-lg p-3">
                                    <div className="flex items-center gap-1">
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        </AnimatePresence>

                        {/* Channel Statistics - Hidden on mobile */}
                        <div className="px-4 py-2 border-t border-white/10 channel-statistics mobile-hidden">
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center gap-3">
                              <span>📊 {channels.find(c => c.id === selectedChannel)?.members.toLocaleString()} members</span>
                              <span>🟢 {channels.find(c => c.id === selectedChannel)?.online} online</span>
                              <span>💬 {Math.floor((channels.find(c => c.id === selectedChannel)?.members || 0) * 0.1)} messages today</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Activity: {channels.find(c => c.id === selectedChannel)?.activityLevel}</span>
                              <div className={`w-2 h-2 rounded-full ${
                                channels.find(c => c.id === selectedChannel)?.activityLevel === 'very-high' ? 'bg-green-500' :
                                channels.find(c => c.id === selectedChannel)?.activityLevel === 'high' ? 'bg-blue-500' :
                                channels.find(c => c.id === selectedChannel)?.activityLevel === 'medium' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`} />
                            </div>
                          </div>
                        </div>

                        {/* Message Input */}
                        <div className="flex gap-3 p-3 pb-3 exp-message-input-container">
                          <div className="flex items-center gap-1 flex-1 exp-input-group">
                            <button 
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors exp-input-btn"
                              onClick={() => setNewMessage(prev => prev + ' @')}
                              title="Mention someone"
                            >
                              <User className="w-3 h-3 text-gray-400" />
                            </button>
                            <button 
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors exp-input-btn"
                              onClick={() => setNewMessage(prev => prev + ' 😊')}
                              title="Add emoji"
                            >
                              <Smile className="w-3 h-3 text-gray-400" />
                            </button>
                          <input
                            type="text"
                              placeholder={`Message #${selectedChannel}... (Use @ to mention)`}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                sendChannelMessage();
                              }
                            }}
                            className="flex-1 bg-white/5 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/8 exp-message-input"
                          />
                          </div>
                          <button
                            onClick={sendChannelMessage}
                            disabled={!newMessage.trim()}
                            className="px-4 py-2 bg-purple-500 rounded-xl text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 exp-send-button"
                          >
                            <Send className="w-3 h-3" />
                            Send
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-white font-medium mb-2">Select a Channel</h3>
                          <p className="text-gray-400 text-sm">Choose a channel from the list to start chatting</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'friends' && (
                <div className="flex gap-4 h-full p-4">
                  {/* Left Side: Friends List */}
                  <div className="w-1/5 bg-white/2 rounded-2xl overflow-hidden exp-friends-left-side">
                    <div className="p-4">
                      <h3 className="font-medium text-white text-base mb-1">Friends</h3>
                      <p className="text-xs text-gray-400">{friendsList.length} friends online</p>
                    </div>
                    
                    <div className="overflow-y-auto h-[calc(100%-80px)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300">
                      {friendsList.map((friend, index) => (
                        <motion.div
                          key={friend.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`p-4 cursor-pointer transition-all duration-300 hover:bg-white/5 exp-friend-item ${
                            selectedFriend === friend.id ? 'bg-purple-500/10' : ''
                          }`}
                          onClick={() => setSelectedFriend(friend.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <img 
                                src={friend.avatar || getUserAvatar(friend.name || '')} 
                                alt={friend.name} 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              {friend.online && (
                                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-white text-xs">
                                <DecryptedText 
                                  text={friend.name} 
                                  speed={30} 
                                  maxIterations={8} 
                                  sequential={true} 
                                  revealDirection="start"
                                  animateOn="hover"
                                  className="text-white"
                                  encryptedClassName="text-purple-400"
                                />
                              </h3>
                              <p className={`text-xs ${friend.online ? 'text-green-400' : 'text-gray-400'}`}>
                                {friend.online ? 'Online' : 'Offline'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {(friendChats[friend.id] || []).length} messages
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Chat Interface */}
                  <div className="flex-1 bg-white/2 rounded-2xl overflow-hidden">
                    {selectedFriend ? (
                      <>
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4 exp-friends-chat-header">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <img 
                                src={friendsList.find(f => f.id === selectedFriend)?.avatar || getUserAvatar(friendsList.find(f => f.id === selectedFriend)?.name || '')} 
                                alt={friendsList.find(f => f.id === selectedFriend)?.name}
                                className="w-10 h-10 rounded-full object-cover" 
                              />
                              {friendsList.find(f => f.id === selectedFriend)?.online && (
                                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-white text-sm">
                                <DecryptedText 
                                  text={friendsList.find(f => f.id === selectedFriend)?.name || ''} 
                                  speed={30} 
                                  maxIterations={8} 
                                  sequential={true} 
                                  revealDirection="start"
                                  animateOn="hover"
                                  className="text-white"
                                  encryptedClassName="text-purple-400"
                                />
                              </h3>
                              <p className={`text-xs ${friendsList.find(f => f.id === selectedFriend)?.online ? 'text-green-400' : 'text-gray-400'}`}>
                                {friendsList.find(f => f.id === selectedFriend)?.online ? 'Online' : 'Offline'}
                              </p>
                            </div>
                          </div>
                          
                          {/* Chat Actions */}
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                              <Phone className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                              <Video className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>

                        {/* Chat Messages */}
                        <AnimatePresence mode="wait" key={selectedFriend}>
                          <motion.div
                            key={selectedFriend}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            ref={expFriendMessagesRef}
                            className="p-4 space-y-3 overflow-y-auto h-[calc(100%-140px)] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300 exp-friends-chat-messages"
                          >
                            {(friendChats[selectedFriend] || []).map((msg, index) => (
                              <div key={index} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] ${msg.user === 'You' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white'} rounded-lg p-3`}>
                                  {msg.user !== 'You' && (
                                    <div className="flex items-center gap-2 mb-2">
                                      <img 
                                        src={msg.avatar || getUserAvatar(msg.user || '')} 
                                        alt={msg.user} 
                                        className="w-6 h-6 rounded-full object-cover"
                                      />
                                      <span className="font-medium text-xs">{msg.user}</span>
                                      <span className="text-xs opacity-60">{msg.time}</span>
                                    </div>
                                  )}
                                  <div className="text-sm">{msg.message}</div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        </AnimatePresence>

                        {/* Message Input */}
                        <div className="flex gap-4 p-4 pb-4 exp-friends-message-input">
                          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                            <Paperclip className="w-5 h-5 text-gray-400" />
                          </button>
                          <input
                            type="text"
                            placeholder="Type a message..."
                            value={friendInput}
                            onChange={(e) => setFriendInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                sendFriendMessage();
                              }
                            }}
                            className="flex-1 bg-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/8"
                          />
                          <button
                            onClick={sendFriendMessage}
                            disabled={!friendInput.trim()}
                            className="px-8 py-4 bg-purple-500 rounded-2xl text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-white font-medium mb-2">Select a Friend</h3>
                          <p className="text-gray-400 text-sm">Choose a friend from the list to start chatting</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'feed' && (
                <div className="h-full p-4">
                  {/* Full Feed Experience */}
                  <div className="h-full bg-white/2 rounded-2xl overflow-hidden">
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300">
                      <Feed isExperienceView={true} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hub' && (
                <div className="h-full p-4">
                  {/* Full Community Hub Experience */}
                  <div className="h-full bg-white/2 rounded-2xl overflow-hidden">
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent hover:scrollbar-thumb-purple-400 transition-all duration-300">
                      {/* Enhanced Community Hub Experience View - Full Chat Window with Widgets */}
                      <div className="w-full h-[calc(100vh-120px)] p-6 bg-black flex gap-6">
                        {/* Main Chat Area */}
                        <div className="flex-1 bg-black">
                         
                         {/* Full Chat Window */}
                         <div className="bg-black h-full flex flex-col">
                           
                           {/* Chat Header */}
                           <div className="p-2 bg-black border-b border-white/5">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                 <h3 className="text-xs font-medium text-white">Community Chat</h3>
                                 <span className="text-xs text-green-400 font-medium">Live</span>
                               </div>
                               
                               {/* Quick Action Buttons */}
                               <div className="flex items-center gap-2">
                                 <button 
                                   onClick={() => setShowPollModal(true)}
                                   className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-xs text-purple-300"
                                   title="Create Poll"
                                 >
                                   📊 Poll
                                 </button>
                                 <button 
                                   onClick={() => setShowEventModal(true)}
                                   className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors text-xs text-green-300"
                                   title="Create Event"
                                 >
                                   📅 Event
                                 </button>
                                 <button 
                                   onClick={() => setShowAnnouncementModal(true)}
                                   className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-xs text-blue-300"
                                   title="Create Announcement"
                                 >
                                   📢 Announce
                                 </button>
                               </div>
                               
                               {/* Chat Settings Menu */}
                               <div className="flex items-center gap-3">

                                 {/* Chat Settings Menu */}
                                 <button className="p-3 rounded-lg hover:bg-white/5 transition-colors group relative">
                                   <MoreHorizontal className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                   
                                   {/* Expanded Chat Options */}
                                   <div className="absolute right-0 top-full mt-2 w-56 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                     <div className="p-3 space-y-2">
                                       <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
                                         <Users className="w-4 h-4" />
                                         <span>View Members</span>
                                       </button>
                                       <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
                                         <Settings className="w-4 h-4" />
                                         <span>Chat Settings</span>
                                       </button>
                                       <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
                                         <Search className="w-4 h-4" />
                                         <span>Search Messages</span>
                                       </button>
                                       <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
                                         <Volume2 className="w-4 h-4" />
                                         <span>Mute Notifications</span>
                                       </button>
                                       <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
                                         <Bookmark className="w-4 h-4" />
                                         <span>Saved Messages</span>
                                       </button>
                                     </div>
                                   </div>
                                 </button>
                                 
                                 {/* Members List */}
                                 <button className="p-3 rounded-lg hover:bg-white/5 transition-colors group relative">
                                   <Users className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                   
                                   {/* Expanded Member List */}
                                   <div className="absolute right-0 top-full mt-2 w-72 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                     <div className="p-4">
                                       <h4 className="text-sm font-medium text-white mb-4">Online Members (12)</h4>
                                       <div className="space-y-3">
                                         {[
                                           { name: 'FilmFan_2024', status: 'online', avatar: '🎬', role: 'Moderator' },
                                           { name: 'CinemaLover', status: 'online', avatar: '🎥', role: 'Member' },
                                           { name: 'MovieBuff', status: 'online', avatar: '🍿', role: 'Member' },
                                           { name: 'ArtDirector', status: 'away', avatar: '🎨', role: 'Creator' },
                                           { name: 'FilmStudent', status: 'online', avatar: '🎓', role: 'Member' }
                                         ].map((member, index) => (
                                           <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                             <div className="w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center text-sm">
                                               {member.avatar}
                                             </div>
                                             <div className="flex-1 min-w-0">
                                               <div className="flex items-center gap-1">
                                                 <span className="text-sm text-gray-300 truncate">{member.name}</span>
                                                 <span className="text-sm text-gray-500">• {member.role}</span>
                                               </div>
                                             </div>
                                             <div className={`w-3 h-3 rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                           </div>
                                         ))}
                                       </div>
                                     </div>
                                   </div>
                                 </button>
                               </div>
                             </div>
                           </div>
                           
                           {/* Chat Messages */}
                           <div className="hub-chat-messages h-[calc(100vh-200px)] overflow-y-auto p-6 pb-24 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                             {hubChatMessages.map((msg, index) => (
                               <motion.div
                                 key={msg.id}
                                 initial={{ opacity: 0, x: -20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: index * 0.1 }}
                                 className={`flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group ${msg.isOfficial ? 'border-l-4 border-purple-500' : ''} ${msg.isBot ? 'border-l-4 border-blue-500' : ''}`}
                               >
                                 <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center text-lg overflow-hidden">
                                   {msg.user === 'You' ? (
                                     <img 
                                       src={msg.avatar} 
                                       alt="Your avatar" 
                                       className="w-full h-full object-cover"
                                       onError={(e) => {
                                         const target = e.currentTarget as HTMLImageElement;
                                         target.style.display = 'none';
                                         target.parentElement!.innerHTML = '👤';
                                       }}
                                     />
                                   ) : (
                                     <span>{msg.avatar}</span>
                                   )}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                   <div className="flex items-center gap-3 mb-2">
                                     <span className={`text-sm font-medium ${msg.isOfficial ? 'text-purple-300' : msg.isBot ? 'text-blue-300' : 'text-purple-300'}`}>
                                       {msg.user}
                                       {msg.isOfficial && <span className="ml-1 text-purple-400">✓</span>}
                                       {msg.isBot && <span className="ml-1 text-blue-400">🤖</span>}
                                     </span>
                                     <span className="text-xs text-gray-500">{msg.time}</span>
                                   </div>
                                   
                                   {/* Message Content */}
                                   <div className="mb-3">
                                     {msg.isBot && msg.pollData ? (
                                       <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                         <p className="text-sm text-gray-300 mb-3 font-medium">{msg.pollData.question}</p>
                                         <div className="space-y-2">
                                           {msg.pollData?.options.map((option, idx) => {
                                             const optionKey = String.fromCharCode(65 + idx);
                                             const votes = msg.pollData?.votes[optionKey] || 0;
                                             const totalVotes = Object.values(msg.pollData?.votes || {}).reduce((a, b) => a + b, 0);
                                             const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                                             return (
                                               <button
                                                 key={idx}
                                                 onClick={() => handlePollVote(msg.id, optionKey)}
                                                 className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                                               >
                                                 <span className="text-sm text-gray-300">{option}</span>
                                                 <div className="flex items-center gap-2">
                                                   <div className="w-20 bg-white/10 rounded-full h-2">
                                                     <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                   </div>
                                                   <span className="text-xs text-gray-400">{percentage}%</span>
                                                 </div>
                                               </button>
                                             );
                                           })}
                                         </div>
                                       </div>
                                     ) : msg.isBot && msg.eventData ? (
                                       <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                                         <div className="flex items-center gap-2 mb-3">
                                           <Calendar className="w-5 h-5 text-green-400" />
                                           <h3 className="text-lg font-semibold text-green-300">{msg.eventData.title}</h3>
                                         </div>
                                         <div className="space-y-2 text-sm">
                                           <div className="flex items-center gap-2">
                                             <Clock className="w-4 h-4 text-green-400" />
                                             <span className="text-gray-300">{msg.eventData.date} at {msg.eventData.time || 'TBD'}</span>
                                           </div>
                                           <div className="flex items-center gap-2">
                                             <MapPin className="w-4 h-4 text-green-400" />
                                             <span className="text-gray-300">{msg.eventData.location || 'Location TBD'}</span>
                                           </div>
                                           <div className="flex items-center gap-2">
                                             <Users className="w-4 h-4 text-green-400" />
                                             <span className="text-gray-300">{(msg.eventData.attendees?.length || 0)}/{msg.eventData.maxAttendees || '∞'} attending</span>
                                           </div>
                                           <p className="text-gray-300 mt-3 leading-relaxed">{msg.eventData.description}</p>
                                           <div className="flex gap-2 mt-4">
                                             <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 text-sm font-medium transition-colors">
                                               👍 Interested
                                             </button>
                                             <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm transition-colors">
                                               📅 Add to Calendar
                                             </button>
                                           </div>
                                         </div>
                                       </div>
                                     ) : msg.isBot && 'announcementData' in msg && msg.announcementData ? (
                                       <div className={`rounded-lg p-4 border ${
                                         msg.announcementData.priority === 'urgent' ? 'bg-red-500/10 border-red-500/30' :
                                         msg.announcementData.priority === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                                         msg.announcementData.priority === 'normal' ? 'bg-blue-500/10 border-blue-500/30' :
                                         'bg-gray-500/10 border-gray-500/30'
                                       }`}>
                                         <div className="flex items-center gap-2 mb-3">
                                           <div className={`p-2 rounded-full ${
                                             msg.announcementData.priority === 'urgent' ? 'bg-red-500/20' :
                                             msg.announcementData.priority === 'high' ? 'bg-orange-500/20' :
                                             msg.announcementData.priority === 'normal' ? 'bg-blue-500/20' :
                                             'bg-gray-500/20'
                                           }`}>
                                             <Bell className={`w-4 h-4 ${
                                               msg.announcementData.priority === 'urgent' ? 'text-red-400' :
                                               msg.announcementData.priority === 'high' ? 'text-orange-400' :
                                               msg.announcementData.priority === 'normal' ? 'text-blue-400' :
                                               'text-gray-400'
                                             }`} />
                                           </div>
                                           <div>
                                             <h3 className="text-lg font-semibold text-white">{msg.announcementData.title}</h3>
                                             <div className="flex items-center gap-2 mt-1">
                                               <span className={`text-xs px-2 py-1 rounded-full ${
                                                 msg.announcementData.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                                                 msg.announcementData.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                                 msg.announcementData.priority === 'normal' ? 'bg-blue-500/20 text-blue-300' :
                                                 'bg-gray-500/20 text-gray-300'
                                               }`}>
                                                 {msg.announcementData.priority?.toUpperCase() || 'NORMAL'}
                                               </span>
                                               <span className="text-xs text-gray-400">{msg.announcementData.category || 'General'}</span>
                                             </div>
                                           </div>
                                         </div>
                                         <p className="text-gray-300 leading-relaxed">{msg.announcementData.content}</p>
                                         <div className="flex gap-2 mt-4">
                                           <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 text-xs transition-colors">
                                             📌 Pin
                                           </button>
                                           <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 text-xs transition-colors">
                                             🔔 Subscribe
                                           </button>
                                         </div>
                                       </div>
                                     ) : msg.isBot && msg.pollResults ? (
                                       <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                         <p className="text-sm text-gray-300 mb-3 font-medium">{msg.pollResults.question}</p>
                                         <div className="space-y-2">
                                           {Object.entries(msg.pollResults.results).map(([option, percentage]) => (
                                             <div key={option} className="flex items-center justify-between">
                                               <span className="text-sm text-gray-300">{option}</span>
                                               <div className="flex items-center gap-2">
                                                 <div className="w-20 bg-white/10 rounded-full h-2">
                                                   <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                 </div>
                                                 <span className="text-xs text-gray-400">{percentage}%</span>
                                               </div>
                                             </div>
                                           ))}
                                         </div>
                                       </div>
                                     ) : (
                                       <p className="text-sm text-gray-300 leading-relaxed">
                                         {msg.message}
                                         {msg.mentions && msg.mentions.map((mention, idx) => (
                                           <span key={idx} className="text-blue-400 font-medium">{mention} </span>
                                         ))}
                                       </p>
                                     )}
                                   </div>
                                   
                                   {/* Reactions */}
                                   {msg.reactions && msg.reactions.length > 0 && (
                                     <div className="flex items-center gap-1 mb-2">
                                       {msg.reactions.slice(0, 5).map((reaction, idx) => (
                                         <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full">
                                           {reaction}
                                         </span>
                                       ))}
                                       {msg.reactions.length > 5 && (
                                         <span className="text-xs text-gray-500">+{msg.reactions.length - 5}</span>
                                       )}
                                     </div>
                                   )}
                                   
                                   {/* Message Actions */}
                                   <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                     <button
                                       onClick={() => handleHubChatLike(msg.id)}
                                       className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                                     >
                                       <Heart className="w-3 h-3" />
                                       <span>{msg.likes}</span>
                                     </button>
                                     
                                     {/* Reaction Picker */}
                                     <div className="relative group/reactions">
                                       <button className="text-xs text-gray-500 hover:text-yellow-400 transition-colors">
                                         😀
                                       </button>
                                       <div className="absolute bottom-full left-0 mb-2 bg-black/90 backdrop-blur-xl rounded-lg p-2 opacity-0 invisible group-hover/reactions:opacity-100 group-hover/reactions:visible transition-all duration-300 z-50">
                                         <div className="flex gap-1">
                                           {['❤️', '🔥', '👏', '🎯', '💯', '🚀', '🏆', '✨'].map((emoji) => (
                                             <button
                                               key={emoji}
                                               onClick={() => handleHubChatReaction(msg.id, emoji)}
                                               className="p-1 hover:bg-white/10 rounded transition-colors"
                                             >
                                               {emoji}
                                             </button>
                                           ))}
                                         </div>
                                       </div>
                                     </div>
                                     
                                     <button className="text-xs text-gray-500 hover:text-blue-400 transition-colors">Reply</button>
                                     <button className="text-xs text-gray-500 hover:text-green-400 transition-colors">Share</button>
                                     <button className="text-xs text-gray-500 hover:text-yellow-400 transition-colors">Bookmark</button>
                                   </div>
                                 </div>
                               </motion.div>
                             ))}
                           </div>
                           
                           {/* Chat Input */}
                           <div className="absolute bottom-0 left-0 right-0 p-0">
                             <div className="flex gap-3 justify-center p-4">
                               <input
                                 type="text"
                                 placeholder="Type a message..."
                                 value={hubChatInput}
                                 onChange={(e) => setHubChatInput(e.target.value)}
                                 onKeyDown={(e) => e.key === 'Enter' && handleHubChatSend()}
                                 className="flex-1 bg-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/8 max-w-lg"
                               />
                               <button
                                 onClick={handleHubChatSend}
                                 disabled={!hubChatInput.trim()}
                                 className="px-8 py-4 bg-purple-500 rounded-2xl text-white text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                 <Send className="w-5 h-5" />
                               </button>
                             </div>
                           </div>
                         </div>
                       </div>
                       
                       {/* Widgets Sidebar */}
                       <div className="w-80 bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 p-4 space-y-4">
                         {/* Widget Toggle */}
                         <div className="flex items-center justify-between">
                           <h3 className="text-sm font-medium text-white">Community Widgets</h3>
                           <button 
                             onClick={() => setShowWidgets(!showWidgets)}
                             className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                           >
                             {showWidgets ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
                           </button>
                         </div>
                         
                         {showWidgets && (
                           <div className="space-y-4">
                             {/* Widget Navigation */}
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <button 
                                   onClick={() => setWidgetPage(Math.max(0, widgetPage - 1))}
                                   disabled={widgetPage === 0}
                                   className="p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                                 >
                                   <ChevronLeft className="w-4 h-4 text-gray-400" />
                                 </button>
                                 <span className="text-xs text-gray-400">
                                   {widgetPage + 1} / 4
                                 </span>
                                 <button 
                                   onClick={() => setWidgetPage(Math.min(3, widgetPage + 1))}
                                   disabled={widgetPage === 3}
                                   className="p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                                 >
                                   <ChevronRight className="w-4 h-4 text-gray-400" />
                                 </button>
                               </div>
                             </div>

                             {/* Page 1: Community Stats & Recent Activities */}
                             {widgetPage === 0 && (
                               <div className="space-y-4">
                                 {/* Community Stats Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <BarChart3 className="w-4 h-4" />
                                     Community Stats
                                   </h4>
                                   <div className="space-y-2">
                                     <div className="flex justify-between text-xs">
                                       <span className="text-gray-400">Total Members</span>
                                       <span className="text-white font-medium">{formatNumber(communityStats.totalMembers)}</span>
                                     </div>
                                     <div className="flex justify-between text-xs">
                                       <span className="text-gray-400">Online Now</span>
                                       <span className="text-green-400 font-medium">{formatNumber(communityStats.onlineMembers)}</span>
                                     </div>
                                     <div className="flex justify-between text-xs">
                                       <span className="text-gray-400">Total Posts</span>
                                       <span className="text-white font-medium">{formatNumber(communityStats.totalPosts)}</span>
                                     </div>
                                     <div className="flex justify-between text-xs">
                                       <span className="text-gray-400">Active Polls</span>
                                       <span className="text-purple-400 font-medium">{formatNumber(communityStats.totalPolls)}</span>
                                     </div>
                                   </div>
                                 </div>
                                 
                                 {/* Recent Activities Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <Activity className="w-4 h-4" />
                                     Recent Activities
                                   </h4>
                                   <div className="space-y-2 max-h-32 overflow-y-auto">
                                     {recentActivities.map((activity) => (
                                       <div key={activity.id} className="text-xs text-gray-400">
                                         <span className="text-white font-medium">{activity.user}</span> {activity.action} <span className="text-purple-400">{activity.target}</span>
                                         <div className="text-gray-500">{activity.time}</div>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               </div>
                             )}

                             {/* Page 2: Your Created Content */}
                             {widgetPage === 1 && (
                               <div className="space-y-4">
                                 {/* Your Polls Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <BarChart3 className="w-4 h-4" />
                                     Your Polls ({userCreatedPolls.length})
                                   </h4>
                                   <div className="space-y-3">
                                     {userCreatedPolls.length > 0 ? (
                                       userCreatedPolls.slice(0, 3).map((poll) => (
                                         <div key={poll.id} className="text-xs">
                                           <p className="text-gray-300 mb-2">{poll.question || 'Poll'}</p>
                                           <div className="flex items-center gap-2 text-gray-400">
                                             <span>👥 {poll.totalVotes} votes</span>
                                             <span>⏰ {poll.options.length} options</span>
                                           </div>
                                         </div>
                                       ))
                                     ) : (
                                       <p className="text-xs text-gray-500">No polls created yet</p>
                                     )}
                                   </div>
                                 </div>
                                 
                                 {/* Your Events Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <Calendar className="w-4 h-4" />
                                     Your Events ({userCreatedEvents.length})
                                   </h4>
                                   <div className="space-y-2">
                                     {userCreatedEvents.length > 0 ? (
                                       userCreatedEvents.slice(0, 3).map((event) => (
                                         <div key={event.id} className="text-xs">
                                           <p className="text-white font-medium">{event.eventData?.title || 'Event'}</p>
                                           <p className="text-gray-400">{event.eventData?.date} at {event.eventData?.time}</p>
                                           <div className="flex items-center gap-2 mt-1">
                                             <div className="flex-1 bg-white/10 rounded-full h-1">
                                               <div className="bg-green-500 h-1 rounded-full" style={{ width: `${(event.eventData?.attendees?.length || 0) / (event.eventData?.maxAttendees || 1) * 100}%` }}></div>
                                             </div>
                                             <span className="text-gray-400">{event.eventData?.attendees?.length || 0}/{event.eventData?.maxAttendees || 1}</span>
                                           </div>
                                         </div>
                                       ))
                                     ) : (
                                       <p className="text-xs text-gray-500">No events created yet</p>
                                     )}
                                   </div>
                                 </div>
                                 
                                 {/* Your Announcements Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <Bell className="w-4 h-4" />
                                     Your Announcements ({userCreatedAnnouncements.length})
                                   </h4>
                                   <div className="space-y-2">
                                     {userCreatedAnnouncements.length > 0 ? (
                                       userCreatedAnnouncements.slice(0, 3).map((announcement) => (
                                         <div key={announcement.id} className="text-xs">
                                           <p className="text-white font-medium">{announcement.announcementData?.title || 'Announcement'}</p>
                                           <span className={`text-xs px-2 py-1 rounded-full ${
                                             announcement.announcementData?.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                                             announcement.announcementData?.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                             announcement.announcementData?.priority === 'normal' ? 'bg-blue-500/20 text-blue-300' :
                                             'bg-gray-500/20 text-gray-300'
                                           }`}>
                                             {announcement.announcementData?.priority?.toUpperCase() || 'NORMAL'}
                                           </span>
                                         </div>
                                       ))
                                     ) : (
                                       <p className="text-xs text-gray-500">No announcements created yet</p>
                                     )}
                                   </div>
                                 </div>
                               </div>
                             )}

                             {/* Page 3: Active Community Content */}
                             {widgetPage === 2 && (
                               <div className="space-y-4">
                                 {/* Active Polls Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <BarChart3 className="w-4 h-4" />
                                     Active Polls
                                   </h4>
                                   <div className="space-y-3">
                                     {activePolls.slice(0, 2).map((poll) => (
                                       <div key={poll.id} className="text-xs">
                                         <p className="text-gray-300 mb-2">{poll.question}</p>
                                         {poll.options.map((option, idx) => (
                                           <div key={idx} className="flex items-center gap-2 mb-1">
                                             <div className="w-16 bg-white/10 rounded-full h-1">
                                               <div className="bg-purple-500 h-1 rounded-full" style={{ width: `${(poll.votes[idx] / poll.totalVotes) * 100}%` }}></div>
                                             </div>
                                             <span className="text-gray-400">{option}</span>
                                           </div>
                                         ))}
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                                 
                                 {/* Upcoming Events Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <Calendar className="w-4 h-4" />
                                     Upcoming Events
                                   </h4>
                                   <div className="space-y-2">
                                     {upcomingEvents.slice(0, 2).map((event) => (
                                       <div key={event.id} className="text-xs">
                                         <p className="text-white font-medium">{event.title}</p>
                                         <p className="text-gray-400">{event.date} at {event.time}</p>
                                         <div className="flex items-center gap-2 mt-1">
                                           <div className="flex-1 bg-white/10 rounded-full h-1">
                                             <div className="bg-green-500 h-1 rounded-full" style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}></div>
                                           </div>
                                           <span className="text-gray-400">{event.attendees}/{event.maxAttendees}</span>
                                         </div>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                                 
                                 {/* Trending Topics Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <TrendingUp className="w-4 h-4" />
                                     Trending Topics
                                   </h4>
                                   <div className="flex flex-wrap gap-2">
                                     {communityStats.trendingTopics.map((topic, idx) => (
                                       <span key={idx} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                                         {topic}
                                       </span>
                                     ))}
                                   </div>
                                 </div>
                               </div>
                             )}

                             {/* Page 4: News & Announcements */}
                             {widgetPage === 3 && (
                               <div className="space-y-4">
                                 {/* Community News Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <TrendingUp className="w-4 h-4" />
                                     Community News
                                   </h4>
                                   <div className="space-y-2 max-h-32 overflow-y-auto">
                                     {communityNews.slice(0, 2).map((news) => (
                                       <div key={news.id} className="text-xs border-l-2 border-blue-500/30 pl-2">
                                         <div className="flex items-center gap-2 mb-1">
                                           <span className={`text-xs px-2 py-1 rounded-full ${
                                             news.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                                             news.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                             news.priority === 'normal' ? 'bg-blue-500/20 text-blue-300' :
                                             'bg-gray-500/20 text-gray-300'
                                           }`}>
                                             {news.category}
                                           </span>
                                           <span className="text-gray-500">{news.date}</span>
                                         </div>
                                         <p className="text-white font-medium mb-1">{news.title}</p>
                                         <p className="text-gray-400 leading-relaxed line-clamp-2">{news.content}</p>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                                 
                                 {/* Community Announcements Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <Bell className="w-4 h-4" />
                                     Announcements
                                   </h4>
                                   <div className="space-y-2 max-h-32 overflow-y-auto">
                                     {communityAnnouncements.slice(0, 2).map((announcement) => (
                                       <div key={announcement.id} className="text-xs border-l-2 border-orange-500/30 pl-2">
                                         <div className="flex items-center gap-2 mb-1">
                                           <span className={`text-xs px-2 py-1 rounded-full ${
                                             announcement.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                                             announcement.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                             announcement.priority === 'normal' ? 'bg-blue-500/20 text-blue-300' :
                                             'bg-gray-500/20 text-gray-300'
                                           }`}>
                                             {announcement.priority.toUpperCase()}
                                           </span>
                                           <span className="text-gray-500">{announcement.date}</span>
                                         </div>
                                         <p className="text-white font-medium mb-1">{announcement.title}</p>
                                         <p className="text-gray-400 leading-relaxed line-clamp-2">{announcement.content}</p>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                                 
                                 {/* Community Insights Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <Lightbulb className="w-4 h-4" />
                                     Community Insights
                                   </h4>
                                   <div className="space-y-2 text-xs">
                                     <div className="flex justify-between">
                                       <span className="text-gray-400">Most Active Time</span>
                                       <span className="text-white">7-9 PM</span>
                                     </div>
                                     <div className="flex justify-between">
                                       <span className="text-gray-400">Top Topic</span>
                                       <span className="text-purple-300">Tech News</span>
                                     </div>
                                     <div className="flex justify-between">
                                       <span className="text-gray-400">Engagement Rate</span>
                                       <span className="text-green-400">87%</span>
                                     </div>
                                     <div className="flex justify-between">
                                       <span className="text-gray-400">New Members</span>
                                       <span className="text-blue-400">+23 this week</span>
                                     </div>
                                   </div>
                                 </div>
                                 
                                 {/* Community Rules Widget */}
                                 <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                   <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                     <Shield className="w-4 h-4" />
                                     Community Rules
                                   </h4>
                                   <div className="space-y-1 text-xs text-gray-400">
                                     <div>• Be respectful and kind</div>
                                     <div>• No spam or self-promotion</div>
                                     <div>• Keep discussions relevant</div>
                                     <div>• Report inappropriate content</div>
                                   </div>
                                 </div>
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                     </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Poll Creation Modal */}
              <AnimatePresence>
                {showPollModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowPollModal(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full max-w-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          📊 Create Poll
                        </h3>
                        <button
                          onClick={() => setShowPollModal(false)}
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Question Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Poll Question *
                          </label>
                          <input
                            type="text"
                            value={pollForm.question}
                            onChange={(e) => setPollForm(prev => ({ ...prev, question: e.target.value }))}
                            placeholder="What would you like to ask?"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>

                        {/* Options */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Options * (2-8 options)
                          </label>
                          <div className="space-y-2">
                            {pollForm.options.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updatePollOption(index, e.target.value)}
                                  placeholder={`Option ${index + 1}`}
                                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                {pollForm.options.length > 2 && (
                                  <button
                                    onClick={() => removePollOption(index)}
                                    className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                                  >
                                    <X className="w-4 h-4 text-red-400" />
                                  </button>
                                )}
                              </div>
                            ))}
                            {pollForm.options.length < 8 && (
                              <button
                                onClick={addPollOption}
                                className="w-full p-2 border border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-white/40 transition-colors"
                              >
                                + Add Option
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Poll Settings */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Duration
                            </label>
                            <select
                              value={pollForm.duration}
                              onChange={(e) => setPollForm(prev => ({ ...prev, duration: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            >
                              <option value="1h">1 Hour</option>
                              <option value="6h">6 Hours</option>
                              <option value="24h">24 Hours</option>
                              <option value="7d">7 Days</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={pollForm.allowMultipleVotes}
                                onChange={(e) => setPollForm(prev => ({ ...prev, allowMultipleVotes: e.target.checked }))}
                                className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-300">Allow multiple votes</span>
                            </label>
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={pollForm.anonymous}
                                onChange={(e) => setPollForm(prev => ({ ...prev, anonymous: e.target.checked }))}
                                className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-300">Anonymous poll</span>
                            </label>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => setShowPollModal(false)}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handlePollSubmit}
                            disabled={!pollForm.question.trim() || pollForm.options.filter(opt => opt.trim()).length < 2}
                            className="flex-1 px-4 py-2 bg-purple-500 rounded-lg text-white font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Create Poll
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Event Creation Modal */}
              <AnimatePresence>
                {showEventModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowEventModal(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full max-w-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          📅 Create Event
                        </h3>
                        <button
                          onClick={() => setShowEventModal(false)}
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Event Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Event Title *
                          </label>
                          <input
                            type="text"
                            value={eventForm.title}
                            onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter event title"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                          />
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Date *
                            </label>
                            <input
                              type="date"
                              value={eventForm.date}
                              onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Time *
                            </label>
                            <input
                              type="time"
                              value={eventForm.time}
                              onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Location
                          </label>
                          <select
                            value={eventForm.location}
                            onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                          >
                            <option value="Online">Online</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Chennai">Chennai</option>
                          </select>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description *
                          </label>
                          <textarea
                            value={eventForm.description}
                            onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your event..."
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                          />
                        </div>

                        {/* Max Attendees */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Max Attendees
                          </label>
                          <input
                            type="number"
                            value={eventForm.maxAttendees}
                            onChange={(e) => setEventForm(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 50 }))}
                            min="1"
                            max="1000"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => setShowEventModal(false)}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleEventSubmit}
                            disabled={!eventForm.title.trim() || !eventForm.date || !eventForm.description.trim()}
                            className="flex-1 px-4 py-2 bg-green-500 rounded-lg text-white font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Create Event
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Announcement Creation Modal */}
              <AnimatePresence>
                {showAnnouncementModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowAnnouncementModal(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full max-w-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          📢 Create Announcement
                        </h3>
                        <button
                          onClick={() => setShowAnnouncementModal(false)}
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Announcement Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={announcementForm.title}
                            onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter announcement title"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>

                        {/* Priority and Category */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Priority
                            </label>
                            <select
                              value={announcementForm.priority}
                              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, priority: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                              <option value="low">Low</option>
                              <option value="normal">Normal</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Category
                            </label>
                            <select
                              value={announcementForm.category}
                              onChange={(e) => setAnnouncementForm(prev => ({ ...prev, category: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                              <option value="general">General</option>
                              <option value="update">Update</option>
                              <option value="news">News</option>
                              <option value="alert">Alert</option>
                            </select>
                          </div>
                        </div>

                        {/* Content */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Content *
                          </label>
                          <textarea
                            value={announcementForm.content}
                            onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Write your announcement..."
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => setShowAnnouncementModal(false)}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAnnouncementSubmit}
                            disabled={!announcementForm.title.trim() || !announcementForm.content.trim()}
                            className="flex-1 px-4 py-2 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Create Announcement
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;