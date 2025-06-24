
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUpload: (data: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const { language } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Enhanced security: Strict file type validation
  const acceptedFormats = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-excel': '.xls',
    'text/csv': '.csv',
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'image/jpeg': '.jpg',
    'image/png': '.png'
  };

  // Security: Maximum file size (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Enhanced security validation
  const validateFile = (file: File): boolean => {
    // Check file type
    if (!Object.keys(acceptedFormats).includes(file.type)) {
      toast.error(
        language === 'gr' 
          ? 'Μη υποστηριζόμενος τύπος αρχείου' 
          : 'Unsupported file type'
      );
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        language === 'gr' 
          ? 'Το αρχείο είναι πολύ μεγάλο (μέγιστο 5MB)' 
          : 'File is too large (maximum 5MB)'
      );
      return false;
    }

    // Check file name for potential security issues
    const suspiciousChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (suspiciousChars.test(file.name)) {
      toast.error(
        language === 'gr' 
          ? 'Μη έγκυρο όνομα αρχείου' 
          : 'Invalid file name'
      );
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    console.log('File upload attempt:', { name: file.name, type: file.type, size: file.size });

    if (!validateFile(file)) {
      return;
    }

    setUploadedFile(file);
    
    try {
      // Simulate file processing with enhanced error handling
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data extraction with input sanitization
      const mockData = {
        productName: sanitizeInput(language === 'gr' ? 'Προϊόν από αρχείο' : 'Product from file'),
        purchasePrice: Math.max(0, 5.50),
        quantity: Math.max(0, 100),
        waste: Math.max(0, Math.min(100, 5)),
        profitMargin: Math.max(0, Math.min(100, 25))
      };
      
      console.log('File processed successfully:', mockData);
      onFileUpload(mockData);
      
      toast.success(
        language === 'gr' 
          ? 'Το αρχείο επεξεργάστηκε επιτυχώς!' 
          : 'File processed successfully!'
      );
    } catch (error) {
      console.error('File processing error:', error);
      toast.error(
        language === 'gr' 
          ? 'Σφάλμα κατά την επεξεργασία του αρχείου' 
          : 'Error processing file'
      );
      setUploadedFile(null);
    }
  };

  // Input sanitization helper
  const sanitizeInput = (input: string): string => {
    return input.replace(/[<>&"']/g, '').trim().substring(0, 100);
  };

  const getFileTypeIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <Card className="border-dashed border-2 border-slate-300 hover:border-blue-400 transition-colors">
      <CardContent className="p-6">
        <div
          className={`relative rounded-lg border-2 border-dashed transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : uploadedFile 
                ? 'border-green-500 bg-green-50' 
                : 'border-slate-300 hover:border-blue-400'
          } p-6 text-center`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={Object.keys(acceptedFormats).join(',')}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
          />
          
          <div className="space-y-4">
            {uploadedFile ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <div>
                  <h3 className="font-semibold text-green-800">
                    {language === 'gr' ? 'Αρχείο ανέβηκε επιτυχώς!' : 'File uploaded successfully!'}
                  </h3>
                  <p className="text-sm text-green-600 flex items-center justify-center space-x-2 mt-2">
                    {getFileTypeIcon(uploadedFile.type)}
                    <span>{uploadedFile.name}</span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className={`w-12 h-12 mx-auto ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
                <div>
                  <h3 className="font-semibold text-slate-700 mb-2">
                    {language === 'gr' 
                      ? 'Ανεβάστε το αρχείο σας' 
                      : 'Upload your file'
                    }
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {language === 'gr' 
                      ? 'Σύρετε και αφήστε ή κάντε κλικ για επιλογή'
                      : 'Drag and drop or click to select'
                    }
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {language === 'gr' ? 'Επιλογή Αρχείου' : 'Choose File'}
                    </label>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Enhanced security notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">
                {language === 'gr' ? 'Οδηγίες & Ασφάλεια Αρχείου' : 'File Instructions & Security'}
              </h4>
              <div className="text-sm text-blue-700 space-y-2">
                <p>
                  <strong>{language === 'gr' ? 'Υποστηριζόμενοι τύποι:' : 'Supported types:'}</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Excel (.xlsx, .xls), CSV - {language === 'gr' ? 'για δεδομένα προϊόντων' : 'for product data'}</li>
                  <li>PDF, Word (.docx) - {language === 'gr' ? 'για εξαγωγή κειμένου' : 'for text extraction'}</li>
                  <li>JPG, PNG - {language === 'gr' ? 'για OCR και ανάλυση εικόνας' : 'for OCR and image analysis'}</li>
                </ul>
                <p className="mt-3">
                  <strong>{language === 'gr' ? 'Όρια Ασφαλείας:' : 'Security Limits:'}</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>{language === 'gr' ? 'Μέγιστο μέγεθος: 5MB' : 'Maximum size: 5MB'}</li>
                  <li>{language === 'gr' ? 'Μόνο εγκεκριμένοι τύποι αρχείων' : 'Only approved file types'}</li>
                  <li>{language === 'gr' ? 'Έλεγχος ονόματος αρχείου' : 'File name validation'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Supported formats */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.values(acceptedFormats).map((format) => (
            <span
              key={format}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
            >
              {format}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
