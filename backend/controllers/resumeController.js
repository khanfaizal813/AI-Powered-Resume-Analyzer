const Resume = require("../models/Resume");
const { OpenAI } = require("openai");
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const textract = require('textract');
const { promisify } = require('util');
const textractFromBuffer = promisify(textract.fromBufferWithMime);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supported file types and their MIME types
const SUPPORTED_TYPES = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if file type is supported
    const fileType = SUPPORTED_TYPES[req.file.mimetype];
    if (!fileType) {
      const supportedTypes = Object.keys(SUPPORTED_TYPES).join(', ');
      return res.status(400).json({ 
        error: `Unsupported file format. Please upload a file in one of these formats: ${supportedTypes}` 
      });
    }

    let resumeContent = '';

    try {
      // Process file based on type
      if (fileType === 'pdf') {
        const pdfText = await pdfParse(req.file.buffer);
        resumeContent = pdfText.text;
      } 
      // Process DOCX files
      else if (fileType === 'docx') {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        resumeContent = result.value;
      }
      // Process DOC files
      else if (fileType === 'doc') {
        resumeContent = await textractFromBuffer(req.file.buffer, req.file.mimetype);
      }

      // Check if we successfully extracted any text
      if (!resumeContent || resumeContent.trim().length === 0) {
        throw new Error('Could not extract text from the document');
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert resume reviewer." },
          { role: "user", content: `Analyze this resume and provide detailed feedback:\n\n${resumeContent}` },
        ],
      });

      res.json({ 
        message: response.choices[0].message.content,
        originalText: resumeContent 
      });

    } 
    // catch (parseError) {
    //   console.error('Error parsing document:', parseError);
    //   return res.status(400).json({ 
    //     error: 'Error processing the document. Please ensure the file is not corrupted and try again.' 
    //   });
    // }
    catch (parseError) {
      console.error('Error parsing document:', parseError);
      
      // Extract meaningful error message
      let errorMessage = 'Error processing the document.';
      
      // Check for common error patterns
      if (parseError.message) {
        // If it's a known error type, use its message
        errorMessage = parseError.message;
      } else if (parseError.error?.message) {
        // If it's an error object with nested message
        errorMessage = parseError.error.message;
      } else if (typeof parseError === 'string') {
        // If it's a string error
        errorMessage = parseError;
      }
      
      // Clean up the error message for better display
      errorMessage = errorMessage
        .replace('Error: ', '')  // Remove redundant "Error: " prefix
        .replace(/\.$/, '');     // Remove trailing period if exists
      
      return res.status(400).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          stack: parseError.stack,
          fullError: parseError
        } : undefined
      });
    }

  } catch (error) {
    console.error('Error in analyzeResume:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while processing your request' 
    });
  }
};
