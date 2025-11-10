import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { CONTENT_COLLECTION, db } from '@/lib/firebase';
import { Content } from '@/models/content';
import demoContent from '@/mock-data/content';

/**
 * Content Service - Handles all content-related operations
 */
export class ContentService {
  private static readonly COLLECTION_NAME = CONTENT_COLLECTION;

  /**
   * Get site content
   */
  static async getContent(): Promise<Content> {
    try {
      const siteContentRef = doc(db, this.COLLECTION_NAME, 'siteContent');
      const systemSettingsRef = doc(db, this.COLLECTION_NAME, 'systemSettings');

      const [siteContentSnap, systemSettingsSnap] = await Promise.all([
        getDoc(siteContentRef),
        getDoc(systemSettingsRef),
      ]);

      const siteContentData = siteContentSnap.exists()
        ? (siteContentSnap.data() as any)
        : {};
      const systemSettingsData = systemSettingsSnap.exists()
        ? (systemSettingsSnap.data() as any)
        : {};

      const isSiteEmpty = !siteContentData || Object.keys(siteContentData).length === 0;
      const isSettingsEmpty = !systemSettingsData || Object.keys(systemSettingsData).length === 0;

      // If server returns completely empty content, fallback to demo content
      if (isSiteEmpty && isSettingsEmpty) {
        return demoContent;
      }

      // Otherwise, fallback missing parts to demo while keeping any server data
      return {
        siteContent: isSiteEmpty ? demoContent.siteContent : siteContentData,
        systemSettings: isSettingsEmpty ? demoContent.systemSettings : systemSettingsData,
      } as Content;
    } catch (error) {
      console.error('Error fetching content:', error);
      // Fallback to static content
      return demoContent;
    }
  }
  /**
   * Update site content
   */
  static async updateSiteContent(payload: any): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, 'siteContent');
      await updateDoc(docRef, payload);
    } catch (error) {
      console.error('Error updating site content:', error);
      throw new Error(
        `Failed to update site content: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Update system settings
   */
  static async updateSystemSettings(payload: any): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, 'systemSettings');
      await updateDoc(docRef, payload);
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw new Error(
        `Failed to update system settings: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Create new content
   */
  static async createContent(
    payload: Partial<Content>,
    documentId: string = 'siteContent'
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, documentId);
      await setDoc(docRef, payload, { merge: true });
    } catch (error) {
      console.error('Error creating content:', error);
      throw new Error(
        `Failed to create content: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get content by ID
   */
  static async getContentById(id: string): Promise<any> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      throw new Error(
        `Failed to fetch content: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Update content by ID
   */
  static async updateContent(id: string, payload: any): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(docRef, payload);
    } catch (error) {
      console.error('Error updating content:', error);
      throw new Error(
        `Failed to update content: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Delete content by ID
   */
  static async deleteContent(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(docRef, { deleted: true, deletedAt: new Date() });
    } catch (error) {
      console.error('Error deleting content:', error);
      throw new Error(
        `Failed to delete content: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
