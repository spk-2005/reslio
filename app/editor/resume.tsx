// app/(tabs)/editor/resume.tsx

import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView, Platform, TouchableOpacity } from 'react-native';
import ResumeExportComponent from '@/components/ResumeExportComponent';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef, useCallback } from 'react';

import WebView from 'react-native-webview';

import { useAuth } from '@/contexts/AuthContext'; 
import { informationAPI, templateAPI } from '@/services/api';
import ResumeEditorToolbar from '@/components/ResumeEditorToolTab';
import { useExportTrigger } from './_layout';

interface Template {
  _id: string;
  name: string;
  structure: {
    html: string;
    css: string;
  };
}

interface ElementData {
  content: string;
  type: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  textAlign: string;
  fontFamily: string;
  lineHeight: number;
  className: string;
  elementTag?: string;
  elementId?: string;
  elementSelector?: string;
  positionX?: number;
  positionY?: number;
}

interface CoordinateData {
  x: number;
  y: number;
  visible: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const A4_ASPECT_RATIO = 1.414;
const RESUME_WIDTH_PERCENTAGE = 0.9;
const RESUME_WIDTH = screenWidth * RESUME_WIDTH_PERCENTAGE;
const RESUME_HEIGHT = RESUME_WIDTH * A4_ASPECT_RATIO;



export default function EditorResumeScreen() {
  const { templateId } = useLocalSearchParams<{ templateId?: string }>();
  const { user } = useAuth(); 
  
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  // ✅ CRITICAL FIX #1: Changed from string[] to ElementData[]
  const [history, setHistory] = useState<ElementData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [coordinates, setCoordinates] = useState<CoordinateData>({ x: 0, y: 0, visible: false });
  
  const webViewRef = useRef<WebView>(null);
  const viewToCaptureRef = useRef<View>(null);

  const { setTriggerExport } = useExportTrigger();

  const [isExportModalVisible, setExportModalVisible] = useState(false);

  const handleExport = useCallback(() => {
      console.log('⚡️ Export Initiated from Header!');
      setExportModalVisible(true);
  }, []);

  useEffect(() => {
      setTriggerExport(() => () => handleExport());
      return () => setTriggerExport(null);
  }, [setTriggerExport, handleExport]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && templateId) {
        try {
          const [profileResponse, templateResponse] = await Promise.all([
            // @ts-ignore
            informationAPI.get(),
            // @ts-ignore
            templateAPI.getById(templateId),
          ]);

          setUserProfile(profileResponse.information);
          setTemplate(templateResponse.template);

        } catch (error) {
          console.error('❌ Failed to fetch data for editor:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, templateId]);

  useEffect(() => {
    if (template && userProfile) {
      const html = generateFullHtml();
      setHtmlContent(html);
    }
  }, [template, userProfile]); 

  const escapeHtml = (text: string) => {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const generateFullHtml = () => {
    if (!template || !userProfile) {
      return '<!DOCTYPE html><html><body><p>Loading...</p></body></html>';
    }

    const headerHtml = `
    <header class="resume-header">
      <h1 class="user-name editable draggable" data-type="name">${escapeHtml(userProfile.personalDetails?.name || 'Your Name')}</h1>
      <div class="contact-info" data-type="container">
        <div class="contact-item" data-type="container">
          <span class="user-email editable draggable" data-type="email">${escapeHtml(userProfile.email || 'email@example.com')}</span>
        </div>
        ${userProfile.personalDetails?.phone ? `
        <div class="contact-item" data-type="container">
          <span class="user-phone editable draggable" data-type="phone">${escapeHtml(userProfile.personalDetails.phone)}</span>
        </div>` : ''}
        ${userProfile.personalDetails?.location ? `
        <div class="contact-item" data-type="container">
          <span class="user-location editable draggable" data-type="location">${escapeHtml(userProfile.personalDetails.location)}</span>
        </div>` : ''}
      </div>
      <div class="social-links" data-type="container">
        ${userProfile.contactLinks?.find((l: any) => l.type === 'LinkedIn')?.url ? 
          `<a href="${escapeHtml(userProfile.contactLinks.find((l: any) => l.type === 'LinkedIn').url)}" class="link-linkedin editable draggable" data-type="link">LinkedIn</a>` : ''}
        ${userProfile.contactLinks?.find((l: any) => l.type === 'GitHub')?.url ? 
          `<a href="${escapeHtml(userProfile.contactLinks.find((l: any) => l.type === 'GitHub').url)}" class="link-github editable draggable" data-type="link">GitHub</a>` : ''}
        ${userProfile.contactLinks?.find((l: any) => l.type === 'Website')?.url ? 
          `<a href="${escapeHtml(userProfile.contactLinks.find((l: any) => l.type === 'Website').url)}" class="link-website editable draggable" data-type="link">Portfolio</a>` : ''}
      </div>
    </header>`;

    const experienceHtml = userProfile.experience && userProfile.experience.length > 0 ? `
    <section class="resume-section" data-type="section">
      <h2 class="section-title editable draggable" data-type="heading">Experience</h2>
      <div class="section-content experience-list">
        ${userProfile.experience.map((exp: any, index: number) => {
          const startDate = exp.startDate || '';
          const endDate = exp.endDate || 'Present';
          const dateStr = startDate ? `${startDate} - ${endDate}` : '';
          
          return `
        <div class="item experience-item" data-type="container">
          <div class="item-header" data-type="container">
            <div class="item-title-group" data-type="container">
              <h3 class="exp-position editable draggable" data-type="text">${escapeHtml(exp.position || '')}</h3>
              <p class="exp-company editable draggable" data-type="text">${escapeHtml(exp.company || '')}${exp.type ? ' • ' + escapeHtml(exp.type) : ''}</p>
            </div>
            ${dateStr ? `<span class="exp-date editable draggable" data-type="date">${escapeHtml(dateStr)}</span>` : ''}
          </div>
          ${exp.description ? `<p class="exp-description editable draggable" data-type="text">${escapeHtml(exp.description)}</p>` : ''}
        </div>`;
        }).join('')}
      </div>
    </section>` : '';

    const educationHtml = userProfile.education && userProfile.education.length > 0 ? `
    <section class="resume-section" data-type="section">
      <h2 class="section-title editable draggable" data-type="heading">Education</h2>
      <div class="section-content education-list">
        ${userProfile.education.map((edu: any, index: number) => `
        <div class="item education-item" data-type="container">
          <div class="item-header" data-type="container">
            <div class="item-title-group" data-type="container">
              <h3 class="edu-degree editable draggable" data-type="text">${escapeHtml(edu.degree || '')}</h3>
              <p class="edu-institution editable draggable" data-type="text">${escapeHtml(edu.institution || '')}</p>
            </div>
            ${edu.endDate ? `<span class="edu-date editable draggable" data-type="date">${escapeHtml(edu.endDate)}</span>` : ''}
          </div>
          ${edu.field ? `<p class="edu-field editable draggable" data-type="text">${escapeHtml(edu.field)}</p>` : ''}
        </div>`).join('')}
      </div>
    </section>` : '';

    const projectsHtml = userProfile.projects && userProfile.projects.length > 0 ? `
    <section class="resume-section" data-type="section">
      <h2 class="section-title editable draggable" data-type="heading">Projects</h2>
      <div class="section-content projects-list">
        ${userProfile.projects.map((proj: any, index: number) => {
          const links = [];
          if (proj.liveLink) {
            links.push(`<a href="${escapeHtml(proj.liveLink)}" class="project-live-link editable draggable" data-type="link">Live Demo</a>`);
          }
          if (proj.githubLink) {
            links.push(`<a href="${escapeHtml(proj.githubLink)}" class="project-github-link editable draggable" data-type="link">GitHub</a>`);
          }
          
          return `
        <div class="item project-item" data-type="container">
          <h3 class="project-name editable draggable" data-type="text">${escapeHtml(proj.name || '')}</h3>
          ${proj.description ? `<p class="project-description editable draggable" data-type="text">${escapeHtml(proj.description)}</p>` : ''}
          ${links.length > 0 ? `<div class="project-links" data-type="container">${links.join(' ')}</div>` : ''}
        </div>`;
        }).join('')}
      </div>
    </section>` : '';

    const achievementsHtml = userProfile.achievements && userProfile.achievements.length > 0 ? `
    <section class="resume-section" data-type="section">
      <h2 class="section-title editable draggable" data-type="heading">Achievements</h2>
      <div class="section-content achievements-list">
        ${userProfile.achievements.map((ach: any, index: number) => `
        <div class="item achievement-item" data-type="container">
          <div class="item-header" data-type="container">
            <div class="item-title-group" data-type="container">
              <h3 class="achievement-title editable draggable" data-type="text">${escapeHtml(ach.title || '')}</h3>
              <p class="achievement-issuer editable draggable" data-type="text">${escapeHtml(ach.issuer || '')}${ach.type ? ' • ' + escapeHtml(ach.type) : ''}</p>
            </div>
            ${ach.date ? `<span class="achievement-date editable draggable" data-type="date">${escapeHtml(ach.date)}</span>` : ''}
          </div>
        </div>`).join('')}
      </div>
    </section>` : '';

    const TEMPLATE_CSS = template.structure.css || '';

    const injectedJavaScript = `
      let selectedElement = null;
      let draggedElement = null;
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let initialScrollY = 0;
      let offsetX = 0;
      let offsetY = 0;
      let guideLines = [];
      let gridOverlay = null;
      let dragPreview = null;

      let elementIdCounter = 0;
      const SNAP_THRESHOLD = 15;
      const GRID_SIZE = 8;
      const elementPositions = new Map();

      document.addEventListener('DOMContentLoaded', function() {
        const container = document.querySelector('.resume-container');
        const draggables = document.querySelectorAll('.draggable');
        
        // Initialize ALL editable elements with IDs immediately
        document.querySelectorAll('.editable').forEach(el => {
          const id = 'el-' + (elementIdCounter++);
          el.setAttribute('data-element-id', id);
          console.log('🏷️ Assigned ID to element:', el.className, '→', id);
        });

        draggables.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          elementPositions.set(element, {
            x: rect.left - containerRect.left,
            y: (rect.top + scrollTop) - (containerRect.top + scrollTop),
            width: rect.width,
            height: rect.height,
            isPositioned: false
          });
          
          setupDraggable(element);
        });

        function setupDraggable(element) {
          let longPressTimer = null;
          let touchStartPos = { x: 0, y: 0 };
          let hasMoved = false;
          let isLongPress = false;
          let touchStartTime = 0;
          let lastTouchTime = 0;

          element.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            
            const now = Date.now();

            hasMoved = false;
            isLongPress = false;
            touchStartTime = now;
            const touch = e.touches[0];
            touchStartPos = { x: touch.clientX, y: touch.clientY };
            
            if (longPressTimer) {
              clearTimeout(longPressTimer);
            }
            
            longPressTimer = setTimeout(() => {
              if (!hasMoved) {
                isLongPress = true;
                element.classList.add('can-drag');
                startDrag(element, touch.clientX, touch.clientY);
                navigator.vibrate?.(50);
              }
            }, 500);
            
            if (now - lastTouchTime < 300) {
              clearTimeout(longPressTimer);
              startContentEditing(element);
              e.preventDefault();
            }
            lastTouchTime = now;
          }, { passive: false, capture: true });

          element.addEventListener('touchmove', function(e) {
            const touch = e.touches[0];
            const deltaX = Math.abs(touch.clientX - touchStartPos.x);
            const deltaY = Math.abs(touch.clientY - touchStartPos.y);
            
            if (deltaX > 10 || deltaY > 10) {
              hasMoved = true;
              if (!isLongPress) {
                clearTimeout(longPressTimer);
                element.classList.remove('can-drag');
              }
            }

            if (isDragging && draggedElement === element) {
              e.preventDefault();
              e.stopPropagation();
              moveDrag(touch.clientX, touch.clientY);
            }
          }, { passive: false, capture: true });

          element.addEventListener('touchend', function(e) {
            clearTimeout(longPressTimer);
            element.classList.remove('can-drag');
            
            const touchDuration = Date.now() - touchStartTime;
            
            if (isDragging && draggedElement === element) {
              endDrag();
              e.preventDefault();
              e.stopPropagation();
            } else if (!hasMoved && touchDuration < 500 && element.classList.contains('editable') && !element.isContentEditable) {
              e.preventDefault();
              e.stopPropagation();
              handleClick(element, e);
            }
            
            isLongPress = false;
            hasMoved = false;
          }, { capture: true });

          element.addEventListener('touchcancel', function(e) {
            clearTimeout(longPressTimer);
            element.classList.remove('can-drag');
            if (isDragging && draggedElement === element) {
              endDrag();
            }
            isLongPress = false;
            hasMoved = false;
          }, { capture: true });

          if (element.classList.contains('editable')) {
            element.addEventListener('dblclick', function(e) {
              e.preventDefault();
              e.stopPropagation();
              startContentEditing(element);
            });
            
            element.addEventListener('click', function(e) {
              if (!isDragging && !isLongPress && !element.isContentEditable) {
                e.preventDefault();
                e.stopPropagation();
                handleClick(element, e);
              } else if (element.isContentEditable) {
                e.stopPropagation();
              }
            }, { capture: true });
          }
        }

        function startContentEditing(element) {
          const elementType = element.tagName.toLowerCase();
          if (elementType === 'div' || elementType === 'section' || elementType === 'a') {
            return;
          }
          
          if (selectedElement && selectedElement !== element && selectedElement.isContentEditable) {
            endContentEditing(selectedElement);
          }
          
          selectedElement = element;
          element.classList.add('selected');
          element.setAttribute('contentEditable', 'true');
          element.focus();
          
          const range = document.createRange();
          range.selectNodeContents(element);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'editingStarted' }));
          
          element.addEventListener('blur', handleBlur, { once: true });
          element.addEventListener('keydown', handleKeyDown, { once: true });
        }

        function endContentEditing(element) {
          if (!element || !element.isContentEditable) return;
          
          element.removeAttribute('contentEditable');
          
          const elementId = element.getAttribute('data-element-id');
          
          if (!elementId) {
            console.error('❌ CRITICAL: Element missing data-element-id in endContentEditing!');
            return;
          }
          
          const newContent = element.textContent || element.innerText || '';
          const styles = window.getComputedStyle(element);
          const position = elementPositions.get(element);
          
          const data = {
            content: newContent.trim(),
            type: element.getAttribute('data-type') || element.tagName.toLowerCase(),
            fontSize: parseInt(styles.fontSize) || 14,
            fontWeight: styles.fontWeight || 'normal',
            color: rgb2hex(styles.color) || '#000000',
            textAlign: styles.textAlign || 'left',
            fontFamily: styles.fontFamily.split(',')[0].replace(/['"]/g, '').trim() || 'Arial',
            lineHeight: styles.lineHeight === 'normal' ? 1.5 : parseFloat(styles.lineHeight) / parseInt(styles.fontSize),
            className: element.className,
            elementId: elementId,
            elementTag: element.tagName.toLowerCase(),
            positionX: position ? Math.round(position.x) : 0,
            positionY: position ? Math.round(position.y) : 0
          };
          
          console.log('📤 Sending updated content with ID:', elementId);
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'editingFinished' }));
        }

        function handleBlur(e) {
          endContentEditing(e.target);
        }

        function handleKeyDown(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
          }
        }

        function handleClick(element, e) {
          e.preventDefault();
          e.stopPropagation();
          
          const elementId = element.getAttribute('data-element-id');
          if (!elementId) {
            console.error('❌ CRITICAL: Element clicked without data-element-id!');
            return;
          }
          
          if (selectedElement && selectedElement.isContentEditable) {
            endContentEditing(selectedElement);
          }
          
          if (selectedElement && selectedElement !== element) {
            selectedElement.classList.remove('selected');
          }
          
          selectedElement = element;
          element.classList.add('selected');
          
          const styles = window.getComputedStyle(element);
          const elementType = element.tagName.toLowerCase();
          const position = elementPositions.get(element);
          
          let content = '';
          
          if (elementType === 'hr') {
            content = 'Horizontal Line';
          } else if (elementType === 'div' || elementType === 'section') {
            content = 'Container';
          } else if (elementType === 'a') {
            content = element.textContent || element.innerText || '';
          } else {
            content = element.textContent || element.innerText || '';
          }
          
          content = content.trim();
          
          const data = {
            content: content,
            type: element.getAttribute('data-type') || elementType,
            fontSize: parseInt(styles.fontSize) || 14,
            fontWeight: styles.fontWeight || 'normal',
            color: rgb2hex(styles.color) || '#000000',
            textAlign: styles.textAlign || 'left',
            fontFamily: styles.fontFamily.split(',')[0].replace(/['"]/g, '').trim() || 'Arial',
            lineHeight: styles.lineHeight === 'normal' ? 1.5 : parseFloat(styles.lineHeight) / parseInt(styles.fontSize),
            className: element.className,
            elementId: elementId,
            elementTag: elementType,
            positionX: position ? Math.round(position.x) : 0,
            positionY: position ? Math.round(position.y) : 0
          };
          
          console.log('📤 Sending click data with ID:', elementId);
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }

        function rgb2hex(rgb) {
          if (!rgb) return '#000000';
          if (rgb.startsWith('#')) return rgb;
          
          const matches = rgb.match(/^rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)$/);
          if (!matches) return '#000000';
          
          const hex = (x) => ("0" + parseInt(x).toString(16)).slice(-2);
          return "#" + hex(matches[1]) + hex(matches[2]) + hex(matches[3]);
        }

        function startDrag(element, clientX, clientY) {
          if (isDragging) return;
          
          if (selectedElement && selectedElement.isContentEditable) {
            endContentEditing(selectedElement);
          }
          
          isDragging = true;
          draggedElement = element;
          initialScrollY = window.pageYOffset || document.documentElement.scrollTop;
          
          const container = document.querySelector('.resume-container');
          const containerRect = container.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          let position = elementPositions.get(element);
          
          if (!position.isPositioned) {
            const rect = element.getBoundingClientRect();
            
            position.x = rect.left - containerRect.left;
            position.y = (rect.top + scrollTop) - (containerRect.top + scrollTop);
            position.width = rect.width;
            position.height = rect.height;
            position.originalParent = element.parentElement;
            position.originalNextSibling = element.nextSibling;
            position.isPositioned = true;
            
            elementPositions.set(element, position);
          }
          
          const rect = element.getBoundingClientRect();
          offsetX = clientX - rect.left;
          offsetY = clientY - rect.top;
          
          position.originalStyles = {
            position: element.style.position,
            width: element.style.width,
            height: element.style.height,
            left: element.style.left,
            top: element.style.top,
            margin: element.style.margin,
            zIndex: element.style.zIndex
          };
          
          element.classList.add('dragging', 'positioned');
          element.style.position = 'absolute';
          element.style.width = position.width + 'px';
          element.style.height = position.height + 'px';
          element.style.left = position.x + 'px';
          element.style.top = position.y + 'px';
          element.style.margin = '0';
          element.style.zIndex = '1000';
          
          if (!gridOverlay) {
            gridOverlay = document.createElement('div');
            gridOverlay.className = 'grid-overlay';
            document.body.appendChild(gridOverlay);
          }
          gridOverlay.classList.add('visible');
          
          createDragPreview(position, container);
          
          updateCoordinateDisplay(Math.round(position.x), Math.round(position.y), true);
        }

        function createDragPreview(position, container) {
          if (dragPreview) {
            dragPreview.remove();
          }
          
          dragPreview = document.createElement('div');
          dragPreview.className = 'drag-preview';
          dragPreview.style.position = 'absolute';
          dragPreview.style.width = position.width + 'px';
          dragPreview.style.height = position.height + 'px';
          dragPreview.style.border = '2px dashed #667eea';
          dragPreview.style.background = 'rgba(102, 126, 234, 0.1)';
          dragPreview.style.borderRadius = '6px';
          dragPreview.style.pointerEvents = 'none';
          dragPreview.style.zIndex = '999';
          dragPreview.style.transition = 'all 0.1s ease';
          container.appendChild(dragPreview);
        }

        function moveDrag(clientX, clientY) {
          if (!isDragging || !draggedElement) return;
          
          const container = document.querySelector('.resume-container');
          const containerRect = container.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const position = elementPositions.get(draggedElement);
          
          let newX = clientX - containerRect.left - offsetX;
          let newY = (clientY + scrollTop) - (containerRect.top + scrollTop) - offsetY;
          
          const containerPadding = 32;
          const minX = 0;
          const minY = 0;
          const maxX = containerRect.width - position.width;
          const maxY = container.offsetHeight - position.height;
          
          newX = Math.max(minX, Math.min(newX, maxX));
          newY = Math.max(minY, Math.min(newY, maxY));
          
          newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
          newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
          
          clearGuides();
          const snapResult = getSnapCoordinates(newX, newY, position.width, position.height);
          
          if (snapResult.snapX !== null) {
            newX = snapResult.snapX;
            showGuideLine('vertical', snapResult.guideX, container);
          }
          
          if (snapResult.snapY !== null) {
            newY = snapResult.snapY;
            showGuideLine('horizontal', snapResult.guideY, container);
          }
          
          if (dragPreview) {
            dragPreview.style.left = newX + 'px';
            dragPreview.style.top = newY + 'px';
          }
          
          position.x = newX;
          position.y = newY;
          
          draggedElement.style.left = newX + 'px';
          draggedElement.style.top = newY + 'px';
          
          updateCoordinateDisplay(Math.round(newX), Math.round(newY), true);
        }

        function getSnapCoordinates(x, y, width, height) {
          const container = document.querySelector('.resume-container');
          const result = { 
            snapX: null, 
            snapY: null,
            guideX: null,
            guideY: null
          };
          
          const containerRect = container.getBoundingClientRect();
          const containerPadding = 32;
          const containerWidth = containerRect.width - containerPadding * 2;
          const containerCenterX = containerWidth / 2 + containerPadding;
          
          const left = x;
          const right = x + width;
          const centerX = x + width / 2;
          const top = y;
          const bottom = y + height;
          const centerY = y + height / 2;
          
          let minXDist = SNAP_THRESHOLD;
          let minYDist = SNAP_THRESHOLD;
          
          const snapPoints = [
            { check: left, target: containerPadding, snap: containerPadding },
            { check: right, target: containerWidth + containerPadding, snap: containerWidth + containerPadding - width },
            { check: centerX, target: containerCenterX, snap: containerCenterX - width / 2 }
              ];
              
              snapPoints.forEach(point => {
                const dist = Math.abs(point.check - point.target);
                if (dist < minXDist) {
                  result.snapX = point.snap;
                  result.guideX = point.target;
                  minXDist = dist;
                }
              });
              
              // Snap to other positioned elements
              elementPositions.forEach((pos, el) => {
                if (el === draggedElement || !pos.isPositioned) return;
                
                const otherLeft = pos.x;
                const otherRight = pos.x + pos.width;
                const otherCenterX = pos.x + pos.width / 2;
                const otherTop = pos.y;
                const otherBottom = pos.y + pos.height;
                const otherCenterY = pos.y + pos.height / 2;
                
                // X-axis alignment
                [
                  { check: left, target: otherLeft, snap: otherLeft },
                  { check: right, target: otherRight, snap: otherRight - width },
                  { check: centerX, target: otherCenterX, snap: otherCenterX - width / 2 },
                  { check: left, target: otherRight, snap: otherRight },
                  { check: right, target: otherLeft, snap: otherLeft - width }
                ].forEach(snap => {
                  const dist = Math.abs(snap.check - snap.target);
                  if (dist < minXDist) {
                    result.snapX = snap.snap;
                    result.guideX = snap.target;
                    minXDist = dist;
                  }
                });
                
                // Y-axis alignment
                [
                  { check: top, target: otherTop, snap: otherTop },
                  { check: bottom, target: otherBottom, snap: otherBottom - height },
                  { check: centerY, target: otherCenterY, snap: otherCenterY - height / 2 },
                  { check: top, target: otherBottom, snap: otherBottom },
                  { check: bottom, target: otherTop, snap: otherTop - height }
                ].forEach(snap => {
                  const dist = Math.abs(snap.check - snap.target);
                  if (dist < minYDist) {
                    result.snapY = snap.snap;
                    result.guideY = snap.target;
                    minYDist = dist;
                  }
                });
              });
              
              return result;
            }

            function showGuideLine(type, position, container) {
              const line = document.createElement('div');
              line.className = 'guide-line ' + type;
              line.setAttribute('data-coord', type === 'vertical' ? 'X: ' + Math.round(position) : 'Y: ' + Math.round(position));
              
              if (type === 'vertical') {
                line.style.left = position + 'px';
              } else {
                line.style.top = position + 'px';
              }
              
              container.appendChild(line);
              guideLines.push(line);
              
              setTimeout(() => {
                if (line.parentNode) {
                  line.parentNode.removeChild(line);
                }
              }, 200);
            }

            function updateCoordinateDisplay(x, y, visible) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'coordinates',
                x: x,
                y: y,
                visible: visible
              }));
            }

            function clearGuides() {
              guideLines.forEach(line => {
                if (line.parentNode) {
                  line.parentNode.removeChild(line);
                }
              });
              guideLines = [];
            }

            function endDrag() {
  if (!isDragging || !draggedElement) return;
  
  // ✅ CRITICAL: Capture elementId and position BEFORE nullifying
  const elementId = draggedElement.getAttribute('data-element-id');
  const finalPosition = elementPositions.get(draggedElement);
  
  draggedElement.classList.remove('dragging');
  draggedElement.style.zIndex = '100';
  
  if (dragPreview) {
    dragPreview.remove();
    dragPreview = null;
  }
  
  clearGuides();
  updateCoordinateDisplay(0, 0, false);
  
  if (gridOverlay) {
    gridOverlay.classList.remove('visible');
  }
  
  // ✅ Send position update BEFORE nullifying draggedElement
  if (elementId && finalPosition) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'dragEnd',
      elementId: elementId,
      positionX: Math.round(finalPosition.x),
      positionY: Math.round(finalPosition.y)
    }));
  }
  
  // Now safe to nullify
  isDragging = false;
  draggedElement = null;
  
  navigator.vibrate?.(30);
}

            // Click outside to deselect - only deselect if clicking on container directly
            document.addEventListener('click', function(e) {
              const container = document.querySelector('.resume-container');
              if (e.target === container && !isDragging) {
                
                // Disable editing if currently active
                if (selectedElement && selectedElement.isContentEditable) {
                  endContentEditing(selectedElement);
                }
                
                if (selectedElement) {
                  selectedElement.classList.remove('selected');
                  selectedElement = null;
                  // Notify React Native that selection was cleared
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'selectionCleared'
                  }));
                }
              }
            });
          
            // Function used by native code (handleApplyStyles, handleUndo, handleRedo)
     window.updateElement = function(elementId, content, fontSize, fontWeight, color, textAlign, fontFamily, lineHeight, positionX, positionY) {
  console.log('🔧 updateElement called with ID:', elementId);
  console.log('📍 Position:', positionX, positionY);
  
  const elementToUpdate = document.querySelector('[data-element-id="' + elementId + '"]');
  
  if (!elementToUpdate) {
    console.error('❌ Element not found with ID:', elementId);
    return false;
  }
  
  console.log('✅ Element found:', elementToUpdate.tagName, elementToUpdate.className);
  
  // Deselect previous element if it's different
  if (selectedElement && selectedElement !== elementToUpdate) {
    selectedElement.classList.remove('selected');
  }
  
  // Set the new selected element
  selectedElement = elementToUpdate;
  elementToUpdate.classList.add('selected');
  
  // Ensure content editable is off before applying styles
  if (elementToUpdate.isContentEditable) {
    elementToUpdate.removeAttribute('contentEditable'); 
  }
  
  const elementType = elementToUpdate.tagName.toLowerCase();
  console.log('📝 Updating element type:', elementType, 'with content:', content);
  
  if (elementType === 'hr') {
    elementToUpdate.style.borderTopWidth = (fontSize / 8) + 'px';
    elementToUpdate.style.borderTopColor = color;
    elementToUpdate.style.borderTopStyle = fontWeight === 'bold' ? 'solid' : 'dashed';
    elementToUpdate.style.margin = (fontSize / 2) + 'px 0';
  } else if (elementType === 'div' || elementType === 'section') {
    elementToUpdate.style.fontSize = fontSize + 'px';
    elementToUpdate.style.color = color;
    elementToUpdate.style.fontWeight = fontWeight;
  } else {
    if (content !== 'Horizontal Line' && content !== 'Container') {
      elementToUpdate.textContent = content;
      console.log('✏️ Updated text content to:', content);
    }
    elementToUpdate.style.fontSize = fontSize + 'px';
    elementToUpdate.style.fontWeight = fontWeight;
    elementToUpdate.style.color = color;
    elementToUpdate.style.textAlign = textAlign;
    elementToUpdate.style.fontFamily = fontFamily;
    elementToUpdate.style.lineHeight = lineHeight;
  }

  
  console.log('✅ Element updated successfully');
  return true;
}
});
      `;


      const fullHtml = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            background: white;
            overflow-y: auto;
            overflow-x: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          }

          ${TEMPLATE_CSS}
          
          .resume-container {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: 100vh !important;
            padding: 40px 32px 200px 32px !important;
            margin: 0 !important;
            box-sizing: border-box;
            position: relative;
            background: white;
          }

          /* Draggable Elements */
          .draggable {
            cursor: grab;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            position: relative;
            touch-action: manipulation;
          }

          .draggable.positioned {
            position: absolute !important;
            z-index: 100;
            pointer-events: auto;
            /* FIX: Ensure no external margin/padding interferes with absolute position calculation */
            margin: 0 !important;
            padding: 0 !important; 
          }

          .draggable.dragging {
            cursor: grabbing !important;
            z-index: 1000 !important;
            opacity: 0.95;
            transform: scale(1.01);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 2px #3b82f6;
            border-radius: 6px;
            touch-action: none;
            pointer-events: auto;
          }

          /* Drag Handle Icon */
          .draggable::before {
            content: '⋮⋮';
            position: absolute;
            left: -24px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            color: #9ca3af;
            opacity: 0;
            transition: opacity 0.2s ease;
            cursor: grab;
            letter-spacing: -3px;
            z-index: 10;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            pointer-events: none;
          }

          .draggable:hover::before {
            opacity: 0;
          }

          .draggable.can-drag::before {
            opacity: 0.6;
          }

          .draggable.dragging::before {
            opacity: 1;
            color: #3b82f6;
          }

          /* Editable Elements */
          .editable {
            position: relative;
            padding: 4px 6px;
            margin: -4px -6px;
            border-radius: 4px;
            transition: all 0.15s ease;
          }

          .editable:hover:not(.dragging) {
            background-color: rgba(59, 130, 246, 0.04);
            box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.15);
            outline: none;
          }

          .editable.selected:not(.dragging) {
            background-color: rgba(59, 130, 246, 0.08);
          }
          
          /* New style for contentEditable mode */
          .editable[contentEditable="true"] {
            background-color: white;
            box-shadow: 0 0 0 2px #3b82f6;
            outline: none;
            cursor: text;
            padding: 4px 6px;
            margin: -4px -6px;
            white-space: pre-wrap;
          }
          
          .editable[contentEditable="true"]::after {
            display: none;
          }


          .editable.selected::after {
            content: '✎';
            position: absolute;
            top: -10px;
            right: -10px;
            width: 22px;
            height: 22px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
            z-index: 10;
            pointer-events: none;
          }

          .editable.dragging::after {
            display: none;
          }

          /* Alignment Guide Lines */
          .guide-line {
            position: absolute;
            background-color: #f43f5e;
            z-index: 9999;
            pointer-events: none;
            box-shadow: 0 0 8px rgba(244, 63, 94, 0.5);
          }

          .guide-line.vertical {
            width: 2px;
            height: 100%;
            top: 0;
          }

          .guide-line.horizontal {
            height: 2px;
            width: 100%;
            left: 0;
          }

          .guide-line::before {
            content: attr(data-coord);
            position: absolute;
            background-color: #f43f5e;
            color: white;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }

          .guide-line.vertical::before {
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
          }

          .guide-line.horizontal::before {
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
          }

          /* Snap Indicator */
          .snap-indicator {
            position: absolute;
            border: 2px dashed #f43f5e;
            background-color: rgba(244, 63, 94, 0.08);
            pointer-events: none;
            z-index: 9998;
            border-radius: 6px;
            animation: snapPulse 0.3s ease;
          }

          @keyframes snapPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }

          /* Grid Overlay (Optional) */
          .grid-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9997;
            background-image: 
              linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
            background-size: 20px 20px;
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          .grid-overlay.visible {
            opacity: 1;
          }
        </style>
        <script>
          ${injectedJavaScript}
        </script>
      </head>
      <body>
        <div class="resume-container">
          ${headerHtml}
          ${experienceHtml}
          ${educationHtml}
          ${projectsHtml}
          ${achievementsHtml}
        </div>
      </body>
      </html>`;

      return fullHtml;
    };

    // --- WEBVIEW HANDLERS (Existing Logic) ---
const handleWebViewMessage = (event: any) => {
  try {
    const data = JSON.parse(event.nativeEvent.data);
    
    // Handle coordinate updates
    if (data.type === 'coordinates') {
      setCoordinates({
        x: data.x,
        y: data.y,
        visible: data.visible
      });
      return;
    }
    
    // ADD: Handle drag end - capture final position
    if (data.type === 'dragEnd') {
      console.log('🎯 Drag ended, capturing position');
      if (selectedElement && data.elementId === selectedElement.elementId) {
        const updatedElement = {
          ...selectedElement,
          positionX: data.positionX,
          positionY: data.positionY,
        };
        
        // Add to history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(updatedElement);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setSelectedElement(updatedElement);
        
        console.log('✅ Position change added to history');
      }
      return;
    }
    
    // Handle editing state
    if (data.type === 'editingStarted') {
      setToolbarVisible(false);
      return;
    }
    
    if (data.type === 'editingFinished') {
      setToolbarVisible(true);
      return; 
    }
    
    // Handle selection cleared
    if (data.type === 'selectionCleared') {
      setToolbarVisible(false);
      setSelectedElement(null);
      return;
    }
    
    // Handle element selection or content update
    const newElementData: ElementData = {
      content: data.content,
      type: data.type,
      fontSize: data.fontSize,
      fontWeight: data.fontWeight,
      color: data.color,
      textAlign: data.textAlign,
      fontFamily: data.fontFamily.split(',')[0].replace(/['"]/g, ''),
      lineHeight: data.lineHeight,
      className: data.className,
      elementId: data.elementId,
      elementTag: data.elementTag,
      elementSelector: data.className,
      positionX: data.positionX || 0,  // ADD THIS
      positionY: data.positionY || 0,  // ADD THIS
    };
    
    console.log('📨 Received element data:', newElementData);
    
    // Check if this is a content change (from endContentEditing) or just selection
    const isContentChange = selectedElement && 
                           selectedElement.elementId === newElementData.elementId &&
                           selectedElement.content !== newElementData.content;
    
    // Initialize history with first state if empty
    if (history.length === 0) {
      console.log('🆕 Initializing history with first element');
      setHistory([newElementData]);
      setHistoryIndex(0);
      setSelectedElement(newElementData);
      setToolbarVisible(true);
      return;
    }
    
    // If content changed (user edited text directly), add to history
    if (isContentChange) {
      console.log('📝 Content changed, adding to history');
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newElementData);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      console.log('✅ History updated. Length:', newHistory.length, 'Index:', newHistory.length - 1);
    }
    
    setSelectedElement(newElementData);
    setToolbarVisible(true);
    
  } catch (error) {
    console.error('Error parsing message:', error);
  }
};

const handleApplyStyles = (styles: ElementData) => {
  console.log('🎨 Applying styles:', styles);
  
  // Check if styles actually changed
  if (!selectedElement) {
    console.log('⏭️ No selected element');
    return;
  }
  
  // Preserve position if not changed
  const updatedStyles = {
    ...styles,
    positionX: styles.positionX ?? selectedElement.positionX ?? 0,
    positionY: styles.positionY ?? selectedElement.positionY ?? 0,
  };
  
  // Add to history
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push(updatedStyles);
  setHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
  
  console.log('✅ Added to history. New length:', newHistory.length);
  
  // Update local state
  setSelectedElement(updatedStyles);

  // Escape helper function
  const escapeContent = (str: string) => {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\\\') 
      .replace(/'/g, "\\'") 
      .replace(/"/g, '\\"') 
      .replace(/\n/g, '\\n') 
      .replace(/\r/g, '\\r') 
      .replace(/\t/g, '\\t'); 
  };

  const escapedContent = escapeContent(updatedStyles.content);
  const elementId = updatedStyles.elementId;
  
  const jsCode = `
    (function() {
      try {
        if (window.updateElement) {
          const result = window.updateElement(
            '${elementId}',
            '${escapedContent}', 
            ${updatedStyles.fontSize}, 
            '${updatedStyles.fontWeight}', 
            '${updatedStyles.color}', 
            '${updatedStyles.textAlign}', 
            '${updatedStyles.fontFamily}', 
            ${updatedStyles.lineHeight},
            ${updatedStyles.positionX},
            ${updatedStyles.positionY}
          );
          return result;
        }
        return false;
      } catch (e) {
        console.error('❌ Update error:', e.message);
        return false;
      }
    })();
  `;
  
  webViewRef.current?.injectJavaScript(jsCode);
};



const handleUndoRedoLogic = (targetState: ElementData, newIndex: number) => {
  console.log('⏮️ Undo/Redo to index:', newIndex);
  console.log('📦 Target state:', targetState);
  
  setHistoryIndex(newIndex);
  setSelectedElement(targetState); 
  
  const escapeContent = (str: string) => {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\\\') 
      .replace(/'/g, "\\'") 
      .replace(/"/g, '\\"') 
      .replace(/\n/g, '\\n') 
      .replace(/\r/g, '\\r') 
      .replace(/\t/g, '\\t'); 
  };

  const escapedContent = escapeContent(targetState.content);
  const elementId = targetState.elementId;
  
  console.log('🔍 Undo/Redo using elementId:', elementId);
  console.log('� Undo/Redo with content:', escapedContent);
  
  const jsCode = `
    (function() {
      try {
        console.log('🚀 Executing updateElement from handleUndoRedoLogic with ID: ${elementId}');
        console.log('Content:', '${escapedContent}');
        
        if (window.updateElement && '${elementId}') {
          const result = window.updateElement(
            '${elementId}',
            '${escapedContent}',
            ${targetState.fontSize},
            '${targetState.fontWeight}',
            '${targetState.color}',
            '${targetState.textAlign}',
            '${targetState.fontFamily}',
            ${targetState.lineHeight}
          );
          console.log('✅ Undo/Redo update result:', result);
          return result;
        }
        console.error('❌ window.updateElement not found or elementId is missing.');
        return false;
      } catch (e) {
        console.error('❌ Undo/Redo error:', e.message, e.stack);
        return false;
      }
    })();
  `;
  
  webViewRef.current?.injectJavaScript(jsCode);
};

const handleUndo = () => {
  console.log('🔙 Undo clicked. Current index:', historyIndex, 'History length:', history.length);
  const newIndex = historyIndex - 1;
  if (newIndex >= 0) {
    const targetState = history[newIndex];
    handleUndoRedoLogic(targetState, newIndex);
  } else {
    console.log('⚠️ Cannot undo - already at oldest state');
  }
};

const handleRedo = () => {
  console.log('🔜 Redo clicked. Current index:', historyIndex, 'History length:', history.length);
  const newIndex = historyIndex + 1;
  if (newIndex < history.length) {
    const targetState = history[newIndex];
    handleUndoRedoLogic(targetState, newIndex);
  } else {
    console.log('⚠️ Cannot redo - already at newest state');
  }
};

    
    const handleCloseToolbar = () => {
      setToolbarVisible(false);
      setSelectedElement(null);
      webViewRef.current?.injectJavaScript(`
        if (selectedElement) {
          // IMPORTANT: Disable contentEditable if active before deselecting
          if (selectedElement.isContentEditable) {
            selectedElement.removeAttribute('contentEditable');
          }
          selectedElement.classList.remove('selected');
          selectedElement = null;
        }
        true;
      `);
    };
    
    // --- RENDER ---
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading your resume...</Text>
        </View>
      );
    }
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
    return (
      <View style={styles.container}>
        {/* Banner Ad Component */}
        
        {template && userProfile && htmlContent ? (
          <>
            {/* Coordinate Display Bar */}
            {coordinates.visible && (
              <View style={styles.coordinateBar}>
                <View style={styles.coordinateContainer}>
                  <View style={styles.coordinateItem}>
                    <Text style={styles.coordinateLabel}>X:</Text>
                    <Text style={styles.coordinateValue}>{coordinates.x}px</Text>
                  </View>
                  <View style={styles.coordinateSeparator} />
                  <View style={styles.coordinateItem}>
                    <Text style={styles.coordinateLabel}>Y:</Text>
                    <Text style={styles.coordinateValue}>{coordinates.y}px</Text>
                  </View>
                </View>
              </View>
            )}

            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <View style={styles.paperContainer}>
                {/* Ref used by ResumeExportComponent to capture the view as an image */}
                <View style={styles.paperShadow} ref={viewToCaptureRef}>
                  <WebView
                    originWhitelist={['*']}
                    ref={webViewRef}
                    source={{ html: htmlContent }}
                    style={styles.webview}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                    showsHorizontalScrollIndicator={false}
                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                    automaticallyAdjustContentInsets={false}
                    onMessage={handleWebViewMessage}
                  />
                </View>
              </View>
            </ScrollView>
            <View style={styles.historyControlsContainer}>
              {/* Undo Button */}
              <TouchableOpacity
                style={[styles.historyButton, !canUndo && styles.historyButtonDisabled]} 
                onPress={handleUndo} // <-- CORRECTED: Use component's handleUndo
                disabled={!canUndo} // <-- CORRECTED: Use derived canUndo
              >
                <Text style={[styles.historyButtonText, !canUndo && styles.historyButtonTextDisabled]}>↶</Text>
              </TouchableOpacity>
          
              {/* Redo Button */}
              <TouchableOpacity 
                style={[styles.historyButton, !canRedo && styles.historyButtonDisabled]} 
                onPress={handleRedo} // <-- CORRECTED: Use component's handleRedo
                disabled={!canRedo} // <-- CORRECTED: Use derived canRedo
              >
                <Text style={[styles.historyButtonText, !canRedo && styles.historyButtonTextDisabled]}>↷</Text>
              </TouchableOpacity>
            </View>
            
            {/* Toolbar */}
            {toolbarVisible && selectedElement && (
              <ResumeEditorToolbar
                isVisible={toolbarVisible}
                // @ts-ignore - Assuming ResumeEditorToolbar expects ElementData
                selectedElement={selectedElement} 
                onApply={handleApplyStyles}
                onClose={handleCloseToolbar}
              />
            )}
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ Could not load resume</Text>
            <Text style={styles.errorSubtext}>
              {!template ? 'Template not found' : !userProfile ? 'User profile not loaded' : 'Generating content...'}
            </Text>
          </View>
        )}

        {/* The ResumeExportComponent is now here, controlled by local state */}
        {userProfile && (
          <ResumeExportComponent
            htmlContent={htmlContent}
            resumeName={userProfile.personalDetails?.name || 'resume'}
            containerRef={viewToCaptureRef}
            showModal={isExportModalVisible}
            onCloseModal={() => setExportModalVisible(false)}
            onExportComplete={() => {
              console.log('Export flow finished.');
              setExportModalVisible(false);
            }}
          />
        )}
      </View>
    );
  }

  // --- Stylesheet ---

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f3f4f6',
      justifyContent: 'space-between', 
    },
    coordinateBar: {
      backgroundColor: '#667eea',
      paddingVertical: 12,
      paddingHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
      zIndex: 100,
    },
    coordinateContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 24,
    },
    coordinateItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    coordinateLabel: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    coordinateValue: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '700',
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      minWidth: 60,
    },
    coordinateSeparator: {
      width: 1,
      height: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    paperContainer: {
      width: RESUME_WIDTH,
      minHeight: RESUME_HEIGHT,
      marginBottom: 24,
    },
    paperShadow: {
      backgroundColor: 'white',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 10,
      overflow: 'hidden',
      minHeight: RESUME_HEIGHT,
    },
    webview: {
      flex: 1,
      backgroundColor: 'white',
      minHeight: RESUME_HEIGHT,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9fafb',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 15,
      color: '#6b7280',
      fontWeight: '500',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    errorText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#4b5563',
      marginBottom: 8,
    },
    errorSubtext: {
      fontSize: 14,
      color: '#9ca3af',
      textAlign: 'center',
    },
    historyControlsContainer: {
      position: 'absolute',
      bottom: 120, // Adjust this value to position it above the toolbar
      right: 20,
      zIndex: 1000,
      flexDirection: 'column',
      gap: 10,
      
    },
    historyButton: {
      backgroundColor: '#ffffff',
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 6,
    },
    historyButtonDisabled: {
      backgroundColor: '#e5e7eb',
    },
    historyButtonText: {
      fontSize: 24,
      lineHeight: 28,
      color: '#3b82f6',
    },
    historyButtonTextDisabled: {
      color: '#9ca3af',
    },
  });
