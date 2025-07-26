import { Component, HostListener, AfterViewInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ResumeService } from '../../services/resume-service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-resume.html',
  styleUrls: ['./upload-resume.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class UploadResume implements AfterViewInit {
  selectedFile: File | null = null;
  isDragover = false;
  isUploading = false;
  errorMessage: string | null = null;
  aiResponse: SafeHtml | null = null;
  uploadProgress = 0;
  fileInput: HTMLInputElement | null = null;

  ngAfterViewInit() {
    this.fileInput = document.getElementById('file-upload') as HTMLInputElement;
  }

  constructor(
    private readonly resumeService: ResumeService,
    private readonly sanitizer: DomSanitizer
  ) { }

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover = false;
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover = false;
    this.onFileDrop(event);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragover = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.aiResponse = null;
    this.errorMessage = null;

    // Reset the file input
    if (this.fileInput) {
      this.fileInput.value = '';
    }
  }

  private processFile(file: File): void {
    // Reset previous state
    this.errorMessage = null;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.some(type => file.type === type)) {
      this.errorMessage = 'Invalid file type. Please upload a PDF, DOC, or DOCX file.';
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.errorMessage = 'File is too large. Maximum size is 5MB.';
      return;
    }

    this.selectedFile = file;
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first.';
      return;
    }

    this.isUploading = true;
    this.aiResponse = null;
    this.errorMessage = null;

    this.resumeService.analyzeResume(this.selectedFile).subscribe({
      next: (response: any) => {
        this.aiResponse = this.formatResponse(response.aiSuggestions ?? 'No suggestions available.');
        this.isUploading = false;
      },
      error: (error: any) => {
        console.error('Error analyzing resume:', error);
        this.errorMessage = (error.error?.error ??
                          error.statusText) ??
                          'An error occurred while analyzing your resume. Please try again.';
        this.isUploading = false;
      }
    });
  }

  formatResponse(text: string): SafeHtml {
    if (!text) return '';

    try {
      // Basic markdown formatting
      let formattedText = text
        // Headers
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-900">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-5 mb-2 text-gray-900">$1</h3>')
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Lists
        .replace(/^\s*[\-*] (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
        .replace(/^\s*\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
        // New lines
        .replace(/\n/g, '<br>');

      // Wrap lists in ul/ol tags
      formattedText = formattedText.replace(/(<li[^>]*>.*?<\/li>\n?)+/g,
        (match) => {
          if (match.includes('list-decimal')) {
            return `<ol class="my-3 pl-6 space-y-1">${match}</ol>`;
          } else {
            return `<ul class="my-3 pl-6 space-y-1">${match}</ul>`;
          }
        }
      );

      return this.sanitizer.bypassSecurityTrustHtml(formattedText);
    } catch (e) {
      console.error('Error formatting response:', e);
      return text;
    }
  }
}
